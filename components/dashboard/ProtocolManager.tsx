'use client'

import { useState } from 'react'
import { DailyCheckInCard } from './DailyCheckInCard'
import { DailyCheckInCard as DailyCheckInCardType } from './DailyCheckInCard' // Import type usage? No need.
import { ResultsChart } from './ResultsChart'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { Activity, ClipboardList } from 'lucide-react'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function ProtocolManager({ protocolDataList }: { protocolDataList: any[] }) {
    // 1. Deduplicate protocols by Title
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const uniqueProtocols = protocolDataList.reduce((acc: any[], current) => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const x = acc.find((item: any) => item.protocol.title === current.protocol.title);
        if (!x) return acc.concat([current]);
        return acc;
    }, []);

    const selectedProtocolData = uniqueProtocols?.[0]

    if (!selectedProtocolData) {
        // Empty State
        return (
            <div className="space-y-4">
                <h2 className="text-xl font-bold tracking-tight px-1">Summary</h2>
                <Card className="border-dashed border-zinc-800 bg-zinc-900/20">
                    <CardContent className="flex flex-col items-center justify-center py-12 text-center space-y-4">
                        <div className="h-12 w-12 rounded-full bg-zinc-900 flex items-center justify-center">
                            <Activity className="h-6 w-6 text-zinc-500" />
                        </div>
                        <div className="space-y-1">
                            <h3 className="text-lg font-medium text-white">No Active Protocols</h3>
                            <p className="text-sm text-zinc-400 max-w-[300px]">
                                You aren't tracking any experimental protocols yet. Start one to optimize your biology.
                            </p>
                        </div>
                        <a href="/dashboard/protocols" className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 h-10 px-4 py-2 border border-zinc-700 bg-zinc-900 hover:bg-zinc-800 text-zinc-300">
                            <ClipboardList className="mr-2 h-4 w-4" />
                            Browse Library
                        </a>
                    </CardContent>
                </Card>
            </div>
        )
    }

    return (
        <div className="space-y-4">
            <h2 className="text-xl font-bold tracking-tight px-1">Summary</h2>
            {/* Responsive Grid for "Leaner/Smaller" look on Desktop */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                {uniqueProtocols.map((protocolData: any, index: number) => (
                    <div key={protocolData.protocol.id} className="animate-in fade-in slide-in-from-bottom-2 duration-300" style={{ animationDelay: `${index * 50}ms` }}>
                        <DailyCheckInCard
                            protocolData={protocolData}
                            colorIndex={index}
                        />
                    </div>
                ))}
            </div>
        </div>
    )
}
