export type ProtocolTemplate = {
    id: string
    title: string
    description: string
    hypothesis: string
    icon: 'coffee' | 'moon' | 'smartphone' | 'activity'
    tier: 1 | 2 | 3
    phases: {
        name: string
        type: 'baseline' | 'intervention' | 'washout'
        duration_days: number
    }[]
    metrics: {
        key: string
        label: string
        source: 'manual' | 'automated'
        metricType: 'number' | 'time' | 'select' | 'boolean' | 'text'
        suffix?: string
        options?: string[]
        placeholder?: string
        icon?: 'moon' | 'activity' | 'zap' | 'smartphone' | 'coffee'
        // Flexible Logging Attributes
        attributes?: {
            key: string
            label: string
            type: 'time' | 'number' | 'select' | 'text'
            options?: string[]
            required?: boolean
            suffix?: string
        }[]
    }[]
    studies?: string[] // Array of research study URLs or DOIs
}

export const HABIT_CATEGORIES = {
    SLEEP: 'Sleep-Related',
    TREATMENTS: 'Treatments',
    SELF_CARE: 'Self-Care',
    LIFESTYLE: 'Lifestyle'
} as const

export const HABIT_OPTIONS = {
    [HABIT_CATEGORIES.SLEEP]: [
        'CPAP Machine', 'Ear Plugs/Headphones', 'Eye Mask', 'Light Exercise Before Bed',
        'Moderate Exercise Before Bed', 'Vigorous Exercise Before Bed', 'Humidifier Use', 'Nasal Strips'
    ],
    [HABIT_CATEGORIES.TREATMENTS]: [
        'Acupuncture', 'Chiropractor', 'Compression Therapy', 'Cupping',
        'Light Therapy', 'Massage Therapy', 'Physical Therapy'
    ],
    [HABIT_CATEGORIES.SELF_CARE]: [
        'Cold Showers/Baths', 'Journaling', 'Sauna/Steam Room', 'Stretching', 'Sunlight'
    ],
    [HABIT_CATEGORIES.LIFESTYLE]: [
        'Alcohol', 'Morning Caffeine', 'Late Caffeine', 'Light Exercise',
        'Moderate Exercise', 'Vigorous Exercise', 'Healthy Meals', 'Heavy Meals'
    ]
}

export const PROTOCOL_TEMPLATES: ProtocolTemplate[] = [
    {
        id: 'caffeine-reset',
        title: 'Caffeine Reset',
        description: 'Assess the impact of caffeine on your sleep quality.',
        hypothesis: 'Reducing caffeine intake to zero will improve deep sleep duration by 15%.',
        icon: 'coffee',
        tier: 1,
        phases: [
            { name: 'Baseline', type: 'baseline', duration_days: 5 },
            { name: 'Caffeine Detox', type: 'intervention', duration_days: 10 },
            { name: 'Reintroduction', type: 'washout', duration_days: 3 }
        ],
        metrics: [
            {
                key: 'caffeine_intake',
                label: 'Caffeine Intake',
                source: 'manual',
                metricType: 'number',
                suffix: 'mg',
                placeholder: 'e.g., 200',
                icon: 'coffee',
                attributes: [
                    { key: 'time', label: 'Time Consumed', type: 'time', required: true },
                    { key: 'type', label: 'Source', type: 'select', options: ['Coffee', 'Tea', 'Energy Drink', 'Pills'], required: true },
                    { key: 'amount', label: 'Amount', type: 'number', suffix: 'mg', required: true }
                ]
            },
            { key: 'sleep_score', label: 'Sleep Score', source: 'automated', metricType: 'number', suffix: '%', icon: 'moon' },
            { key: 'deep_sleep', label: 'Deep Sleep', source: 'automated', metricType: 'number', suffix: 'min', icon: 'moon' }
        ],
        studies: [
            'https://pubmed.ncbi.nlm.nih.gov/23313551/',
            'https://pubmed.ncbi.nlm.nih.gov/26899133/'
        ]
    },
    {
        id: 'sleep-optimization',
        title: 'Sleep Optimization',
        description: 'Test if a strict 10 PM bedtime improves your recovery score.',
        hypothesis: 'Sleeping at 10 PM consistently increases HRV and recovery.',
        icon: 'moon',
        tier: 2,
        phases: [
            { name: 'Baseline (Normal Routine)', type: 'baseline', duration_days: 7 },
            { name: 'Strict 10PM Bedtime', type: 'intervention', duration_days: 14 }
        ],
        metrics: [
            {
                key: 'bedtime',
                label: 'Bedtime',
                source: 'automated',
                metricType: 'time',
                icon: 'moon'
            },
            { key: 'sleep_duration_seconds', label: 'Duration', source: 'automated', metricType: 'time', suffix: 'h', icon: 'moon' },
            { key: 'sleep_score', label: 'Sleep Score', source: 'automated', metricType: 'number', suffix: '%', icon: 'activity' },
            { key: 'hrv_avg_ms', label: 'HRV', source: 'automated', metricType: 'number', suffix: 'ms', icon: 'activity' }
        ],
        studies: [
            'https://pubmed.ncbi.nlm.nih.gov/31130584/',
            'https://pubmed.ncbi.nlm.nih.gov/28485729/'
        ]
    },
    {
        id: 'digital-detox',
        title: 'Screen-Time Audit',
        description: 'Measure impact of evening screen time on sleep latency.',
        hypothesis: 'No screens after 8 PM will reduce sleep latency by 20%.',
        icon: 'smartphone',
        tier: 1,
        phases: [
            { name: 'Normal Usage', type: 'baseline', duration_days: 3 },
            { name: 'No Evening Screens', type: 'intervention', duration_days: 7 }
        ],
        metrics: [
            {
                key: 'evening_screens',
                label: 'Screen Time (Post-8PM)',
                source: 'manual',
                metricType: 'number',
                suffix: 'min',
                icon: 'smartphone'
            },
            { key: 'sleep_latency', label: 'Sleep Latency', source: 'automated', metricType: 'number', suffix: 'min', icon: 'moon' }
        ],
        studies: [
            'https://pubmed.ncbi.nlm.nih.gov/30311830/',
            'https://pubmed.ncbi.nlm.nih.gov/29073412/'
        ]
    },
    {
        id: 'metabolic-flexibility',
        title: 'Metabolic Flexibility',
        description: 'Advanced protocol to improve fat oxidation via fasted Zone 2 training.',
        hypothesis: 'Fasted Zone 2 training increases fat oxidation rate and stable energy levels.',
        icon: 'activity',
        tier: 3,
        phases: [
            { name: 'Baseline Carb', type: 'baseline', duration_days: 7 },
            { name: 'Fasted Training', type: 'intervention', duration_days: 21 },
            { name: 'Reintroduction', type: 'washout', duration_days: 7 }
        ],
        metrics: [
            { key: 'fasting_glucose', label: 'Fasting Glucose', source: 'manual', metricType: 'number', suffix: 'mg/dL', icon: 'zap' },
            { key: 'ketones', label: 'Blood Ketones', source: 'manual', metricType: 'number', suffix: 'mmol/L', icon: 'zap' },
            { key: 'zone2_duration', label: 'Zone 2 Duration', source: 'automated', metricType: 'time', icon: 'activity' }
        ],
        studies: [
            'https://pubmed.ncbi.nlm.nih.gov/28715993/',
            'https://pubmed.ncbi.nlm.nih.gov/31614942/'
        ]
    }
]
