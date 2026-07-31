"use client";

import { isRedirectError } from "next/dist/client/components/redirect-error";
import { useEffect, useState } from "react";

import { CreateWorkspaceForm } from "@/components/forms/CreateWorkspaceForm";
import { Box } from "@/components/ui/Box";
import { Button } from "@/components/ui/Button";
import { SelectList } from "@/components/ui/SelectList";
import { Text } from "@/components/ui/Text";
import { useToast } from "@/components/ui/Toast";
import { useWorkspace } from "@/contexts/WorkspaceContext";

import styles from "./styles.module.css";
import { Badge } from "@/components/ui/Badge";
import { MEMBERSHIP_ROLE_LABELS } from "@/constants/mapping";

export function SelectWorkspaceForm() {
  const { toast } = useToast();
  const {
    workspaces,
    currentWorkspace,
    setCurrentWorkspace,
    loadMore,
    totalCount,
  } = useWorkspace();
  const [selectedId, setSelectedId] = useState(
    currentWorkspace?.id ?? workspaces[0]?.id ?? "",
  );
  const [isSubmitting, setIsSubmitting] = useState(false);
  const canLoadMore = workspaces.length < totalCount;

  useEffect(() => {
    if (currentWorkspace?.id) {
      setSelectedId(currentWorkspace.id);
    }
  }, [currentWorkspace?.id]);

  const onContinue = async () => {
    const workspace = workspaces.find((item) => item.id === selectedId);
    if (!workspace) {
      toast({
        title: "Sélection requise",
        description: "Choisissez un workspace pour continuer.",
        variant: "warning",
      });
      return;
    }

    setIsSubmitting(true);
    try {
      await setCurrentWorkspace(workspace);
    } catch (error) {
      if (isRedirectError(error)) {
        throw error;
      }
      console.error(error);
      setIsSubmitting(false);
      toast({
        title: "Impossible de continuer",
        description: "Le workspace n'a pas pu être sélectionné.",
        variant: "danger",
      });
    }
  };

  return (
    <Box direction="column" gap={32} padding={16} className={styles.root}>
      <Box direction="column" gap={16}>
        <Text.ThirdHeading as="h1">Vos workspaces</Text.ThirdHeading>
        <Text.Body className={styles.subtitle}>
          Sélectionnez l&apos;espace dans lequel vous souhaitez travailler.
        </Text.Body>
      </Box>

      <Box direction="column" gap={8}>
        {workspaces.length === 0 ? (
          <Text.Body className={styles.empty}>Aucun workspace</Text.Body>
        ) : (
          <SelectList
            value={selectedId}
            onValueChange={setSelectedId}
            className={styles.list}
          >
            {workspaces.map((workspace) => (
              <SelectList.Item key={workspace.id} value={workspace.id}>
                <Box direction="column" gap={8}>
                  <Text.Body>{workspace.name}</Text.Body>
                  <Badge size="sm">
                    {MEMBERSHIP_ROLE_LABELS[workspace.role]}
                  </Badge>
                </Box>
              </SelectList.Item>
            ))}
            {canLoadMore ? (
              <SelectList.LoadMore
                remaining={Math.max(totalCount - workspaces.length, 0)}
                onClick={() => void loadMore()}
              />
            ) : null}
          </SelectList>
        )}
      </Box>

      <Box direction="column" gap={12}>
        <CreateWorkspaceForm />
        <Button
          type="button"
          loading={isSubmitting}
          disabled={!selectedId}
          onClick={() => void onContinue()}
        >
          Continuer
        </Button>
      </Box>
    </Box>
  );
}
