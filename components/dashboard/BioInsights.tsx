'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Brain, Users, ExternalLink, Info } from 'lucide-react'
import { cn } from '@/lib/utils'

interface Insight {
    id: string
    title: string
    description: string
    type?: string // 'positive' | 'neutral' | 'info'
    reference?: string
    users?: number
}

interface BioInsightsProps {
    clinical: Insight[]
    community: Insight[]
}

export function BioInsights({ clinical, community }: BioInsightsProps) {
    const [activeTab, setActiveTab] = useState<'clinical' | 'community'>('clinical')

    return (
        <Card className="border-zinc-800 bg-zinc-900/50">
            <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center gap-2 text-lg font-bold">
                        <Brain className="h-5 w-5 text-purple-400" />
                        Bio-Intelligence
                    </CardTitle>
                    <div className="flex bg-zinc-950 rounded-lg p-1 border border-zinc-800">
                        <button
                            onClick={() => setActiveTab('clinical')}
                            className={cn(
                                "px-3 py-1 rounded-md text-xs font-medium transition-all",
                                activeTab === 'clinical'
                                    ? "bg-zinc-800 text-purple-400 shadow-sm"
                                    : "text-zinc-500 hover:text-zinc-300"
                            )}
                        >
                            Clinical
                        </button>
                        <button
                            onClick={() => setActiveTab('community')}
                            className={cn(
                                "px-3 py-1 rounded-md text-xs font-medium transition-all",
                                activeTab === 'community'
                                    ? "bg-zinc-800 text-emerald-400 shadow-sm"
                                    : "text-zinc-500 hover:text-zinc-300"
                            )}
                        >
                            History
                        </button>
                    </div>
                </div>
                <CardDescription>
                    {activeTab === 'clinical'
                        ? "Insights based on your physiological data vs research baselines."
                        : "Crowdsourced patterns from the Ag-Fit community."}
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="space-y-3">
                    {activeTab === 'clinical' ? (
                        clinical.map((insight) => (
                            <div key={insight.id} className="p-3 rounded-lg bg-zinc-950/50 border border-zinc-800/50 relative overflow-hidden group">
                                <div className={cn(
                                    "absolute left-0 top-0 bottom-0 w-1",
                                    insight.type === 'positive' ? "bg-emerald-500" :
                                        insight.type === 'info' ? "bg-blue-500" : "bg-zinc-700"
                                )} />
                                <div className="pl-3">
                                    <h4 className="text-sm font-semibold text-zinc-200 mb-1">{insight.title}</h4>
                                    <p className="text-xs text-zinc-400 mb-2 leading-relaxed">
                                        {insight.description}
                                    </p>
                                    {insight.reference && (
                                        <div className="flex items-center gap-1 text-[10px] text-zinc-500 uppercase tracking-wider font-medium">
                                            <Info className="w-3 h-3" />
                                            Source: {insight.reference}
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))
                    ) : (
                        community.map((insight) => (
                            <div key={insight.id} className="p-3 rounded-lg bg-zinc-950/50 border border-zinc-800/50">
                                <div className="flex justify-between items-start mb-1">
                                    <h4 className="text-sm font-semibold text-zinc-200">{insight.title}</h4>
                                    <div className="flex items-center gap-1 text-[10px] text-emerald-500 bg-emerald-500/10 px-1.5 py-0.5 rounded border border-emerald-500/20">
                                        <Users className="w-3 h-3" />
                                        {insight.users}
                                    </div>
                                </div>
                                <p className="text-xs text-zinc-400 leading-relaxed">
                                    {insight.description}
                                </p>
                            </div>
                        ))
                    )}
                </div>
            </CardContent>
        </Card>
    )
}
