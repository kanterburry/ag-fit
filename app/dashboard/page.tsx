
import { Suspense } from 'react'
import BioStateHeader from '@/components/dashboard/BioStateHeader'
import ActiveTimeline from '@/components/dashboard/ActiveTimeline'
import VolumeTrends from '@/components/dashboard/VolumeTrends'
import RecentActivities from '@/components/dashboard/RecentActivities'

import { getTodayWorkouts, getRecentActivities, getBioInsights } from '@/app/dashboard/actions'
import { Plus, MessageSquare } from 'lucide-react'
import Link from 'next/link'
import PushManager from '@/components/features/notifications/PushManager'
import { GarminDashboard } from '@/components/features/garmin/GarminDashboard'
import { getActiveProtocols } from '@/app/actions/dashboard'
import { ProtocolManager } from '@/components/dashboard/ProtocolManager'

import { BioInsights } from '@/components/dashboard/BioInsights'
import DashboardActions from '@/components/dashboard/DashboardActions'

export default async function DashboardPage() {
    // Fetch all data in parallel for faster page load
    const [workouts, activities, protocolDataList, bioInsights] = await Promise.all([
        getTodayWorkouts(),
        getRecentActivities(),
        getActiveProtocols(),
        getBioInsights()
    ])

    return (
        <div className="min-h-screen bg-black text-white p-6 pb-24 space-y-8">
            <div className="lg:col-span-2 space-y-6">
                {/* Dashboard Actions (Sticky Header) - Repositioned to avoid top-right profile on mobile */}
                <div className="fixed bottom-24 right-4 sm:absolute sm:top-6 sm:right-6 sm:bottom-auto z-50">
                    <DashboardActions protocols={protocolDataList} />
                </div>

                {/* Header / Stats */}
                <div className="animate-in fade-in slide-in-from-top-4 duration-500 pt-12 md:pt-0">
                    <Suspense fallback={<div className="h-32 bg-zinc-900 rounded-2xl animate-pulse" />}>
                        <BioStateHeader />
                    </Suspense>
                </div>

                {/* Bio Command Center Header */}
                <div className="flex items-center justify-between mb-6">
                    <div className="space-y-1">
                        <h2 className="text-2xl font-bold tracking-tight bg-gradient-to-r from-purple-400 via-pink-500 to-purple-600 bg-clip-text text-transparent">
                            Bio-Command Center
                        </h2>
                        <p className="text-sm text-zinc-500">Your active protocol experiments and progress</p>
                    </div>
                </div>

                {/* Bio-Experiment Module */}
                <section>
                    <ProtocolManager protocolDataList={protocolDataList} />
                </section>

                {/* Bio Intelligence Module - Adjacent to Bio Command Center */}
                {bioInsights && (
                    <section>
                        <BioInsights
                            clinical={bioInsights.clinical}
                            community={bioInsights.community}
                        />
                    </section>
                )}

                {/* Health Dashboard - Wearable Stats */}
                <section>
                    <div className="mb-4">
                        <h2 className="text-xl font-bold text-zinc-100">Health Dashboard</h2>
                        <p className="text-sm text-zinc-500">Live data from your wearable device</p>
                    </div>
                    <GarminDashboard />
                </section>

                {/* Removed Volume Trends and Active Timeline as per user request */}

                {/* Recent Activities */}
                <section className="space-y-6">
                    <RecentActivities activities={activities || []} />
                </section>

            </div>
        </div>
    )
}
