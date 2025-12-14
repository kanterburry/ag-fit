"use client";

import { useState } from "react";
import { subscribeUserToPush } from "@/lib/notifications/pushService";
import { Bell, BellOff, CheckCircle, AlertTriangle } from "lucide-react";

export default function NotificationManager() {
    const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
    const [msg, setMsg] = useState("");

    const handleSubscribe = async () => {
        setStatus("loading");
        const result = await subscribeUserToPush();

        if (result.success) {
            setStatus("success");
            setMsg("You are now subscribed to Nudges!");
        } else {
            setStatus("error");
            setMsg(result.error || "Failed to subscribe.");
        }
    };

    return (
        <div className="rounded-xl border border-slate-800 bg-slate-900 p-6">
            <div className="mb-4 flex items-center gap-3">
                <div className="rounded-full bg-primary/10 p-2 text-primary">
                    <Bell size={24} />
                </div>
                <div>
                    <h3 className="font-bold text-white">Nudge Engine</h3>
                    <p className="text-sm text-slate-400">Get notified 30m before your planned workouts.</p>
                </div>
            </div>

            {status === "success" ? (
                <div className="flex items-center gap-2 rounded-lg bg-emerald-500/10 p-3 text-emerald-400">
                    <CheckCircle size={18} />
                    <span className="text-sm font-medium">Active & Ready</span>
                </div>
            ) : (
                <button
                    onClick={handleSubscribe}
                    disabled={status === "loading"}
                    className="flex w-full items-center justify-center gap-2 rounded-lg bg-primary py-3 font-bold text-slate-900 transition-hover hover:bg-emerald-400 disabled:opacity-50"
                >
                    {status === "loading" ? "Activating..." : "Enable Nudges"}
                </button>
            )}

            {status === "error" && (
                <div className="mt-3 flex items-center gap-2 text-xs text-error">
                    <AlertTriangle size={14} />
                    <span>{msg}</span>
                </div>
            )}
        </div>
    );
}
