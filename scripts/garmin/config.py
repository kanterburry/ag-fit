import os
import sys
from dotenv import load_dotenv

# Explicitly load from parent directory's .env.local if running from scripts/
# Logic to find .env.local:
# If running as `python scripts/garmin_bridge.py`, CWD is usually root.
# We'll just load `.env.local` assuming we are in project root.
load_dotenv('.env.local')

GARMIN_EMAIL = os.getenv("GARMIN_EMAIL")
GARMIN_PASS = os.getenv("GARMIN_PASS")
SUPABASE_URL = os.getenv("NEXT_PUBLIC_SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_SERVICE_ROLE_KEY")
USER_ID = os.getenv("USER_ID")
GARMIN_TOKENS = os.getenv("GARMIN_TOKENS")

def validate_config():
    if not all([GARMIN_EMAIL, GARMIN_PASS, SUPABASE_URL, SUPABASE_KEY, USER_ID]):
        print("Missing environment variables. Check .env.local")
        sys.exit(1)
