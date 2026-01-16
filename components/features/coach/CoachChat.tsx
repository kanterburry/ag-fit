'use client';

import { useRef, useEffect, useState } from 'react';
import { Send, Bot, User, Loader2, RefreshCw, AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

export default function CoachChat({ className }: { className?: string }) {
    // State
    const [messages, setMessages] = useState<any[]>([]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<Error | null>(null);

    // Refs
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);
    const [isFocused, setIsFocused] = useState(false);

    // Scroll Helper
    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages, isLoading]);

    // Manual Send Handler
    const handleSend = async () => {
        if (!input.trim() || isLoading) return;

        const userMessage = {
            id: Date.now().toString(),
            role: 'user',
            content: input
        };

        // 1. Optimistic Update
        setMessages(prev => [...prev, userMessage]);
        const currentInput = input;
        setInput('');
        setIsLoading(true);
        setError(null);

        try {
            // 2. Fetch API
            const response = await fetch('/api/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    messages: [...messages, userMessage]
                })
            });

            if (!response.ok) {
                throw new Error(response.statusText);
            }

            // 3. Handle Stream
            const reader = response.body?.getReader();
            const decoder = new TextDecoder();

            if (!reader) throw new Error("No response body");

            // Create placeholder for assistant message
            const assistantMessageId = (Date.now() + 1).toString();
            setMessages(prev => [
                ...prev,
                { id: assistantMessageId, role: 'assistant', content: '' }
            ]);

            let accumulatedContent = '';

            while (true) {
                const { done, value } = await reader.read();
                if (done) break;

                const text = decoder.decode(value, { stream: true });
                accumulatedContent += text;

                // Update the last message (assistant's) with new content
                setMessages(prev => {
                    const newMessages = [...prev];
                    const lastMsg = newMessages[newMessages.length - 1];
                    if (lastMsg.id === assistantMessageId) {
                        lastMsg.content = accumulatedContent;
                    }
                    return newMessages;
                });
            }

        } catch (err: any) {
            console.error("Chat Error:", err);
            setError(err);
            setInput(currentInput); // Restore input on valid error
        } finally {
            setIsLoading(false);
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    const reload = () => {
        setError(null);
    };

    return (
        <div className={cn("flex flex-col h-full bg-zinc-950 relative", className)}>

            {/* 1. Messages Area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-6 scrollbar-thin scrollbar-thumb-zinc-800 scrollbar-track-transparent pb-32">
                {messages.length === 0 && (
                    <div className="flex flex-col items-center justify-center min-h-[50vh] text-zinc-500 animate-in fade-in zoom-in duration-500">
                        <div className="w-16 h-16 bg-zinc-900 rounded-2xl flex items-center justify-center mb-4 border border-zinc-800 shadow-xl shadow-purple-900/10">
                            <Bot className="w-8 h-8 text-purple-400" />
                        </div>
                        <h3 className="text-lg font-medium text-white mb-2">ProtocolAI Research Assistant</h3>
                        <p className="text-center max-w-xs text-sm">
                            Ready to analyze your protocols, health metrics, and provide research-backed answers.
                        </p>
                    </div>
                )}

                {messages.map((msg: any) => (
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        key={msg.id}
                        className={cn(
                            "flex gap-4 w-full",
                            msg.role === 'user' ? "flex-row-reverse" : "flex-row"
                        )}
                    >
                        {/* Avatar */}
                        <div className={cn(
                            "w-8 h-8 rounded-full flex items-center justify-center shrink-0 border shadow-md",
                            msg.role === 'user'
                                ? "bg-indigo-600 border-indigo-500 text-white"
                                : "bg-zinc-800 border-zinc-700 text-purple-400"
                        )}>
                            {msg.role === 'user' ? <User size={14} /> : <Bot size={14} />}
                        </div>

                        {/* Bubble */}
                        <div className={cn(
                            "px-5 py-3 rounded-2xl max-w-[85%] text-sm leading-relaxed shadow-sm",
                            msg.role === 'user'
                                ? "bg-indigo-600 text-white rounded-tr-sm"
                                : "bg-zinc-900 border border-zinc-800 text-zinc-200 rounded-tl-sm p-4 overflow-hidden"
                        )}>
                            {msg.role === 'user' ? (
                                <div className="whitespace-pre-wrap">{msg.content}</div>
                            ) : (
                                <div className="prose prose-invert prose-sm max-w-none break-words leading-normal [&>ul]:list-disc [&>ul]:pl-4 [&>ol]:list-decimal [&>ol]:pl-4">
                                    <ReactMarkdown remarkPlugins={[remarkGfm]}>
                                        {msg.content}
                                    </ReactMarkdown>
                                </div>
                            )}
                        </div>
                    </motion.div>
                ))}

                {isLoading && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="flex gap-4"
                    >
                        <div className="w-8 h-8 rounded-full bg-zinc-800 border border-zinc-700 flex items-center justify-center shrink-0">
                            <Bot size={14} className="text-purple-400" />
                        </div>
                        <div className="flex items-center gap-2 text-zinc-500 text-sm py-2">
                            <Loader2 size={14} className="animate-spin" />
                            <span>Analyzing data...</span>
                        </div>
                    </motion.div>
                )}

                {error && (
                    <div className="p-4 rounded-xl bg-red-950/30 border border-red-900/50 text-red-400 text-sm flex items-center gap-3">
                        <AlertCircle size={16} />
                        <div className="flex-1">
                            <span className="font-semibold block mb-1">Connection Error</span>
                            {error.message}
                        </div>
                        <button
                            onClick={() => reload()}
                            className="p-2 hover:bg-red-900/40 rounded-lg transition-colors"
                            title="Retry"
                        >
                            <RefreshCw size={14} />
                        </button>
                    </div>
                )}

                <div ref={messagesEndRef} />
            </div>

            {/* 2. Input Area */}
            <div className="p-4 bg-gradient-to-t from-zinc-950 via-zinc-950 to-transparent absolute bottom-0 left-0 right-0 z-50">
                <div
                    className={cn(
                        "flex items-center gap-2 p-2 rounded-full bg-zinc-900/90 border transition-all duration-300 shadow-2xl backdrop-blur-xl",
                        isFocused ? "border-purple-500/50 ring-1 ring-purple-500/20" : "border-zinc-800"
                    )}
                >
                    <input
                        ref={inputRef}
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={handleKeyDown}
                        onFocus={() => setIsFocused(true)}
                        onBlur={() => setIsFocused(false)}
                        placeholder="Ask ProtocolAI..."
                        className="flex-1 bg-transparent border-none outline-none px-4 text-white placeholder:text-zinc-500 text-sm min-w-0"
                        autoFocus
                        autoComplete="off"
                        disabled={isLoading}
                    />

                    <button
                        onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            handleSend();
                        }}
                        disabled={!input.trim() || isLoading}
                        className={cn(
                            "w-10 h-10 rounded-full flex items-center justify-center transition-all duration-200 shrink-0",
                            input.trim() && !isLoading
                                ? "bg-purple-600 hover:bg-purple-500 text-white shadow-lg shadow-purple-900/20 cursor-pointer hover:scale-105 active:scale-95"
                                : "bg-zinc-800 text-zinc-600 cursor-not-allowed"
                        )}
                        aria-label="Send Message"
                    >
                        {isLoading ? (
                            <Loader2 size={18} className="animate-spin" />
                        ) : (
                            <Send size={18} className={cn("ml-0.5", input.trim() && "text-white")} />
                        )}
                    </button>
                </div>

                <div className="text-center mt-2">
                    <span className="text-[10px] text-zinc-600 font-medium tracking-wide uppercase">AI Research Assistant</span>
                </div>
            </div>
        </div>
    );
}
