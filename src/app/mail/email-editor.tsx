"use client";
import { useState } from "react";
import StarterKit from "@tiptap/starter-kit";
import { EditorContent, useEditor } from "@tiptap/react";
import { Text } from "@tiptap/extension-text";
import EditorMenuBar from "./editor-menubar";

type Props = {};

const EmailEditor = (props: Props) => {
  const [value, setValue] = useState<string>("");

  const customText = Text.extend({
    addKeyboardShortcuts() {
      return {
        "Meta-j": () => {
          console.log("Meta-j");
          return true;
        },
      };
    },
  });

  const editor = useEditor({
    autofocus: false,
    extensions: [StarterKit, customText],
    onUpdate: ({ editor }) => {
      setValue(editor.getHTML());
      console.log("editor.getJSON(): ", editor.getJSON());
    },
    immediatelyRender: false,
  });

  if (!editor) return null;

  return (
    <div>
      <EditorMenuBar editor={editor} />
      <div className="prose prose-sm sm:prose lg:prose-lg xl:prose-2xl w-full px-4">
        <EditorContent editor={editor} value={value} />
      </div>
    </div>
  );
};

export default EmailEditor;


