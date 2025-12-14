"use client";

import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";

interface VolumeChartProps {
    data: { date: string; volume: number }[];
}

export default function VolumeChart({ data }: VolumeChartProps) {
    if (!data || data.length === 0) {
        return (
            <div className="flex h-64 items-center justify-center rounded-xl bg-slate-900 border border-slate-800">
                <p className="text-slate-500">No volume data yet</p>
            </div>
        );
    }

    return (
        <div className="h-64 w-full rounded-xl bg-slate-900 border border-slate-800 p-4">
            <h3 className="mb-4 text-sm font-medium text-slate-400">Weekly Volume (kg)</h3>
            <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
                    <XAxis
                        dataKey="date"
                        stroke="#94a3b8"
                        fontSize={12}
                        tickLine={false}
                        axisLine={false}
                    />
                    <Tooltip
                        contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155', color: '#fff' }}
                        cursor={{ fill: '#334155', opacity: 0.4 }}
                    />
                    <Bar
                        dataKey="volume"
                        fill="#22c55e"
                        radius={[4, 4, 0, 0]}
                        maxBarSize={50}
                    />
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
}
