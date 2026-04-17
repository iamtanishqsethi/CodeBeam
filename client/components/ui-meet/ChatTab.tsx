"use client";

import {useMeetingStore} from "@/store/meetingStore";
import {useEffect, useRef, useState} from "react";
import {socket} from "@/lib/socket";
import {ChatMessage} from "@/types/store.types";
import {Button} from "@/components/ui/button";
import {ScrollArea} from "@/components/ui/scroll-area";
import {Input} from "@/components/ui/input";
import {Send} from "lucide-react";
import {cn} from "@/lib/utils";

interface ChatTabProps {
    meetingId: string;
}

export default function ChatTab({meetingId}: ChatTabProps) {
    const messages = useMeetingStore(store => store.chatMessages);
    const addMessage = useMeetingStore(store => store.setChatMessages);
    const [text, setText] = useState("");
    const messageEndRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        messageEndRef.current?.scrollIntoView({behavior: "smooth", block: "end"});
    }, [messages.length]);

    function sendMessage(e?: React.FormEvent) {
        e?.preventDefault();
        const trimmed = text.trim();
        if (!trimmed) return;

        const msg: ChatMessage = {
            id: `${socket.id ?? "local"}-${Date.now()}`,
            text: trimmed,
            userId: socket.id ?? "unknown",
            timestamp: Date.now(),
        };

        socket.emit("chat-message", {meetingId, ...msg});
        addMessage(msg);
        setText("");
    }

    return (
        <div className="flex h-full flex-col">
            <ScrollArea className="min-h-0 flex-1">
                <div className="flex flex-col gap-3 p-4">
                    {messages.length === 0 && (
                        <div className="mt-12 flex flex-col items-center gap-2 text-center">
                            <div className="flex size-12 items-center justify-center rounded-full bg-muted">
                                <Send className="text-muted-foreground" />
                            </div>
                            <p className="text-sm text-muted-foreground">
                                No messages yet. Say hello!
                            </p>
                        </div>
                    )}

                    {messages.map((m, i) => {
                        const isSelf = m.userId === socket.id;
                        const sender = m.userName ?? (isSelf ? "You" : m.userId.slice(0, 8));

                        return (
                            <div
                                key={m.id ?? `${m.userId}-${m.timestamp}-${i}`}
                                className={cn("group flex flex-col gap-1", isSelf ? "items-end" : "items-start")}
                            >
                                <div className={cn("flex items-center gap-2", isSelf && "flex-row-reverse")}>
                                    <span className="text-xs font-medium text-muted-foreground">{sender}</span>
                                    <span className="text-xs text-muted-foreground/60 opacity-0 transition-opacity group-hover:opacity-100">
                                        {new Date(m.timestamp ?? 0).toLocaleTimeString([], {
                                            hour: "2-digit",
                                            minute: "2-digit",
                                        })}
                                    </span>
                                </div>
                                <div className={cn("flex items-end gap-2", isSelf && "flex-row-reverse")}>
                                    <p
                                        className={cn(
                                            "max-w-[82%] rounded-2xl px-3.5 py-2 text-sm leading-relaxed shadow-sm",
                                            isSelf
                                                ? "bg-primary text-primary-foreground rounded-br-md"
                                                : "bg-muted text-foreground rounded-bl-md"
                                        )}
                                    >
                                        {m.text}
                                    </p>
                                    <div className="flex translate-y-1 gap-1 opacity-0 transition-all group-hover:translate-y-0 group-hover:opacity-100">
                                        {["👍", "❤️"].map((emoji) => (
                                            <Button
                                                key={emoji}
                                                type="button"
                                                variant="ghost"
                                                size="icon"
                                                aria-label={`React ${emoji}`}
                                                className="size-6 rounded-full text-xs"
                                            >
                                                {emoji}
                                            </Button>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                    <div ref={messageEndRef} />
                </div>
            </ScrollArea>

            <form onSubmit={sendMessage} className="flex gap-2 border-t border-white/[0.08] p-3">
                <Input
                    value={text}
                    onChange={e => setText(e.target.value)}
                    placeholder="Type a message..."
                    className="min-w-0 flex-1 rounded-xl border-white/[0.08] bg-muted/50"
                    aria-label="Chat message"
                />
                <Button
                    type="submit"
                    size="icon"
                    disabled={!text.trim()}
                    aria-label="Send message"
                    className="rounded-xl transition-transform hover:-translate-y-0.5 active:scale-[0.97]"
                >
                    <Send data-icon="inline-start" />
                </Button>
            </form>
        </div>
    );
}
