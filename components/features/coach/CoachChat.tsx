"use client";

import { useChat } from "@ai-sdk/react";
import { useEffect, useRef } from "react";
import { Send, Bot, User, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

export default function CoachChat() {
    const { messages, input, handleInputChange, handleSubmit, isLoading } = useChat({
        api: "/api/chat",
        initialMessages: [
        ]
    } as any) as any;

    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    return (
        <div className="flex flex-col h-full bg-slate-950">
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
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
                                "flex h-8 w-8 shrink-0 items-center justify-center rounded-full",
                                msg.role === "user" ? "bg-emerald-600 text-white" : "bg-slate-700 text-emerald-400"
                            )}
                        >
                            {msg.role === "user" ? <User size={16} /> : <Bot size={16} />}
                        </div>

                        <div
                            className={cn(
                                "max-w-[85%] rounded-2xl px-4 py-2 text-sm leading-relaxed",
                                msg.role === "user"
                                    ? "bg-emerald-600/10 text-emerald-100 border border-emerald-600/20"
                                    : "bg-slate-800 border border-slate-700 text-slate-200"
                            )}
                        >
                            <p className="whitespace-pre-wrap">{msg.content}</p>
                            {/* Render tool invocations if needed, usually managed by the AI response text itself or a dedicated UI for 'calling tool...' */}
                            {msg.toolInvocations?.map((toolInvocation: any) => {
                                const { toolName, toolCallId, state } = toolInvocation;
                                const result = 'result' in toolInvocation ? toolInvocation.result : null;

                                return (
                                    <div key={toolCallId} className="mt-2 p-2 bg-black/20 rounded border border-slate-700/50 text-xs font-mono text-slate-400">
                                        <div className="flex items-center gap-2">
                                            <div className="w-2 h-2 rounded-full bg-yellow-500 animate-pulse" />
                                            <span>{toolName}</span>
                                        </div>
                                        {state === 'result' && (
                                            <div className="mt-1 text-emerald-400/80">
                                                Result: {result}
                                            </div>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                ))}
                {isLoading && messages[messages.length - 1]?.role !== 'assistant' && (
                    <div className="flex gap-3">
                        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-slate-700 text-emerald-400">
                            <Bot size={16} />
                        </div>
                        <div className="rounded-2xl bg-slate-800 border border-slate-700 px-4 py-2">
                            <Loader2 size={16} className="animate-spin text-slate-400" />
                        </div>
                    </div>
                )}
                <div ref={messagesEndRef} />
            </div>

            <div className="border-t border-slate-800 bg-slate-900/50 p-4 backdrop-blur-sm">
                <form onSubmit={handleSubmit} className="flex gap-2">
                    <input
                        value={input}
                        onChange={handleInputChange}
                        placeholder="Plan a workout..."
                        className="flex-1 rounded-full bg-slate-900 px-4 py-2 text-sm text-white focus:outline-none focus:ring-1 focus:ring-emerald-500 border border-slate-700"
                        disabled={isLoading}
                    />
                    <button
                        type="submit"
                        disabled={isLoading}
                        className="flex h-9 w-9 items-center justify-center rounded-full bg-emerald-600 text-white transition-all hover:bg-emerald-500 disabled:opacity-50 disabled:hover:bg-emerald-600"
                    >
                        <Send size={16} />
                    </button>
                </form>
            </div>
        </div>
    );
}
