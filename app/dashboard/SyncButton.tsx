"use client";

import { useTransition } from "react";
import { triggerGCalSync, triggerGarminSync } from "@/app/actions/sync";
import { RefreshCw } from "lucide-react";
import { cn } from "@/lib/utils";

export function SyncButton() {
    const [isPending, startTransition] = useTransition();

    const handleSync = () => {
        startTransition(async () => {
            // Trigger both
            try {
                await Promise.all([triggerGCalSync(), triggerGarminSync()]);
                // Ideally show toast
                console.log("Sync complete");
            } catch (e) {
                console.error(e);
            }
        });
    };

    return (
        <button
            onClick={handleSync}
            disabled={isPending}
            className={cn(
                "flex items-center justify-center rounded-full bg-slate-800 p-2 text-slate-400 transition-colors hover:bg-slate-700 hover:text-white",
                isPending && "animate-spin cursor-not-allowed opacity-50"
            )}
            title="Sync Calendar & Garmin"
        >
            <RefreshCw size={20} />
        </button>
    );
}
