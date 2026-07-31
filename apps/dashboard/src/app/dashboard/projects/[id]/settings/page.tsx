"use client";

import { PageHeader } from "@/app/dashboard/workspaces/settings/layouts/PageHeader";
import { EditProjectForm } from "@/components/forms/EditProjectForm";
import { Box } from "@/components/ui/Box";
import { Separator } from "@/components/ui/Separator";
import { Text } from "@/components/ui/Text";
import { useProject } from "@/contexts/ProjectContext";

export default function ProjectSettingsPage() {
  const { project } = useProject();

  return (
    <>
      <PageHeader title={`Paramètres de « ${project.name} »`} />
      <Box direction="column" gap={16}>
        <Box direction="column" gap={8}>
          <Text.BodyLarge>Informations du projet</Text.BodyLarge>
          <Separator variant="light" />
        </Box>
        <EditProjectForm />
      </Box>
    </>
  );
}
