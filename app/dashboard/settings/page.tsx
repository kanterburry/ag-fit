import NotificationManager from "@/components/features/settings/NotificationManager";

export default function SettingsPage() {
    return (
        <div className="container mx-auto max-w-2xl px-4 py-8">
            <h1 className="mb-6 text-2xl font-bold text-white">Settings</h1>

            <div className="space-y-6">
                <section>
                    <h2 className="mb-4 text-lg font-semibold text-slate-400">Notifications</h2>
                    <NotificationManager />
                </section>

                {/* Future settings: Profile, Units, etc. */}
            </div>
        </div>
    );
}
