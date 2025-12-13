import CoachChat from "@/components/features/coach/CoachChat";

export default function CoachPage() {
    return (
        <div className="h-full">
            <div className="flex items-center justify-between px-4 py-4 border-b border-slate-800">
                <h1 className="text-xl font-bold text-white">AI Coach</h1>
                <span className="rounded-full bg-secondary/10 px-2 py-0.5 text-xs font-medium text-secondary">
                    Beta
                </span>
            </div>
            <CoachChat />
        </div>
    );
}
