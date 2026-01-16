'use client'

import { createContext, useContext, useState, ReactNode } from 'react'

interface CoachContextType {
    isOpen: boolean
    open: () => void
    close: () => void
    toggle: () => void
}

const CoachContext = createContext<CoachContextType | undefined>(undefined)

export function CoachProvider({ children }: { children: ReactNode }) {
    const [isOpen, setIsOpen] = useState(false)

    const open = () => setIsOpen(true)
    const close = () => setIsOpen(false)
    const toggle = () => setIsOpen(prev => !prev)

    return (
        <CoachContext.Provider value={{ isOpen, open, close, toggle }}>
            {children}
        </CoachContext.Provider>
    )
}

export function useCoach() {
    const context = useContext(CoachContext)
    if (context === undefined) {
        throw new Error('useCoach must be used within a CoachProvider')
    }
    return context
}
