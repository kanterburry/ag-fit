
import { NextResponse } from 'next/server';
import { exec } from 'child_process';
import util from 'util';

const execPromise = util.promisify(exec);

export async function POST() {
    try {
        // 1. Determine python command
        // On Vercel this will fail (no python). On local Windows, 'py -3.12' or 'python'.
        // We try 'py -3.12' since we know that's what the user has.
        const command = 'py -3.12 scripts/garmin_bridge.py';

        console.log(`Executing: ${command}`);

        const { stdout, stderr } = await execPromise(command, {
            cwd: process.cwd(),
            env: process.env // Pass current env vars (including .env.local loaded by Next.js)
        });

        if (stderr) {
            console.warn('Script stderr:', stderr);
        }

        console.log('Script stdout:', stdout);

        return NextResponse.json({
            success: true,
            message: 'Sync completed',
            details: stdout
        });

    } catch (error: any) {
        console.error('Sync failed:', error);
        return NextResponse.json({
            success: false,
            error: error.message || 'Unknown error',
            details: error.stdout || error.stderr
        }, { status: 500 });
    }
}
