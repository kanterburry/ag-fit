import { DashboardSidebar } from "@/components/layout/DashboardSidebar";
import { DashboardBottomNav } from "@/components/layout/DashboardBottomNav";

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="flex min-h-screen bg-background text-foreground">
            {/* Sidebar for Desktop */}
            <DashboardSidebar />

            <div className="flex-1 flex flex-col min-h-screen relative">
                <main className="flex-1 pb-24 md:pb-8 p-4 md:p-8 overflow-y-auto w-full max-w-7xl mx-auto">
                    {children}
                </main>
            </div>

            {/* Bottom Nav for Mobile */}
            <DashboardBottomNav />
        </div>
    );
}
