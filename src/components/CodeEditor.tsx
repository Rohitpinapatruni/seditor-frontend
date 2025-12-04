import Editor, { OnMount } from "@monaco-editor/react";

type Props = {
  onMount: OnMount;
};

export default function CodeEditor({ onMount }: Props) {
  return (
    <Editor
      height="100%"
      defaultLanguage="javascript"
      onMount={onMount}
      options={{
        minimap: { enabled: false },
        fontSize: 14,
      }}
    />
  );
}
