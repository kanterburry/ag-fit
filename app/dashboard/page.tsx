
import { Suspense } from 'react'
import BioStateHeader from '@/components/dashboard/BioStateHeader'
import ActiveTimeline from '@/components/dashboard/ActiveTimeline'
import VolumeTrends from '@/components/dashboard/VolumeTrends'
import RecentActivities from '@/components/dashboard/RecentActivities'
import SyncStatus from '@/components/dashboard/SyncStatus'
import { getTodayWorkouts, getRecentActivities, getBioInsights } from '@/app/dashboard/actions'
import { Plus, MessageSquare } from 'lucide-react'
import Link from 'next/link'
import PushManager from '@/components/features/notifications/PushManager'
import { GarminDashboard } from '@/components/features/garmin/GarminDashboard'
import { getActiveProtocols } from '@/app/actions/dashboard'
import { ProtocolManager } from '@/components/dashboard/ProtocolManager'
import SyncButton from '@/components/dashboard/SyncButton'
import { BioInsights } from '@/components/dashboard/BioInsights'

export default async function DashboardPage() {
    const workouts = await getTodayWorkouts()
    const activities = await getRecentActivities()
    const protocolDataList = await getActiveProtocols()
    const bioInsights = await getBioInsights()

    return (
        <div className="min-h-screen bg-black text-white p-6 pb-24 space-y-8">
            <div className="lg:col-span-2 space-y-6">
                {/* Header / Stats */}
                <div className="animate-in fade-in slide-in-from-top-4 duration-500">
                    <Suspense fallback={<div className="h-32 bg-zinc-900 rounded-2xl animate-pulse" />}>
                        <BioStateHeader />
                    </Suspense>
                </div>

                {/* Welcome / Context */}
                <div className="flex items-center justify-between mb-4">
                    <div>
                        <h2 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-600">
                            Bio-Command Center
                        </h2>
                        <p className="text-zinc-500">Your physiological status and daily tasks.</p>
                    </div>
                    {/* SyncButton moved to Header */}
                </div>

                {/* Scheduled Workouts (ActiveTimeline) removed per user request */}

                {/* Bio-Experiment Module */}
                <section>
                    <ProtocolManager protocolDataList={protocolDataList} />
                </section>

                {/* Garmin Stats Grid */}
                <section>
                    <GarminDashboard />
                </section>

                {/* Removed Volume Trends and Active Timeline as per user request */}

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Recent Activities (Bento Item) */}
                    <section className="md:col-span-2 space-y-6">
                        {bioInsights && (
                            <BioInsights
                                clinical={bioInsights.clinical}
                                community={bioInsights.community}
                            />
                        )}
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
