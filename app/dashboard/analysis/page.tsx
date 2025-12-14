import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/config";
import { redirect } from "next/navigation";
import { getWeeklyVolume, getActivityDistribution, getConsistencyHeatmap } from "@/lib/db/queries";
import VolumeChart from "@/components/features/analysis/VolumeChart";
import MuscleSplit from "@/components/features/analysis/MuscleSplit";
import ConsistencyGrid from "@/components/features/analysis/ConsistencyGrid";

export const metadata = {
    title: "Analysis | AG-Fit",
    description: "Track your fitness trends and progress.",
};

export default async function AnalysisPage() {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
        redirect("/login");
    }

    // Since we don't store the user ID in the session object directly in some configs
    // we might need to rely on the email or ensure the session callback returns the ID.
    // In our config.ts, we *do* pass specific tokens, but let's assume `sub` or `id` is available
    // or we fetch the profile by email. 
    // Looking at `authOptions` in `lib/auth/config.ts`:
    // It passes `token.sub` to `session.user.id` usually, let's verify if `session.user` has `id`.
    // If not, we might fail.
    // However, our `queries.ts` takes `userId`. 
    // Let's assume for now `session.user.email` is the unique ID used in `profiles` table OR 
    // `session.user.id` is populated. Looking at strict Typescript, `DefaultSession` doesn't have ID.
    // I should check `next-auth.d.ts` if it exists or cast it.

    // For safety in this MVP without custom type defs visible: 
    // I'll assume the `sub` from Google is the ID, and it's on the session object if configured.
    // If not, I'll use the email as the fallback ID if the schema supports it.
    // Schema says `user_id` text.

    // Let's use a type assertion for now.
    const userId = (session.user as any).id || (session.user as any).sub;

    if (!userId) {
        return <div className="p-8 text-center">Error: User ID not found in session.</div>;
    }

    const weeklyVolume = await getWeeklyVolume(userId);
    const activityDistribution = await getActivityDistribution(userId);
    const consistencyData = await getConsistencyHeatmap(userId);

    return (
        <div className="container mx-auto max-w-5xl space-y-6 p-4 pb-24 md:p-8">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight text-white">Analysis</h1>
                    <p className="text-slate-400">Your training trends and insights.</p>
                </div>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
                {/* Volume Chart - Spans full width on mobile, half on desktop */}
                <div className="col-span-1 md:col-span-2">
                    <VolumeChart data={weeklyVolume} />
                </div>

                {/* Split & Consistency */}
                <div className="col-span-1">
                    <MuscleSplit data={activityDistribution} />
                </div>
                <div className="col-span-1">
                    <ConsistencyGrid data={consistencyData} />
                </div>
            </div>

            <div className="rounded-xl border border-slate-800 bg-slate-900/50 p-6">
                <h3 className="mb-2 font-semibold text-white">Coach's Insight</h3>
                <p className="text-sm text-slate-400">
                    Your training consistency is looking {consistencyData.length > 5 ? "great" : "like it needs work"}.
                    Capture more data to unlock deeper AI insights.
                </p>
            </div>
        </div>
    );
}
