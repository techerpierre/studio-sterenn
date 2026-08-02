"use client";

import {
  EventStatus,
  TaskExportEventData,
  TaskExportType,
} from "@sterenn/api-contracts";
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  DownloadIcon,
  EllipsisVerticalIcon,
  FileJsonIcon,
  FileTextIcon,
  UploadIcon,
} from "lucide-react";
import { useCallback } from "react";

import { PageHeader } from "@/app/dashboard/workspaces/settings/layouts/PageHeader";
import { Box } from "@/components/ui/Box";
import { Button } from "@/components/ui/Button";
import { Dropdown } from "@/components/ui/Dropdown";
import { useToast } from "@/components/ui/Toast";
import { useProject } from "@/contexts/ProjectContext";
import { useExportBoard } from "@/hooks/useExportBoard";

import { TaskBoardFiltersModal } from "./TaskBoardFiltersModal";

export type TaskBoardHeaderProps = {
  onScrollColumns: (direction: -1 | 1) => void;
};

export function TaskBoardHeader({ onScrollColumns }: TaskBoardHeaderProps) {
  const { project } = useProject();
  const { toast } = useToast();

  const handleExportEvent = useCallback(
    (event: TaskExportEventData) => {
      if (event.status === EventStatus.Processing) {
        toast({
          title: "Export en cours",
          description: "Préparation du fichier…",
          variant: "default",
        });
        return;
      }

      if (event.status === EventStatus.Completed && event.data.ressourceUrl) {
        toast({
          title: "Export terminé",
          description: "Téléchargement du fichier…",
          variant: "success",
        });
        window.location.assign(event.data.ressourceUrl);
        return;
      }

      if (event.status === EventStatus.Failed) {
        toast({
          title: "Échec de l’export",
          description: event.message ?? "Une erreur est survenue.",
          variant: "danger",
        });
      }
    },
    [toast],
  );

  const { exportBoard, isExporting } = useExportBoard({
    projectId: project.id,
    onEvent: handleExportEvent,
  });

  return (
    <PageHeader
      title="Table des taches"
      right={
        <Box align="center" gap={4}>
          <Dropdown
            trigger={
              <Button
                type="button"
                icon
                variant="ghost"
                aria-label="Plus d’actions"
                disabled={isExporting}
              >
                <EllipsisVerticalIcon size={16} aria-hidden />
              </Button>
            }
            align="end"
          >
            <Dropdown.Item
              onClick={() =>
                toast({
                  title: "Import bientôt disponible",
                  description: "L’import JSON du board arrive prochainement.",
                  variant: "default",
                })
              }
            >
              <UploadIcon size={16} aria-hidden />
              Import
            </Dropdown.Item>
            <Dropdown.Subsection
              label={
                <Box align="center" gap={8}>
                  <DownloadIcon size={16} aria-hidden />
                  <span>Export</span>
                </Box>
              }
            >
              <Dropdown.Item
                disabled={isExporting}
                onClick={() => exportBoard(TaskExportType.MARKDOWN)}
              >
                <FileTextIcon size={16} aria-hidden />
                Markdown
              </Dropdown.Item>
              <Dropdown.Item
                disabled={isExporting}
                onClick={() => exportBoard(TaskExportType.JSON)}
              >
                <FileJsonIcon size={16} aria-hidden />
                JSON
              </Dropdown.Item>
            </Dropdown.Subsection>
          </Dropdown>
          <TaskBoardFiltersModal />
          <Button
            type="button"
            icon
            variant="ghost"
            aria-label="Faire défiler les colonnes vers la gauche"
            onClick={() => onScrollColumns(-1)}
          >
            <ChevronLeftIcon size={16} aria-hidden />
          </Button>
          <Button
            type="button"
            icon
            variant="ghost"
            aria-label="Faire défiler les colonnes vers la droite"
            onClick={() => onScrollColumns(1)}
          >
            <ChevronRightIcon size={16} aria-hidden />
          </Button>
        </Box>
      }
    />
  );
}
