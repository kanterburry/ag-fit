"use client";

import { useState, useRef, useEffect } from "react";
import { chatWithCoach, type Message } from "@/app/actions/coach";
import { Send, Bot, User, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

export default function CoachChat() {
    const [input, setInput] = useState("");
    const [messages, setMessages] = useState<Message[]>([
        { role: "model", parts: "Ready to train? Let's analyze your progress." },
    ]);
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleSend = async () => {
        if (!input.trim() || isLoading) return;

        const userMsg = input.trim();
        setInput("");
        setMessages((prev) => [...prev, { role: "user", parts: userMsg }]);
        setIsLoading(true);

        const result = await chatWithCoach(messages, userMsg);

        setIsLoading(false);
        if (result.success) {
            setMessages((prev) => [...prev, { role: "model", parts: result.message! }]);
        } else {
            setMessages((prev) => [...prev, { role: "model", parts: "Connection error. Please retry." }]);
        }
    };

    return (
        <div className="flex flex-col h-full">
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {messages.map((msg, i) => (
                    <div
                        key={i}
                        className={cn(
                            "flex gap-3",
                            msg.role === "user" ? "flex-row-reverse" : "flex-row"
                        )}
                    >
                        <div
                            className={cn(
                                "flex h-8 w-8 shrink-0 items-center justify-center rounded-full",
                                msg.role === "user" ? "bg-primary text-background" : "bg-secondary text-background"
                            )}
                        >
                            {msg.role === "user" ? <User size={16} /> : <Bot size={16} />}
                        </div>

                        <div
                            className={cn(
                                "max-w-[80%] rounded-2xl px-4 py-2 text-sm",
                                msg.role === "user"
                                    ? "bg-primary/10 text-primary-foreground" // light green bg
                                    : "bg-surface border border-slate-700 text-slate-200"
                            )}
                        >
                            {/* Just simple text for MVP, markdown parsing later if needed */}
                            <p className="whitespace-pre-wrap">{msg.parts}</p>
                        </div>
                    </div>
                ))}
                {isLoading && (
                    <div className="flex gap-3">
                        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-secondary text-background">
                            <Bot size={16} />
                        </div>
                        <div className="rounded-2xl bg-surface border border-slate-700 px-4 py-2">
                            <Loader2 size={16} className="animate-spin text-slate-400" />
                        </div>
                    </div>
                )}
                <div ref={messagesEndRef} />
            </div>

            <div className="border-t border-slate-800 bg-surface/50 p-4 backdrop-blur-sm">
                <div className="flex gap-2">
                    <input
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && handleSend()}
                        placeholder="Ask your coach..."
                        className="flex-1 rounded-full bg-slate-900 px-4 py-2 text-sm text-white focus:outline-none focus:ring-1 focus:ring-secondary"
                        disabled={isLoading}
                    />
                    <button
                        onClick={handleSend}
                        disabled={isLoading}
                        className="flex h-9 w-9 items-center justify-center rounded-full bg-secondary text-white transition-opacity hover:opacity-90 disabled:opacity-50"
                    >
                        <Send size={16} />
                    </button>
                </div>
            </div>
        </div>
    );
}
