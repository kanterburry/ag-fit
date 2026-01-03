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
        metricType: 'number' | 'time' | 'select' | 'boolean'
        suffix?: string
        options?: string[]
        placeholder?: string
        icon?: 'moon' | 'activity' | 'zap' | 'smartphone' | 'coffee'
    }[]
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
                icon: 'coffee'
            },
            { key: 'sleep_score', label: 'Sleep Score', source: 'automated', metricType: 'number', suffix: '%', icon: 'moon' },
            { key: 'deep_sleep', label: 'Deep Sleep', source: 'automated', metricType: 'number', suffix: 'min', icon: 'moon' }
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
            { key: 'hrv', label: 'HRV', source: 'automated', metricType: 'number', suffix: 'ms', icon: 'activity' },
            { key: 'recovery_score', label: 'Recovery', source: 'automated', metricType: 'number', suffix: '%', icon: 'activity' }
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
        ]
    }
]
