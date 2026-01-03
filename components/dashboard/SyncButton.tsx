'use client'

import { useState, useEffect } from 'react';
import { RefreshCw } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface SyncButtonProps {
    showLabel?: boolean;
    className?: string;
}

export default function SyncButton({ showLabel = false, className = "" }: SyncButtonProps) {
    const [loading, setLoading] = useState(false);
    const [lastSynced, setLastSynced] = useState<string>('');
    const router = useRouter();

    useEffect(() => {
        const updateTime = () => {
            const stored = localStorage.getItem('last_garmin_sync');
            if (stored) {
                setLastSynced(timeAgo(stored));
            }
        };
        updateTime();
        const interval = setInterval(updateTime, 60000); // Update every minute
        return () => clearInterval(interval);
    }, []);

    const handleSync = async () => {
        setLoading(true);
        try {
            const res = await fetch('/api/sync/garmin', { method: 'POST' });
            const data = await res.json();
            if (!res.ok) throw new Error(data.error || 'Sync failed');

            localStorage.setItem('last_garmin_sync', new Date().toISOString());
            setLastSynced('Just now');
            console.log('Sync Complete:', data);

            router.refresh();
        } catch (e: any) {
            console.error('Sync Error:', e);
        } finally {
            setLoading(false);
        }
    };

    return (
        <button
            onClick={handleSync}
            disabled={loading}
            className={`flex items-center gap-2 p-2 rounded-lg hover:bg-zinc-800 transition-colors text-zinc-400 hover:text-white disabled:opacity-50 ${className}`}
            title="Sync Garmin Data"
        >
            <RefreshCw
                className={`w-4 h-4 ${loading ? 'animate-spin text-purple-500' : ''}`}
            />
            {showLabel && lastSynced && (
                <span className="text-xs font-medium text-zinc-500">
                    Last synced: {lastSynced}
                </span>
            )}
        </button>
    );
}

function timeAgo(dateString: string) {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return '';
    const seconds = Math.floor((new Date().getTime() - date.getTime()) / 1000);

    let interval = seconds / 31536000;
    if (interval > 1) return Math.floor(interval) + "y ago";
    interval = seconds / 2592000;
    if (interval > 1) return Math.floor(interval) + "mo ago";
    interval = seconds / 86400;
    if (interval > 1) return Math.floor(interval) + "d ago";
    interval = seconds / 3600;
    if (interval > 1) return Math.floor(interval) + "h ago";
    interval = seconds / 60;
    if (interval > 1) return Math.floor(interval) + "m ago";

    return "Just now";
}
