"use client";

import React, { useEffect, useRef, useState } from "react";
import * as Y from "yjs";
import { SocketIOProvider } from "y-socket.io";
import { MonacoBinding } from "y-monaco";
import Editor from "@monaco-editor/react";
import { ChevronDown } from "lucide-react";

interface CollaborativeEditorProps {
  roomId: string;
  userName: string;
}

const LANGUAGES = [
  { id: "javascript", label: "JavaScript" },
  { id: "typescript", label: "TypeScript" },
  { id: "python", label: "Python" },
  { id: "go", label: "Go" },
];

const COLORS = [
  "#FF3366", "#33CC99", "#3399FF", "#FF9933", 
  "#9933FF", "#00CFFF", "#FF3399", "#00FF66",
  "#FFCC00", "#FF6633"
];

const getRandomColor = () => COLORS[Math.floor(Math.random() * COLORS.length)];

export default function CollaborativeEditor({ roomId, userName }: CollaborativeEditorProps) {
  const [language, setLanguage] = useState(LANGUAGES[0].id);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const editorRef = useRef<any>(null);
  const ydocRef = useRef<Y.Doc | null>(null);
  const providerRef = useRef<SocketIOProvider | null>(null);
  const bindingRef = useRef<MonacoBinding | null>(null);
  const colorRef = useRef(getRandomColor());

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleEditorDidMount = (editor: any) => {
    editorRef.current = editor;

    // Initialize Yjs Document
    const ydoc = new Y.Doc();
    ydocRef.current = ydoc;

    // Connect to Yjs WebSocket via socket.io
    const serverUrl = process.env.NEXT_PUBLIC_SERVER_URL || "http://localhost:5050";
    
    // Y-socket.io provider handles the connection
    const provider = new SocketIOProvider(serverUrl, roomId, ydoc, {
      autoConnect: true,
    });
    providerRef.current = provider;

    // Setup Awareness
    provider.awareness.setLocalStateField("user", {
      name: userName,
      color: colorRef.current,
    });

    // Bind Yjs to Monaco
    const type = ydoc.getText("monaco");
    bindingRef.current = new MonacoBinding(
      type,
      editorRef.current.getModel(),
      new Set([editorRef.current]),
      provider.awareness
    );

    // Sync Language Selection
    const configMap = ydoc.getMap("config");
    
    // Listen for remote language changes
    configMap.observe((event) => {
      if (event.keysChanged.has("language")) {
        const newLang = configMap.get("language") as string;
        if (newLang) setLanguage(newLang);
      }
    });

    // If a language was already set in the document, use it
    const existingLang = configMap.get("language") as string;
    if (existingLang) {
      setLanguage(existingLang);
    } else {
      configMap.set("language", language);
    }

    // Setup Awareness Listener
    const handleAwarenessUpdate = () => {
      setTimeout(() => {
        const awarenessStates = provider.awareness.getStates();
        awarenessStates.forEach((state, clientId) => {
          if (clientId === provider.awareness.clientID) return;
          const user = state.user;
          if (user?.name) {
            const heads = document.querySelectorAll(`.yRemoteSelectionHead-${clientId}`);
            heads.forEach((h) => {
              (h as HTMLElement).setAttribute("user-name", user.name);
              if (user.color) {
                (h as HTMLElement).style.borderColor = user.color;
                (h as HTMLElement).style.setProperty('--cursor-color', user.color);
              }
            });
          }
        });
      }, 0);
    };
    provider.awareness.on("change", handleAwarenessUpdate);
  };

  const handleLanguageChange = (langId: string) => {
    setLanguage(langId);
    setDropdownOpen(false);
    
    if (ydocRef.current) {
      const configMap = ydocRef.current.getMap("config");
      configMap.set("language", langId);
    }
  };

  useEffect(() => {
    return () => {
      bindingRef.current?.destroy();
      providerRef.current?.destroy();
      ydocRef.current?.destroy();
    };
  }, []);

  const [output, setOutput] = useState("");
  const [isRunning, setIsRunning] = useState(false);

  const runCode = async () => {
    if (!editorRef.current) return;
    
    setIsRunning(true);
    setOutput("Running code...");
    
    const code = editorRef.current.getValue();

    try {
      const response = await fetch("/api/execute", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          language: language,
          code: code,
        }),
      });
      
      const data = await response.json();
      
      if (data.status === 200) {
        if (data.output) {
          setOutput(data.output);
        } else if (data.error) {
          setOutput(`Error:\n${data.error}`);
        } else {
          setOutput("Program executed successfully (no output).");
        }
      } else {
        setOutput(`Execution error: ${data.message || "Unknown error"}`);
      }
    } catch (error) {
      setOutput("Failed to connect to execution service. Please try again later.");
    } finally {
      setIsRunning(false);
    }
  };

  return (
    <div className="flex flex-col w-full h-full bg-[#1e1e1e] rounded-lg overflow-hidden border border-slate-800 shadow-2xl">
      <div className="flex items-center justify-between px-4 py-3 bg-[#252526] border-b border-slate-800">
        <div className="flex items-center gap-4">
          <div className="text-sm font-semibold text-slate-300">
            CodeBeam Editor
          </div>
          
          <button
            onClick={runCode}
            disabled={isRunning}
            className="flex items-center gap-2 px-4 py-1.5 text-xs font-bold uppercase tracking-wider bg-emerald-600 hover:bg-emerald-500 disabled:bg-emerald-900 disabled:text-emerald-400 text-white rounded-md transition-all shadow-lg active:scale-95"
          >
            {isRunning ? (
              <>
                <div className="size-3 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Running...
              </>
            ) : (
              <>
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="currentColor" className="lucide lucide-play"><polygon points="5 3 19 12 5 21 5 3"/></svg>
                Run
              </>
            )}
          </button>
        </div>
        
        {/* Language Selector Dropdown */}
        <div className="relative">
          <button 
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="flex items-center gap-2 px-3 py-1.5 text-sm bg-slate-800 text-slate-200 rounded-md hover:bg-slate-700 transition-colors border border-slate-700"
          >
            {LANGUAGES.find(l => l.id === language)?.label || "Select Language"}
            <ChevronDown size={14} />
          </button>
          
          {dropdownOpen && (
            <div className="absolute right-0 top-full mt-1 w-40 bg-slate-800 border border-slate-700 rounded-md shadow-lg z-50 overflow-hidden">
              {LANGUAGES.map((lang) => (
                <button
                  key={lang.id}
                  onClick={() => handleLanguageChange(lang.id)}
                  className={`w-full text-left px-4 py-2 text-sm hover:bg-slate-700 transition-colors ${
                    language === lang.id ? "text-blue-400 font-medium bg-slate-700/50" : "text-slate-300"
                  }`}
                >
                  {lang.label}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="flex-1 flex flex-col relative overflow-hidden">
        <div className="flex-1 relative min-h-0">
          <Editor
            height="100%"
            language={language}
            theme="vs-dark"
            onMount={handleEditorDidMount}
            options={{
              minimap: { enabled: false },
              fontSize: 14,
              wordWrap: "on",
              padding: { top: 16 },
              smoothScrolling: true,
              cursorBlinking: "smooth",
              formatOnPaste: true,
              formatOnType: true,
            }}
          />
        </div>
        
        {/* Output Panel */}
        <div className="h-40 bg-[#1e1e1e] border-t border-slate-800 flex flex-col">
          <div className="px-4 py-1.5 bg-[#252526] border-b border-slate-800 text-[10px] font-bold uppercase tracking-widest text-slate-500 flex justify-between items-center">
            <span>Output</span>
            {output && (
              <button 
                onClick={() => setOutput("")}
                className="hover:text-slate-300 transition-colors"
              >
                Clear
              </button>
            )}
          </div>
          <div className="flex-1 p-4 overflow-y-auto font-mono text-sm">
            {output ? (
              <pre className={output.includes("error") || output.includes("Failed") ? "text-red-400" : "text-slate-300"}>
                {output}
              </pre>
            ) : (
              <span className="text-slate-600 italic">No output yet. Click "Run" to execute your code.</span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
