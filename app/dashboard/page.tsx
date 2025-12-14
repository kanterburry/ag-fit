
import { Suspense } from 'react'
import BioStateHeader from '@/components/dashboard/BioStateHeader'
import ActiveTimeline from '@/components/dashboard/ActiveTimeline'
import VolumeTrends from '@/components/dashboard/VolumeTrends'
import RecentActivities from '@/components/dashboard/RecentActivities'
import SyncStatus from '@/components/dashboard/SyncStatus'
import { getTodayWorkouts, getRecentActivities } from '@/app/dashboard/actions'
import { Plus, MessageSquare } from 'lucide-react'
import Link from 'next/link'
import PushManager from '@/components/features/notifications/PushManager'
import { GarminDashboard } from '@/components/features/garmin/GarminDashboard'

export default async function DashboardPage() {
    const workouts = await getTodayWorkouts()
    const activities = await getRecentActivities()

    return (
        <div className="min-h-screen bg-[#050505] text-zinc-100 p-6 pb-24 font-sans">
            <header className="mb-8 flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight text-white">Command Center</h1>
                    <p className="text-zinc-500 text-sm">Welcome back, Athlete.</p>
                </div>
                <div className="flex items-center gap-3">
                    <PushManager />
                    <div className="h-10 w-10 rounded-full bg-zinc-800 flex items-center justify-center border border-zinc-700">
                        {/* User Avatar Placeholder */}
                        <span className="text-xs font-mono text-zinc-400">ME</span>
                    </div>
                </div>
            </header>

            {/* Module A: Command Center */}
            <div className="max-w-md md:max-w-5xl mx-auto space-y-6">

                {/* Bio-State Header */}
                <Suspense fallback={<div className="h-24 bg-zinc-900 rounded-2xl animate-pulse" />}>
                    <BioStateHeader />
                </Suspense>

                {/* Garmin Stats Grid */}
                <section>
                    <GarminDashboard />
                </section>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Active Timeline */}
                    <section>
                        <ActiveTimeline workouts={workouts || []} />
                    </section>

                    {/* Volume Trends (Bento Item) */}
                    <section className="h-48">
                        <VolumeTrends />
                    </section>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Recent Activities (Bento Item) */}
                    <section className="md:col-span-2">
                        <RecentActivities activities={activities || []} />
                    </section>

                    {/* Sync Console (Full Width) */}
                    <section className="md:col-span-1">
                        <SyncStatus />
                    </section>
                </div>

                {/* Quick Actions (Floating or Fixed Bottom) */}
                <div className="fixed bottom-6 left-0 right-0 px-6 flex justify-center gap-4 z-50">
                    <Link
                        href="/dashboard/log"
                        className="flex-1 max-w-[160px] h-14 rounded-2xl bg-zinc-900 border border-zinc-800 flex items-center justify-center gap-2 text-purple-400 font-medium active:scale-95 transition-transform backdrop-blur-md bg-opacity-80 shadow-lg shadow-purple-900/10"
                    >
                        <Plus size={20} />
                        <span>Log Set</span>
                    </Link>
                    <Link
                        href="/dashboard/coach"
                        className="flex-1 max-w-[160px] h-14 rounded-2xl bg-zinc-900 border border-zinc-800 flex items-center justify-center gap-2 text-zinc-400 font-medium active:scale-95 transition-transform backdrop-blur-md bg-opacity-80"
                    >
                        <MessageSquare size={20} />
                        <span>AI Coach</span>
                    </Link>
                </div>
            </div>
        </div>
    )
}
