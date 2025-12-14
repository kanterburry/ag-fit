import { getAllActivities } from "@/app/dashboard/actions";
import { ActivityList } from "@/components/features/history/ActivityList";

export default async function ActivityPage() {
    const activities = await getAllActivities();

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold text-white">History</h1>
                <p className="text-zinc-400">Your path to greatness</p>
            </div>

            <ActivityList activities={activities || []} />
        </div>
    );
}
