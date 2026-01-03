import { NextResponse } from 'next/server';
import { syncGarminData } from '@/lib/garmin/sync';

export async function POST() {
    try {
        console.log('[Garmin Sync] Starting Node.js sync...');
        const result = await syncGarminData();
        console.log('[Garmin Sync] Completed:', result);

        return NextResponse.json({
            success: true,
            data: result
        });

    } catch (error: any) {
        console.error('[Garmin Sync] Failed:', error);
        return NextResponse.json({
            success: false,
            error: error.message || 'Unknown sync error',
            details: String(error)
        }, { status: 500 });
    }
}
