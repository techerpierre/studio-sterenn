import { createEmptyGate } from '@/components/logics';
import { Text } from '@/components/ui/Text';

import styles from './styles.module.css';

function ProjectListEmptyView() {
  return (
    <Text.BodySmall className={styles.empty}>
      Ce workspace ne possède aucun projets. Créez en un pour commencer
    </Text.BodySmall>
  );
}

export const ProjectListEmpty = createEmptyGate(ProjectListEmptyView);
