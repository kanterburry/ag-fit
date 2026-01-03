'use client'

import { useState } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { ResultsChart } from './ResultsChart'
import { PROTOCOL_TEMPLATES } from '@/lib/protocols/templates'
import { logDailyData } from '@/app/actions/dashboard'
import { ChevronRight, Activity, Flame, Moon, Smartphone, Zap, Check, Plus } from 'lucide-react'
import { cn } from '@/lib/utils'

type Props = {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    protocolData: any
    colorIndex?: number
}

// Apple Health-like colors
const THEME_COLORS = [
    { text: 'text-rose-500', bg: 'bg-rose-500', border: 'border-rose-500/20', glow: 'shadow-rose-500/20' },
    { text: 'text-indigo-400', bg: 'bg-indigo-400', border: 'border-indigo-500/20', glow: 'shadow-indigo-500/20' },
    { text: 'text-orange-500', bg: 'bg-orange-500', border: 'border-orange-500/20', glow: 'shadow-orange-500/20' },
    { text: 'text-emerald-400', bg: 'bg-emerald-400', border: 'border-emerald-500/20', glow: 'shadow-emerald-500/20' },
    { text: 'text-cyan-400', bg: 'bg-cyan-400', border: 'border-cyan-500/20', glow: 'shadow-cyan-500/20' },
]

