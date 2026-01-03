import { NextResponse } from 'next/server';
import { execSync } from 'child_process';
import path from 'path';

export async function POST() {
    try {
        console.log('[Garmin Sync] Starting Python bridge sync...');

        // Path to Python script
        const scriptPath = path.join(process.cwd(), 'scripts', 'garmin_bridge.py');

        // Execute Python script with environment variables
        const output = execSync(`python "${scriptPath}"`, {
            encoding: 'utf-8',
            env: process.env,
            timeout: 120000, // 2 minute timeout
            maxBuffer: 10 * 1024 * 1024 // 10MB buffer for output
        });

        console.log('[Garmin Sync] Python output:', output);
        console.log('[Garmin Sync] Completed successfully');

        return NextResponse.json({
            success: true,
            message: 'Garmin sync completed',
            output: output
        });

    } catch (error: any) {
        console.error('[Garmin Sync] Failed:', error);

        const errorOutput = error.stderr || error.stdout || error.message || 'Unknown error';

        return NextResponse.json({
            success: false,
            error: 'Garmin sync failed',
            details: errorOutput
        }, { status: 500 });
    }
}
