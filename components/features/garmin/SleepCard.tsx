
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Moon, Clock, Brain } from "lucide-react"

interface SleepProps {
    data: {
        sleep_score?: number | null
        sleep_seconds?: number | null
        deep_sleep_seconds?: number | null
        rem_sleep_seconds?: number | null
        light_sleep_seconds?: number | null
    } | null
}

export function SleepCard({ data }: SleepProps) {
    if (!data) return (
        <Card className="glass-card">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Sleep Score</CardTitle>
                <Moon className="h-4 w-4 text-purple-400" />
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-bold">--</div>
                <p className="text-xs text-muted-foreground">No sleep data tracked</p>
            </CardContent>
        </Card>
    )

    const hours = Math.floor((data.sleep_seconds || 0) / 3600)
    const minutes = Math.floor(((data.sleep_seconds || 0) % 3600) / 60)

    // Stages percentages
    const total = data.sleep_seconds || 1
    const deepPct = Math.round(((data.deep_sleep_seconds || 0) / total) * 100)
    const remPct = Math.round(((data.rem_sleep_seconds || 0) / total) * 100)
    const lightPct = Math.round(((data.light_sleep_seconds || 0) / total) * 100)

    return (
        <Card className="glass-card relative overflow-hidden">
            <div className="absolute top-0 right-0 p-3 opacity-10 pointer-events-none">
                <Moon className="h-24 w-24" />
            </div>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Sleep Quality</CardTitle>
                <Moon className="h-4 w-4 text-purple-400" />
            </CardHeader>
            <CardContent>
                <div className="flex items-end justify-between">
                    <div>
                        <div className="text-3xl font-bold text-gradient-purple">{data.sleep_score || '--'}</div>
                        <p className="text-xs text-muted-foreground">Score</p>
                    </div>
                    <div className="text-right">
                        <div className="text-xl font-semibold">{hours}h {minutes}m</div>
                        <p className="text-xs text-muted-foreground">Duration</p>
                    </div>
                </div>

                <div className="mt-4 flex h-2 w-full rounded-full bg-white/10 overflow-hidden">
                    <div className="bg-blue-600 h-full" style={{ width: `${deepPct}%` }} title="Deep" />
                    <div className="bg-indigo-500 h-full" style={{ width: `${lightPct}%` }} title="Light" />
                    <div className="bg-purple-500 h-full" style={{ width: `${remPct}%` }} title="REM" />
                </div>
                <div className="flex justify-between mt-1 text-[10px] text-muted-foreground">
                    <span>Deep {deepPct}%</span>
                    <span>Light {lightPct}%</span>
                    <span>REM {remPct}%</span>
                </div>
            </CardContent>
        </Card>
    )
}
