'use client';

import { fetchEventSource } from '@microsoft/fetch-event-source';
import {
  EventStatus,
  TaskExportEventData,
  TaskExportType,
} from '@sterenn/api-contracts';
import { useCallback, useRef, useState } from 'react';

export type UseExportBoardOptions = {
  projectId: string;
  onEvent?: (event: TaskExportEventData) => void;
};

export type UseExportBoardResult = {
  exportBoard: (type: TaskExportType) => void;
  cancel: () => void;
  isExporting: boolean;
  lastEvent: TaskExportEventData | null;
};

export function useExportBoard({
  projectId,
  onEvent,
}: UseExportBoardOptions): UseExportBoardResult {
  const [isExporting, setIsExporting] = useState(false);
  const [lastEvent, setLastEvent] = useState<TaskExportEventData | null>(null);
  const abortRef = useRef<AbortController | null>(null);
  const onEventRef = useRef(onEvent);
  onEventRef.current = onEvent;

  const cancel = useCallback(() => {
    abortRef.current?.abort();
    abortRef.current = null;
    setIsExporting(false);
  }, []);

  const exportBoard = useCallback(
    (type: TaskExportType) => {
      abortRef.current?.abort();

      const controller = new AbortController();
      abortRef.current = controller;
      setIsExporting(true);
      setLastEvent(null);

      void fetchEventSource(
        `/api/projects/${projectId}/board/export?type=${encodeURIComponent(type)}`,
        {
          method: 'GET',
          signal: controller.signal,
          openWhenHidden: true,
          async onopen(response) {
            if (response.ok) return;

            throw new Error(
              response.status === 401
                ? 'Unauthorized'
                : `Export failed (${response.status})`,
            );
          },
          onmessage(message) {
            if (!message.data) return;

            let event: TaskExportEventData;
            try {
              event = JSON.parse(message.data) as TaskExportEventData;
            } catch {
              return;
            }

            setLastEvent(event);
            onEventRef.current?.(event);

            if (
              event.status === EventStatus.Completed ||
              event.status === EventStatus.Failed
            ) {
              controller.abort();
              abortRef.current = null;
              setIsExporting(false);
            }
          },
          onerror(error) {
            const failedEvent: TaskExportEventData = {
              status: EventStatus.Failed,
              data: { ressourceUrl: null },
              message:
                error instanceof Error ? error.message : 'Export failed',
            };

            setLastEvent(failedEvent);
            onEventRef.current?.(failedEvent);
            setIsExporting(false);
            abortRef.current = null;

            throw error;
          },
          onclose() {
            setIsExporting(false);
            abortRef.current = null;
          },
        },
      );
    },
    [projectId],
  );

  return {
    exportBoard,
    cancel,
    isExporting,
    lastEvent,
  };
}
