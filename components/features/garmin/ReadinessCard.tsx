"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Battery, Clock } from "lucide-react";

interface ReadinessCardProps {
    data?: {
        score?: number;
        rating?: string;
        recoveryTimeHours?: number;
    };
}

export function ReadinessCard({ data }: ReadinessCardProps) {
    if (!data || !data.score) {
        return (
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Battery className="h-5 w-5" />
                        Training Readiness
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-sm text-muted-foreground">No readiness data available</p>
                </CardContent>
            </Card>
        );
    }

    const getReadinessColor = (score: number) => {
        if (score >= 80) return 'text-green-600';
        if (score >= 60) return 'text-blue-600';
        if (score >= 40) return 'text-yellow-600';
        if (score >= 20) return 'text-orange-600';
        return 'text-red-600';
    };

    const getReadinessRingColor = (score: number) => {
        if (score >= 80) return 'stroke-green-600';
        if (score >= 60) return 'stroke-blue-600';
        if (score >= 40) return 'stroke-yellow-600';
        if (score >= 20) return 'stroke-orange-600';
        return 'stroke-red-600';
    };

    // Calculate circumference for SVG circle
    const radius = 70;
    const circumference = 2 * Math.PI * radius;
    const strokeDashoffset = circumference - (data.score / 100) * circumference;

    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <Battery className="h-5 w-5" />
                    Training Readiness
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                {/* Radial Gauge */}
                <div className="flex justify-center items-center">
                    <div className="relative w-40 h-40">
                        <svg className="w-full h-full -rotate-90" viewBox="0 0 160 160">
                            {/* Background circle */}
                            <circle
                                cx="80"
                                cy="80"
                                r={radius}
                                stroke="currentColor"
                                strokeWidth="12"
                                fill="none"
                                className="text-muted"
                                opacity="0.2"
                            />
                            {/* Progress circle */}
                            <circle
                                cx="80"
                                cy="80"
                                r={radius}
                                stroke="currentColor"
                                strokeWidth="12"
                                fill="none"
                                strokeLinecap="round"
                                className={getReadinessRingColor(data.score)}
                                style={{
                                    strokeDasharray: circumference,
                                    strokeDashoffset: strokeDashoffset,
                                    transition: 'stroke-dashoffset 0.5s ease'
                                }}
                            />
                        </svg>
                        {/* Center text */}
                        <div className="absolute inset-0 flex flex-col items-center justify-center">
                            <div className={`text-4xl font-bold ${getReadinessColor(data.score)}`}>
                                {data.score}
                            </div>
                            {data.rating && (
                                <div className="text-xs text-muted-foreground uppercase">
                                    {data.rating}
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Recovery Time */}
                {data.recoveryTimeHours !== undefined && data.recoveryTimeHours > 0 && (
                    <div className="flex items-center justify-between bg-muted/50 p-3 rounded">
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Clock className="h-4 w-4" />
                            <span>Recovery Time</span>
                        </div>
                        <div className="text-lg font-bold">
                            {data.recoveryTimeHours}h
                        </div>
                    </div>
                )}
            </CardContent>
        </Card>
    );
}
