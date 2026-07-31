import { SignInForm } from "@/components/forms/SignInForm";

import styles from "./page.module.css";

export default function SignIn() {
  return (
    <div className={styles.page}>
      <div className={styles.formPanel}>
        <div className={styles.formContent}>
          <SignInForm />
        </div>
      </div>
      <div className={styles.visualPanel} aria-hidden="true" />
    </div>
  );
}
