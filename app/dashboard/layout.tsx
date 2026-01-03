import { DashboardSidebar } from "@/components/layout/DashboardSidebar";
import { DashboardBottomNav } from "@/components/layout/DashboardBottomNav";
import { DashboardHeader } from "@/components/layout/DashboardHeader";

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="flex min-h-screen bg-background text-foreground overflow-hidden">
            {/* Sidebar for Desktop */}
            <DashboardSidebar />

            <div className="flex-1 flex flex-col min-h-screen relative w-full overflow-hidden">
                <DashboardHeader />
                <main className="flex-1 overflow-y-auto p-4 md:p-8 w-full max-w-7xl mx-auto pb-24 md:pb-8 scrollbar-thin scrollbar-thumb-zinc-800 scrollbar-track-transparent">
                    {children}
                </main>
            </div>

            {/* Bottom Nav for Mobile */}
            <DashboardBottomNav />
        </div>
    );
}
