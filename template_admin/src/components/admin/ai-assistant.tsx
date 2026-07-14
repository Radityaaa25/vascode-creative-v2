"use client";
import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Bot, Minus, Send, Sparkles, X, AlertTriangle, CheckCircle2 } from "lucide-react";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { cn } from "@/lib/utils";

type Message = {
  id: string;
  role: "user" | "ai";
  text: string;
  time: string;
  data?: { label: string; value: string }[];
  status?: "success" | "error";
};

type PendingAction = { title: string; description: string; destructive?: boolean } | null;

const now = () => new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

export function AIAssistant() {
  const [open, setOpen] = useState(false);
  const [pos, setPos] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [dragging, setDragging] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { id: "1", role: "ai", text: "Hi Rasya — I can pull analytics, draft content, or run actions with your approval. What do you need?", time: now() },
  ]);
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  const [pending, setPending] = useState<PendingAction>(null);
  const bodyRef = useRef<HTMLDivElement>(null);

  // Initial snap position — bottom-right
  useEffect(() => {
    const setDefault = () => setPos({ x: window.innerWidth - 88, y: window.innerHeight - 96 });
    setDefault();
    window.addEventListener("resize", setDefault, { passive: true });
    return () => window.removeEventListener("resize", setDefault);
  }, []);

  useEffect(() => {
    bodyRef.current?.scrollTo({ top: bodyRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, typing, open]);

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

  const send = () => {
    const text = input.trim();
    if (!text) return;
    setMessages((m) => [...m, { id: crypto.randomUUID(), role: "user", text, time: now() }]);
    setInput("");
    setTyping(true);

    // Simulated intent detection
    setTimeout(() => {
      setTyping(false);
      const lower = text.toLowerCase();
      if (lower.includes("delete") || lower.includes("remove")) {
        setPending({
          title: "Delete client record?",
          description: `The AI will permanently delete: "PT Contoh Jaya" and archive its 3 related projects. This cannot be undone.`,
          destructive: true,
        });
        setMessages((m) => [...m, {
          id: crypto.randomUUID(), role: "ai", time: now(),
          text: "I've prepared a deletion. Please approve before I execute.",
        }]);
      } else if (lower.includes("update") || lower.includes("mark") || lower.includes("change")) {
        setPending({
          title: "Update project status",
          description: `Change status of "Nusantara Rebrand" from Active to Completed and notify the client.`,
        });
        setMessages((m) => [...m, {
          id: crypto.randomUUID(), role: "ai", time: now(),
          text: "Ready to run this update — awaiting your approval.",
        }]);
      } else {
        setMessages((m) => [...m, {
          id: crypto.randomUUID(), role: "ai", time: now(),
          text: "Here's a quick read on this month's performance:",
          data: [
            { label: "New clients", value: "24 (+18%)" },
            { label: "Active projects", value: "37" },
            { label: "Response SLA", value: "1.4h" },
          ],
        }]);
      }
    }, 900);
  };

  const runApproved = () => {
    const action = pending;
    setPending(null);
    setMessages((m) => [...m, {
      id: crypto.randomUUID(), role: "ai", time: now(),
      text: action?.destructive ? "Deleted successfully." : "Action executed successfully.",
      status: "success",
    }]);
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
        <Sparkles className="h-6 w-6 text-black" />
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
              <div className="grid h-9 w-9 place-items-center rounded-full bg-gradient-to-br from-primary to-accent">
                <Bot className="h-4 w-4 text-black" />
              </div>
              <div className="flex-1">
                <div className="text-sm font-semibold">AI Assistant</div>
                <div className="flex items-center gap-1.5 text-[11px] text-white/60">
                  <span className="relative flex h-1.5 w-1.5">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent opacity-75" />
                    <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-accent" />
                  </span>
                  Online · Groq qwen-2.5
                </div>
              </div>
              <button onClick={() => setOpen(false)} className="grid h-8 w-8 place-items-center rounded-full text-white/60 hover:bg-white/10 hover:text-foreground">
                <Minus className="h-4 w-4" />
              </button>
              <button onClick={() => setOpen(false)} className="grid h-8 w-8 place-items-center rounded-full text-white/60 hover:bg-white/10 hover:text-foreground">
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Body */}
            <div ref={bodyRef} className="flex-1 space-y-3 overflow-y-auto px-4 py-4">
              {messages.map((m) => (
                <div key={m.id} className={cn("flex gap-2", m.role === "user" ? "justify-end" : "justify-start")}>
                  {m.role === "ai" && (
                    <div className="mt-0.5 grid h-6 w-6 shrink-0 place-items-center rounded-full bg-gradient-to-br from-primary to-accent">
                      <Bot className="h-3 w-3 text-black" />
                    </div>
                  )}
                  <div className={cn("max-w-[75%] space-y-1")}>
                    <div
                      className={cn(
                        "rounded-2xl px-3.5 py-2 text-sm leading-relaxed",
                        m.role === "user"
                          ? "bg-primary text-primary-foreground rounded-br-sm"
                          : "bg-white/8 text-foreground rounded-bl-sm",
                      )}
                    >
                      {m.status === "success" && (
                        <div className="mb-1 flex items-center gap-1.5 text-xs font-semibold text-accent">
                          <CheckCircle2 className="h-3.5 w-3.5" /> Executed
                        </div>
                      )}
                      {m.text}
                      {m.data && (
                        <div className="mt-2 space-y-1 rounded-xl border border-white/10 bg-black/20 p-2 text-xs">
                          {m.data.map((d) => (
                            <div key={d.label} className="flex justify-between">
                              <span className="text-white/60">{d.label}</span>
                              <span className="font-semibold">{d.value}</span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                    <div className={cn("text-[10px] text-white/40", m.role === "user" ? "text-right" : "")}>{m.time}</div>
                  </div>
                </div>
              ))}

              {typing && (
                <div className="flex gap-2">
                  <div className="mt-0.5 grid h-6 w-6 place-items-center rounded-full bg-gradient-to-br from-primary to-accent">
                    <Bot className="h-3 w-3 text-black" />
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
            <div className="border-t border-white/8 p-3">
              <div className="flex items-center gap-2 rounded-full border border-white/10 bg-white/5 pl-4 pr-1.5 py-1.5">
                <input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && send()}
                  placeholder="Ask something or request an action…"
                  className="flex-1 bg-transparent text-sm placeholder:text-white/40 focus:outline-none"
                />
                <button
                  onClick={send}
                  disabled={!input.trim()}
                  className="grid h-9 w-9 place-items-center rounded-full bg-accent text-black transition hover:brightness-110 disabled:opacity-40"
                >
                  <Send className="h-4 w-4" />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Approval modal */}
      <AlertDialog open={!!pending} onOpenChange={(o) => !o && setPending(null)}>
        <AlertDialogContent className="glass-strong border-white/10">
          <AlertDialogHeader>
            <div className={cn(
              "mb-2 grid h-11 w-11 place-items-center rounded-full",
              pending?.destructive ? "bg-destructive/20 text-destructive" : "bg-primary/20 text-primary",
            )}>
              <AlertTriangle className="h-5 w-5" />
            </div>
            <AlertDialogTitle>Confirm Action</AlertDialogTitle>
            <AlertDialogDescription className="text-white/70">
              <span className="mb-2 block font-semibold text-foreground">{pending?.title}</span>
              {pending?.description}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="rounded-full border-white/10 bg-transparent hover:bg-white/5">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={runApproved}
              className={cn(
                "rounded-full",
                pending?.destructive
                  ? "bg-destructive text-destructive-foreground hover:bg-destructive/90"
                  : "bg-primary text-primary-foreground hover:brightness-110",
              )}
            >
              Approve & Run
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
