'use server'

import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!
const supabase = createClient(supabaseUrl, supabaseKey)

// CONFIG
const URA_CONFIG = {
    ACCESS_KEY: process.env.URA_ACCESS_KEY!,
    AUTH_URL: 'https://eservice.ura.gov.sg/uraDataService/insertNewToken/v1',
    BASE_URL: 'https://eservice.ura.gov.sg/uraDataService/invokeUraDS/v1',
}

const HDB_CONFIG = {
    BASE_URL: 'https://data.gov.sg/api/action/datastore_search',
    RESOURCE_ID: 'f1765dbd-80fc-42f9-a83b-f6279e8ea471',
}

// ----------------------------------------------------------------------------
// 1. HELPERS & UTILS
// ----------------------------------------------------------------------------

async function getURAToken() {
    if (!URA_CONFIG.ACCESS_KEY) throw new Error('Missing URA_ACCESS_KEY')

    const response = await fetch(URA_CONFIG.AUTH_URL, {
        method: 'GET',
        headers: { AccessKey: URA_CONFIG.ACCESS_KEY },
    })

    const json = await response.json()
    if (json.Status === 'Success') return json.Result
    throw new Error(`URA Auth Failed: ${JSON.stringify(json)}`)
}

// ----------------------------------------------------------------------------
// 2. HDB SYNC
// ----------------------------------------------------------------------------

export async function syncHDBData() {
    console.log('Starting HDB Sync...')
    // Start with fetching latest data (e.g. last 12 months if empty, or new data)
    // For simplicity MVP: Fetch last 2000 records sorted by _id desc to get latest

    const limit = 2000
    const url = `${HDB_CONFIG.BASE_URL}?resource_id=${HDB_CONFIG.RESOURCE_ID}&limit=${limit}&sort=_id desc`

    try {
        const res = await fetch(url)
        const json = await res.json()

        if (!json.success) throw new Error('HDB API Failed')

        const records = json.result.records
        const formatted = records.map((r: any) => ({
            transaction_date: `${r.month}-01`, // approx date
            town: r.town,
            flat_type: r.flat_type,
            block: r.block,
            street_name: r.street_name,
            storey_range: r.storey_range,
            floor_area_sqm: parseFloat(r.floor_area_sqm),
            flat_model: r.flat_model,
            remaining_lease: r.remaining_lease,
            resale_price: parseFloat(r.resale_price),
            district_code: getDistrictFromTown(r.town)
        }))

        const { error } = await supabase
            .from('property_hdb_transactions')
            .upsert(formatted, {
                onConflict: 'transaction_date,block,street_name,storey_range,resale_price',
                ignoreDuplicates: true
            })

        if (error) throw error
        return { success: true, count: formatted.length }

    } catch (error) {
        console.error('HDB Sync Error:', error)
        return { success: false, error }
    }
}

// ----------------------------------------------------------------------------
// 3. URA SYNC (Private Transactions)
// ----------------------------------------------------------------------------

export async function syncURAData() {
    console.log('Starting URA Sync...')
    try {
        const token = await getURAToken()
        let totalSynced = 0

        // URA splits transaction data into batches (1-4)
        for (let i = 1; i <= 4; i++) {
            const url = `${URA_CONFIG.BASE_URL}?service=PMI_Resi_Transaction&batch=${i}`
            const res = await fetch(url, {
                headers: { AccessKey: URA_CONFIG.ACCESS_KEY, Token: token }
            })
            const json = await res.json()

            if (json.Status === 'Success' && json.Result) {
                const batchData = processURA(json.Result)
                if (batchData.length > 0) {
                    const { error } = await supabase
                        .from('property_ura_transactions')
                        .upsert(batchData, {
                            onConflict: 'transaction_date,project_name,street_name,price,area_sqm',
                            ignoreDuplicates: true
                        })
                    if (error) console.error('URA Upsert Error:', error)
                    else totalSynced += batchData.length
                }
            }
        }
        return { success: true, count: totalSynced }

    } catch (error) {
        console.error('URA Sync Error:', error)
        return { success: false, error }
    }
}

function processURA(data: any[]) {
    // URA returns array of projects, each containing "transaction" array
    return data.flatMap(project => {
        if (!project.transaction) return []

        return project.transaction.map((tx: any) => ({
            transaction_date: convertURADate(tx.contractDate),
            project_name: project.project,
            street_name: project.street,
            property_type: project.propertyType || 'Private',
            district_code: project.district,
            tenure: 'Unknown', // URA often hides tenure in separate fields, keeping simple for now
            price: parseFloat(tx.price),
            area_sqm: parseFloat(tx.area),
            nett_price: parseFloat(tx.nettPrice || tx.price),
            price_psm: parseFloat(tx.price) / parseFloat(tx.area),
            no_of_units: parseInt(tx.noOfUnits || '1'),
            type_of_sale: tx.typeOfSale
        }))
    })
}

function convertURADate(uraDate: string) {
    // URA format: "1024" (Oct 2024) or "0124"
    if (!uraDate || uraDate.length !== 4) return new Date().toISOString()
    const month = parseInt(uraDate.substring(0, 2))
    const year = 2000 + parseInt(uraDate.substring(2, 4)) // Assuming 2000s
    return `${year}-${String(month).padStart(2, '0')}-15` // Mid-month
}

function getDistrictFromTown(town: string) {
    const map: Record<string, string> = {
        "ANG MO KIO": "20", "BEDOK": "16", "BISHAN": "20", "BUKIT BATOK": "23", "BUKIT MERAH": "03",
        "BUKIT PANJANG": "23", "BUKIT TIMAH": "10", "CENTRAL AREA": "01", "CHOA CHU KANG": "23",
        "CLEMENTI": "05", "GEYLANG": "14", "HOUGANG": "19", "JURONG EAST": "22", "JURONG WEST": "22",
        "KALLANG/WHAMPOA": "12", "MARINE PARADE": "15", "PASIR RIS": "18", "PUNGGOL": "19",
        "QUEENSTOWN": "03", "SEMBAWANG": "27", "SENGKANG": "19", "SERANGOON": "19", "TAMPINES": "18",
        "TOA PAYOH": "12", "WOODLANDS": "25", "YISHUN": "27"
    }
    return map[town] || "99"
}

// ----------------------------------------------------------------------------
// 4. DATA FETCHING (CLIENT CONSUMPTION)
// ----------------------------------------------------------------------------

export async function getPropertyData(filters?: { district?: string, year?: number }) {
    // 1. Fetch HDB Stats
    let hdbQuery = supabase
        .from('property_hdb_transactions')
        .select('district_code, resale_price, transaction_date')

    if (filters?.district) hdbQuery = hdbQuery.eq('district_code', filters.district)

    const { data: hdbData, error: hdbError } = await hdbQuery.limit(500) // Limit for MVP performance

    // 2. Fetch URA Stats
    let uraQuery = supabase
        .from('property_ura_transactions')
        .select('district_code, price, transaction_date')

    if (filters?.district) uraQuery = uraQuery.eq('district_code', filters.district)

    const { data: uraData, error: uraError } = await uraQuery.limit(500)

    if (hdbError || uraError) {
        console.error('Fetch Error', hdbError, uraError)
        return { hdb: [], ura: [] }
    }

    return {
        hdb: hdbData,
        ura: uraData
    }
}
