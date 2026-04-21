'use client';

import type { Editor } from '@tiptap/react';

import { useCallback } from 'react';
import Link from '@tiptap/extension-link';
import Color from '@tiptap/extension-color';
import Image from '@tiptap/extension-image';
import StarterKit from '@tiptap/starter-kit';
import Underline from '@tiptap/extension-underline';
import TextAlign from '@tiptap/extension-text-align';
import Placeholder from '@tiptap/extension-placeholder';
import { useEditor, EditorContent } from '@tiptap/react';
import { TextStyle } from '@tiptap/extension-text-style';

import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Select from '@mui/material/Select';
import Divider from '@mui/material/Divider';
import MenuItem from '@mui/material/MenuItem';
import IconButton from '@mui/material/IconButton';

// ----------------------------------------------------------------------

type TiptapEditorProps = {
  value?: string;
  onChange?: (html: string) => void;
  placeholder?: string;
  error?: boolean;
  helperText?: React.ReactNode;
};

export function TiptapEditor({ value, onChange, placeholder, error, helperText }: TiptapEditorProps) {
  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit,
      Underline,
      TextStyle,
      Color,
      TextAlign.configure({ types: ['heading', 'paragraph'] }),
      Link.configure({ openOnClick: false }),
      Image,
      Placeholder.configure({ placeholder: placeholder ?? '' }),
    ],
    content: value ?? '',
    onUpdate: ({ editor: ed }) => {
      onChange?.(ed.getHTML());
    },
  });

  if (!editor) return null;

  return (
    <Box
      sx={{
        border: '1px solid',
        borderColor: error ? 'error.main' : 'divider',
        borderRadius: 1,
        '&:focus-within': {
          borderColor: error ? 'error.main' : 'primary.main',
          borderWidth: 2,
        },
      }}
    >
      <Toolbar editor={editor} />
      <Divider />
      <Box
        sx={{
          p: 2,
          minHeight: 200,
          '& .tiptap': {
            outline: 'none',
            minHeight: 180,
            '& p.is-editor-empty:first-of-type::before': {
              color: 'text.disabled',
              content: 'attr(data-placeholder)',
              float: 'left',
              height: 0,
              pointerEvents: 'none',
            },
            '& img': {
              maxWidth: '100%',
              height: 'auto',
              borderRadius: 1,
            },
          },
        }}
      >
        <EditorContent editor={editor} />
      </Box>

      {helperText && (
        <Box sx={{ px: 2, pb: 1, color: error ? 'error.main' : 'text.secondary', fontSize: '0.75rem' }}>
          {helperText}
        </Box>
      )}
    </Box>
  );
}

// ----------------------------------------------------------------------

/** Botón de toolbar con estilo activo/inactivo */
function TBtn({
  active,
  onClick,
  children,
  title,
}: {
  active?: boolean;
  onClick: () => void;
  children: React.ReactNode;
  title?: string;
}) {
  return (
    <IconButton
      size="small"
      onClick={onClick}
      title={title}
      sx={{
        borderRadius: 0.5,
        fontWeight: active ? 700 : 400,
        color: active ? 'primary.main' : 'text.secondary',
        bgcolor: active ? 'action.selected' : 'transparent',
        minWidth: 28,
        height: 28,
        fontSize: '0.85rem',
      }}
    >
      {children}
    </IconButton>
  );
}

