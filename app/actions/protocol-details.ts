'use server'

import { createClient } from '@/utils/supabase/server'

export async function getProtocolDetails(protocolId: string) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        return { error: 'Unauthorized' }
    }

    // Fetch protocol with phases and daily logs
    const { data: protocol, error } = await supabase
        .from('protocols')
        .select(`
            *,
            protocol_phases (*),
            daily_logs (*)
        `)
        .eq('id', protocolId)
        .eq('user_id', user.id)
        .single()

    if (error) {
        console.error('Error fetching protocol details:', JSON.stringify(error, null, 2))
        console.error('Protocol ID:', protocolId)
        console.error('User ID:', user.id)
        return { error: 'Protocol not found' }
    }

    if (!protocol) {
        console.error('No protocol found for ID:', protocolId)
        return { error: 'Protocol not found' }
    }

    return { protocol }
}
