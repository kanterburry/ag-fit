'use client'

import { useState, useRef, useEffect } from 'react';
import { Send, ArrowLeft, Bot } from 'lucide-react';
import Link from 'next/link';

type Message = {
    id: string;
    role: 'user' | 'assistant';
    content: string;
};

export default function CoachPage() {
    const [messages, setMessages] = useState<Message[]>([]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const scrollRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages]);

    const handleSubmit = async (e?: React.FormEvent) => {
        e?.preventDefault();
        if (!input.trim() || isLoading) return;

        const userMessage: Message = { id: Date.now().toString(), role: 'user', content: input };
        setMessages(prev => [...prev, userMessage]);
        setInput('');
        setIsLoading(true);

        try {
            const response = await fetch('/api/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    messages: [...messages, userMessage].map(m => ({ role: m.role, content: m.content }))
                })
            });

            if (!response.ok) throw new Error('Failed to fetch response');
            if (!response.body) return;

            const reader = response.body.getReader();
            const decoder = new TextDecoder();
            let assistantMessage: Message = { id: (Date.now() + 1).toString(), role: 'assistant', content: '' };

            setMessages(prev => [...prev, assistantMessage]);

            while (true) {
                const { done, value } = await reader.read();
                if (done) break;
                const text = decoder.decode(value, { stream: true });
                assistantMessage.content += text;

                setMessages(prev => {
                    const newMessages = [...prev];
                    newMessages[newMessages.length - 1] = { ...assistantMessage };
                    return newMessages;
                });
            }

        } catch (error) {
            console.error('Chat error:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleQuickPrompt = (text: string) => {
        setInput(text);
        // Optional: auto submit
        // handleSubmit(); 
        // But setting input allows user to edit before sending
    };

    return (
        <div className="flex flex-col h-screen bg-[#050505] text-zinc-100 font-sans">
            {/* Header */}
            <header className="flex items-center gap-4 p-4 border-b border-zinc-800 bg-zinc-900/50 backdrop-blur-md">
                <Link href="/dashboard" className="p-2 rounded-full hover:bg-zinc-800 transition-colors">
                    <ArrowLeft size={20} />
                </Link>
                <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-purple-500/10 flex items-center justify-center border border-purple-500/20">
                        <Bot size={20} className="text-purple-400" />
                    </div>
                    <div>
                        <h1 className="font-bold">AI Coach (Gemini)</h1>
                        <p className="text-xs text-green-500 flex items-center gap-1">
                            <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                            Online
                        </p>
                    </div>
                </div>
            </header>

            {/* Chat Area */}
            <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-4">
                {messages.length === 0 && (
                    <div className="h-full flex flex-col items-center justify-center text-zinc-500 space-y-4">
                        <Bot size={48} className="text-zinc-800" />
                        <p className="text-sm">"Ready to train? Ask me anything."</p>
                        <div className="flex flex-wrap justify-center gap-2 max-w-xs">
                            <button onClick={() => handleQuickPrompt('Am I ready to train today?')} className="px-3 py-1.5 rounded-full border border-zinc-800 bg-zinc-900 text-xs hover:border-purple-500/50 transition-colors">
                                Am I ready to train?
                            </button>
                            <button onClick={() => handleQuickPrompt('Why is my bench press stalling?')} className="px-3 py-1.5 rounded-full border border-zinc-800 bg-zinc-900 text-xs hover:border-purple-500/50 transition-colors">
                                Bench press help
                            </button>
                        </div>
                    </div>
                )}

                {messages.map(m => (
                    <div key={m.id} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                        <div className={`max-w-[85%] rounded-2xl px-4 py-2 text-sm ${m.role === 'user'
                                ? 'bg-purple-600 text-white rounded-br-none'
                                : 'bg-zinc-800 text-zinc-200 rounded-bl-none'
                            }`}>
                            {m.content}
                        </div>
                    </div>
                ))}
                {isLoading && messages[messages.length - 1]?.role !== 'assistant' && (
                    <div className="flex justify-start">
                        <div className="bg-zinc-800 rounded-2xl rounded-bl-none px-4 py-2">
                            <div className="flex gap-1">
                                <span className="w-1.5 h-1.5 bg-zinc-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                                <span className="w-1.5 h-1.5 bg-zinc-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                                <span className="w-1.5 h-1.5 bg-zinc-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* Input */}
            <form onSubmit={handleSubmit} className="p-4 border-t border-zinc-800 bg-zinc-900/50 backdrop-blur-md">
                <div className="flex gap-2">
                    <input
                        className="flex-1 bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-purple-500/50 transition-colors placeholder:text-zinc-600"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder="Type a message..."
                    />
                    <button type="submit" className="p-3 bg-purple-600 rounded-xl text-white hover:bg-purple-500 transition-colors disabled:opacity-50" disabled={isLoading || !input.trim()}>
                        <Send size={20} />
                    </button>
                </div>
            </form>
        </div>
    );
}
