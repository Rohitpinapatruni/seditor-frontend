// src/routes/RoomPage.tsx
import { useParams } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import CodeEditor from "../components/CodeEditor";
import * as Y from "yjs";
import { WebsocketProvider } from "y-websocket";
import { MonacoBinding } from "y-monaco";
import { editor } from "monaco-editor";

export default function RoomPage() {
  const { roomId } = useParams<{ roomId: string }>();
  const roomIdSafe = roomId ?? "unknown";

  const [connected, setConnected] = useState(false);
  const editorRef = useRef<editor.IStandaloneCodeEditor | null>(null);
  const providerRef = useRef<WebsocketProvider | null>(null);
  const docRef = useRef<Y.Doc | null>(null);
  const bindingRef = useRef<MonacoBinding | null>(null);

  useEffect(() => {
    // 1. Create Yjs Doc
    const doc = new Y.Doc();
    docRef.current = doc;

    // 2. Connect to Websocket Provider
    // Using the same host/port as the backend
    const provider = new WebsocketProvider(
      "ws://localhost:8000",
      roomIdSafe,
      doc
    );
    providerRef.current = provider;

    provider.on("status", (event: { status: string }) => {
      setConnected(event.status === "connected");
    });

    // Cleanup
    return () => {
      if (bindingRef.current) {
        bindingRef.current.destroy();
      }
      if (providerRef.current) {
        providerRef.current.destroy();
      }
      if (docRef.current) {
        docRef.current.destroy();
      }
    };
  }, [roomIdSafe]);

  const handleEditorDidMount = (editor: editor.IStandaloneCodeEditor) => {
    editorRef.current = editor;
    const doc = docRef.current;
    const provider = providerRef.current;

    if (doc && provider) {
      const type = doc.getText("monaco");
      // 3. Bind Yjs Doc to Monaco Editor
      const binding = new MonacoBinding(
        type,
        editor.getModel()!,
        new Set([editor]),
        provider.awareness
      );
      bindingRef.current = binding;
    }
  };

  const copyLink = () => {
    navigator.clipboard.writeText(window.location.href);
  };

  return (
    <div className="room-layout">
      <header className="room-header">
        <div className="room-title">
          <span>Seditor Room</span>
          <div className="room-id">{roomIdSafe}</div>
          <div style={{ fontSize: "0.75rem", color: "#9ca3af" }}>
            {connected ? "Connected" : "Connecting..."}
          </div>
        </div>
        <button className="btn btn-secondary" onClick={copyLink}>
          🔗 Copy invite link
        </button>
      </header>

      <main className="room-main">
        <section className="editor-pane">
          <div className="editor-wrapper">
            <CodeEditor onMount={handleEditorDidMount} />
          </div>
        </section>

        <aside className="sidebar">
          <div className="sidebar-section">
            <div className="sidebar-section-title">Users</div>
            <div className="sidebar-scroll">User list coming soon…</div>
          </div>

          <div className="sidebar-section">
            <div className="sidebar-section-title">Chat</div>
          </div>

          <div className="sidebar-scroll">
            Chat history will appear here once we implement it.
          </div>

          <div className="chat-footer">
            <input
              className="input"
              placeholder="Type a message… (not wired yet)"
              disabled
            />
            <button className="btn btn-secondary" disabled>
              Send
            </button>
          </div>
        </aside>
      </main>
    </div>
  );
}
