'use client'

import { useState } from 'react'
import { Calendar as CalendarIcon, Loader2, Check } from 'lucide-react'
import { syncProtocolsToGoogleCalendar } from '@/app/actions/google-calendar'
import { cn } from '@/lib/utils'

export function GoogleCalendarSyncButton() {
    const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
    const [message, setMessage] = useState('')

    const handleSync = async () => {
        setStatus('loading')
        try {
            const result = await syncProtocolsToGoogleCalendar()
            if (result.success) {
                setStatus('success')
                setMessage(result.message || 'Synced successfully!')
                setTimeout(() => setStatus('idle'), 3000)
            } else {
                setStatus('error')
                setMessage(result.message || 'Sync failed')
                setTimeout(() => setStatus('idle'), 5000)
            }
        } catch (e: any) {
            setStatus('error')
            setMessage(e.message || 'An error occurred')
            setTimeout(() => setStatus('idle'), 5000)
        }
    }

    return (
        <div className="flex items-center gap-2">
            <button
                onClick={handleSync}
                disabled={status === 'loading' || status === 'success'}
                className={cn(
                    "flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium transition-all border",
                    status === 'idle' && "bg-zinc-800 text-zinc-300 border-zinc-700 hover:bg-zinc-700 hover:text-white",
                    status === 'loading' && "bg-zinc-800 text-zinc-400 border-zinc-700 cursor-not-allowed",
                    status === 'success' && "bg-green-500/10 text-green-400 border-green-500/20",
                    status === 'error' && "bg-red-500/10 text-red-400 border-red-500/20"
                )}
            >
                {status === 'loading' ? (
                    <Loader2 size={14} className="animate-spin" />
                ) : status === 'success' ? (
                    <Check size={14} />
                ) : (
                    <CalendarIcon size={14} />
                )}
                <span>
                    {status === 'idle' && "Sync to Google Calendar"}
                    {status === 'loading' && "Syncing..."}
                    {status === 'success' && "Synced!"}
                    {status === 'error' && "Failed"}
                </span>
            </button>
            {message && status !== 'idle' && (
                <span className={cn(
                    "text-xs",
                    status === 'success' ? "text-green-500" : "text-red-500"
                )}>
                    {message}
                </span>
            )}
        </div>
    )
}
