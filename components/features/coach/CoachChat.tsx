"use client";

import { useChat } from "@ai-sdk/react";
import { useEffect, useRef } from "react";
import { Send, Bot, User, Loader2, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";

export default function CoachChat({ className }: { className?: string }) {
    // Standard Vercel AI SDK v5 hook usage
    const {
        messages,
        input,
        handleInputChange,
        handleSubmit,
        isLoading,
        error,
        append
    } = useChat({
        api: "/api/chat",
        maxSteps: 5, // Allow multi-step tool calls
        onError: (err: any) => {
            console.error("CoachChat Error:", err);
        }
    } as any) as any;

    const messagesEndRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages, isLoading]);

    // Custom submit handler to ensure we're append-ready or handle empty states
    const onSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!input?.trim()) return;
        handleSubmit(e);
    };

    return (
        <div className={cn("flex flex-col h-full bg-slate-950 text-slate-200 font-sans", className)}>
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {/* Welcome Message if empty */}
                {messages.length === 0 && (
                    <div className="flex flex-col items-center justify-center h-full text-slate-500 space-y-4 opacity-50">
                        <Bot size={48} />
                        <p className="text-center">Ready to train. Ask me anything.</p>
                    </div>
                )}

                {messages.map((msg: any) => (
                    <div
                        key={msg.id}
                        className={cn(
                            "flex gap-3",
                            msg.role === "user" ? "flex-row-reverse" : "flex-row"
                        )}
                    >
                        <div
                            className={cn(
                                "flex h-8 w-8 shrink-0 items-center justify-center rounded-full shadow-sm",
                                msg.role === "user" ? "bg-emerald-600 text-white" : "bg-slate-700 text-emerald-400"
                            )}
                        >
                            {msg.role === "user" ? <User size={16} /> : <Bot size={16} />}
                        </div>

                        <div
                            className={cn(
                                "max-w-[85%] rounded-2xl px-4 py-2 text-sm leading-relaxed shadow-sm",
                                msg.role === "user"
                                    ? "bg-emerald-600/10 text-emerald-100 border border-emerald-600/20"
                                    : "bg-slate-800 border border-slate-700 text-slate-200"
                            )}
                        >
                            <div className="whitespace-pre-wrap">{msg.content}</div>
                            {/* Tool invocations causing side effects could be visualized here if needed, 
                                but standard checking is usually enough */}
                        </div>
                    </div>
                ))}

                {isLoading && (
                    <div className="flex gap-3 animate-pulse">
                        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-slate-700 text-emerald-400">
                            <Bot size={16} />
                        </div>
                        <div className="rounded-2xl bg-slate-800 border border-slate-700 px-4 py-2 text-sm text-slate-400 flex items-center gap-2">
                            <Loader2 size={14} className="animate-spin" /> Thinking...
                        </div>
                    </div>
                )}

                {error && (
                    <div className="flex justify-center p-2 text-red-400 text-sm bg-red-900/20 rounded-lg border border-red-900/50">
                        <AlertCircle size={16} className="mr-2" />
                        <span>Error: {error.message}</span>
                    </div>
                )}

                <div ref={messagesEndRef} />
            </div>

            <div className="border-t border-slate-800 bg-slate-900/50 p-4 backdrop-blur-sm">
                <form onSubmit={onSubmit} className="flex gap-2 relative">
                    <input
                        ref={inputRef}
                        value={input}
                        onChange={handleInputChange}
                        placeholder="Plan a workout..."
                        className="flex-1 rounded-full bg-slate-900 px-4 py-2 text-sm text-white focus:outline-none focus:ring-1 focus:ring-emerald-500 border border-slate-700 placeholder:text-slate-500"
                        disabled={isLoading}
                    />
                    <button
                        type="submit"
                        disabled={isLoading || !input?.trim()}
                        className="flex h-9 w-9 items-center justify-center rounded-full bg-emerald-600 text-white transition-all hover:bg-emerald-500 disabled:opacity-50 disabled:hover:bg-emerald-600"
                    >
                        <Send size={16} />
                    </button>
                </form>
            </div>
        </div>
    );
}
