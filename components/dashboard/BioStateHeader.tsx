
import { Activity, Zap, CheckCircle, TrendingUp } from "lucide-react";
import { getCommandCenterStats } from "@/app/dashboard/actions";
import SyncButton from "./SyncButton";

export default async function BioStateHeader() {
    const stats = await getCommandCenterStats();

    const metrics = {
        completed: stats?.completedProtocols ?? 0,
        active: stats?.activeProtocols ?? 0,
        reliability: stats?.reliabilityScore ?? 0,
        streak: stats?.activeStreak ?? 0,
    };

    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            {/* Protocols Completed */}
            <div className="relative overflow-hidden rounded-2xl bg-zinc-900/50 border border-zinc-800 p-4 flex flex-col items-center justify-center gap-2">
                <div className="absolute top-2 right-2 z-10">
                    <SyncButton />
                </div>
                <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-transparent pointer-events-none" />
                <div className="flex items-center gap-2 text-purple-400">
                    <CheckCircle className="w-5 h-5" />
                    <span className="text-xs font-mono uppercase tracking-wider">Protocols</span>
                </div>
                <div className="flex items-baseline gap-3">
                    <div className="flex flex-col items-center">
                        <span className="text-2xl font-bold text-white font-mono">{metrics.active}</span>
                        <span className="text-[10px] text-zinc-500 uppercase">Active</span>
                    </div>
                    <div className="h-8 w-px bg-zinc-800"></div>
                    <div className="flex flex-col items-center">
                        <span className="text-2xl font-bold text-zinc-400 font-mono">{metrics.completed}</span>
                        <span className="text-[10px] text-zinc-500 uppercase">Done</span>
                    </div>
                </div>
            </div>

            {/* Reliability (Adherence) Score */}
            <div className="relative overflow-hidden group rounded-2xl bg-zinc-900/50 border border-zinc-800 p-4 flex flex-col items-center justify-center gap-2 cursor-help transition-colors hover:bg-zinc-900/80">
                <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/10 to-transparent pointer-events-none" />
                <div className="flex items-center gap-2 text-emerald-400">
                    <TrendingUp className="w-5 h-5" />
                    <span className="text-xs font-mono uppercase tracking-wider">Adherence</span>
                </div>
                <span className="text-3xl font-bold text-white font-mono">{metrics.reliability}%</span>

                {/* Tooltip */}
                <div className="absolute top-full mt-2 left-1/2 -translate-x-1/2 w-48 p-2 rounded-lg bg-zinc-950 border border-zinc-800 text-xs text-zinc-400 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-20 shadow-xl">
                    <p className="font-bold text-zinc-300 mb-1">Consistency Metric</p>
                    <p>(Total Logged Days / Total Days) × 100</p>
                </div>
            </div>

            {/* Active Streak */}
            <div className="relative overflow-hidden group rounded-2xl bg-zinc-900/50 border border-zinc-800 p-4 flex flex-col items-center justify-center gap-2 cursor-help">
                <div className="absolute inset-0 bg-gradient-to-br from-amber-500/10 to-transparent pointer-events-none" />
                <div className="flex items-center gap-2 text-amber-500">
                    <Zap className="w-5 h-5" />
                    <span className="text-xs font-mono uppercase tracking-wider">Streak</span>
                </div>
                <span className="text-3xl font-bold text-white font-mono">{metrics.streak} <span className="text-sm text-zinc-500">days</span></span>

                {/* Tooltip (Added) */}
                <div className="absolute top-full mt-2 left-1/2 -translate-x-1/2 w-48 p-2 rounded-lg bg-zinc-950 border border-zinc-800 text-xs text-zinc-400 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-20 shadow-xl">
                    <p className="font-bold text-zinc-300 mb-1">Consistency Streak</p>
                    <p>Consecutive days you have logged *any* protocol activity.</p>
                </div>
            </div>
        </div>
    );
}
