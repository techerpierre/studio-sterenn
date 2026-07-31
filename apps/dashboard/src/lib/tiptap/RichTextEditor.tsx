'use client';

import { EditorContent, useEditor, type Editor } from '@tiptap/react';
import { useEffect } from 'react';

import clsx from '@/lib/clsx';

import { createRichTextExtensions } from './extensions';
import styles from './styles.module.css';
import { RichTextToolbar } from './Toolbar';

export type RichTextEditorProps = {
  value?: string;
  onChange?: (value: string) => void;
  onBlur?: () => void;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
  'aria-invalid'?: boolean;
  'aria-describedby'?: string;
};

function getMarkdown(editor: Editor): string {
  const markdown = (
    editor.storage as unknown as {
      markdown?: { getMarkdown: () => string };
    }
  ).markdown;

  return markdown?.getMarkdown().trim() ?? '';
}

export function RichTextEditor({
  value = '',
  onChange,
  onBlur,
  placeholder = 'Description de la tâche…',
  disabled = false,
  className,
  'aria-invalid': ariaInvalid,
  'aria-describedby': ariaDescribedBy,
}: RichTextEditorProps) {
  const editor = useEditor({
    immediatelyRender: false,
    editable: !disabled,
    extensions: createRichTextExtensions(placeholder),
    content: value,
    editorProps: {
      attributes: {
        class: styles.prose,
        ...(ariaInvalid ? { 'aria-invalid': 'true' } : {}),
        ...(ariaDescribedBy ? { 'aria-describedby': ariaDescribedBy } : {}),
      },
    },
    onUpdate: ({ editor: current }) => {
      onChange?.(getMarkdown(current));
    },
    onBlur: () => {
      onBlur?.();
    },
  });

  useEffect(() => {
    if (!editor) return;
    editor.setEditable(!disabled);
  }, [disabled, editor]);

  useEffect(() => {
    if (!editor) return;
    const current = getMarkdown(editor);
    if (value === current) return;
    if (!value) {
      editor.commands.clearContent(false);
      return;
    }
    editor.commands.setContent(value, { emitUpdate: false });
  }, [editor, value]);

  if (!editor) {
    return (
      <div
        className={clsx(styles.root, styles.loading, className)}
        aria-busy="true"
      />
    );
  }

  return (
    <div
      className={clsx(
        styles.root,
        disabled && styles.disabled,
        ariaInvalid && styles.invalid,
        className,
      )}
    >
      <EditorContent editor={editor} className={styles.content} />
      {!disabled ? <RichTextToolbar editor={editor} /> : null}
    </div>
  );
}
