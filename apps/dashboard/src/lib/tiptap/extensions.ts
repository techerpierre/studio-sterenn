import { TaskItem, TaskList } from '@tiptap/extension-list';
import { Placeholder } from '@tiptap/extensions';
import StarterKit from '@tiptap/starter-kit';
import { Markdown } from 'tiptap-markdown';

export function createRichTextExtensions(placeholder = 'Écrire…') {
  return [
    StarterKit.configure({
      heading: { levels: [2, 3] },
    }),
    TaskList,
    TaskItem.configure({
      nested: true,
    }),
    Placeholder.configure({ placeholder }),
    Markdown.configure({
      html: false,
      transformPastedText: true,
      transformCopiedText: true,
    }),
  ];
}
