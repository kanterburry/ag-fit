'use client'

import { Bar, BarChart, CartesianGrid, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from 'recharts'

interface Props {
    hdbData: any[]
    uraData: any[]
}

export function MarketPriceChart({ hdbData, uraData }: Props) {
    // Aggregate data by district for the chart
    // This logic ideally happens on server or in a hook, but keeping it simple for MVP

    const hdbByDist = hdbData.reduce((acc, curr) => {
        const d = curr.district_code || 'Unk'
        if (!acc[d]) acc[d] = { count: 0, sum: 0 }
        acc[d].count += 1
        acc[d].sum += curr.resale_price
        return acc
    }, {} as Record<string, { count: number, sum: number }>)

    const uraByDist = uraData.reduce((acc, curr) => {
        const d = curr.district_code || 'Unk'
        if (!acc[d]) acc[d] = { count: 0, sum: 0 }
        acc[d].count += 1
        acc[d].sum += curr.price
        return acc
    }, {} as Record<string, { count: number, sum: number }>)

    const allDistricts = Array.from(new Set([...Object.keys(hdbByDist), ...Object.keys(uraByDist)])).sort()

    const chartData = allDistricts.map(d => ({
        name: `D${d}`,
        HDB: hdbByDist[d] ? Math.round(hdbByDist[d].sum / hdbByDist[d].count) : 0,
        Private: uraByDist[d] ? Math.round(uraByDist[d].sum / uraByDist[d].count) : 0,
    }))

    if (chartData.length === 0) return <div className="flex items-center justify-center h-full text-muted-foreground">No data available. Try Syncing.</div>

    return (
        <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" fontSize={12} />
                <YAxis fontSize={12} tickFormatter={(value) => `$${value / 1000}k`} />
                <Tooltip formatter={(value) => `$${Number(value).toLocaleString()}`} />
                <Legend />
                <Bar dataKey="HDB" fill="#8884d8" name="HDB Resale" />
                <Bar dataKey="Private" fill="#82ca9d" name="Private" />
            </BarChart>
        </ResponsiveContainer>
    )
}
