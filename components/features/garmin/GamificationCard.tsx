"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Trophy, Target, Medal, Flag } from "lucide-react";

interface GamificationCardProps {
    data?: {
        challenges?: Array<{
            challengeId: string;
            name: string;
            type: string;
            status: string;
            endDate?: string;
            progressJson?: any;
        }>;
        goals?: Array<{
            goalId: string;
            name: string;
            type: string;
            status: string;
            targetValue?: number;
            currentValue?: number;
            endDate?: string;
        }>;
    };
}

export function GamificationCard({ data }: GamificationCardProps) {
    if (!data || (!data.challenges?.length && !data.goals?.length)) {
        return (
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Trophy className="h-5 w-5" />
                        Challenges & Goals
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-sm text-muted-foreground">No active challenges or goals</p>
                </CardContent>
            </Card>
        );
    }

    const getStatusBadge = (status: string) => {
        switch (status.toLowerCase()) {
            case 'active':
            case 'in_progress':
                return <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded">Active</span>;
            case 'completed':
                return <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded">Completed</span>;
            case 'available':
                return <span className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded">Available</span>;
            default:
                return <span className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded">{status}</span>;
        }
    };

    const activeChallenges = data.challenges?.filter(c => c.status.toLowerCase() === 'active' || c.status.toLowerCase() === 'in_progress') || [];
    const activeGoals = data.goals?.filter(g => g.status.toLowerCase() === 'active') || [];

    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <Trophy className="h-5 w-5" />
                    Challenges & Goals
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                {/* Active Challenges */}
                {activeChallenges.length > 0 && (
                    <div className="space-y-2">
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Medal className="h-4 w-4" />
                            <span>Active Challenges ({activeChallenges.length})</span>
                        </div>
                        <div className="space-y-2">
                            {activeChallenges.slice(0, 3).map((challenge) => (
                                <div
                                    key={challenge.challengeId}
                                    className="bg-muted/50 p-3 rounded space-y-1"
                                >
                                    <div className="flex justify-between items-start">
                                        <div className="font-semibold text-sm">{challenge.name}</div>
                                        {getStatusBadge(challenge.status)}
                                    </div>
                                    <div className="text-xs text-muted-foreground capitalize">
                                        {challenge.type}
                                    </div>
                                    {challenge.endDate && (
                                        <div className="text-xs text-muted-foreground">
                                            Ends: {new Date(challenge.endDate).toLocaleDateString()}
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Active Goals */}
                {activeGoals.length > 0 && (
                    <div className="space-y-2">
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Target className="h-4 w-4" />
                            <span>Active Goals ({activeGoals.length})</span>
                        </div>
                        <div className="space-y-2">
                            {activeGoals.slice(0, 3).map((goal) => (
                                <div
                                    key={goal.goalId}
                                    className="bg-muted/50 p-3 rounded space-y-2"
                                >
                                    <div className="flex justify-between items-start">
                                        <div className="font-semibold text-sm">{goal.name}</div>
                                        <Flag className="h-4 w-4 text-muted-foreground" />
                                    </div>
                                    {goal.currentValue !== undefined && goal.targetValue !== undefined && (
                                        <>
                                            <div className="flex justify-between text-xs">
                                                <span>{goal.currentValue.toLocaleString()}</span>
                                                <span className="text-muted-foreground">/ {goal.targetValue.toLocaleString()}</span>
                                            </div>
                                            <div className="w-full bg-muted rounded-full h-2">
                                                <div
                                                    className="bg-green-600 h-2 rounded-full transition-all"
                                                    style={{
                                                        width: `${Math.min((goal.currentValue / goal.targetValue) * 100, 100)}%`
                                                    }}
                                                />
                                            </div>
                                        </>
                                    )}
                                    {goal.endDate && (
                                        <div className="text-xs text-muted-foreground">
                                            Target: {new Date(goal.endDate).toLocaleDateString()}
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Show totals if there are more */}
                {(activeChallenges.length > 3 || activeGoals.length > 3) && (
                    <div className="text-xs text-center text-muted-foreground">
                        +{Math.max(0, activeChallenges.length - 3 + activeGoals.length - 3)} more
                    </div>
                )}
            </CardContent>
        </Card>
    );
}
