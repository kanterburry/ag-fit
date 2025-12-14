'use client'

import { LineChart, Line, ResponsiveContainer, Tooltip } from 'recharts'

export default function VolumeTrends() {
    // Mock data for visual purpose as we don't have historical volume data yet
    const data = [
        { day: 'M', volume: 12 },
        { day: 'T', volume: 15 },
        { day: 'W', volume: 0 },
        { day: 'T', volume: 18 },
        { day: 'F', volume: 14 },
        { day: 'S', volume: 22 },
        { day: 'S', volume: 10 },
    ]

    return (
        <div className="h-full w-full p-4 bg-zinc-900/30 rounded-2xl border border-zinc-800/50">
            <h2 className="text-zinc-400 text-xs font-mono uppercase tracking-wider mb-4">Volume Trend</h2>
            <div className="h-[100px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={data}>
                        <Tooltip
                            contentStyle={{ backgroundColor: '#18181b', borderColor: '#27272a', borderRadius: '8px' }}
                            itemStyle={{ color: '#a855f7' }}
                            cursor={false}
                        />
                        <Line
                            type="monotone"
                            dataKey="volume"
                            stroke="#a855f7"
                            strokeWidth={2}
                            dot={false}
                        />
                    </LineChart>
                </ResponsiveContainer>
            </div>
        </div>
    )
}
