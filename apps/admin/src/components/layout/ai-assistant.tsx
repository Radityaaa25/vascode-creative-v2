'use client'

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Bot, Minus, Send, Square, Pencil, Sparkles, X, AlertTriangle, CheckCircle2, Trash2 } from "lucide-react";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { cn } from "@/lib/utils";
import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport } from "ai";

const now = () => new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

const STORAGE_KEY = "vascode_chat_history";
const EXPIRY_DAYS = 30;

export function AIAssistant() {
  const [open, setOpen] = useState(false);
  const [pos, setPos] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [dragging, setDragging] = useState(false);
  const [input, setInput] = useState("");
  const [confirmClear, setConfirmClear] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  
  const bodyRef = useRef<HTMLDivElement>(null);
  
  const { messages, sendMessage, setMessages, status, error, stop } = useChat({
    transport: new DefaultChatTransport({ api: "/api/chat" }),
    id: "vascode-assistant",
  });

  const isLoading = status === "submitted" || status === "streaming";

  useEffect(() => {
    if (error) console.error("AI Assistant error:", error);
  }, [error]);

  // Load chat history from localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const { data, timestamp } = JSON.parse(saved);
        const ageInDays = (Date.now() - timestamp) / (1000 * 60 * 60 * 24);
        if (ageInDays < EXPIRY_DAYS) {
          const migrated = data.map((m: any) => {
            if (!m.parts && m.content) {
              return { ...m, parts: [{ type: "text" as const, text: m.content }] };
            }
            return m;
          });
          setMessages(migrated);
        } else {
          localStorage.removeItem(STORAGE_KEY);
        }
      }
    } catch (e) {
      console.error("Failed to load chat history", e);
    }
  }, [setMessages]);

  // Save chat history to localStorage with debounce (avoids jank during streaming)
  const saveTimerRef = useRef<any>(undefined);
  useEffect(() => {
    if (messages.length === 0) return;
    clearTimeout(saveTimerRef.current);
    saveTimerRef.current = setTimeout(() => {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({
        data: messages,
        timestamp: Date.now()
      }));
    }, 500);
    return () => clearTimeout(saveTimerRef.current);
  }, [messages]);

  const clearChat = () => setConfirmClear(true);

  const confirmClearChat = () => {
    localStorage.removeItem(STORAGE_KEY);
    setConfirmClear(false);
    window.location.reload();
  };

  // Initial snap position — bottom-right
  useEffect(() => {
    const setDefault = () => setPos({ x: window.innerWidth - 88, y: window.innerHeight - 96 });
    setDefault();
    window.addEventListener("resize", setDefault, { passive: true });
    return () => window.removeEventListener("resize", setDefault);
  }, []);

  useEffect(() => {
    bodyRef.current?.scrollTo({ top: bodyRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, isLoading, open]);

  // Draggable bubble with snap-to-edge
  const dragRef = useRef({ startX: 0, startY: 0, origX: 0, origY: 0, moved: false });
  const onPointerDown = (e: React.PointerEvent) => {
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
    dragRef.current = { startX: e.clientX, startY: e.clientY, origX: pos.x, origY: pos.y, moved: false };
    setDragging(true);
  };
  const onPointerMove = (e: React.PointerEvent) => {
    if (!dragging) return;
    const dx = e.clientX - dragRef.current.startX;
    const dy = e.clientY - dragRef.current.startY;
    if (Math.abs(dx) + Math.abs(dy) > 4) dragRef.current.moved = true;
    setPos({
      x: Math.max(8, Math.min(window.innerWidth - 72, dragRef.current.origX + dx)),
      y: Math.max(8, Math.min(window.innerHeight - 72, dragRef.current.origY + dy)),
    });
  };
  const onPointerUp = () => {
    setDragging(false);
    // Snap horizontally to nearest edge
    setPos((p) => {
      const snapX = p.x + 32 < window.innerWidth / 2 ? 16 : window.innerWidth - 80;
      return { x: snapX, y: p.y };
    });
  };
  const onClickBubble = () => {
    if (dragRef.current.moved) return;
    setOpen(true);
  };

  return (
    <>
      {/* Floating draggable bubble */}
      <motion.button
        type="button"
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onClick={onClickBubble}
        style={{ left: pos.x, top: pos.y }}
        className={cn(
          "fixed z-50 grid h-14 w-14 select-none place-items-center rounded-full",
          "bg-gradient-to-br from-primary to-accent shadow-[0_10px_40px_-5px_hsl(257_65%_57%/0.7)]",
          "touch-none transition-shadow",
          dragging ? "cursor-grabbing scale-110" : "cursor-grab hover:scale-105",
          open && "pointer-events-none opacity-0",
        )}
        animate={{ scale: dragging ? 1.1 : 1 }}
      >
        <img src="/logo-icon.png" alt="AI" className="h-7 w-7 object-contain drop-shadow-md brightness-0 invert" />
        <span className="absolute -bottom-0.5 -right-0.5 h-3.5 w-3.5 rounded-full border-2 border-background bg-accent" />
      </motion.button>

      {/* Chat window */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: "spring", stiffness: 260, damping: 22 }}
            className="fixed bottom-6 right-6 z-50 flex h-[560px] w-[380px] max-w-[calc(100vw-2rem)] flex-col overflow-hidden rounded-3xl glass-strong shadow-2xl"
          >
            {/* Header */}
            <div className="flex items-center gap-3 border-b border-white/8 px-4 py-3">
              <div className="grid h-9 w-9 place-items-center rounded-full bg-gradient-to-br from-primary to-accent shrink-0 overflow-hidden p-1.5">
                <img src="/logo-icon.png" alt="AI" className="h-full w-full object-contain brightness-0 invert" />
              </div>
              <div className="flex-1 overflow-hidden">
                <div className="text-sm font-semibold truncate">VasCode Assistant</div>
                <div className="flex items-center gap-1.5 text-[11px] text-white/60">
                  <span className="relative flex h-1.5 w-1.5">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent opacity-75" />
                    <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-accent" />
                  </span>
                  AI Assistant
                </div>
              </div>
              <button onClick={clearChat} title="Clear Chat History" className="grid h-8 w-8 place-items-center rounded-full text-white/60 hover:bg-destructive/20 hover:text-destructive transition-colors shrink-0">
                <Trash2 className="h-4 w-4" />
              </button>
              <button onClick={() => setOpen(false)} className="grid h-8 w-8 place-items-center rounded-full text-white/60 hover:bg-white/10 hover:text-foreground shrink-0">
                <Minus className="h-4 w-4" />
              </button>
            </div>

            {/* Body */}
            <div ref={bodyRef} className="flex-1 space-y-4 overflow-y-auto px-4 py-4 scroll-smooth">
              {messages.length === 0 && (
                <div className="text-center text-xs text-white/40 mt-10 space-y-2">
                  <div className="mx-auto grid h-12 w-12 place-items-center rounded-full bg-white/5">
                    <img src="/logo-icon.png" alt="AI" className="h-6 w-6 opacity-40 brightness-0 invert" />
                  </div>
                  <p>Hi, I am VasCode Assistant.<br/>How can I help you today?</p>
                </div>
              )}
              {messages.map((m) => (
                <div key={m.id} className={cn("group flex gap-2", m.role === "user" ? "justify-end" : "justify-start")}>
                  {m.role !== "user" && (
                    <div className="mt-0.5 grid h-7 w-7 shrink-0 place-items-center rounded-full bg-gradient-to-br from-primary to-accent p-1.5">
                      <img src="/logo-icon.png" alt="AI" className="h-full w-full object-contain brightness-0 invert" />
                    </div>
                  )}
                  <div className={cn("max-w-[78%] space-y-1")}>
                    <div
                      className={cn(
                        "rounded-2xl px-3.5 py-2.5 text-[13px] leading-relaxed whitespace-pre-wrap text-justify",
                        m.role === "user"
                          ? "bg-primary text-primary-foreground rounded-br-sm"
                          : "bg-white/8 text-foreground rounded-bl-sm",
                      )}
                    >
                      {(m.parts ?? []).filter((p: any) => p.type === "text").map((p: any) => p.text).join("").replace(/<think>[\s\S]*?(?:<\/think>|$)/g, "").trim()}
                    </div>
                    {m.role === "user" && !isLoading && (
                      <button
                        onClick={() => {
                          const text = (m.parts ?? []).filter((p: any) => p.type === "text").map((p: any) => p.text).join("");
                          setInput(text);
                          setEditingId(m.id);
                          bodyRef.current?.scrollTo({ top: bodyRef.current.scrollHeight, behavior: "smooth" });
                        }}
                        className="flex items-center gap-1 text-[10px] text-white/30 hover:text-white/60 transition-colors opacity-0 group-hover:opacity-100"
                      >
                        <Pencil className="h-3 w-3" />
                        Edit
                      </button>
                    )}
                  </div>
                </div>
              ))}

              {isLoading && (
                <div className="flex gap-2">
                  <div className="mt-0.5 grid h-7 w-7 place-items-center rounded-full bg-gradient-to-br from-primary to-accent p-1.5">
                    <img src="/logo-icon.png" alt="AI" className="h-full w-full object-contain brightness-0 invert" />
                  </div>
                  <div className="flex items-center gap-1 rounded-2xl rounded-bl-sm bg-white/8 px-4 py-3">
                    {[0, 1, 2].map((i) => (
                      <motion.span
                        key={i}
                        className="h-1.5 w-1.5 rounded-full bg-white/70"
                        animate={{ opacity: [0.3, 1, 0.3], y: [0, -3, 0] }}
                        transition={{ duration: 1, repeat: Infinity, delay: i * 0.15 }}
                      />
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Input */}
            <form onSubmit={(e) => {
              e.preventDefault();
              const text = input.trim();
              if (!text || isLoading) return;
              if (editingId) {
                sendMessage({ text, messageId: editingId });
                setEditingId(null);
              } else {
                sendMessage({ text });
              }
              setInput("");
            }} className="border-t border-white/8 p-3">
              <div className="flex items-center gap-2 rounded-full border border-white/10 bg-white/5 pl-4 pr-1.5 py-1.5">
                <input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                      const text = input.trim();
                      if (!text || isLoading) return;
                      if (editingId) {
                        sendMessage({ text, messageId: editingId });
                        setEditingId(null);
                      } else {
                        sendMessage({ text });
                      }
                      setInput("");
                    }
                    if (e.key === "Escape" && editingId) {
                      setEditingId(null);
                      setInput("");
                    }
                  }}
                  placeholder={editingId ? "Edit pesan..." : "Ask VasCode Assistant..."}
                  className="flex-1 bg-transparent text-sm placeholder:text-white/40 focus:outline-none"
                />
                {isLoading ? (
                  <button
                    type="button"
                    onClick={stop}
                    className="grid h-9 w-9 place-items-center rounded-full bg-destructive text-white transition hover:brightness-110"
                  >
                    <Square className="h-4 w-4" />
                  </button>
                ) : (
                  <button
                    type="submit"
                    disabled={!input.trim()}
                    className="grid h-9 w-9 place-items-center rounded-full bg-accent text-black transition hover:brightness-110 disabled:opacity-40"
                  >
                    {editingId ? <Pencil className="h-4 w-4" /> : <Send className="h-4 w-4 ml-0.5" />}
                  </button>
                )}
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
      <AlertDialog open={confirmClear} onOpenChange={(o) => !o && setConfirmClear(false)}>
        <AlertDialogContent className="glass-strong border-white/10">
          <AlertDialogHeader>
            <div className="mb-2 grid h-11 w-11 place-items-center rounded-full bg-destructive/20 text-destructive">
              <Trash2 className="h-5 w-5" />
            </div>
            <AlertDialogTitle>Hapus Riwayat Chat?</AlertDialogTitle>
            <AlertDialogDescription className="text-white/70">
              Semua riwayat percakapan akan dihapus permanen. Tindakan ini tidak dapat dibatalkan.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="rounded-full border-white/10 bg-transparent hover:bg-white/5">
              Batal
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmClearChat}
              className="rounded-full bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Hapus
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
