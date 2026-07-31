"use client";

import clsx from "@/lib/clsx";
import {
  ChangeEvent,
  InputHTMLAttributes,
  ReactNode,
  Ref,
  TextareaHTMLAttributes,
  useCallback,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import { EyeIcon, EyeOffIcon } from "lucide-react";

import styles from "./styles.module.css";
import textStyles from "../Text/styles.module.css";
import { Loader } from "../Loader";
import { type TextType } from "../Text";

export type TextInputType =
  | "text"
  | "email"
  | "password"
  | "search"
  | "url"
  | "username";

export type TextInputSize = "sm" | "md" | "lg";
export type TextInputVariant = "default" | "secondary" | "ghost";
export type TextInputTextType = TextType;

type TextInputSharedProps = {
  size?: TextInputSize;
  variant?: TextInputVariant;
  textType?: TextInputTextType;
  rounded?: boolean;
  loading?: boolean;
  leftItem?: ReactNode;
  rightItem?: ReactNode;
  multiline?: boolean;
  rows?: number;
};

export type TextInputProps = TextInputSharedProps &
  Omit<InputHTMLAttributes<HTMLInputElement>, "type" | "size"> & {
    type?: TextInputType;
    ref?: Ref<HTMLInputElement | HTMLTextAreaElement>;
  };

export function TextInput({
  type = "text",
  size = "md",
  variant = "default",
  textType,
  rounded = false,
  loading = false,
  leftItem,
  rightItem,
  multiline = false,
  rows,
  className,
  disabled,
  ref,
  ...props
}: TextInputProps) {
  const [showPassword, setShowPassword] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);
  const isDisabled = Boolean(disabled || loading);
  const isPassword = !multiline && type === "password";
  const autoSize = multiline && rows == null;

  const inputType =
    type === "username" ? "text" : isPassword && showPassword ? "text" : type;

  const passwordToggle =
    isPassword && rightItem === undefined && !loading ? (
      <button
        type="button"
        className={styles.toggle}
        onClick={() => setShowPassword((visible) => !visible)}
        disabled={isDisabled}
        aria-label={
          showPassword ? "Masquer le mot de passe" : "Afficher le mot de passe"
        }
        tabIndex={-1}
      >
        {showPassword ? (
          <EyeOffIcon size={ICON_SIZE[size]} />
        ) : (
          <EyeIcon size={ICON_SIZE[size]} />
        )}
      </button>
    ) : null;

  const resolvedRightItem = loading ? (
    <Loader size="sm" className={styles.loader} />
  ) : rightItem !== undefined ? (
    rightItem
  ) : (
    passwordToggle
  );

  const fieldClassName = clsx(
    styles.input,
    multiline && styles.textarea,
    autoSize && styles.textareaAuto,
    textType ? textStyles[textType] : styles.typographyFromSize,
  );

  const setTextareaRef = useCallback(
    (node: HTMLTextAreaElement | null) => {
      textareaRef.current = node;
      assignRef(ref as Ref<HTMLTextAreaElement> | undefined, node);
      if (node && autoSize) {
        autosizeTextarea(node);
      }
    },
    [ref, autoSize],
  );

  const value = (props as TextareaHTMLAttributes<HTMLTextAreaElement>).value;
  const defaultValue = (props as TextareaHTMLAttributes<HTMLTextAreaElement>)
    .defaultValue;

  useLayoutEffect(() => {
    if (!autoSize || !textareaRef.current) return;
    autosizeTextarea(textareaRef.current);
  }, [autoSize, value, defaultValue]);

  const handleTextareaChange = (event: ChangeEvent<HTMLTextAreaElement>) => {
    (props as TextareaHTMLAttributes<HTMLTextAreaElement>).onChange?.(event);
    if (autoSize) {
      autosizeTextarea(event.currentTarget);
    }
  };

  return (
    <div
      className={clsx(
        styles.root,
        styles[size],
        styles[variant],
        multiline && styles.multiline,
        textType ? styles.withTextType : false,
        rounded ? styles.rounded : false,
        isDisabled ? styles.disabled : false,
        className,
      )}
    >
      {leftItem ? <span className={styles.item}>{leftItem}</span> : null}
      {multiline ? (
        <textarea
          ref={setTextareaRef}
          className={fieldClassName}
          rows={rows ?? 1}
          disabled={isDisabled}
          {...(props as TextareaHTMLAttributes<HTMLTextAreaElement>)}
          onChange={handleTextareaChange}
        />
      ) : (
        <input
          ref={ref as Ref<HTMLInputElement>}
          type={inputType}
          className={fieldClassName}
          disabled={isDisabled}
          {...props}
        />
      )}
      {resolvedRightItem ? (
        <span className={styles.item}>{resolvedRightItem}</span>
      ) : null}
    </div>
  );
}

const ICON_SIZE: Record<TextInputSize, number> = {
  sm: 14,
  md: 16,
  lg: 18,
};

function assignRef<T>(ref: Ref<T> | undefined, value: T | null) {
  if (!ref) return;
  if (typeof ref === "function") {
    ref(value);
    return;
  }
  ref.current = value;
}

function autosizeTextarea(element: HTMLTextAreaElement) {
  element.style.height = "0px";
  element.style.height = `${element.scrollHeight}px`;
}
