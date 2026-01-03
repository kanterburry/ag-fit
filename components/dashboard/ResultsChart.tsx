'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'

type Props = {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    protocolData: any;
    maxItems?: number;
}

export function ResultsChart({ protocolData, maxItems }: Props) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { logs = [], metrics = [], protocol } = protocolData || {}

    if (!protocolData || !protocol) return null;

    // Find template to get metric configs
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const PROTOCOL_TEMPLATES = require('@/lib/protocols/templates').PROTOCOL_TEMPLATES
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const template = PROTOCOL_TEMPLATES.find((t: any) => t.title === protocol.title) || PROTOCOL_TEMPLATES[0]

    const displayMetrics = maxItems ? template.metrics.slice(0, maxItems) : template.metrics;

    // Create a map of date -> data object
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const mergedData = new Map<string, any>()

    // Helper to add data
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const addData = (date: string, key: string, value: any) => {
        const existing = mergedData.get(date) || { date }

        // Handle "250 mg" strings by parsing float, or keep as is
        const numericValue = typeof value === 'string' ? parseFloat(value.replace(/[^0-9.]/g, '')) : value
        // If NaN (e.g. text note), ignore for chart, but keep for record? For now assumes numbers.
        const finalValue = isNaN(numericValue) ? value : numericValue

        mergedData.set(date, { ...existing, [key]: finalValue })
    }

    // Process Manual Logs
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    logs.forEach((log: any) => {
        if (log.data) {
            Object.entries(log.data).forEach(([k, v]) => addData(log.date, k, v))
        }
    })

    // Process Metrics
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    metrics.forEach((m: any) => {
        const { date, user_id, id, created_at, ...values } = m
        Object.entries(values).forEach(([k, v]) => {
            if (v !== null) addData(date, k, v)
        })
    })

    const chartData = Array.from(mergedData.values()).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())

    // Define colors for lines
    const colors = ['#34d399', '#818cf8', '#fbbf24', '#f472b6']

    if (chartData.length === 0) {
        return (
            <Card className="border-slate-800 bg-transparent shadow-none border-none">
                <CardContent className="h-[100px] w-full flex items-center justify-center text-zinc-500 text-sm">
                    No trend data available yet.
                </CardContent>
            </Card>
        )
    }

    return (
        <div className="space-y-2 pt-2">
            {/* Ultra-Compact Micro-Charts */}
            {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
            {displayMetrics.map((m: any, i: number) => {
                const latestData = chartData[chartData.length - 1]
                const latestVal = latestData ? latestData[m.key] : '-'
                const color = colors[i % colors.length]

                return (
                    <div key={m.key} className="flex items-center justify-between p-3 rounded-lg bg-zinc-900/40 border border-zinc-800/50 h-20">
                        {/* Left: Label & Value */}
                        <div className="flex flex-col justify-center min-w-[100px]">
                            <div className="flex items-center gap-2 mb-1">
                                <span className="w-1.5 h-1.5 rounded-full shrink-0" style={{ backgroundColor: color }} />
                                <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest truncate max-w-[90px]">{m.label}</span>
                            </div>
                            <div className="flex items-baseline gap-1">
                                <span className="text-lg font-bold text-zinc-200">
                                    {typeof latestVal === 'number' ? latestVal.toLocaleString() : latestVal}
                                </span>
                                <span className="text-[10px] font-medium text-zinc-500">{m.suffix}</span>
                            </div>
                        </div>

                        {/* Right: Micro Sparkline */}
                        <div className="h-full w-[100px] py-1">
                            <ResponsiveContainer width="100%" height="100%">
                                <LineChart data={chartData}>
                                    <Line
                                        type="monotone"
                                        dataKey={m.key}
                                        stroke={color}
                                        strokeWidth={2}
                                        dot={false}
                                        isAnimationActive={false}
                                        connectNulls
                                    />
                                </LineChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                )
            })}
        </div>
    )
}
