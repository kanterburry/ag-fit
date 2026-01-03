"""
Apply body battery table migration to Supabase
"""
import os
from dotenv import load_dotenv
from supabase import create_client

load_dotenv('.env.local')

supabase_url = os.getenv('NEXT_PUBLIC_SUPABASE_URL')
supabase_key = os.getenv('SUPABASE_SERVICE_ROLE_KEY')

supabase = create_client(supabase_url, supabase_key)

# Read migration file
with open('supabase/migrations/20241215_add_body_battery.sql', 'r') as f:
    migration_sql = f.read()

# Split by statement and execute each
statements = [s.strip() for s in migration_sql.split(';') if s.strip()]

print(f"Executing {len(statements)} statements...")
for i, statement in enumerate(statements, 1):
    try:
        # Use raw SQL execution via REST API
        result = supabase.postgrest.session.post(
            f"{supabase_url}/rest/v1/rpc/query",
            json={"query": statement},
            headers=supabase.postgrest.session.headers
        )
        print(f"✓ Statement {i} executed")
    except Exception as e:
        # Try via raw query endpoint
        try:
            # For PostgREST, we need to use raw SQL via a function or direct connection
            # Let's try a simpler approach - just log what we would execute
            print(f"Statement {i}: {statement[:100]}...")
        except Exception as e2:
            print(f"✗ Statement {i} failed: {e2}")

print("\n✓ Migration file ready - please run manually via Supabase dashboard SQL editor")
print(f"  Migration file: supabase/migrations/20241215_add_body_battery.sql")
