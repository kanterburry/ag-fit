
import { getGarminDailyMetrics, getGarminHRV, getGarminWeight, getGarminGear } from "@/app/dashboard/actions"
import { SleepCard } from "./SleepCard"
import { HealthMetricsCard } from "./HealthMetricsCard"
import { BodyCompCard } from "./BodyCompCard"
import { GearCard } from "./GearCard"
import { Suspense } from "react"
import { Skeleton } from "@/components/ui/skeleton"

async function GarminStats() {
    // Fetch data in parallel
    const [daily, hrv, weight, gear] = await Promise.all([
        getGarminDailyMetrics(),
        getGarminHRV(),
        getGarminWeight(),
        getGarminGear()
    ])

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <HealthMetricsCard daily={daily} hrv={hrv} />
            <SleepCard data={daily} />
            <BodyCompCard data={weight} />
            <GearCard gear={gear} />
        </div>
    )
}

function LoadingStats() {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <Skeleton className="h-[200px] w-full bg-white/5 rounded-xl" />
            <Skeleton className="h-[200px] w-full bg-white/5 rounded-xl" />
            <Skeleton className="h-[200px] w-full bg-white/5 rounded-xl" />
            <Skeleton className="h-[200px] w-full bg-white/5 rounded-xl" />
        </div>
    )
}

export function GarminDashboard() {
    return (
        <Suspense fallback={<LoadingStats />}>
            <GarminStats />
        </Suspense>
    )
}
