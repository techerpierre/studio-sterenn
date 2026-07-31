'use client';

import type { ChainedCommands, Editor } from '@tiptap/react';
import { useEditorState } from '@tiptap/react';
import {
  BoldIcon,
  CodeIcon,
  FileCodeIcon,
  Heading2Icon,
  Heading3Icon,
  ItalicIcon,
  ListChecksIcon,
  ListIcon,
  ListOrderedIcon,
  QuoteIcon,
  Redo2Icon,
  StrikethroughIcon,
  Undo2Icon,
} from 'lucide-react';
import { useEffect, useRef, useState, type MouseEvent } from 'react';

import { Toolbar } from '@/components/ui/Toolbar';
import clsx from '@/lib/clsx';

import styles from './styles.module.css';

/** Keep the editor focused so ProseMirror selection is not lost on toolbar clicks. */
function keepEditorSelection(event: MouseEvent) {
  event.preventDefault();
}

export type RichTextToolbarProps = {
  editor: Editor;
};

export function RichTextToolbar({ editor }: RichTextToolbarProps) {
  const selectionRef = useRef<{ from: number; to: number } | null>(null);
  const [expanded, setExpanded] = useState(false);
  const [visible, setVisible] = useState(false);

  const editorState = useEditorState({
    editor,
    selector: (ctx) => ({
      isFocused: ctx.editor.isFocused,
      bold: ctx.editor.isActive('bold'),
      italic: ctx.editor.isActive('italic'),
      strike: ctx.editor.isActive('strike'),
      code: ctx.editor.isActive('code'),
      codeBlock: ctx.editor.isActive('codeBlock'),
      h2: ctx.editor.isActive('heading', { level: 2 }),
      h3: ctx.editor.isActive('heading', { level: 3 }),
      bulletList: ctx.editor.isActive('bulletList'),
      orderedList: ctx.editor.isActive('orderedList'),
      taskList: ctx.editor.isActive('taskList'),
      blockquote: ctx.editor.isActive('blockquote'),
      canUndo: ctx.editor.can().undo(),
      canRedo: ctx.editor.can().redo(),
    }),
  });

  useEffect(() => {
    if (editorState.isFocused) {
      setVisible(true);
      return;
    }
    setExpanded(false);
    setVisible(false);
  }, [editorState.isFocused]);

  const rememberSelection = () => {
    const { from, to } = editor.state.selection;
    selectionRef.current = { from, to };
  };

  const run = (apply: (chain: ChainedCommands) => ChainedCommands) => {
    const saved = selectionRef.current ?? {
      from: editor.state.selection.from,
      to: editor.state.selection.to,
    };

    apply(editor.chain().focus().setTextSelection(saved)).run();
  };

  const onToolbarMouseDown = (event: MouseEvent) => {
    rememberSelection();
    keepEditorSelection(event);
  };

  return (
    <div
      className={clsx(styles.toolbarAnchor, visible && styles.toolbarVisible)}
      inert={visible ? undefined : true}
      onMouseDown={onToolbarMouseDown}
    >
      <Toolbar
        className={styles.toolbar}
        expandFrom="end"
        visibleCount={2}
        expanded={expanded}
        onExpandedChange={setExpanded}
      >
        <Toolbar.Item
          aria-label="Gras"
          active={editorState.bold}
          onClick={() => run((chain) => chain.toggleBold())}
        >
          <BoldIcon size={16} aria-hidden />
        </Toolbar.Item>
        <Toolbar.Item
          aria-label="Liste à puces"
          active={editorState.bulletList}
          onClick={() => run((chain) => chain.toggleBulletList())}
        >
          <ListIcon size={16} aria-hidden />
        </Toolbar.Item>
        <Toolbar.Item
          aria-label="Italique"
          active={editorState.italic}
          onClick={() => run((chain) => chain.toggleItalic())}
        >
          <ItalicIcon size={16} aria-hidden />
        </Toolbar.Item>
        <Toolbar.Item
          aria-label="Barré"
          active={editorState.strike}
          onClick={() => run((chain) => chain.toggleStrike())}
        >
          <StrikethroughIcon size={16} aria-hidden />
        </Toolbar.Item>
        <Toolbar.Item
          aria-label="Code"
          active={editorState.code}
          onClick={() => run((chain) => chain.toggleCode())}
        >
          <CodeIcon size={16} aria-hidden />
        </Toolbar.Item>
        <Toolbar.Item
          aria-label="Bloc de code"
          active={editorState.codeBlock}
          onClick={() => run((chain) => chain.toggleCodeBlock())}
        >
          <FileCodeIcon size={16} aria-hidden />
        </Toolbar.Item>
        <Toolbar.Item
          aria-label="Titre 2"
          active={editorState.h2}
          onClick={() => run((chain) => chain.toggleHeading({ level: 2 }))}
        >
          <Heading2Icon size={16} aria-hidden />
        </Toolbar.Item>
        <Toolbar.Item
          aria-label="Titre 3"
          active={editorState.h3}
          onClick={() => run((chain) => chain.toggleHeading({ level: 3 }))}
        >
          <Heading3Icon size={16} aria-hidden />
        </Toolbar.Item>
        <Toolbar.Item
          aria-label="Liste numérotée"
          active={editorState.orderedList}
          onClick={() => run((chain) => chain.toggleOrderedList())}
        >
          <ListOrderedIcon size={16} aria-hidden />
        </Toolbar.Item>
        <Toolbar.Item
          aria-label="Checklist"
          active={editorState.taskList}
          onClick={() => run((chain) => chain.toggleTaskList())}
        >
          <ListChecksIcon size={16} aria-hidden />
        </Toolbar.Item>
        <Toolbar.Item
          aria-label="Citation"
          active={editorState.blockquote}
          onClick={() => run((chain) => chain.toggleBlockquote())}
        >
          <QuoteIcon size={16} aria-hidden />
        </Toolbar.Item>
        <Toolbar.Item
          aria-label="Annuler"
          disabled={!editorState.canUndo}
          onClick={() => run((chain) => chain.undo())}
        >
          <Undo2Icon size={16} aria-hidden />
        </Toolbar.Item>
        <Toolbar.Item
          aria-label="Rétablir"
          disabled={!editorState.canRedo}
          onClick={() => run((chain) => chain.redo())}
        >
          <Redo2Icon size={16} aria-hidden />
        </Toolbar.Item>
      </Toolbar>
    </div>
  );
}
