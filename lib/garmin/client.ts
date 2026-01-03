import { GarminConnect } from 'garmin-connect';

export class GarminClient {
    private client: GarminConnect;
    private isAuthenticated: boolean = false;

    constructor() {
        const email = process.env.GARMIN_EMAIL;
        const password = process.env.GARMIN_PASSWORD || process.env.GARMIN_PASS;

        if (!email || !password) {
            console.warn('Garmin credentials not configured in environment');
            this.client = new GarminConnect();
        } else {
            this.client = new GarminConnect({ username: email, password });
        }
    }

    async login() {
        if (this.isAuthenticated) return;

        const email = process.env.GARMIN_EMAIL;
        const password = process.env.GARMIN_PASSWORD || process.env.GARMIN_PASS;

        console.log('[GarminClient] Login Attempt:', {
            hasEmail: !!email,
            hasPassword: !!password,
            passwordVar: process.env.GARMIN_PASSWORD ? 'GARMIN_PASSWORD' : (process.env.GARMIN_PASS ? 'GARMIN_PASS' : 'NONE')
        });

        if (!email || !password) {
            console.warn('Garmin credentials missing in environment variables');
            throw new Error('GARMIN_CREDENTIALS_MISSING');
        }

        try {
            await this.client.login(email, password);
            this.isAuthenticated = true;
            console.log('Garmin authenticated successfully');
        } catch (error) {
            console.error('Garmin authentication failed:', error);
            throw new Error('GARMIN_AUTH_FAILED: ' + (error as Error).message);
        }
    }

    async getDailyStats(date: Date) {
        await this.login();
        // user-summary-daily includes steps, hr, stress
        // sleep is separate usually
        const dateStr = date.toISOString().split('T')[0];

        try {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const c = this.client as any;
            const summary = await c.getUserSummary(dateStr);
            const sleep = await c.getSleepData(dateStr);
            const hrv = await c.getHrvData(dateStr);

            return {
                summary,
                sleep,
                hrv
            };
        } catch (error) {
            console.error(`Failed to fetch daily stats for ${dateStr}:`, error);
            throw error;
        }
    }

    async getActivities(limit: number = 10) {
        await this.login();
        try {
            const activities = await this.client.getActivities(0, limit);
            return activities;
        } catch (error) {
            console.error('Failed to fetch activities:', error);
            throw error;
        }
    }

    async getTrainingStatus() {
        await this.login();
        try {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const c = this.client as any;
            const status = await c.getTrainingStatus();
            return status;
        } catch (error) {
            console.error('Failed to fetch training status:', error);
            throw error;
        }
    }

    async getRacePredictions() {
        await this.login();
        try {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const c = this.client as any;
            const predictions = await c.getRacePredictions();
            return predictions;
        } catch (error) {
            console.error('Failed to fetch race predictions:', error);
            throw error;
        }
    }
}
