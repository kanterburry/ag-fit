"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Bot, X, Maximize2, Minimize2 } from "lucide-react";
import CoachChat from "./CoachChat";
import { cn } from "@/lib/utils";

export default function CoachWidget() {
    const [isOpen, setIsOpen] = useState(false);
    const [isExpanded, setIsExpanded] = useState(false);

    return (
        <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.8, y: 20 }}
                        animate={{
                            opacity: 1,
                            scale: 1,
                            y: 0,
                            width: isExpanded ? "90vw" : "350px",
                            height: isExpanded ? "80vh" : "500px",
                        }}
                        exit={{ opacity: 0, scale: 0.8, y: 20 }}
                        className={cn(
                            "mb-4 overflow-hidden rounded-2xl border border-slate-700 bg-slate-900 shadow-2xl",
                            isExpanded ? "fixed bottom-6 right-6 max-w-[1200px]" : "w-[350px]"
                        )}
                    >
                        {/* Header */}
                        <div className="flex items-center justify-between border-b border-slate-800 bg-slate-950 px-4 py-3">
                            <div className="flex items-center gap-2">
                                <Bot className="text-emerald-400" size={20} />
                                <span className="font-bold text-white">AI Coach</span>
                            </div>
                            <div className="flex items-center gap-1">
                                <button
                                    onClick={() => setIsExpanded(!isExpanded)}
                                    className="rounded p-1 text-slate-400 hover:text-white"
                                >
                                    {isExpanded ? <Minimize2 size={16} /> : <Maximize2 size={16} />}
                                </button>
                                <button
                                    onClick={() => setIsOpen(false)}
                                    className="rounded p-1 text-slate-400 hover:text-white"
                                >
                                    <X size={16} />
                                </button>
                            </div>
                        </div>

                        {/* Content */}
                        <div className="h-[calc(100%-50px)] bg-slate-900">
                            {/* We might need to adjust CoachChat to fit this container naturally */}
                            <div className="h-full overflow-hidden">
                                <CoachChat />
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setIsOpen(!isOpen)}
                className={cn(
                    "flex h-14 w-14 items-center justify-center rounded-full shadow-lg shadow-emerald-900/40 transition-colors",
                    isOpen ? "bg-slate-700 text-slate-300" : "bg-emerald-500 text-slate-950"
                )}
            >
                {isOpen ? <X size={24} /> : <Bot size={28} />}
            </motion.button>
        </div>
    );
}
