'use client'

import { useState } from 'react'
import { motion, PanInfo, useAnimation } from 'framer-motion'
import { Check, Clock, Calendar, AlertCircle } from 'lucide-react'
import { completeWorkout } from '@/app/dashboard/actions'
import { format } from 'date-fns'

type Workout = {
    id: number
    title: string
    start_time: string
    is_completed: boolean | null
    notification_sent: boolean | null
}

export default function ActiveTimeline({ workouts }: { workouts: Workout[] }) {
    if (!workouts || workouts.length === 0) {
        return (
            <div className="text-zinc-500 text-sm italic text-center py-8">
                No workouts scheduled for today.
            </div>
        )
    }

    return (
        <div className="flex flex-col gap-3">
            <h2 className="text-zinc-400 text-xs font-mono uppercase tracking-wider mb-2">Today's Schedule</h2>
            {workouts.map((workout) => (
                <TimelineItem key={workout.id} workout={workout} />
            ))}
        </div>
    )
}

function TimelineItem({ workout }: { workout: Workout }) {
    const [completed, setCompleted] = useState(workout.is_completed)
    const controls = useAnimation()

    const handleDragEnd = async (event: any, info: PanInfo) => {
        if (info.offset.x > 100) {
            // Complete trigger
            setCompleted(true)
            await completeWorkout(workout.id)
        } else {
            controls.start({ x: 0 })
        }
    }

    const startTime = new Date(workout.start_time)
    const isPast = new Date() > startTime && !completed

    return (
        <div className="relative h-20 w-full overflow-hidden rounded-xl bg-zinc-900 border border-zinc-800">
            {/* Background Actions */}
            <div className="absolute inset-0 flex items-center justify-start px-4 bg-green-500/20">
                <Check className="text-green-500" />
                <span className="ml-2 text-green-500 font-mono text-xs uppercase">Completed</span>
            </div>

            {/* Swipeable Card */}
            <motion.div
                drag="x"
                dragConstraints={{ left: 0, right: 300 }}
                dragElastic={0.1}
                onDragEnd={handleDragEnd}
                animate={controls}
                className={`absolute inset-0 flex items-center justify-between px-4 bg-zinc-950 border border-zinc-800 z-10 transition-colors ${completed ? 'border-green-500/50' : ''}`}
                style={{ x: 0 }}
            >
                <div className="flex items-center gap-4">
                    <div className={`p-2 rounded-full ${completed ? 'bg-green-500/20 text-green-500' : isPast ? 'bg-red-500/20 text-red-500' : 'bg-purple-500/20 text-purple-500'}`}>
                        {completed ? <Check size={18} /> : isPast ? <AlertCircle size={18} /> : <Calendar size={18} />}
                    </div>
                    <div>
                        <h3 className={`font-medium ${completed ? 'text-zinc-500 line-through' : 'text-white'}`}>{workout.title}</h3>
                        <div className="flex items-center gap-2 text-xs text-zinc-500 font-mono">
                            <Clock size={12} />
                            {format(startTime, 'h:mm a')}
                        </div>
                    </div>
                </div>

                {!completed && (
                    <div className="text-zinc-600 text-xs font-mono uppercase tracking-widest opacity-50">
                        Slide &gt;&gt;
                    </div>
                )}
            </motion.div>
        </div>
    )
}
