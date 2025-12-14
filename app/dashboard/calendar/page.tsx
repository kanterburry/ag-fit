import { getUpcomingWorkouts } from "@/app/dashboard/actions";
import { CalendarView } from "@/components/features/calendar/CalendarView";

export default async function CalendarPage() {
    const workoutsData = await getUpcomingWorkouts();

    // Transform data for calendar
    const events = workoutsData?.map((w: any) => ({
        date: new Date(w.start_time),
        type: 'workout',
        title: w.title
    })) || [];

    return (
        <div className="h-full flex flex-col space-y-4">
            <div>
                <h1 className="text-2xl font-bold text-white">Calendar</h1>
                <p className="text-zinc-400">View your training schedule</p>
            </div>
            <CalendarView events={events} />
        </div>
    );
}
