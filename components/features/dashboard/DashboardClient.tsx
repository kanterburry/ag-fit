"use client";

import { useState } from "react";
import { SidePanel } from "@/components/ui/SidePanel";
import WorkoutLogger from "@/components/features/workout/WorkoutLogger";
import CoachWidget from "@/components/features/coach/CoachWidget";
import { Header } from "@/components/layout/Header";
import { Plus } from "lucide-react";
import { SyncButton } from "@/app/dashboard/SyncButton";

export default function DashboardClient({ children }: { children: React.ReactNode }) {
    const [isLogOpen, setIsLogOpen] = useState(false);

    return (
        <div className="relative min-h-screen pb-20 md:pb-0">
            {/* Custom Header for Dashboard Context */}
            <div className="sticky top-0 z-30 border-b border-slate-800 bg-background/80 px-4 py-3 backdrop-blur-md">
                <div className="mx-auto flex max-w-5xl items-center justify-between">
                    <span className="text-xl font-bold tracking-tight text-white">AG-FIT</span>

                    <div className="flex items-center gap-2">
                        <SyncButton />
                        <button
                            onClick={() => setIsLogOpen(true)}
                            className="flex items-center gap-1 rounded-full bg-primary px-4 py-2 text-sm font-semibold text-background transition-transform hover:scale-105 active:scale-95"
                        >
                            <Plus size={16} />
                            Log
                        </button>
                    </div>
                </div>
            </div>

            <main className="mx-auto max-w-5xl px-4 py-6">
                <h2 className="mb-4 text-xs font-semibold uppercase tracking-wider text-slate-500">Timeline</h2>
                <div className="space-y-4">
                    {children}
                </div>
            </main>

            {/* Side Panel for Logging */}
            <SidePanel
                isOpen={isLogOpen}
                onClose={() => setIsLogOpen(false)}
                title="Log Workout"
            >
                <WorkoutLogger
                    onSuccess={() => setIsLogOpen(false)}
                    onCancel={() => setIsLogOpen(false)}
                />
            </SidePanel>

            {/* Floating Coach */}
            <CoachWidget />
        </div>
    );
}
