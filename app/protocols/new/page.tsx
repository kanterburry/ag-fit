import { ProtocolLibrary } from '@/components/protocols/ProtocolLibrary'
import { getUserProtocols } from '@/app/actions/protocol'

export default async function NewProtocolPage() {
    const userProtocols = await getUserProtocols()

    return (
        <div className="container mx-auto max-w-6xl py-12 px-4">
            <div className="mb-12 text-center max-w-2xl mx-auto">
                <h1 className="text-4xl font-bold text-white mb-4">Protocol Library</h1>
                <p className="text-zinc-400 text-lg">
                    Select a pre-validated experiment to biologically urge-surf your physiology.
                    Intelligence automates the tracking structure for you.
                </p>
            </div>
            <ProtocolLibrary userProtocols={userProtocols} />
        </div>
    )
}
