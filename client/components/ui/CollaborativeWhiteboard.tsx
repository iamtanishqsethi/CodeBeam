"use client";

import React, { useEffect, useRef, useCallback, useState } from "react";
import dynamic from "next/dynamic";
import * as Y from "yjs";
import { SocketIOProvider } from "y-socket.io";
import "@excalidraw/excalidraw/index.css";

// Dynamically import Excalidraw (no SSR — it uses browser APIs)
const Excalidraw = dynamic(
  async () => (await import("@excalidraw/excalidraw")).Excalidraw,
  { ssr: false }
);

interface CollaborativeWhiteboardProps {
  roomId: string;
  userName: string;
}

const COLORS = [
  "#FF3366", "#33CC99", "#3399FF", "#FF9933",
  "#9933FF", "#00CFFF", "#FF3399", "#00FF66",
];

const getRandomColor = () => COLORS[Math.floor(Math.random() * COLORS.length)];

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type ExcalidrawImperativeAPI = any;

export default function CollaborativeWhiteboard({ roomId, userName }: CollaborativeWhiteboardProps) {
  const [excalidrawAPI, setExcalidrawAPI] = useState<ExcalidrawImperativeAPI | null>(null);
  const ydocRef = useRef<Y.Doc | null>(null);
  const providerRef = useRef<SocketIOProvider | null>(null);
  const colorRef = useRef(getRandomColor());
  const isRemoteUpdateRef = useRef(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // ─── Setup Yjs sync when API is ready ────────────────────────────
  useEffect(() => {
    if (!excalidrawAPI || !mounted) return;

    const ydoc = new Y.Doc();
    ydocRef.current = ydoc;

    const serverUrl = process.env.NEXT_PUBLIC_SERVER_URL || "http://localhost:5050";

    const provider = new SocketIOProvider(serverUrl, `whiteboard-${roomId}`, ydoc, {
      autoConnect: true,
    });
    providerRef.current = provider;

    // Awareness for cursor/pointer display
    provider.awareness.setLocalStateField("user", {
      name: userName,
      color: colorRef.current,
    });

    // Shared data structure for elements and app state
    const yElementsMap = ydoc.getMap("elementsMap");
    const yAppState = ydoc.getMap("appState");

    // ── Sync remote → local ────────────────────────────────────────
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const handleRemoteChange = (event: any, transaction: Y.Transaction) => {
      if (transaction.local) return;
      if (!excalidrawAPI) return;
      isRemoteUpdateRef.current = true;

      const elementsMap = yElementsMap.toJSON();
      const elementsArray = Object.values(elementsMap);
      
      if (elementsArray.length > 0) {
        excalidrawAPI.updateScene({ elements: elementsArray });
      }

      isRemoteUpdateRef.current = false;
    };

    yElementsMap.observe(handleRemoteChange);

    // Load initial state if exists
    const initialElementsMap = yElementsMap.toJSON();
    const initialElementsArray = Object.values(initialElementsMap);
    if (initialElementsArray.length > 0) {
      excalidrawAPI.updateScene({ elements: initialElementsArray });
    }

    // Sync theme from shared state
    yAppState.observe(() => {
      // Could sync theme or other app state in the future
    });

    return () => {
      yElementsMap.unobserve(handleRemoteChange);
      provider.destroy();
      ydoc.destroy();
    };
  }, [excalidrawAPI, mounted, roomId, userName]);

  // ─── Handle local changes → Yjs ─────────────────────────────────
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleChange = useCallback((elements: readonly any[]) => {
    if (isRemoteUpdateRef.current || !ydocRef.current) return;

    const yElementsMap = ydocRef.current.getMap("elementsMap");

    ydocRef.current.transact(() => {
      elements.forEach((el) => {
        const existing = yElementsMap.get(el.id) as any;
        // Only update if it's new, or the version is strictly higher (indicates local edit)
        // This prevents re-broadcasting identical states or overwriting newer remote states
        if (!existing || existing.version < el.version || (el.isDeleted && !existing.isDeleted)) {
          yElementsMap.set(el.id, el);
        }
      });
    });
  }, []);

  // ─── Pointer state for awareness (collaborative cursors) ────────
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handlePointerUpdate = useCallback((payload: any) => {
    if (!providerRef.current) return;
    providerRef.current.awareness.setLocalStateField("pointer", payload.pointer);
  }, []);

  // ─── Stable References to Prevent Infinite Loops ─────────────────
  const excalidrawUIOptions = React.useMemo(
    () => ({
      canvasActions: {
        loadScene: false,
        export: false,
      },
    }),
    []
  );

  const excalidrawInitialData = React.useMemo(
    () => ({
      appState: {
        viewBackgroundColor: "transparent",
        theme: "dark",
      },
    }),
    []
  );

  const handleExcalidrawAPI = useCallback(
    (api: ExcalidrawImperativeAPI) => {
      setExcalidrawAPI((prev) => (prev?.ready === api?.ready && prev?.id === api?.id ? prev : api));
    },
    []
  );

  if (!mounted) {
    return (
      <div className="flex items-center justify-center w-full h-full bg-background">
        <span className="text-white/30 text-sm">Loading whiteboard...</span>
      </div>
    );
  }

  return (
    <div className="flex flex-col w-full h-full bg-background overflow-hidden">
      {/* ── Toolbar ──────────────────────────────────────────────────── */}
      <div className="relative z-20 flex items-center justify-between gap-2 px-3 py-2 bg-white/[0.03] border-b border-white/10 backdrop-blur-xl">
        <span className="text-[10px] font-bold uppercase tracking-[0.15em] text-white/50 font-(family-name:--font-share-tech)">
          Whiteboard
        </span>
        <div className="flex items-center gap-2">
          <span className="text-[10px] text-white/30 hidden sm:inline">
            Collaborative • {userName}
          </span>
        </div>
      </div>

      {/* ── Excalidraw Canvas ────────────────────────────────────────── */}
      <div className="flex-1 relative min-h-0">
        <div className="absolute inset-0">
          <Excalidraw
            excalidrawAPI={handleExcalidrawAPI}
            onChange={handleChange}
            onPointerUpdate={handlePointerUpdate}
            theme="dark"
            UIOptions={excalidrawUIOptions}
            initialData={excalidrawInitialData}
          />
        </div>
      </div>
    </div>
  );
}
