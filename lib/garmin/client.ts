import { GarminConnect } from 'garmin-connect';

export class GarminClient {
    private client: GarminConnect;
    private isAuthenticated: boolean = false;

    constructor() {
        this.client = new GarminConnect();
    }

    async login() {
        if (this.isAuthenticated) return;

        const email = process.env.GARMIN_EMAIL;
        const password = process.env.GARMIN_PASSWORD;

        if (!email || !password) {
            throw new Error('Missing GARMIN_EMAIL or GARMIN_PASSWORD environment variables');
        }

        try {
            await this.client.login(email, password);
            this.isAuthenticated = true;
            console.log('Garmin authenticated successfully');
        } catch (error) {
            console.error('Garmin authentication failed:', error);
            throw error;
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
}
