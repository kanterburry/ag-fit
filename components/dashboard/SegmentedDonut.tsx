'use client'

import { cn } from '@/lib/utils'
import { motion } from 'framer-motion'

export interface DonutSegment {
    status: 'completed' | 'missed' | 'future' | 'active'
    color?: string // Tailwind text color class
}

interface SegmentedDonutProps {
    segments: DonutSegment[]
    size?: number
    strokeWidth?: number
    children?: React.ReactNode
    className?: string
}

export function SegmentedDonut({
    segments = [],
    size = 280,
    strokeWidth = 20,
    children,
    className,
}: SegmentedDonutProps) {
    const center = size / 2
    const radius = (size - strokeWidth) / 2
    const circumference = 2 * Math.PI * radius

    // Calculate gap size based on total segments
    const totalSegments = segments.length || 1
    const gapPercent = 0.015
    const segmentLength = (1 - (totalSegments * gapPercent)) / totalSegments
    const visibleDash = circumference * segmentLength

    const renderSegments = segments.map((seg, i) => {
        const rotate = (i * (360 / totalSegments)) - 90
        return { index: i, rotate, ...seg }
    })

    return (
        <div
            className={cn("relative flex items-center justify-center", className)}
            style={{ width: size, height: size }}
        >
            <svg
                width={size}
                height={size}
                className="transform rotate-0"
            >
                {renderSegments.map((s) => {
                    // Determine Color: Prioritize explicit color prop, else defaults
                    let segmentColor = "text-zinc-800"
                    if (s.color) {
                        segmentColor = s.color
                    } else if (s.status === 'completed') {
                        segmentColor = "text-emerald-500"
                    } else if (s.status === 'active') {
                        segmentColor = "text-white"
                    }

                    return (
                        <motion.circle
                            key={s.index}
                            cx={center}
                            cy={center}
                            r={radius}
                            fill="none"
                            stroke="currentColor"
                            strokeWidth={strokeWidth}
                            strokeDasharray={`${visibleDash} ${circumference - visibleDash}`}
                            strokeLinecap="round"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: s.index * 0.005 }}
                            className={cn(
                                "origin-center transition-all duration-500",
                                segmentColor,
                                s.status === 'active' && "animate-pulse"
                            )}
                            style={{
                                transform: `rotate(${s.rotate}deg)`,
                                transformOrigin: '50% 50%'
                            }}
                        />
                    )
                })}
            </svg>

            {/* Inner Content Layer */}
            <div className="absolute inset-0 flex flex-col items-center justify-center z-10 p-8 text-center">
                {children}
            </div>
        </div>
    )
}
