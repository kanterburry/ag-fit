"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Heart, Droplets, Wind, ActivityIcon } from "lucide-react";

interface WellnessCardProps {
    data?: {
        hydrationLiters?: number;
        hydrationGoalLiters?: number;
        bloodPressureSystolic?: number;
        bloodPressureDiastolic?: number;
        bloodPressurePulse?: number;
        avgSpo2Percentage?: number;
        avgWakingBreathsPerMinute?: number;
        avgSleepingBreathsPerMinute?: number;
    };
}

export function WellnessCard({ data }: WellnessCardProps) {
    if (!data) {
        return (
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Heart className="h-5 w-5" />
                        Wellness
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-sm text-muted-foreground">No wellness data available</p>
                </CardContent>
            </Card>
        );
    }

    const getBPCategory = (systolic?: number, diastolic?: number) => {
        if (!systolic || !diastolic) return null;
        if (systolic >= 140 || diastolic >= 90) return { label: 'High', color: 'text-red-600' };
        if (systolic >= 130 || diastolic >= 80) return { label: 'Elevated', color: 'text-orange-600' };
        if (systolic >= 120 || diastolic >= 80) return { label: 'Elevated', color: 'text-yellow-600' };
        return { label: 'Normal', color: 'text-green-600' };
    };

    const getSpo2Color = (spo2?: number) => {
        if (!spo2) return 'text-gray-600';
        if (spo2 >= 95) return 'text-green-600';
        if (spo2 >= 90) return 'text-yellow-600';
        return 'text-red-600';
    };

    const bpCategory = getBPCategory(data.bloodPressureSystolic, data.bloodPressureDiastolic);

    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <Heart className="h-5 w-5" />
                    Wellness
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                {/* Hydration Removed */
                /* data.hydrationLiters !== undefined && ( ... ) */}

                {/* Blood Pressure */}
                {(data.bloodPressureSystolic || data.bloodPressureDiastolic) && (
                    <div className="space-y-2">
                        <div className="flex items-center gap-2  text-sm text-muted-foreground">
                            <Heart className="h-4 w-4" />
                            <span>Blood Pressure</span>
                        </div>
                        <div className="bg-muted/50 p-3 rounded space-y-1">
                            <div className="flex justify-between items-center">
                                <div className="text-2xl font-bold">
                                    {data.bloodPressureSystolic}/{data.bloodPressureDiastolic}
                                </div>
                                {bpCategory && (
                                    <span className={`text-sm font-semibold ${bpCategory.color}`}>
                                        {bpCategory.label}
                                    </span>
                                )}
                            </div>
                            {data.bloodPressurePulse && (
                                <div className="text-sm text-muted-foreground">
                                    Pulse: {data.bloodPressurePulse} bpm
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {/* SpO2 */}
                {data.avgSpo2Percentage && (
                    <div className="flex justify-between items-center bg-muted/50 p-3 rounded">
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <ActivityIcon className="h-4 w-4" />
                            <span>Blood Oxygen (SpO2)</span>
                        </div>
                        <div className={`text-2xl font-bold ${getSpo2Color(data.avgSpo2Percentage)}`}>
                            {data.avgSpo2Percentage?.toFixed(1) ?? '0.0'}%
                        </div>
                    </div>
                )}

                {/* Respiration */}
                {(data.avgWakingBreathsPerMinute || data.avgSleepingBreathsPerMinute) && (
                    <div className="space-y-2">
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Wind className="h-4 w-4" />
                            <span>Respiration Rate</span>
                        </div>
                        <div className="grid grid-cols-2 gap-2">
                            {data.avgWakingBreathsPerMinute && (
                                <div className="bg-muted/50 p-2 rounded">
                                    <div className="text-xs text-muted-foreground">Waking</div>
                                    <div className="text-lg font-bold">{data.avgWakingBreathsPerMinute?.toFixed(1) ?? '0.0'}</div>
                                    <div className="text-xs text-muted-foreground">breaths/min</div>
                                </div>
                            )}
                            {data.avgSleepingBreathsPerMinute && (
                                <div className="bg-muted/50 p-2 rounded">
                                    <div className="text-xs text-muted-foreground">Sleeping</div>
                                    <div className="text-lg font-bold">{data.avgSleepingBreathsPerMinute?.toFixed(1) ?? '0.0'}</div>
                                    <div className="text-xs text-muted-foreground">breaths/min</div>
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </CardContent>
        </Card>
    );
}
