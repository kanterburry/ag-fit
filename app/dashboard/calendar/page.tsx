import { getProtocolTimelineEvents } from "@/app/actions/protocol-timeline";
import { CalendarView } from "@/components/features/calendar/CalendarView";

export default async function CalendarPage() {
    const protocolEvents = await getProtocolTimelineEvents();

    return (
        <div className="h-full flex flex-col space-y-4">
            <div>
                <h1 className="text-2xl font-bold text-white">Calendar</h1>
                <p className="text-zinc-400">View your protocol timeline and experiments</p>
            </div>
            <CalendarView events={protocolEvents} />
        </div>
    );
}
