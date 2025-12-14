'use client'

import { useState } from 'react';
import { RefreshCw } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function SyncButton() {
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const handleSync = async () => {
        setLoading(true);
        try {
            const res = await fetch('/api/sync/garmin', { method: 'POST' });
            const data = await res.json();
            if (!res.ok) throw new Error(data.error || 'Sync failed');

            alert('Sync Complete: ' + (data.details || 'Data updated'));
            router.refresh(); // Refresh Server Components
        } catch (e: any) {
            alert('Error: ' + e.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <button
            onClick={handleSync}
            disabled={loading}
            className="p-2 rounded-full hover:bg-zinc-800 transition-colors text-zinc-400 hover:text-white disabled:opacity-50"
            title="Sync Garmin Data"
        >
            <RefreshCw
                className={`w-4 h-4 ${loading ? 'animate-spin text-purple-500' : ''}`}
            />
        </button>
    );
}
