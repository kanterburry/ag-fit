'use client'

import { SidePanel } from "@/components/ui/SidePanel";
import CoachChat from "@/components/features/coach/CoachChat";
import { useCoach } from "@/context/CoachContext";

export function CoachPanel() {
    const { isOpen, close } = useCoach();

    return (
        <SidePanel
            isOpen={isOpen}
            onClose={close}
            title="ProtocolAI Research Assistant"
            side="right"
            contentClassName="p-0 overflow-hidden flex flex-col"
        >
            <CoachChat className="h-full bg-transparent" />
        </SidePanel>
    );
}
