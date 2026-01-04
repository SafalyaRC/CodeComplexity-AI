"use client";

import Editor from "@monaco-editor/react";
import { useState } from "react";
import { toast } from "sonner";

interface CodeEditorProps {
  code: string;
  language: string;
  onChange: (value: string) => void;
}

export default function CodeEditor({
  code,
  language,
  onChange,
}: CodeEditorProps) {
  const [fontSize, setFontSize] = useState(14);
  const [showLineNumbers, setShowLineNumbers] = useState(true);

  const handleClear = () => {
    onChange("");
    toast.success("Editor cleared");
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      toast.success("Code copied to clipboard");
    } catch (e) {
      toast.error("Failed to copy code");
    }
  };

  const increaseFont = () => setFontSize((s: number) => Math.min(24, s + 1));
  const decreaseFont = () => setFontSize((s: number) => Math.max(10, s - 1));

  return (
    <div className="rounded-lg overflow-hidden card-border">
      <div className="flex items-center justify-between p-2 bg-black/40 border-b border-gray-800">
        <div className="flex items-center space-x-2">
          <button
            onClick={handleClear}
            className="text-sm text-gray-300 hover:text-white px-3 py-1 rounded-md"
          >
            Clear
          </button>
          <button
            onClick={handleCopy}
            className="text-sm text-gray-300 hover:text-white px-3 py-1 rounded-md"
          >
            Copy
          </button>
          <button
            onClick={() => setShowLineNumbers((v) => !v)}
            className="text-sm text-gray-300 hover:text-white px-3 py-1 rounded-md"
          >
            {showLineNumbers ? "Hide lines" : "Show lines"}
          </button>
        </div>

        <div className="flex items-center space-x-2">
          <button onClick={decreaseFont} className="text-sm text-gray-300 px-2">
            A-
          </button>
          <span className="text-sm text-gray-300">{fontSize}px</span>
          <button onClick={increaseFont} className="text-sm text-gray-300 px-2">
            A+
          </button>
        </div>
      </div>

      <Editor
        height="500px"
        language={language}
        theme="vs-dark"
        value={code}
        onChange={(value) => onChange(value || "")}
        options={{
          minimap: { enabled: false },
          fontSize,
          lineNumbers: showLineNumbers ? "on" : "off",
          scrollBeyondLastLine: false,
          automaticLayout: true,
          tabSize: 2,
        }}
      />
    </div>
  );
}
