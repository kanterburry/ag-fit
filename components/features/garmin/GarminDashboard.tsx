
import {
    getGarminDailyMetrics,
    getGarminHRV,
    getGarminWeight,
    getGarminGear,
    getGarminTrainingStatus,
    getGarminTrainingReadiness,
    getGarminWellness,
    getGarminRacePredictions,
    getGarminChallengesAndGoals
} from "@/app/dashboard/actions"
import { SleepCard } from "./SleepCard"
import { HealthMetricsCard } from "./HealthMetricsCard"
import { BodyCompCard } from "./BodyCompCard"
import { GearCard } from "./GearCard"
import { TrainingStatusCard } from "./TrainingStatusCard"
import { ReadinessCard } from "./ReadinessCard"
import { WellnessCard } from "./WellnessCard"
import { PerformanceCard } from "./PerformanceCard"
import { BodyBatteryCard } from "./BodyBatteryCard"

import { Suspense } from "react"
import { Skeleton } from "@/components/ui/skeleton"
import SyncButton from "@/components/dashboard/SyncButton"

async function GarminStats() {
    // Fetch all data in parallel
    const [
        daily,
        hrv,
        weight,
        gear,
        trainingStatus,
        readiness,
        wellness,
        racePredictions,
        challengesAndGoals
    ] = await Promise.all([
        getGarminDailyMetrics(),
        getGarminHRV(),
        getGarminWeight(),
        getGarminGear(),
        getGarminTrainingStatus(),
        getGarminTrainingReadiness(),
        getGarminWellness(),
        getGarminRacePredictions(),
        getGarminChallengesAndGoals()
    ])

    return (
        <div className="space-y-6">
            <div className="flex justify-end items-center gap-2">
                {daily?.updated_at && (
                    <span className="text-[10px] text-zinc-500 font-mono">
                        Last Sync: {new Date(daily.updated_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                )}
                <SyncButton showLabel className="text-xs" />
            </div>

            {/* Core Health Metrics - First Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <HealthMetricsCard daily={daily} hrv={hrv} />
                <SleepCard data={daily} />
                <BodyBatteryCard daily={daily} />
            </div>

            {/* Advanced Training & Performance - Second Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <TrainingStatusCard data={trainingStatus ? {
                    status: trainingStatus.status,
                    vo2MaxRunning: trainingStatus.vo2_max_running,
                    vo2MaxCycling: trainingStatus.vo2_max_cycling,
                    fitnessAge: trainingStatus.fitness_age,
                    lactateThresholdBpm: trainingStatus.lactate_threshold_bpm,
                    lactateThresholdSpeed: trainingStatus.lactate_threshold_speed,
                    enduranceScore: trainingStatus.endurance_score,
                    heatAcclimation: trainingStatus.heat_acclimation,
                    altitudeAcclimation: trainingStatus.altitude_acclimation
                } : undefined} />

                <WellnessCard data={wellness ? {
                    hydrationLiters: wellness.hydration_liters,
                    hydrationGoalLiters: wellness.hydration_goal_liters,
                    bloodPressureSystolic: wellness.blood_pressure_systolic,
                    bloodPressureDiastolic: wellness.blood_pressure_diastolic,
                    bloodPressurePulse: wellness.blood_pressure_pulse,
                    avgSpo2Percentage: wellness.avgSpo2Percentage,
                    avgWakingBreathsPerMinute: wellness.avgWakingBreathsPerMinute,
                    avgSleepingBreathsPerMinute: wellness.avgSleepingBreathsPerMinute
                } : undefined} />

                <PerformanceCard data={{
                    enduranceScore: trainingStatus?.endurance_score,
                    racePredictions: racePredictions?.map(race => ({
                        raceName: race.race_name,
                        predictedTimeSeconds: race.predicted_time_seconds,
                        distanceMeters: race.distance_meters,
                        confidenceScore: race.confidence_score
                    }))
                }} />
            </div>

            {/* Gear - Third Row */}
            <GearCard gear={gear} />
        </div>
    )
}

function LoadingStats() {
    return (
        <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <Skeleton className="h-[200px] w-full bg-white/5 rounded-xl" />
                <Skeleton className="h-[200px] w-full bg-white/5 rounded-xl" />
                <Skeleton className="h-[200px] w-full bg-white/5 rounded-xl" />
                <Skeleton className="h-[200px] w-full bg-white/5 rounded-xl" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <Skeleton className="h-[300px] w-full bg-white/5 rounded-xl" />
                <Skeleton className="h-[300px] w-full bg-white/5 rounded-xl" />
                <Skeleton className="h-[300px] w-full bg-white/5 rounded-xl" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Skeleton className="h-[250px] w-full bg-white/5 rounded-xl" />
                <Skeleton className="h-[250px] w-full bg-white/5 rounded-xl" />
            </div>
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
