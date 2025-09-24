'use client'

import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Image from '@tiptap/extension-image'
import Link from '@tiptap/extension-link'
import TextAlign from '@tiptap/extension-text-align'
import Placeholder from '@tiptap/extension-placeholder'
import CharacterCount from '@tiptap/extension-character-count'
import { useCallback, useEffect } from 'react'
import {
  FaBold,
  FaItalic,
  FaUnderline,
  FaStrikethrough,
  FaListUl,
  FaListOl,
  FaQuoteLeft,
  FaCode,
  FaLink,
  FaImage,
  FaAlignLeft,
  FaAlignCenter,
  FaAlignRight,
  FaUndo,
  FaRedo
} from 'react-icons/fa'

interface TipTapEditorProps {
  content: any
  onChange: (content: any) => void
  placeholder?: string
  editable?: boolean
}

export default function TipTapEditor({
  content,
  onChange,
  placeholder = 'Start writing your blog post...',
  editable = true
}: TipTapEditorProps) {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Image.configure({
        HTMLAttributes: {
          class: 'max-w-full h-auto rounded-lg',
        },
      }),
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: 'text-blue-600 hover:text-blue-800 underline',
        },
      }),
      TextAlign.configure({
        types: ['heading', 'paragraph'],
      }),
      Placeholder.configure({
        placeholder,
      }),
      CharacterCount,
    ],
    content,
    editable,
    immediatelyRender: false,
    onUpdate: ({ editor }) => {
      onChange(editor.getJSON())
    },
  })

  // Update editor content when prop changes
  useEffect(() => {
    if (editor && content !== editor.getJSON()) {
      editor.commands.setContent(content || '')
    }
  }, [editor, content])

  const addImage = useCallback(() => {
    const url = window.prompt('Enter image URL:')

    if (url && editor) {
      editor.chain().focus().setImage({ src: url }).run()
    }
  }, [editor])

  const setLink = useCallback(() => {
    const previousUrl = editor?.getAttributes('link').href
    const url = window.prompt('Enter URL:', previousUrl)

    if (url === null) {
      return
    }

    if (url === '') {
      editor?.chain().focus().extendMarkRange('link').unsetLink().run()
      return
    }

    editor?.chain().focus().extendMarkRange('link').setLink({ href: url }).run()
  }, [editor])

  if (!editor) {
    return (
      <div className="border border-gray-300 rounded-lg overflow-hidden">
        <div className="p-4 min-h-[300px] flex items-center justify-center bg-gray-50">
          <div className="text-gray-500">Loading editor...</div>
        </div>
      </div>
    )
  }

  return (
    <div className="border border-gray-300 rounded-lg overflow-hidden">
      {editable && (
        <div className="flex flex-wrap gap-1 p-3 border-b border-gray-200 bg-gray-50">
          {/* Text formatting */}
          <button
            onClick={() => editor.chain().focus().toggleBold().run()}
            className={`p-2 rounded hover:bg-gray-200 ${
              editor.isActive('bold') ? 'bg-gray-300' : ''
            }`}
            type="button"
          >
            <FaBold size={14} />
          </button>

          <button
            onClick={() => editor.chain().focus().toggleItalic().run()}
            className={`p-2 rounded hover:bg-gray-200 ${
              editor.isActive('italic') ? 'bg-gray-300' : ''
            }`}
            type="button"
          >
            <FaItalic size={14} />
          </button>

          <button
            onClick={() => editor.chain().focus().toggleStrike().run()}
            className={`p-2 rounded hover:bg-gray-200 ${
              editor.isActive('strike') ? 'bg-gray-300' : ''
            }`}
            type="button"
          >
            <FaStrikethrough size={14} />
          </button>

          <div className="w-px h-6 bg-gray-300 mx-1" />

          {/* Headings */}
          <button
            onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
            className={`px-3 py-2 rounded hover:bg-gray-200 text-sm font-medium ${
              editor.isActive('heading', { level: 1 }) ? 'bg-gray-300' : ''
            }`}
            type="button"
          >
            H1
          </button>

          <button
            onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
            className={`px-3 py-2 rounded hover:bg-gray-200 text-sm font-medium ${
              editor.isActive('heading', { level: 2 }) ? 'bg-gray-300' : ''
            }`}
            type="button"
          >
            H2
          </button>

          <button
            onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
            className={`px-3 py-2 rounded hover:bg-gray-200 text-sm font-medium ${
              editor.isActive('heading', { level: 3 }) ? 'bg-gray-300' : ''
            }`}
            type="button"
          >
            H3
          </button>

          <div className="w-px h-6 bg-gray-300 mx-1" />

          {/* Lists */}
          <button
            onClick={() => editor.chain().focus().toggleBulletList().run()}
            className={`p-2 rounded hover:bg-gray-200 ${
              editor.isActive('bulletList') ? 'bg-gray-300' : ''
            }`}
            type="button"
          >
            <FaListUl size={14} />
          </button>

          <button
            onClick={() => editor.chain().focus().toggleOrderedList().run()}
            className={`p-2 rounded hover:bg-gray-200 ${
              editor.isActive('orderedList') ? 'bg-gray-300' : ''
            }`}
            type="button"
          >
            <FaListOl size={14} />
          </button>

          <button
            onClick={() => editor.chain().focus().toggleBlockquote().run()}
            className={`p-2 rounded hover:bg-gray-200 ${
              editor.isActive('blockquote') ? 'bg-gray-300' : ''
            }`}
            type="button"
          >
            <FaQuoteLeft size={14} />
          </button>

          <button
            onClick={() => editor.chain().focus().toggleCodeBlock().run()}
            className={`p-2 rounded hover:bg-gray-200 ${
              editor.isActive('codeBlock') ? 'bg-gray-300' : ''
            }`}
            type="button"
          >
            <FaCode size={14} />
          </button>

          <div className="w-px h-6 bg-gray-300 mx-1" />

          {/* Alignment */}
          <button
            onClick={() => editor.chain().focus().setTextAlign('left').run()}
            className={`p-2 rounded hover:bg-gray-200 ${
              editor.isActive({ textAlign: 'left' }) ? 'bg-gray-300' : ''
            }`}
            type="button"
          >
            <FaAlignLeft size={14} />
          </button>

          <button
            onClick={() => editor.chain().focus().setTextAlign('center').run()}
            className={`p-2 rounded hover:bg-gray-200 ${
              editor.isActive({ textAlign: 'center' }) ? 'bg-gray-300' : ''
            }`}
            type="button"
          >
            <FaAlignCenter size={14} />
          </button>

          <button
            onClick={() => editor.chain().focus().setTextAlign('right').run()}
            className={`p-2 rounded hover:bg-gray-200 ${
              editor.isActive({ textAlign: 'right' }) ? 'bg-gray-300' : ''
            }`}
            type="button"
          >
            <FaAlignRight size={14} />
          </button>

          <div className="w-px h-6 bg-gray-300 mx-1" />

          {/* Media */}
          <button
            onClick={setLink}
            className={`p-2 rounded hover:bg-gray-200 ${
              editor.isActive('link') ? 'bg-gray-300' : ''
            }`}
            type="button"
          >
            <FaLink size={14} />
          </button>

          <button
            onClick={addImage}
            className="p-2 rounded hover:bg-gray-200"
            type="button"
          >
            <FaImage size={14} />
          </button>

          <div className="w-px h-6 bg-gray-300 mx-1" />

          {/* History */}
          <button
            onClick={() => editor.chain().focus().undo().run()}
            className="p-2 rounded hover:bg-gray-200"
            disabled={!editor.can().chain().focus().undo().run()}
            type="button"
          >
            <FaUndo size={14} />
          </button>

          <button
            onClick={() => editor.chain().focus().redo().run()}
            className="p-2 rounded hover:bg-gray-200"
            disabled={!editor.can().chain().focus().redo().run()}
            type="button"
          >
            <FaRedo size={14} />
          </button>
        </div>
      )}

      <div className="p-4 min-h-[300px] bg-white editor-container">
        <EditorContent
          editor={editor}
          className="prose max-w-none focus:outline-none tiptap-editor"
        />
      </div>

      {editable && editor.storage.characterCount && (
        <div className="px-4 py-2 text-sm text-gray-500 border-t border-gray-200 bg-gray-50">
          {editor.storage.characterCount.characters()} characters
        </div>
      )}
    </div>
  )
}