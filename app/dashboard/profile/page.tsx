import { createClient } from "@/utils/supabase/server";
import { User, Settings, Mail, Award, TrendingUp } from "lucide-react";
import Link from "next/link";

export default async function ProfilePage() {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    // Mock stats for now, replace with real aggregations later
    const stats = [
        { label: "Workouts", value: "12", icon: TrendingUp },
        { label: "Achievements", value: "5", icon: Award },
        { label: "Streak", value: "3 Days", icon: User }, // Placeholder icon
    ];

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-2xl font-bold text-white">Profile</h1>
                <p className="text-zinc-400">Manage your account and view progress</p>
            </div>

            {/* User Info Card */}
            <div className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6 flex flex-col md:flex-row items-center gap-6">
                <div className="w-24 h-24 rounded-full bg-purple-600 flex items-center justify-center text-4xl font-bold text-white shadow-lg shadow-purple-900/20">
                    {user?.email?.[0].toUpperCase() || "U"}
                </div>
                <div className="flex-1 text-center md:text-left space-y-2">
                    <h2 className="text-xl font-bold text-white">
                        {user?.user_metadata?.full_name || "Athlete"}
                    </h2>
                    <div className="flex items-center justify-center md:justify-start gap-2 text-zinc-400">
                        <Mail size={16} />
                        <span>{user?.email}</span>
                    </div>
                    <div className="flex gap-2 justify-center md:justify-start pt-2">
                        <span className="px-3 py-1 bg-zinc-800 rounded-full text-xs font-medium text-zinc-300 border border-zinc-700">
                            Free Plan
                        </span>
                        <span className="px-3 py-1 bg-green-900/20 text-green-400 rounded-full text-xs font-medium border border-green-900/50">
                            Active
                        </span>
                    </div>
                </div>
                <Link href="/dashboard/settings" className="p-3 bg-zinc-800 hover:bg-zinc-700 rounded-xl transition-colors text-zinc-300">
                    <Settings size={20} />
                </Link>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {stats.map((stat) => (
                    <div key={stat.label} className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-4 flex items-center gap-4">
                        <div className="p-3 bg-zinc-800 rounded-lg text-purple-400">
                            <stat.icon size={20} />
                        </div>
                        <div>
                            <p className="text-2xl font-bold text-white">{stat.value}</p>
                            <p className="text-xs text-zinc-500 uppercase tracking-widest">{stat.label}</p>
                        </div>
                    </div>
                ))}
            </div>

            {/* Settings / Preferences Stub */}
            <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl overflow-hidden">
                <div className="p-4 border-b border-zinc-800">
                    <h3 className="font-semibold text-white">Preferences</h3>
                </div>
                <div className="p-4 space-y-4">
                    <div className="flex items-center justify-between">
                        <span className="text-zinc-400">Email Notifications</span>
                        <div className="w-10 h-6 bg-purple-600 rounded-full relative cursor-pointer">
                            <div className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full"></div>
                        </div>
                    </div>
                    <div className="flex items-center justify-between">
                        <span className="text-zinc-400">Public Profile</span>
                        <div className="w-10 h-6 bg-zinc-700 rounded-full relative cursor-pointer">
                            <div className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full"></div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="flex justify-center">
                <form action="/auth/signout" method="post">
                    <button className="text-red-500 hover:text-red-400 text-sm font-medium transition-colors">
                        Sign Out
                    </button>
                </form>
            </div>
        </div>
    );
}
