
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Battery, Zap } from "lucide-react"

interface BodyBatteryProps {
    daily: {
        body_battery_min?: number | null
        body_battery_max?: number | null
        body_battery_highest_v02?: number | null // checking if this field exists or similar, keeping it simple
    } | null
}

export function BodyBatteryCard({ daily }: BodyBatteryProps) {
    const min = daily?.body_battery_min || 0
    const max = daily?.body_battery_max || 0
    const current = max // Approximate current as max for now if not available, or just show range

    return (
        <Card className="border-zinc-800 bg-zinc-950/50 backdrop-blur-sm h-full">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
                <div className="flex items-center gap-2">
                    <Battery className="h-5 w-5 text-blue-400" />
                    <CardTitle className="text-base font-medium text-slate-200">Body Battery</CardTitle>
                </div>
                <Zap className="h-4 w-4 text-amber-400" />
            </CardHeader>
            <CardContent>
                <div className="flex items-baseline justify-between mb-4">
                    <div>
                        <span className="text-3xl font-bold text-white">{max}</span>
                        <span className="text-sm text-slate-500 ml-1">/ 100</span>
                        <p className="text-xs text-slate-500 mt-1">Peak Today</p>
                    </div>
                    <div className="text-right">
                        <span className="text-xl font-semibold text-slate-400">{min}</span>
                        <p className="text-xs text-slate-500 mt-1">Lowest Point</p>
                    </div>
                </div>

                {/* Visualization */}
                <div className="space-y-2">
                    <div className="flex justify-between text-xs text-slate-500">
                        <span>0</span>
                        <span>50</span>
                        <span>100</span>
                    </div>
                    <div className="h-3 w-full bg-zinc-900 rounded-full overflow-hidden border border-zinc-800 relative">
                        {/* Background ticks */}
                        <div className="absolute left-1/2 top-0 bottom-0 w-px bg-zinc-800/50" />

                        <div
                            className="h-full bg-gradient-to-r from-red-500 via-amber-500 to-emerald-500 opacity-90 transition-all duration-1000"
                            style={{
                                marginLeft: `${min}%`,
                                width: `${Math.max(5, max - min)}%`
                            }}
                        />
                    </div>
                    <p className="text-xs text-center text-slate-500 pt-2">
                        Charged +{(max - min)} pts today
                    </p>
                </div>
            </CardContent>
        </Card>
    )
}
