import { getWorkspaceSelectorData } from "@/actions/workspace.actions";
import { SelectWorkspaceForm } from "@/components/forms/SelectWorkspaceForm";
import { WorkspaceProvider } from "@/contexts/WorkspaceContext";

import styles from "./page.module.css";

export default async function WorkspacesPage() {
  const { workspaces, count, currentWorkspace, shouldPersistCurrent } =
    await getWorkspaceSelectorData();

  return (
    <WorkspaceProvider
      initialWorkspaces={workspaces}
      initialCurrentWorkspace={currentWorkspace}
      initialTotalCount={count}
      shouldPersistCurrent={shouldPersistCurrent}
    >
      <div className={styles.page}>
        <div className={styles.formPanel}>
          <div className={styles.formContent}>
            <SelectWorkspaceForm />
          </div>
        </div>
        <div className={styles.visualPanel} aria-hidden="true" />
      </div>
    </WorkspaceProvider>
  );
}
