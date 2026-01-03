"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Dumbbell, Calendar, History, User, Settings, Activity, LogOut, FlaskConical } from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
    { href: "/dashboard", label: "Overview", icon: Home },
    { href: "/dashboard/protocols", label: "Protocols", icon: FlaskConical },
    { href: "/dashboard/workouts", label: "Workouts", icon: Dumbbell },
    { href: "/dashboard/calendar", label: "Calendar", icon: Calendar },
    { href: "/dashboard/activity", label: "History", icon: History },
];

const secondaryItems = [
    { href: "/dashboard/profile", label: "Profile", icon: User },
    { href: "/dashboard/settings", label: "Settings", icon: Settings },
]

export function DashboardSidebar() {
    const pathname = usePathname();

    return (
        <aside className="hidden md:flex flex-col w-64 border-r border-zinc-800 bg-zinc-950/50 backdrop-blur-xl h-screen sticky top-0">
            <div className="p-6 flex items-center gap-2 border-b border-zinc-800/50">
                <Activity className="text-purple-500" size={28} />
                <span className="text-xl font-bold tracking-tight text-white">AG-Fit</span>
            </div>

            <div className="flex-1 px-4 py-6 space-y-2">
                <p className="px-4 text-xs font-medium text-zinc-500 uppercase tracking-wider mb-2">Menu</p>
                {navItems.map((item) => {
                    const isActive = pathname === item.href || (item.href !== "/dashboard" && pathname.startsWith(item.href));
                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={cn(
                                "flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 group",
                                isActive
                                    ? "bg-purple-500/10 text-purple-400 border border-purple-500/20 shadow-[0_0_20px_rgba(168,85,247,0.15)]"
                                    : "text-zinc-400 hover:text-zinc-100 hover:bg-zinc-900/50"
                            )}
                        >
                            <item.icon
                                size={20}
                                className={cn(
                                    "transition-colors",
                                    isActive ? "text-purple-400" : "text-zinc-500 group-hover:text-zinc-300"
                                )}
                            />
                            {item.label}
                        </Link>
                    );
                })}
            </div>

            <div className="p-4 border-t border-zinc-800/50 space-y-2">
                <p className="px-4 text-xs font-medium text-zinc-500 uppercase tracking-wider mb-2">Account</p>
                {secondaryItems.map((item) => {
                    const isActive = pathname === item.href;
                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={cn(
                                "flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 group",
                                isActive
                                    ? "bg-zinc-800 text-zinc-100"
                                    : "text-zinc-400 hover:text-zinc-100 hover:bg-zinc-900/50"
                            )}
                        >
                            <item.icon
                                size={20}
                                className={cn(
                                    "transition-colors",
                                    isActive ? "text-zinc-100" : "text-zinc-500 group-hover:text-zinc-300"
                                )}
                            />
                            {item.label}
                        </Link>
                    );
                })}
                <button
                    onClick={async () => {
                        const { createClient } = await import("@/utils/supabase/client");
                        const supabase = createClient();
                        await supabase.auth.signOut();
                        window.location.href = "/login";
                    }}
                    className="flex w-full items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-zinc-400 hover:text-red-400 hover:bg-red-950/30 transition-all duration-200 group"
                >
                    <LogOut
                        size={20}
                        className="text-zinc-500 group-hover:text-red-400 transition-colors"
                    />
                    Sign Out
                </button>
            </div>
        </aside >
    );
}
