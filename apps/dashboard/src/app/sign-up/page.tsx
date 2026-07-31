import { RegisterForm } from "@/components/forms/RegisterForm";

import styles from "./page.module.css";

export default function SignUp() {
  return (
    <div className={styles.page}>
      <div className={styles.formPanel}>
        <div className={styles.formContent}>
          <RegisterForm />
        </div>
      </div>
      <div className={styles.visualPanel} aria-hidden="true" />
    </div>
  );
}
