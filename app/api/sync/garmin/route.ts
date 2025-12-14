
import { NextResponse } from 'next/server';
import { exec } from 'child_process';
import util from 'util';

const execPromise = util.promisify(exec);

export async function POST() {
    try {
        // 1. Determine python command
        // TEMPORARY PROBE
        // const command = 'py -3.12 -u scripts/diagnose_env.py';
        const command = 'py -3.12 -u scripts/garmin_bridge.py';

        console.log(`Executing: ${command}`);
        const tokenLen = process.env.GARMIN_TOKENS ? process.env.GARMIN_TOKENS.length : 0;
        console.log(`Debug: GARMIN_TOKENS length in Node: ${tokenLen}`);

        const { stdout, stderr } = await execPromise(command, {
            cwd: process.cwd(),
            env: process.env
        });

        if (stderr) {
            console.warn('Script stderr:', stderr);
        }

        console.log('Script stdout:', stdout);

        if (stdout.trim().length === 0 && stderr) {
            throw new Error("Script failed with no output. Check stderr.");
        }

        return NextResponse.json({
            success: true,
            message: 'Sync completed',
            output: stdout || stderr // Send whatever we got back to UI
        });

    } catch (error: any) {
        console.error('Sync failed:', error);
        return NextResponse.json({
            success: false,
            error: error.message || 'Unknown execution error',
            output: error.stdout ? error.stdout + "\n" + (error.stderr || "") : (error.stderr || String(error))
        }, { status: 500 });
    }
}
