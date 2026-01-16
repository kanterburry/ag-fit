'use client'

import { useState, useEffect } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { PROTOCOL_TEMPLATES } from '@/lib/protocols/templates'
import { logDailyData } from '@/app/actions/dashboard'
import { deleteProtocol } from '@/app/actions/protocol'
import { Activity, Flame, Moon, Smartphone, Zap, Check, Trash2, Sparkles, Database } from 'lucide-react'
import { cn } from '@/lib/utils'
import { DeleteProtocolDialog } from './DeleteProtocolDialog'
import Link from 'next/link'
import { generateProtocolInsight } from '@/app/actions/ai-insight'
import { useRouter } from 'next/navigation'
import { SegmentedDonut, DonutSegment } from './SegmentedDonut'

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

export default function DailyCheckInCard({ protocolData, colorIndex = 0 }: Props) {
    const [isLoading, setIsLoading] = useState(false)
    const [showDeleteDialog, setShowDeleteDialog] = useState(false)
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [notes, setNotes] = useState('')
    const [insight, setInsight] = useState<string | null>(null)
    const router = useRouter()

    if (!protocolData || !protocolData.protocol) return null

    const { protocol, currentPhase, logs, activeDayInPhase } = protocolData
    const theme = THEME_COLORS[colorIndex % THEME_COLORS.length]

    // Insight Effect
    useEffect(() => {
        let mounted = true
        async function fetchInsight() {
            if (activeDayInPhase > 0) {
                const res = await generateProtocolInsight(protocol.id)
                if (mounted && res.insight) setInsight(res.insight)
            }
        }
        fetchInsight()
        return () => { mounted = false }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [protocol.id])


    // Config
    const template = PROTOCOL_TEMPLATES.find(t => t.title === protocol.title) || PROTOCOL_TEMPLATES[0]
    const manualMetrics = template.metrics.filter(m => m.source === 'manual')
    const primaryMetric = template.metrics.find(m => m.source === 'automated') || template.metrics[0]

    // Form State
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const [formData, setFormData] = useState<Record<string, any>>({})

    const handleLog = async () => {
        setIsLoading(true)
        await logDailyData(protocol.id, currentPhase?.id, { ...formData, notes })
        setIsLoading(false)
    }

    const handleDelete = async () => {
        setIsLoading(true)
        const result = await deleteProtocol(protocol.id)
        setIsLoading(false)

        if (result.error) {
            console.error('Failed to delete protocol:', result.error)
        } else {
            router.refresh()
        }
        setShowDeleteDialog(false)
    }

    const getIcon = () => {
        const title = protocol.title.toLowerCase()
        if (title.includes('sleep')) return Moon
        if (title.includes('caffeine') || title.includes('dopamine')) return Zap
        if (title.includes('phone') || title.includes('screen')) return Smartphone
        if (title.includes('metabolic') || title.includes('fasting')) return Flame
        return Activity
    }
    const Icon = getIcon()

    // --- Timeline Logic ---
    // Flatten phases
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const phases = (protocol.protocol_phases || []).sort((a: any, b: any) => a.order_index - b.order_index)
    let totalDuration = 0
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    phases.forEach((p: any) => totalDuration += p.duration_days)

    // Calculate Days Elapsed
    const startDate = new Date(protocol.created_at)
    startDate.setHours(0, 0, 0, 0)
    const today = new Date()
    today.setHours(0, 0, 0, 0)

    const diffTime = today.getTime() - startDate.getTime()
    const daysElapsed = Math.floor(diffTime / (1000 * 60 * 60 * 24)) + 1
    const currentGlobalDay = Math.min(Math.max(1, daysElapsed), totalDuration)

    // --- Generate Segments (Intuitive Colors) ---
    const donutSegments: DonutSegment[] = []

    // Helper: is this day logged?
    const isDayLogged = (dayIndex: number) => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        return logs.some((l: any) => {
            const logDate = new Date(l.date)
            logDate.setHours(0, 0, 0, 0)
            const dTime = logDate.getTime() - startDate.getTime()
            const dDays = Math.round(dTime / (1000 * 60 * 60 * 24))
            return dDays === dayIndex
        })
    }

    for (let i = 0; i < totalDuration; i++) {
        const isPast = i < (daysElapsed - 1)
        const isToday = i === (daysElapsed - 1)
        const logged = isDayLogged(i)

        let status: DonutSegment['status'] = 'future'
        let color = undefined

        if (logged) {
            status = 'completed'
            color = 'text-emerald-400'
        } else if (isToday) {
            status = 'active'
            color = 'text-white'
        } else if (isPast) {
            status = 'missed'
            color = 'text-red-500/30'
        } else {
            status = 'future'
            color = 'text-zinc-900'
        }

        donutSegments.push({ status, color })
    }

    // Stats Logic
    const logsCount = logs.length
    const reliability = Math.min(100, Math.round((logsCount / daysElapsed) * 100)) || 0

    // Today's Status
    const { todayLog } = protocolData

    // --- Render Center ---
    const renderCenterContent = () => {
        // PASSIVE
        if (protocol.protocol_type === 'PASSIVE') {
            const todayStr = new Date().toISOString().split('T')[0]
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const todayMetric = protocolData.metrics?.find((m: any) => m.date === todayStr)

            // Fallback: Last available metric if today is empty
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const lastMetric = protocolData.metrics?.[protocolData.metrics.length - 1]
            const metricToUse = todayMetric || lastMetric

            let displayValue = '--'
            let subText = 'Syncing...'

            if (metricToUse && metricToUse[primaryMetric.key]) {
                const val = metricToUse[primaryMetric.key]
                if (primaryMetric.metricType === 'time') {
                    if (typeof val === 'number') {
                        const hrs = Math.floor(val / 3600)
                        const mins = Math.floor((val % 3600) / 60)
                        displayValue = `${hrs}h ${mins}m`
                    } else {
                        displayValue = val
                    }
                } else {
                    displayValue = `${val}${primaryMetric.suffix || ''}`
                }

                if (todayMetric) {
                    subText = 'Live Today'
                } else {
                    const d = new Date(metricToUse.date)
                    subText = `Last: ${d.toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}`
                }
            }

            return (
                <div className="flex flex-col items-center animate-in fade-in zoom-in duration-500">
                    <Icon className={cn("w-6 h-6 mb-2 opacity-50", theme.text)} />
                    <span className={cn("text-4xl font-bold tracking-tighter", theme.text)}>
                        {displayValue}
                    </span>
                    <span className="text-xs font-medium text-zinc-500 uppercase tracking-widest mt-1">
                        {subText}
                    </span>
                    <span className="text-[10px] text-zinc-600 mt-2">
                        Day {currentGlobalDay} <span className="text-zinc-700">/ {totalDuration}</span>
                    </span>
                </div>
            )
        }

        // MANUAL - Logged
        if (todayLog) {
            const firstKey = manualMetrics[0]?.key
            const val = todayLog.data?.[firstKey]
            const display = val ? `${val} ${manualMetrics[0]?.suffix || ''}` : 'Done'

            return (
                <div className="flex flex-col items-center animate-in fade-in zoom-in duration-500">
                    <div className="bg-emerald-500/10 text-emerald-500 p-3 rounded-full mb-3 ring-1 ring-emerald-500/20">
                        <Check className="w-6 h-6" />
                    </div>
                    <span className={cn("text-3xl font-bold tracking-tight text-white")}>
                        {display}
                    </span>
                    <span className="text-[10px] font-medium text-emerald-500 uppercase tracking-widest mt-1">
                        Logged Day {currentGlobalDay}
                    </span>
                </div>
            )
        }

        // MANUAL - Action
        return (
            <div className="w-full max-w-[180px] flex flex-col items-center space-y-3 animate-in fade-in">
                <div className="text-center space-y-0.5">
                    <p className="text-sm font-medium text-zinc-300">{manualMetrics[0]?.label}</p>
                    <p className="text-[10px] text-zinc-500 uppercase tracking-widest">
                        Day {currentGlobalDay} <span className="text-zinc-600">of {totalDuration}</span>
                    </p>
                </div>

                <div className="w-full relative group">
                    <Input
                        type="number"
                        autoFocus={false}
                        className="h-10 text-center bg-zinc-900/50 border-zinc-800 text-lg font-bold text-white focus:border-indigo-500/50 transition-all"
                        placeholder="0"
                        value={formData[manualMetrics[0]?.key] || ''}
                        onChange={(e) => setFormData({ ...formData, [manualMetrics[0]?.key]: e.target.value })}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter') handleLog()
                        }}
                    />
                    {manualMetrics[0]?.suffix && (
                        <span className="absolute right-3 top-2.5 text-xs text-zinc-600 font-medium">
                            {manualMetrics[0].suffix}
                        </span>
                    )}
                </div>

                <Button
                    size="sm"
                    onClick={handleLog}
                    disabled={isLoading || !formData[manualMetrics[0]?.key]}
                    className={cn("w-full h-8 text-xs font-semibold shadow-lg", theme.bg, "hover:opacity-90")}
                >
                    {isLoading ? 'Saving...' : 'Log Entry'}
                </Button>
            </div>
        )
    }

    return (
        <>
            <Link href={`/dashboard/protocols/${protocol.id}`} className="block">
                <Card className="h-[400px] flex flex-col items-center justify-between border border-zinc-800 bg-zinc-900/40 hover:bg-zinc-900/80 transition-all duration-500 rounded-[2rem] overflow-hidden shadow-sm group w-full relative cursor-pointer pt-8 pb-6">

                    {/* Header: Title */}
                    <div className="text-center space-y-1 z-10 w-full px-6">
                        {/* Title */}
                        <div className="flex items-center justify-center gap-2">
                            <h3 className={cn("text-xl font-bold tracking-tight text-zinc-100 group-hover:text-white transition-colors truncate")}>
                                {protocol.title}
                            </h3>
                        </div>
                    </div>

                    {/* Main Circular Visualization */}
                    <div className="flex-1 flex flex-col items-center justify-center w-full relative -mt-4">
                        <div className="relative">
                            {/* Glow Effect behind donut */}
                            <div className={cn("absolute inset-0 opacity-0 group-hover:opacity-20 transition-opacity duration-700 blur-3xl", theme.bg)} />

                            <SegmentedDonut
                                segments={donutSegments}
                                size={260}
                                strokeWidth={12}
                            >
                                {renderCenterContent()}
                            </SegmentedDonut>
                        </div>

                        {/* Insight "Side Graph" - Positioned Absolute Right (Inside Card) */}
                        {insight && (
                            <div className="absolute top-1/2 right-4 -translate-y-1/2 flex items-center z-20 pointer-events-auto">
                                {/* Vertical Text Pill (Expands Left) */}
                                <div className="group/side flex flex-row-reverse items-center justify-start h-40 w-8 rounded-full bg-zinc-900 border border-zinc-800 shadow-xl transition-all duration-300 hover:w-56 hover:h-auto hover:py-4 hover:px-4 cursor-help overflow-hidden relative">

                                    {/* Icon Anchor (Always visible on right) */}
                                    <div className="absolute right-0 top-0 bottom-0 w-8 flex items-center justify-center">
                                        <Sparkles className="w-4 h-4 text-indigo-400 group-hover/side:animate-pulse transition-all" />
                                    </div>

                                    {/* Expanded State: Text (Reveals Left) */}
                                    <div className="opacity-0 group-hover/side:opacity-100 transition-opacity duration-300 w-full pr-8">
                                        <p className="text-xs font-medium text-indigo-100/90 leading-tight text-right">
                                            {insight}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Footer: Quick Stats */}
                    <div className="w-full px-8 flex items-center justify-between text-xs font-medium text-zinc-600">
                        <span className="flex items-center gap-1.5" title="(Logged Days / Total Days) * 100">
                            <Activity className={cn("w-3 h-3", reliability >= 80 ? "text-emerald-500" : "text-amber-500")} />
                            <span className={cn(reliability >= 80 ? "text-emerald-500" : "text-amber-500")}>
                                {reliability}% Adherence
                            </span>
                        </span>

                        <span className={cn(
                            "flex items-center gap-1.5",
                            // Red if < 3 days left, Amber if < 7, else Zinc
                            (protocolData.endDate && (new Date(protocolData.endDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24) < 3) ? "text-rose-500 font-bold" :
                                (protocolData.endDate && (new Date(protocolData.endDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24) < 7) ? "text-amber-500" :
                                    "text-zinc-600"
                        )} title={`Protocol ends on ${protocolData.endDate ? new Date(protocolData.endDate).toLocaleDateString() : '...'}`}>
                            <Database className="w-3 h-3" />
                            {protocolData.endDate ? (() => {
                                const diffTime = new Date(protocolData.endDate).getTime() - new Date().getTime();
                                const daysLeft = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
                                return daysLeft > 0 ? `${daysLeft} Days Left` : 'Ending Soon';
                            })() : '...'}
                        </span>

                        {/* Delete (Hidden trigger) */}
                        <div className="group/del relative">
                            <Trash2
                                className="w-3 h-3 hover:text-red-500 cursor-pointer transition-colors opacity-0 group-hover/del:opacity-50"
                                onClick={(e) => {
                                    e.preventDefault()
                                    setShowDeleteDialog(true)
                                }}
                            />
                        </div>
                    </div>

                </Card>
            </Link>

            <DeleteProtocolDialog
                isOpen={showDeleteDialog}
                onClose={() => setShowDeleteDialog(false)}
                onConfirm={handleDelete}
                protocolTitle={protocol.title}
            />
        </>
    )
}
