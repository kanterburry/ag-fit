'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { PROTOCOL_TEMPLATES } from '@/lib/protocols/templates'

export type ProtocolPhaseInput = {
    name: string
    type: 'baseline' | 'intervention' | 'washout'
    duration_days: number
    order_index: number
}

export type CreateProtocolInput = {
    title: string
    hypothesis: string
    phases: ProtocolPhaseInput[]
}

export async function createProtocol(data: CreateProtocolInput) {
    const supabase = await createClient()

    // Get current user
    const {
        data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
        return { error: 'Unauthorized' }
    }

    // Insert Protocol
    const { data: protocol, error: protocolError } = await supabase
        .from('protocols')
        .insert({
            user_id: user.id,
            title: data.title,
            hypothesis: data.hypothesis,
            status: 'active', // default to active for now
        })
        .select()
        .single()

    if (protocolError) {
        console.error('Error creating protocol:', protocolError)
        return { error: 'Failed to create protocol' }
    }

    // Insert Phases
    const phasesData = data.phases.map((phase) => ({
        protocol_id: protocol.id,
        name: phase.name,
        type: phase.type,
        duration_days: phase.duration_days,
        order_index: phase.order_index,
    }))

    const { error: phasesError } = await supabase
        .from('protocol_phases')
        .insert(phasesData)

    if (phasesError) {
        console.error('Error creating phases:', phasesError)
        // strict cleanup if phases fail? For now, let's just error.
        return { error: 'Failed to create phases' }
    }

    revalidatePath('/dashboard')
    redirect('/dashboard')
}

export async function createProtocolFromTemplate(templateId: string) {
    const supabase = await createClient()
    const { data: { user }, error: userError } = await supabase.auth.getUser()

    console.log('[createProtocolFromTemplate] User check:', { user: user?.id, error: userError })

    if (!user) {
        console.error('[createProtocolFromTemplate] Unauthorized: No user found')
        return { error: 'Unauthorized' }
    }

    const template = PROTOCOL_TEMPLATES.find(t => t.id === templateId)
    if (!template) {
        console.error('[createProtocolFromTemplate] Template not found:', templateId)
        return { error: 'Template not found' }
    }

    console.log('[createProtocolFromTemplate] Creating protocol for user:', user.id, 'template:', template.title)

    // 1. Create Protocol
    const { data: protocol, error: pError } = await supabase
        .from('protocols')
        .insert({
            user_id: user.id,
            title: template.title,
            description: template.description,
            hypothesis: template.hypothesis,
            status: 'active'
        })
        .select()
        .single()

    console.log('[createProtocolFromTemplate] Protocol insert result:', { protocol, pError })

    if (pError) {
        console.error('[createProtocolFromTemplate] Error creating protocol:', pError)
        return { error: `Failed to create protocol: ${pError.message}` }
    }

    if (!protocol) {
        console.error('[createProtocolFromTemplate] No protocol returned after insert')
        return { error: 'Protocol creation returned no data' }
    }

    console.log('[createProtocolFromTemplate] Protocol created successfully:', protocol.id)


    // 2. Create Phases
    const phasesData = template.phases.map((phase, index) => ({
        protocol_id: protocol.id,
        name: phase.name,
        type: phase.type,
        duration_days: phase.duration_days,
        order_index: index
    }))


    console.log('[createProtocolFromTemplate] Inserting phases:', phasesData.length)

    const { error: phError } = await supabase
        .from('protocol_phases')
        .insert(phasesData)

    console.log('[createProtocolFromTemplate] Phases insert result:', { phError })

    if (phError) {
        console.error('[createProtocolFromTemplate] Error creating phases:', phError)
        // Ensure we don't leave a broken protocol? OR just error.
        // For now, log and return error.
        return { error: 'Failed to create phases: ' + phError.message }
    }

    revalidatePath('/dashboard')
    // Return success instead of redirecting
    return { success: true, protocolId: protocol.id }
}

export async function getUserProtocols() {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) return []

    const { data: protocols } = await supabase
        .from('protocols')
        .select(`
            *,
            protocol_phases (*)
        `)
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })

    return protocols || []
}
