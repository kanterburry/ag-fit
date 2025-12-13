"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface SidePanelProps {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    children: ReactNode;
    side?: "left" | "right";
}

export function SidePanel({ isOpen, onClose, title, children, side = "right" }: SidePanelProps) {
    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 0.5 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 z-40 bg-black/80 backdrop-blur-sm"
                    />

                    {/* Drawer */}
                    <motion.div
                        initial={{ x: side === "right" ? "100%" : "-100%" }}
                        animate={{ x: 0 }}
                        exit={{ x: side === "right" ? "100%" : "-100%" }}
                        transition={{ type: "spring", damping: 25, stiffness: 200 }}
                        className={cn(
                            "fixed inset-y-0 z-50 flex w-full flex-col bg-surface sm:w-[500px] border-l border-slate-800 shadow-2xl",
                            side === "right" ? "right-0" : "left-0"
                        )}
                    >
                        <div className="flex items-center justify-between border-b border-slate-800 p-4">
                            <h2 className="text-xl font-bold text-white">{title}</h2>
                            <button
                                onClick={onClose}
                                className="rounded-full p-2 text-slate-400 hover:bg-slate-800 hover:text-white"
                            >
                                <X size={24} />
                            </button>
                        </div>

                        <div className="flex-1 overflow-y-auto bg-background p-4">
                            {children}
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}
