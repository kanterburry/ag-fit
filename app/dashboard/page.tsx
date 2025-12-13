import { WorkoutCard, type Workout } from "@/components/features/workout/WorkoutCard";
import DashboardClient from "@/components/features/dashboard/DashboardClient";

// Mock data for MVP visualization (would be replaced by DB fetch)
const mockWorkouts: Workout[] = [
    {
        id: "1",
        type: "strength",
        source: "manual",
        status: "completed",
        date: new Date().toISOString(),
        title: "Upper Body Power",
        exercises: [
            { name: "Bench Press", sets: [{}, {}, {}] },
            { name: "Pull Ups", sets: [{}, {}, {}] },
            { name: "OH Press", sets: [{}, {}, {}] },
        ],
    },
    {
        id: "2",
        type: "bft",
        source: "gcal",
        status: "planned",
        date: new Date(Date.now() + 86400000).toISOString(), // Tomorrow
        title: "BFT: Cardio Summit",
    },
    {
        id: "3",
        type: "cardio",
        source: "garmin",
        status: "missed",
        date: new Date(Date.now() - 86400000).toISOString(), // Yesterday
        title: "Morning Run",
    },
];

export default async function DashboardPage() {
    // In real app: await fetchWorkouts()

    return (
        <DashboardClient>
            {mockWorkouts.map((workout) => (
                <WorkoutCard key={workout.id} workout={workout} />
            ))}
        </DashboardClient>
    );
}

// Client component for Sync Button to handle loading state would be better, 
// strictly server component cannot use onClick. 
// For this MVP, we will use a form action or move SyncButton to a client component.
// Let's create a Client Component inline for simplicity of the file structure or separate it.
import { SyncButton } from "./SyncButton";
