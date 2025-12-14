
import { Activity, Battery, Moon, Heart } from "lucide-react";
import { getBiometrics } from "@/app/dashboard/actions";
import SyncButton from "./SyncButton";

export default async function BioStateHeader() {
    const data = await getBiometrics();

    // Default / Mock data if no data exists for today
    const metrics = {
        bodyBattery: data?.body_battery ?? 0,
        sleepScore: data?.sleep_score ?? 0,
        restingHr: data?.resting_hr ?? 0,
        hrvStatus: data?.hrv_status ?? "N/A",
    };

    return (
        <div className="grid grid-cols-3 gap-4 mb-6">
            {/* Body Battery */}
            <div className="relative overflow-hidden rounded-2xl bg-zinc-900/50 border border-zinc-800 p-4 flex flex-col items-center justify-center gap-2">
                <div className="absolute top-2 right-2 z-10">
                    <SyncButton />
                </div>
                <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-transparent pointer-events-none" />
                <div className="flex items-center gap-2 text-purple-400">
                    <Battery className="w-5 h-5" />
                    <span className="text-xs font-mono uppercase tracking-wider">Body Batt</span>
                </div>
                <span className="text-3xl font-bold text-white font-mono">{metrics.bodyBattery}</span>
            </div>

            {/* Sleep Score */}
            <div className="relative overflow-hidden rounded-2xl bg-zinc-900/50 border border-zinc-800 p-4 flex flex-col items-center justify-center gap-2">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-transparent pointer-events-none" />
                <div className="flex items-center gap-2 text-blue-400">
                    <Moon className="w-5 h-5" />
                    <span className="text-xs font-mono uppercase tracking-wider">Sleep</span>
                </div>
                <span className="text-3xl font-bold text-white font-mono">{metrics.sleepScore}</span>
            </div>

            {/* Resting HR */}
            <div className="relative overflow-hidden rounded-2xl bg-zinc-900/50 border border-zinc-800 p-4 flex flex-col items-center justify-center gap-2">
                <div className="absolute inset-0 bg-gradient-to-br from-red-500/10 to-transparent pointer-events-none" />
                <div className="flex items-center gap-2 text-red-500">
                    <Heart className="w-5 h-5" />
                    <span className="text-xs font-mono uppercase tracking-wider">RHR</span>
                </div>
                <span className="text-3xl font-bold text-white font-mono">{metrics.restingHr}</span>
            </div>
        </div>
    );
}
