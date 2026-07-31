import { Validate2FAForm } from "@/components/forms/Validate2FAForm";

import styles from "./page.module.css";

export default function Validate2FA() {
  return (
    <div className={styles.page}>
      <div className={styles.formPanel}>
        <div className={styles.formContent}>
          <Validate2FAForm />
        </div>
      </div>
      <div className={styles.visualPanel} aria-hidden="true" />
    </div>
  );
}
