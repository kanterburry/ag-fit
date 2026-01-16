import { ProtocolLibrary } from '@/components/protocols/ProtocolLibrary'
import { getUserProtocols } from '@/app/actions/protocol'

export default async function ProtocolsPage() {
    // Fetch User Protocols (Library handles filtering for active/history)
    const userProtocols = await getUserProtocols()

    return (
        <div className="container mx-auto max-w-6xl py-8 px-4 space-y-8">
            <div className="mb-4 text-center max-w-2xl mx-auto">
                <h1 className="text-3xl font-bold text-white mb-2">Protocol Library</h1>
                <p className="text-zinc-400">
                    Select a pre-validated experiment to biologically urge-surf your physiology.
                    Intelligence automates the tracking structure for you.
                </p>
            </div>

            {/* Unified Library View (Active Summary + Directory) */}
            <ProtocolLibrary userProtocols={userProtocols} />
        </div>
    )
}
