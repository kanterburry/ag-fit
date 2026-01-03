'use client'

import { X } from 'lucide-react'

interface DeleteProtocolDialogProps {
    isOpen: boolean
    onClose: () => void
    onConfirm: () => void
    protocolTitle: string
}

export function DeleteProtocolDialog({
    isOpen,
    onClose,
    onConfirm,
    protocolTitle
}: DeleteProtocolDialogProps) {
    if (!isOpen) return null

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
            onClick={onClose}
        >
            <div
                className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 max-w-md mx-4 shadow-2xl"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="flex items-start justify-between mb-4">
                    <div>
                        <h2 className="text-xl font-bold text-white">Delete Protocol?</h2>
                    </div>
                    <button
                        onClick={onClose}
                        className="text-zinc-500 hover:text-zinc-300 transition-colors"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <p className="text-zinc-400 mb-6">
                    Are you sure you want to delete "<span className="font-semibold text-zinc-200">{protocolTitle}</span>"?
                    This will permanently remove all associated data, logs, and progress. This action cannot be undone.
                </p>

                <div className="flex justify-end gap-3">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 rounded-lg bg-zinc-800 text-zinc-100 hover:bg-zinc-700 border border-zinc-700 transition-colors"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={onConfirm}
                        className="px-4 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700 transition-colors"
                    >
                        Delete Protocol
                    </button>
                </div>
            </div>
        </div>
    )
}
