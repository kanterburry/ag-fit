-- Create table for HDB Resale Transactions
CREATE TABLE IF NOT EXISTS property_hdb_transactions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    transaction_date DATE NOT NULL,
    town TEXT NOT NULL,
    flat_type TEXT NOT NULL,
    block TEXT NOT NULL,
    street_name TEXT NOT NULL,
    storey_range TEXT NOT NULL,
    floor_area_sqm NUMERIC,
    flat_model TEXT,
    remaining_lease TEXT,
    resale_price NUMERIC NOT NULL,
    district_code TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    
    -- Composite unique constraint to prevent duplicates during sync
    UNIQUE(transaction_date, block, street_name, storey_range, resale_price)
);

-- Create index for faster filtering on HDB
CREATE INDEX IF NOT EXISTS idx_hdb_town ON property_hdb_transactions(town);
CREATE INDEX IF NOT EXISTS idx_hdb_district ON property_hdb_transactions(district_code);
CREATE INDEX IF NOT EXISTS idx_hdb_date ON property_hdb_transactions(transaction_date);
CREATE INDEX IF NOT EXISTS idx_hdb_flat_type ON property_hdb_transactions(flat_type);


-- Create table for URA Private Property Transactions
CREATE TABLE IF NOT EXISTS property_ura_transactions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    transaction_date DATE NOT NULL, -- Derived from date of sale
    project_name TEXT,
    street_name TEXT,
    property_type TEXT,
    district_code TEXT,
    tenure TEXT,
    price NUMERIC,
    area_sqm NUMERIC,
    nett_price NUMERIC,
    price_psm NUMERIC, -- Calculated or provided
    unit_range TEXT, -- e.g. "01-05" if available in raw data
    no_of_units INTEGER,
    type_of_sale TEXT, -- "New Sale", "Resale", "Sub Sale"
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,

    -- Composite unique constraint (URA data usually has specific project/unit info, but to be safe and avoid dups)
    -- Note: URA API doesn't always provide unit numbers for privacy in some endpoints, using available unique combo
    UNIQUE(transaction_date, project_name, street_name, price, area_sqm)
);

-- Create index for faster filtering on URA
CREATE INDEX IF NOT EXISTS idx_ura_project ON property_ura_transactions(project_name);
CREATE INDEX IF NOT EXISTS idx_ura_district ON property_ura_transactions(district_code);
CREATE INDEX IF NOT EXISTS idx_ura_date ON property_ura_transactions(transaction_date);
CREATE INDEX IF NOT EXISTS idx_ura_type ON property_ura_transactions(property_type);


-- Create table for BTO / Planning Watchlist
CREATE TABLE IF NOT EXISTS property_bto_projects (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    project_name TEXT, -- Extracted from description or manual input
    description TEXT NOT NULL,
    decision_date DATE,
    status TEXT, -- "APPROVED", "REJECTED", "PENDING"
    project_type TEXT, -- "HDB", "CONDO", "LANDED"
    location_details TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    
    UNIQUE(decision_date, description)
);

CREATE INDEX IF NOT EXISTS idx_bto_status ON property_bto_projects(status);
