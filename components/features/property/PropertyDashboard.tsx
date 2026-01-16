'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Loader2, RefreshCw } from 'lucide-react'
import { syncHDBData, syncURAData, getPropertyData } from '@/app/actions/property'
import { MarketPriceChart } from './MarketPriceChart'

export function PropertyDashboard() {
    const [district, setDistrict] = useState<string>("ALL")
    const [isSyncing, setIsSyncing] = useState(false)
    const [isLoading, setIsLoading] = useState(true)
    const [data, setData] = useState<{ hdb: any[], ura: any[] }>({ hdb: [], ura: [] })

    // Initial Fetch
    useEffect(() => {
        fetchData()
    }, [district])

    async function fetchData() {
        setIsLoading(true)
        const filters = district !== "ALL" ? { district } : undefined
        const res = await getPropertyData(filters)
        setData(res)
        setIsLoading(false)
    }

    async function handleSync() {
        setIsSyncing(true)
        // Run both syncs
        await Promise.all([syncHDBData(), syncURAData()])
        // Refresh view
        await fetchData()
        setIsSyncing(false)
    }

    // Calculate Aggregates
    const hdbAvg = data.hdb.length
        ? (data.hdb.reduce((acc, curr) => acc + curr.resale_price, 0) / data.hdb.length).toFixed(0)
        : 0

    const uraAvg = data.ura.length
        ? (data.ura.reduce((acc, curr) => acc + curr.price, 0) / data.ura.length).toFixed(0)
        : 0

    return (
        <div className="space-y-6">
            {/* CONTROLS */}
            <div className="flex flex-col sm:flex-row gap-4 items-center justify-between bg-card p-4 rounded-lg border shadow-sm">
                <div className="flex items-center gap-4 w-full sm:w-auto">
                    <Select value={district} onValueChange={setDistrict}>
                        <SelectTrigger className="w-[200px]">
                            <SelectValue placeholder="Select District" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="ALL">All Districts</SelectItem>
                            <SelectItem value="01">D01 - Raffles Place</SelectItem>
                            <SelectItem value="09">D09 - Orchard</SelectItem>
                            <SelectItem value="10">D10 - Bukit Timah</SelectItem>
                            <SelectItem value="15">D15 - East Coast</SelectItem>
                            <SelectItem value="19">D19 - Hougang / Punggol</SelectItem>
                            <SelectItem value="20">D20 - Bishan / AMK</SelectItem>
                            {/* Add more as needed */}
                        </SelectContent>
                    </Select>
                </div>

                <Button onClick={handleSync} disabled={isSyncing} variant="outline">
                    {isSyncing ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <RefreshCw className="mr-2 h-4 w-4" />}
                    {isSyncing ? 'Syncing...' : 'Sync Latest Data (Gov.sg)'}
                </Button>
            </div>

            {/* KPI CARDS */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Avg HDB Price</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">${parseInt(hdbAvg as string).toLocaleString()}</div>
                        <p className="text-xs text-muted-foreground">{data.hdb.length} transactions loaded</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Avg Private Price</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">${parseInt(uraAvg as string).toLocaleString()}</div>
                        <p className="text-xs text-muted-foreground">{data.ura.length} transactions loaded</p>
                    </CardContent>
                </Card>
            </div>

            {/* CHARTS */}
            <div className="grid gap-4 md:grid-cols-1 lg:grid-cols-2">
                <Card className="col-span-1">
                    <CardHeader>
                        <CardTitle>District Price Analysis</CardTitle>
                        <CardDescription>Average Transaction Price by District</CardDescription>
                    </CardHeader>
                    <CardContent className="h-[300px]">
                        {isLoading ? <div className="flex h-full items-center justify-center"><Loader2 className="animate-spin" /></div>
                            : <MarketPriceChart hdbData={data.hdb} uraData={data.ura} />}
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
