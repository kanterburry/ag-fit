-- Protocol Efficiency: Staging Workflow (PRD v3.1)

-- 1. Create the Schema
CREATE SCHEMA IF NOT EXISTS vault_content;

-- 2. Create Research Sources Table
CREATE TABLE IF NOT EXISTS vault_content.research_sources (
    source_id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    external_id VARCHAR(255) UNIQUE, -- e.g., Semantic Scholar Paper ID
    title TEXT NOT NULL,
    url TEXT,
    publication_date DATE,
    abstract_text TEXT,
    citation_count INT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Create Protocols Staging Table (The AI Drafts)
CREATE TABLE IF NOT EXISTS vault_content.protocols_staging (
    staging_id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    source_id UUID REFERENCES vault_content.research_sources(source_id),
    
    -- AI Generated Fields
    draft_title TEXT,
    draft_hypothesis TEXT,
    protocol_type VARCHAR(20), -- 'PASSIVE', 'ACTIVE', 'HYBRID'
    variable_name TEXT, -- e.g. "Magnesium"
    target_metric VARCHAR(50), -- e.g. "sleep_deep_min"
    
    -- Workflow Status
    status VARCHAR(20) DEFAULT 'PENDING', -- 'PENDING', 'APPROVED', 'REJECTED'
    admin_notes TEXT,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. Create Protocol Library Table (The Live Library)
CREATE TABLE IF NOT EXISTS vault_content.protocol_library (
    protocol_id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title TEXT NOT NULL,
    hypothesis TEXT,
    
    -- The Logic Config
    type VARCHAR(20) NOT NULL, -- 'PASSIVE', 'ACTIVE'
    config JSONB NOT NULL, 
    /* Example JSONB Config:
       {
         "phases": {"baseline": 3, "intervention": 5},
         "trigger_time": "21:00",
         "validity_threshold": 0.3
       }
    */
    
    -- Community Stats (Aggregated)
    success_rate NUMERIC(5, 2) DEFAULT 0, -- e.g. 64.5%
    participant_count INT DEFAULT 0,
    
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 5. RLS Policies (Security)
ALTER TABLE vault_content.research_sources ENABLE ROW LEVEL SECURITY;
ALTER TABLE vault_content.protocols_staging ENABLE ROW LEVEL SECURITY;
ALTER TABLE vault_content.protocol_library ENABLE ROW LEVEL SECURITY;

-- Allow Service Role (Edge Functions) full access
DROP POLICY IF EXISTS "Service Role has full access to research_sources" ON vault_content.research_sources;
CREATE POLICY "Service Role has full access to research_sources"
ON vault_content.research_sources
FOR ALL
TO service_role
USING (true)
WITH CHECK (true);

DROP POLICY IF EXISTS "Service Role has full access to protocols_staging" ON vault_content.protocols_staging;
CREATE POLICY "Service Role has full access to protocols_staging"
ON vault_content.protocols_staging
FOR ALL
TO service_role
USING (true)
WITH CHECK (true);

-- Allow Authenticated Admins (or Users for now) read access to Library
DROP POLICY IF EXISTS "Authenticated users can read protocol_library" ON vault_content.protocol_library;
CREATE POLICY "Authenticated users can read protocol_library"
ON vault_content.protocol_library
FOR SELECT
TO authenticated
USING (true);

-- Staging is RESTRICTED (Admins only - assuming authenticated for now, but really should be specific role)
-- For MVP, we'll allow authenticated users to VIEW staging (to build the admin UI easily)
DROP POLICY IF EXISTS "Authenticated users can read protocols_staging" ON vault_content.protocols_staging;
CREATE POLICY "Authenticated users can read protocols_staging"
ON vault_content.protocols_staging
FOR SELECT
TO authenticated
USING (true);