// SVG helpers para los iconos del toolbar
const SvgBold = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
    <path d="M6 4h8a4 4 0 0 1 2.8 6.85A4.5 4.5 0 0 1 15 20H6V4zm3 7h5a1.5 1.5 0 0 0 0-3H9v3zm0 3v4h6a1.5 1.5 0 0 0 0-3H9z" />
  </svg>
);
const SvgItalic = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
    <path d="M15 20H7v-2h2.93l2.14-12H10V4h8v2h-2.93l-2.14 12H15z" />
  </svg>
);
const SvgUnderline = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
    <path d="M8 3v9a4 4 0 0 0 8 0V3h2v9a6 6 0 0 1-12 0V3h2zM4 20h16v2H4v-2z" />
  </svg>
);
const SvgStrike = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
    <path d="M17.154 14c.23.516.346 1.09.346 1.72c0 1.342-.524 2.392-1.571 3.147C14.88 19.622 13.433 20 11.586 20c-1.64 0-3.263-.381-4.866-1.144V16.6c1.52.877 3.075 1.316 4.666 1.316c2.551 0 3.83-.732 3.839-2.197a2.21 2.21 0 0 0-.648-1.603l-.12-.116H3v-2h18v2h-3.846zM7.556 11c-.36-.606-.54-1.27-.54-1.99c0-1.347.527-2.398 1.58-3.153C9.648 5.286 11.09 4.91 12.92 4.91c1.481 0 2.945.334 4.39 1.002v2.165c-1.358-.75-2.79-1.127-4.293-1.127c-2.609 0-3.914.722-3.914 2.166c0 .405.108.778.323 1.118l.096.15H7.556z" />
  </svg>
);
const SvgListBullet = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
    <path d="M8 4h13v2H8V4zM4.5 6.5a1.5 1.5 0 1 1 0-3a1.5 1.5 0 0 1 0 3zM4.5 13.5a1.5 1.5 0 1 1 0-3a1.5 1.5 0 0 1 0 3zM4.5 20.4a1.5 1.5 0 1 1 0-3a1.5 1.5 0 0 1 0 3zM8 11h13v2H8v-2zm0 7h13v2H8v-2z" />
  </svg>
);
const SvgListOrdered = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
    <path d="M8 4h13v2H8V4zM5 3v3H4V4H3V3h2zm-1 7h2.5v1H4.5v1H6v3H3v-1h2.5v-1H4V10h0zm-1 7h3v1H4.5v1H6v1H3v-3h0zM8 11h13v2H8v-2zm0 7h13v2H8v-2z" />
  </svg>
);
const SvgAlignLeft = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
    <path d="M3 4h18v2H3V4zm0 4h14v2H3V8zm0 4h18v2H3v-2zm0 4h14v2H3v-2zm0 4h18v2H3v-2z" />
  </svg>
);
const SvgAlignCenter = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
    <path d="M3 4h18v2H3V4zm2 4h14v2H5V8zm-2 4h18v2H3v-2zm2 4h14v2H5v-2zm-2 4h18v2H3v-2z" />
  </svg>
);
const SvgAlignRight = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
    <path d="M3 4h18v2H3V4zm4 4h14v2H7V8zm-4 4h18v2H3v-2zm4 4h14v2H7v-2zm-4 4h18v2H3v-2z" />
  </svg>
);
const SvgAlignJustify = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
    <path d="M3 4h18v2H3V4zm0 4h18v2H3V8zm0 4h18v2H3v-2zm0 4h18v2H3v-2zm0 4h18v2H3v-2z" />
  </svg>
);
const SvgLink = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
    <path d="M18.364 15.536L16.95 14.12l1.414-1.414a5 5 0 1 0-7.071-7.071L9.879 7.05L8.464 5.636l1.414-1.414a7 7 0 0 1 9.9 9.9l-1.414 1.414zm-2.828 2.828l-1.414 1.414a7 7 0 0 1-9.9-9.9l1.414-1.414L7.05 9.88l-1.414 1.414a5 5 0 1 0 7.071 7.071l1.414-1.414 1.415 1.414zm-.708-10.607l1.414 1.414-7.071 7.072-1.414-1.414 7.07-7.072z" />
  </svg>
);
const SvgImage = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
    <path d="M4.828 21l-.02.02-.021-.02H2.992A.993.993 0 0 1 2 20.007V3.993A1 1 0 0 1 2.992 3h18.016c.548 0 .992.445.992.993v16.014a1 1 0 0 1-.992.993H4.828zM20 15V5H4v14L14 9l6 6zm0 2.828l-6-6L6.828 19H20v-1.172zM8 11a2 2 0 1 1 0-4a2 2 0 0 1 0 4z" />
  </svg>
);

