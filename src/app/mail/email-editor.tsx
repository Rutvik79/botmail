"use client";
import { useState } from "react";
import StarterKit from "@tiptap/starter-kit";
import { EditorContent, useEditor } from "@tiptap/react";
import { Text } from "@tiptap/extension-text";
import EditorMenuBar from "./editor-menubar";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";

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
      <div className="flex border-b p-4 py-2">
        <EditorMenuBar editor={editor} />
      </div>
      <div className="prose w-full p-4">
        <EditorContent
          editor={editor}
          value={value}
          placeholder="Write your email here..."
        />
      </div>

      <Separator />
      <div className="flex items-center justify-between px-4 py-3">
        <span className="text-sm">
          Tip: Press{" "}
          <kbd className="rounded-lg border border-gray-200 bg-gray-100 px-2 py-1.5 text-xs font-semibold text-gray-800">
            Cmd + J
          </kbd>{" "}
          for AI Autocomplete
        </span>
        <Button>Send</Button>
      </div>
    </div>
  );
};

export default EmailEditor;
