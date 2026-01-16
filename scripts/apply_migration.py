import os
import psycopg2
from dotenv import load_dotenv

# Load .env.local
load_dotenv(dotenv_path=".env.local")

DATABASE_URL = os.getenv("DATABASE_URL")

if not DATABASE_URL:
    print("Error: DATABASE_URL not found in .env.local")
    exit(1)

MIGRATION_FILE = "supabase/migrations/20260116_init_vault_content.sql"

def apply_migration():
    print(f"Applying migration: {MIGRATION_FILE}")
    
    try:
        # Connect to Postgres
        conn = psycopg2.connect(DATABASE_URL)
        cur = conn.cursor()
        
        # Read SQL
        with open(MIGRATION_FILE, 'r') as f:
            sql_content = f.read()
            
        # Execute
        cur.execute(sql_content)
        conn.commit()
        
        print("Success: Migration applied successfully!")
        
        cur.close()
        conn.close()
        
    except Exception as e:
        print(f"Error applying migration: {e}")
        exit(1)

if __name__ == "__main__":
    apply_migration()
