import clsx from "@/lib/clsx";
import { PropsWithChildren } from "react";

import { Box } from "../Box";
import { Text } from "../Text";

import styles from "./styles.module.css";

export type FormFieldProps = PropsWithChildren & {
  label?: string;
  caption?: string;
  error?: string | null;
  htmlFor?: string;
  className?: string;
};

export function FormField({
  label,
  caption,
  error = null,
  htmlFor,
  className,
  children,
}: FormFieldProps) {
  const hasError = error != null && error !== "";
  const helperText = hasError ? error : caption;

  return (
    <Box
      as="div"
      direction="column"
      className={clsx(styles.formField, className)}
    >
      {label && (
        <Text.Body as="label" htmlFor={htmlFor} className={styles.label}>
          {label}
        </Text.Body>
      )}
      {children}

      {helperText && (
        <Text.Caption
          className={clsx(hasError ? styles.error : styles.caption)}
        >
          {helperText}
        </Text.Caption>
      )}
    </Box>
  );
}
