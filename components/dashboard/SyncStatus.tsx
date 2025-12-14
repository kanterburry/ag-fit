
"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { RefreshCw, Terminal, CheckCircle, AlertCircle } from "lucide-react"

export default function SyncStatus() {
    const router = useRouter()
    const [isSyncing, setIsSyncing] = useState(false)
    const [logs, setLogs] = useState<string>("")
    const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle')

    const handleSync = async () => {
        setIsSyncing(true)
        setLogs("Initializing sync...\nRequesting /api/sync/garmin...")
        setStatus('idle')

        try {
            const res = await fetch('/api/sync/garmin', { method: 'POST' })
            const data = await res.json()

            if (res.ok) {
                setLogs((prev) => prev + "\n\n--- SUCCESS ---\n" + (data.output || "Sync completed successfully."))
                setStatus('success')
                // Soft refresh to update server components without page reload
                router.refresh()
            } else {
                setLogs((prev) => prev + "\n\n--- ERROR ---\n" + (data.error || "Unknown error occurred."))
                setStatus('error')
            }
        } catch (error) {
            setLogs((prev) => prev + "\n\n--- NETWORK ERROR ---\n" + String(error))
            setStatus('error')
        } finally {
            setIsSyncing(false)
        }
    }

    return (
        <div className="rounded-2xl bg-zinc-900/50 border border-zinc-800 p-6">
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                    <Terminal className="w-5 h-5 text-zinc-400" />
                    <h3 className="text-zinc-200 font-medium">System Status</h3>
                </div>
                <button
                    onClick={handleSync}
                    disabled={isSyncing}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${isSyncing
                        ? "bg-zinc-800 text-zinc-500 cursor-not-allowed"
                        : "bg-white text-black hover:bg-zinc-200"
                        }`}
                >
                    <RefreshCw className={`w-4 h-4 ${isSyncing ? "animate-spin" : ""}`} />
                    {isSyncing ? "Syncing..." : "Run Manual Sync"}
                </button>
            </div>

            {/* Status Indicator */}
            <div className="flex items-center gap-2 mb-4 text-sm">
                <span className="text-zinc-500">Last Status:</span>
                {status === 'idle' && <span className="text-zinc-400">Ready</span>}
                {status === 'success' && <span className="flex items-center gap-1 text-green-500"><CheckCircle size={14} /> Success</span>}
                {status === 'error' && <span className="flex items-center gap-1 text-red-500"><AlertCircle size={14} /> Failed</span>}
            </div>

            {/* Log Terminal */}
            <div className="bg-black/80 rounded-lg border border-zinc-800 p-4 font-mono text-xs h-48 overflow-y-auto">
                {logs ? (
                    <pre className="whitespace-pre-wrap text-zinc-300">{logs}</pre>
                ) : (
                    <div className="flex flex-col items-center justify-center h-full text-zinc-600 gap-2">
                        <Terminal size={24} className="opacity-20" />
                        <p>No active logs. Run a sync to view output.</p>
                    </div>
                )}
            </div>
        </div>
    )
}