function Toolbar({ editor }: { editor: Editor }) {
  const addImage = useCallback(() => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = () => {
      const file = input.files?.[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = () => {
        const src = reader.result as string;
        editor.chain().focus().setImage({ src }).run();
      };
      reader.readAsDataURL(file);
    };
    input.click();
  }, [editor]);

  const setLink = useCallback(() => {
    const previousUrl = editor.getAttributes('link').href;
    const url = window.prompt('URL', previousUrl);
    if (url === null) return;
    if (url === '') {
      editor.chain().focus().extendMarkRange('link').unsetLink().run();
      return;
    }
    editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run();
  }, [editor]);

  /** Valor actual del bloque para el select */
  const blockType = editor.isActive('heading', { level: 1 })
    ? 'h1'
    : editor.isActive('heading', { level: 2 })
      ? 'h2'
      : editor.isActive('heading', { level: 3 })
        ? 'h3'
        : 'paragraph';

  return (
    <Stack
      direction="row"
      flexWrap="wrap"
      spacing={0.5}
      sx={{ p: 1, bgcolor: 'background.neutral', borderTopLeftRadius: 'inherit', borderTopRightRadius: 'inherit' }}
      alignItems="center"
    >
      {/* Tipo de bloque */}
      <Select
        size="small"
        value={blockType}
        onChange={(e) => {
          const val = e.target.value;
          if (val === 'paragraph') editor.chain().focus().setParagraph().run();
          else if (val === 'h1') editor.chain().focus().toggleHeading({ level: 1 }).run();
          else if (val === 'h2') editor.chain().focus().toggleHeading({ level: 2 }).run();
          else if (val === 'h3') editor.chain().focus().toggleHeading({ level: 3 }).run();
        }}
        sx={{ minWidth: 120, height: 32, fontSize: '0.85rem' }}
      >
        <MenuItem value="paragraph">Paragraph</MenuItem>
        <MenuItem value="h1">Heading 1</MenuItem>
        <MenuItem value="h2">Heading 2</MenuItem>
        <MenuItem value="h3">Heading 3</MenuItem>
      </Select>

      <Divider orientation="vertical" flexItem />

      {/* Formato de texto */}
      <TBtn active={editor.isActive('bold')} onClick={() => editor.chain().focus().toggleBold().run()} title="Bold">
        <SvgBold />
      </TBtn>
      <TBtn active={editor.isActive('italic')} onClick={() => editor.chain().focus().toggleItalic().run()} title="Italic">
        <SvgItalic />
      </TBtn>
      <TBtn active={editor.isActive('underline')} onClick={() => editor.chain().focus().toggleUnderline().run()} title="Underline">
        <SvgUnderline />
      </TBtn>
      <TBtn active={editor.isActive('strike')} onClick={() => editor.chain().focus().toggleStrike().run()} title="Strikethrough">
        <SvgStrike />
      </TBtn>

      <Divider orientation="vertical" flexItem />

      {/* Listas */}
      <TBtn active={editor.isActive('bulletList')} onClick={() => editor.chain().focus().toggleBulletList().run()} title="Bullet list">
        <SvgListBullet />
      </TBtn>
      <TBtn active={editor.isActive('orderedList')} onClick={() => editor.chain().focus().toggleOrderedList().run()} title="Ordered list">
        <SvgListOrdered />
      </TBtn>

      <Divider orientation="vertical" flexItem />

      {/* Alineación */}
      <TBtn active={editor.isActive({ textAlign: 'left' })} onClick={() => editor.chain().focus().setTextAlign('left').run()} title="Align left">
        <SvgAlignLeft />
      </TBtn>
      <TBtn active={editor.isActive({ textAlign: 'center' })} onClick={() => editor.chain().focus().setTextAlign('center').run()} title="Align center">
        <SvgAlignCenter />
      </TBtn>
      <TBtn active={editor.isActive({ textAlign: 'right' })} onClick={() => editor.chain().focus().setTextAlign('right').run()} title="Align right">
        <SvgAlignRight />
      </TBtn>
      <TBtn active={editor.isActive({ textAlign: 'justify' })} onClick={() => editor.chain().focus().setTextAlign('justify').run()} title="Justify">
        <SvgAlignJustify />
      </TBtn>

      <Divider orientation="vertical" flexItem />

      {/* Link e Imagen */}
      <TBtn active={editor.isActive('link')} onClick={setLink} title="Link">
        <SvgLink />
      </TBtn>
      <TBtn onClick={addImage} title="Image">
        <SvgImage />
      </TBtn>
    </Stack>
  );
}
