"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Trophy, Mountain, Timer } from "lucide-react";

interface PerformanceCardProps {
    data?: {
        enduranceScore?: number;
        hillScore?: number;
        racePredictions?: Array<{
            raceName: string;
            predictedTimeSeconds: number;
            distanceMeters: number;
            confidenceScore?: number;
        }>;
    };
}

export function PerformanceCard({ data }: PerformanceCardProps) {
    if (!data) {
        return (
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Trophy className="h-5 w-5" />
                        Performance
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-sm text-muted-foreground">No performance data available</p>
                </CardContent>
            </Card>
        );
    }

    const formatTime = (seconds: number) => {
        const hours = Math.floor(seconds / 3600);
        const minutes = Math.floor((seconds % 3600) / 60);
        const secs = seconds % 60;
        if (hours > 0) {
            return `${hours}:${String(minutes).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
        }
        return `${minutes}:${String(secs).padStart(2, '0')}`;
    };

    const formatDistance = (meters: number) => {
        const km = meters / 1000;
        if (km >= 1) return `${km.toFixed(1)}km`;
        return `${Math.round(meters)}m`;
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <Trophy className="h-5 w-5" />
                    Performance
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                {/* Scores */}
                <div className="grid grid-cols-2 gap-2">
                    {data.enduranceScore !== undefined && (
                        <div className="bg-muted/50 p-3 rounded">
                            <div className="text-xs text-muted-foreground mb-1">Endurance</div>
                            <div className="text-2xl font-bold">{data.enduranceScore}</div>
                        </div>
                    )}
                    {data.hillScore !== undefined && (
                        <div className="bg-muted/50 p-3 rounded">
                            <div className="flex items-center gap-1 text-xs text-muted-foreground mb-1">
                                <Mountain className="h-3 w-3" />
                                <span>Hill Score</span>
                            </div>
                            <div className="text-2xl font-bold">{data.hillScore}</div>
                        </div>
                    )}
                </div>

                {/* Race Predictions */}
                {data.racePredictions && data.racePredictions.length > 0 && (
                    <div className="space-y-2">
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Timer className="h-4 w-4" />
                            <span>Race Predictions</span>
                        </div>
                        <div className="space-y-2">
                            {data.racePredictions.map((race, idx) => (
                                <div
                                    key={idx}
                                    className="flex justify-between items-center bg-muted/50 p-3 rounded"
                                >
                                    <div>
                                        <div className="font-semibold">{race.raceName}</div>
                                        <div className="text-xs text-muted-foreground">
                                            {formatDistance(race.distanceMeters)}
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <div className="text-lg font-bold">
                                            {formatTime(race.predictedTimeSeconds)}
                                        </div>
                                        {race.confidenceScore && (
                                            <div className="text-xs text-muted-foreground">
                                                {Math.round(race.confidenceScore * 100)}% confidence
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </CardContent>
        </Card>
    );
}
