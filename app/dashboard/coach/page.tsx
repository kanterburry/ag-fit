'use client';
import { ArrowLeft, Bot } from 'lucide-react';
import Link from 'next/link';
import CoachChat from '@/components/features/coach/CoachChat';

type Message = {
    id: string;
    role: 'user' | 'assistant';
    content: string;
};

export default function CoachPage() {
    return (
        <div className="flex flex-col h-screen bg-[#050505] text-zinc-100 font-sans">
            {/* Header */}
            <header className="flex items-center gap-4 p-4 border-b border-zinc-800 bg-zinc-900/50 backdrop-blur-md z-10">
                <Link href="/dashboard" className="p-2 rounded-full hover:bg-zinc-800 transition-colors">
                    <ArrowLeft size={20} />
                </Link>
                <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-purple-500/10 flex items-center justify-center border border-purple-500/20">
                        <Bot size={20} className="text-purple-400" />
                    </div>
                    <div>
                        <h1 className="font-bold">AI Coach (Gemini 2.0)</h1>
                        <p className="text-xs text-green-500 flex items-center gap-1">
                            <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                            Online
                        </p>
                    </div>
                </div>
            </header>

            {/* Chat Area - Reusing CoachChat */}
            <div className="flex-1 overflow-hidden">
                <CoachChat className="bg-transparent h-full" />
            </div>
        </div>
    );
}
