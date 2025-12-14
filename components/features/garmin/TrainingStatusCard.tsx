"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Activity, TrendingUp, Flame, Mountain } from "lucide-react";

interface TrainingStatusCardProps {
    data?: {
        status?: string;
        vo2MaxRunning?: number;
        vo2MaxCycling?: number;
        fitnessAge?: number;
        lactateThresholdBpm?: number;
        lactateThresholdSpeed?: number;
        enduranceScore?: number;
        heatAcclimation?: number;
        altitudeAcclimation?: number;
    };
}

export function TrainingStatusCard({ data }: TrainingStatusCardProps) {
    if (!data) {
        return (
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Activity className="h-5 w-5" />
                        Training Status
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-sm text-muted-foreground">No training data available</p>
                </CardContent>
            </Card>
        );
    }

    const getStatusColor = (status?: string) => {
        switch (status?.toLowerCase()) {
            case 'productive':
                return 'text-green-600';
            case 'maintaining':
                return 'text-blue-600';
            case 'peaking':
                return 'text-purple-600';
            case 'recovery':
                return 'text-yellow-600';
            case 'unproductive':
                return 'text-orange-600';
            case 'detraining':
                return 'text-red-600';
            default:
                return 'text-gray-600';
        }
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <Activity className="h-5 w-5" />
                    Training Status
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                {/* Training Status */}
                {data.status && (
                    <div className="flex justify-between items-center">
                        <span className="text-sm text-muted-foreground">Status</span>
                        <span className={`text-sm font-semibold ${getStatusColor(data.status)}`}>
                            {data.status}
                        </span>
                    </div>
                )}

                {/* VO2 Max */}
                <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <TrendingUp className="h-4 w-4" />
                        <span>VO2 Max</span>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                        {data.vo2MaxRunning && (
                            <div className="bg-muted/50 p-2 rounded">
                                <div className="text-xs text-muted-foreground">Running</div>
                                <div className="text-lg font-bold">{data.vo2MaxRunning}</div>
                                <div className="text-xs text-muted-foreground">ml/kg/min</div>
                            </div>
                        )}
                        {data.vo2MaxCycling && (
                            <div className="bg-muted/50 p-2 rounded">
                                <div className="text-xs text-muted-foreground">Cycling</div>
                                <div className="text-lg font-bold">{data.vo2MaxCycling}</div>
                                <div className="text-xs text-muted-foreground">ml/kg/min</div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Fitness Age */}
                {data.fitnessAge && (
                    <div className="flex justify-between items-center">
                        <span className="text-sm text-muted-foreground">Fitness Age</span>
                        <span className="text-2xl font-bold">{Math.round(data.fitnessAge)}</span>
                    </div>
                )}

                {/* Lactate Threshold */}
                {(data.lactateThresholdBpm || data.lactateThresholdSpeed) && (
                    <div className="space-y-2">
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Flame className="h-4 w-4" />
                            <span>Lactate Threshold</span>
                        </div>
                        <div className="grid grid-cols-2 gap-2">
                            {data.lactateThresholdBpm && (
                                <div className="bg-muted/50 p-2 rounded">
                                    <div className="text-xs text-muted-foreground">Heart Rate</div>
                                    <div className="text-lg font-bold">{data.lactateThresholdBpm}</div>
                                    <div className="text-xs text-muted-foreground">bpm</div>
                                </div>
                            )}
                            {data.lactateThresholdSpeed && (
                                <div className="bg-muted/50 p-2 rounded">
                                    <div className="text-xs text-muted-foreground">Speed</div>
                                    <div className="text-lg font-bold">{data.lactateThresholdSpeed.toFixed(1)}</div>
                                    <div className="text-xs text-muted-foreground">km/h</div>
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {/* Endurance Score */}
                {data.enduranceScore && (
                    <div className="flex justify-between items-center">
                        <span className="text-sm text-muted-foreground">Endurance Score</span>
                        <span className="text-2xl font-bold">{data.enduranceScore}</span>
                    </div>
                )}

                {/* Acclimation */}
                {(data.heatAcclimation || data.altitudeAcclimation) && (
                    <div className="space-y-2">
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Mountain className="h-4 w-4" />
                            <span>Acclimation</span>
                        </div>
                        <div className="grid grid-cols-2 gap-2">
                            {data.heatAcclimation !== undefined && (
                                <div className="bg-muted/50 p-2 rounded">
                                    <div className="text-xs text-muted-foreground">Heat</div>
                                    <div className="text-lg font-bold">{data.heatAcclimation}%</div>
                                </div>
                            )}
                            {data.altitudeAcclimation !== undefined && (
                                <div className="bg-muted/50 p-2 rounded">
                                    <div className="text-xs text-muted-foreground">Altitude</div>
                                    <div className="text-lg font-bold">{data.altitudeAcclimation}%</div>
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </CardContent>
        </Card>
    );
}