export function DailyCheckInCard({ protocolData, colorIndex = 0 }: Props) {
    const [isLoading, setIsLoading] = useState(false)
    const [notes, setNotes] = useState('')

    // Fallback if no data
    if (!protocolData || !protocolData.protocol) return null

    const { protocol, currentPhase, activeDayInPhase, todayLog, progressPercent } = protocolData
    const theme = THEME_COLORS[colorIndex % THEME_COLORS.length]

    // Config
    const template = PROTOCOL_TEMPLATES.find(t => t.title === protocol.title) || PROTOCOL_TEMPLATES[0]
    const manualMetrics = template.metrics.filter(m => m.source === 'manual')

    // Form State
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const [formData, setFormData] = useState<Record<string, any>>({})

    const handleLog = async () => {
        setIsLoading(true)
        await logDailyData(protocol.id, currentPhase?.id, { ...formData, notes })
        setIsLoading(false)
    }

    // Dynamic Icon
    const getIcon = () => {
        const title = protocol.title.toLowerCase()
        if (title.includes('sleep')) return Moon
        if (title.includes('caffeine') || title.includes('dopamine')) return Zap
        if (title.includes('phone') || title.includes('screen')) return Smartphone
        if (title.includes('metabolic') || title.includes('fasting')) return Flame
        return Activity
    }
    const Icon = getIcon()

    // Calculate segments (20 segments = 5% each)
    const segments = Array.from({ length: 24 })
    const filledSegments = Math.round((progressPercent / 100) * 24)

    return (
        <Card className="h-[280px] flex flex-col justify-between border border-zinc-800 bg-zinc-900/50 hover:bg-zinc-900/80 transition-all duration-300 rounded-3xl overflow-hidden shadow-sm group w-full relative">

            {/* Header: Progress Ring Icon & Title with Enforced Height and Standardized Spacing */}
            <div className="p-5 pb-2 flex items-start justify-between">
                <div className="flex items-center gap-4"> {/* Increased gap */}
                    {/* Ring Icon Wrapper */}
                    <div className="relative w-12 h-12 flex items-center justify-center shrink-0">
                        <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
                            {/* Track */}
                            <path
                                className="text-zinc-800"
                                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2.5"
                            />
                            {/* Progress */}
                            <path
                                className={cn("transition-all duration-1000 ease-out", theme.text)}
                                strokeDasharray={`${progressPercent}, 100`}
                                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2.5"
                                strokeLinecap="round"
                            />
                        </svg>
                        <Icon className={cn("w-5 h-5 absolute", theme.text)} />
                    </div>

                    {/* Title Area - Enforce 2 Lines Height */}
                    <div className="flex flex-col justify-center min-h-[3rem]">
                        <span className={cn("font-bold text-lg leading-6 tracking-tight text-zinc-100 line-clamp-2", "group-hover:" + theme.text + " transition-colors")}>
                            {protocol.title}
                        </span>
                        <span className="text-xs text-zinc-500 font-medium mt-0.5 uppercase tracking-wide">
                            Day {activeDayInPhase} • {progressPercent}% Done
                        </span>
                    </div>
                </div>
                {/* Status Indicator */}
                <div className="mt-1">
                    {todayLog ? (
                        <div className="bg-emerald-500/10 text-emerald-500 p-1.5 rounded-full">
                            <Check className="w-5 h-5" />
                        </div>
                    ) : (
                        <div className="bg-zinc-800 text-zinc-500 p-1.5 rounded-full">
                            <ChevronRight className="w-5 h-5" />
                        </div>
                    )}
                </div>
            </div>

            <CardContent className="px-5 pb-5 pt-2 flex-1 flex flex-col justify-center">
                {/* IF LOGGED: Show Trend */}
                {todayLog && (
                    <div className="h-full flex flex-col justify-end pb-2">
                        <div className="-mx-2 mb-2 h-full">
                            <ResultsChart protocolData={protocolData} maxItems={2} />
                        </div>
                        <div className="flex items-center justify-between text-[10px] font-medium text-zinc-500 uppercase tracking-widest">
                            <span>Est. Finish: {new Date(new Date().setDate(new Date().getDate() + (30 - activeDayInPhase))).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}</span>
                            <span className={theme.text}>{30 - activeDayInPhase} Days Left</span>
                        </div>
                    </div>
                )}

                {/* IF NOT LOGGED: Show Input */}
                {!todayLog && (
                    <div className="animate-in fade-in slide-in-from-bottom-2 duration-300 flex flex-col justify-between h-full pb-2">
                        <div className="space-y-6"> {/* Increased spacing to match h-20 rows */}
                            {manualMetrics.slice(0, 2).map((metric) => (
                                <div key={metric.key} className="space-y-2">
                                    <label className="text-xs font-semibold text-zinc-400 flex items-center gap-2">
                                        {metric.label}
                                    </label>
                                    <div className="relative">
                                        {metric.metricType === 'time' ? (
                                            <Input
                                                type="time"
                                                className="h-9 bg-zinc-950 border-zinc-800 text-sm text-zinc-200 px-3 focus:border-indigo-500/50 transition-all font-mono"
                                                value={formData[metric.key] || ''}
                                                onChange={(e) => setFormData({ ...formData, [metric.key]: e.target.value })}
                                            />
                                        ) : metric.metricType === 'select' ? (
                                            <select
                                                className="flex h-9 w-full rounded-md border border-zinc-800 bg-zinc-950 px-3 py-1 text-sm text-zinc-200 focus:outline-none focus:border-indigo-500/50 transition-colors"
                                                value={formData[metric.key] || ''}
                                                onChange={(e) => setFormData({ ...formData, [metric.key]: e.target.value })}
                                            >
                                                <option value="" disabled>Select...</option>
                                                {metric.options?.map((opt) => (
                                                    <option key={opt} value={opt}>{opt}</option>
                                                ))}
                                            </select>
                                        ) : (
                                            <>
                                                <Input
                                                    type="number"
                                                    className="h-9 bg-zinc-950 border-zinc-800 text-sm font-semibold text-zinc-100 px-3 focus:border-indigo-500/50 placeholder:text-zinc-700"
                                                    value={formData[metric.key] || ''}
                                                    onChange={(e) => setFormData({ ...formData, [metric.key]: e.target.value })}
                                                    placeholder="0"
                                                />
                                                {metric.suffix && (
                                                    <span className="absolute right-3 top-2.5 text-xs font-medium text-zinc-600">{metric.suffix}</span>
                                                )}
                                            </>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>

                        <Button onClick={handleLog} disabled={isLoading} className={cn("w-full h-9 text-sm font-semibold text-white shadow-md mt-1", theme.bg, "hover:opacity-90")}>
                            {isLoading ? 'Logged' : 'Log Data'}
                            {!isLoading && <Plus className="ml-2 w-4 h-4" />}
                        </Button>
                    </div>
                )}
            </CardContent>

            {/* Discrete Segmented Progress Bar */}
            <div className="w-full flex gap-1 px-5 pb-5 pt-0">
                {segments.map((_, i) => (
                    <div
                        key={i}
                        className={cn(
                            "h-1 px-[1px] flex-1 rounded-full transition-all duration-500",
                            i < filledSegments ? theme.bg : "bg-zinc-800"
                        )}
                    />
                ))}
            </div>
        </Card>
    )
}
