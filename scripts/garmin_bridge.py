
import os
import sys
from datetime import date
from garminconnect import Garmin
from supabase import create_client, Client
from dotenv import load_dotenv

# Load env from .env.local if present (for local dev)
load_dotenv('.env.local')

def sync_garmin_data():
    email = os.getenv("GARMIN_EMAIL")
    password = os.getenv("GARMIN_PASS")
    supabase_url = os.getenv("NEXT_PUBLIC_SUPABASE_URL")
    supabase_key = os.getenv("SUPABASE_SERVICE_ROLE_KEY") # Needs service role to bypass potential RLS if user_id unknown? 
    # Actually, we need to know WHICH user this is.
    # For single user app (the "Hybrid Athlete" / You), we can hardcode or env var the USER_ID.
    user_id = os.getenv("USER_ID") 

    missing = []
    if not email: missing.append("GARMIN_EMAIL")
    if not password: missing.append("GARMIN_PASS")
    if not supabase_url: missing.append("NEXT_PUBLIC_SUPABASE_URL")
    if not supabase_key: missing.append("SUPABASE_SERVICE_ROLE_KEY")
    if not user_id: missing.append("USER_ID")

    if missing:
        print(f"Missing environment variables: {', '.join(missing)}")
        sys.exit(1)

    # --- Headless Auth Logic ---
    garmin_tokens = os.getenv("GARMIN_TOKENS")
    if garmin_tokens:
        print("Found GARMIN_TOKENS. Restoring session...")
        import base64
        import json
        import shutil

        # Determine token directories - populate BOTH to be safe on all platforms
        token_dirs = [
            os.path.expanduser("~/.garminconnect"),
            os.path.expanduser("~/.garth")
        ]
        
        try:
            # Decode base64 -> JSON
            tokens_json = base64.b64decode(garmin_tokens).decode('utf-8')
            tokens_dict = json.loads(tokens_json)

            for t_dir in token_dirs:
                if not os.path.exists(t_dir):
                    os.makedirs(t_dir)
                
                print(f"Restoring {len(tokens_dict)} tokens to {t_dir}...")
                for filename, content in tokens_dict.items():
                    file_path = os.path.join(t_dir, filename)
                    with open(file_path, "w", encoding="utf-8") as f:
                        f.write(content)
                
                # Debug: List files
                print(f"Contents of {t_dir}: {os.listdir(t_dir)}")

            print("Session restored successfully.")
        except Exception as e:
            print(f"Failed to restore tokens: {e}")
            # Do NOT exit, try login anyway (it might fail, but let's see)
    # ---------------------------

    # ---------------------------

    try:
        print("Logging in to Garmin Connect...")
        
        # FIX: Force clear potential corrupted garth tokens from widely used paths
        # This prevents the "OAuth1 token is required" error loop
        import shutil
        possible_token_paths = [
            os.path.expanduser("~/.garminconnect"),
            os.path.expanduser("~/.garth")
        ]
        # Only clear if we are NOT using the headless token restoration method above
        # (If garmin_tokens is set, we just wrote FRESH valid tokens, so don't delete them!)
        if not garmin_tokens:
            print("Ensuring fresh session for local login...")
            for p in possible_token_paths:
                if os.path.exists(p):
                    try:
                        shutil.rmtree(p)
                        print(f"Cleared stale tokens at: {p}")
                    except Exception as e:
                        print(f"Warning: Could not clear {p}: {e}")

        # If tokens exist in ~/.garminconnect (restored above), this will use them.
        # If not (and we cleared them), it will force a fresh login.
        garmin = Garmin(email, password)
        garmin.login()
        print("Login successful.")

        today = date.today()
        print(f"Fetching data for {today.isoformat()}...")
        
        # 1. Sync Biometrics
        stats = garmin.get_user_summary(today.isoformat())
        
        resting_hr = stats.get('restingHeartRate', 0)
        sleep_score = stats.get('sleepScore', 0)
        body_battery = stats.get('bodyBatteryChargedValue', 0)
        
        if body_battery == 0 and 'bodyBattery' in stats: 
             pass # Logic to find nested if needed

        hrv_status = 'Balanced' 
        if 'hrvStatus' in stats:
            hrv_status = stats['hrvStatus']

        # Push Biometrics
        supabase: Client = create_client(supabase_url, supabase_key)
        
        bio_data = {
            "date": today.isoformat(),
            "user_id": user_id,
            "resting_hr": resting_hr,
            "body_battery": body_battery,
            "sleep_score": sleep_score,
            "hrv_status": hrv_status,
            "last_synced_at": "now()"
        }

        try:
            supabase.table("biometrics").upsert(bio_data).execute()
            print("Biometrics synced.")
        except Exception as e:
            print(f"Biometrics sync error: {e}")

        # 2. Sync Activities (Last 7 Days)
        print("Fetching recent activities...")
        # Get activities for the last 7 days to ensure we catch up
        # Standard Garmin API or wrapper usually supports limit or start/limit
        activities = garmin.get_activities(0, 10) # Get last 10 activities
        
        if activities:
            for act in activities:
                # Map fields
                act_type = act.get('activityType', {}).get('typeKey', 'unknown')
                distance = act.get('distance', 0)
                duration = act.get('duration', 0)
                avg_hr = act.get('averageHR', 0)
                calories = act.get('calories', 0)
                start_time = act.get('startTimeLocal', '') # Need to be careful with timezone
                
                # Check mapping for specific types (running, cycling, strength_training)
                # 'running', 'street_running', 'trail_running' -> 'running'
                # 'strength_training' -> 'strength_training'
                
                final_type = 'other'
                if 'running' in act_type: final_type = 'running'
                elif 'cycling' in act_type: final_type = 'cycling'
                elif 'strength' in act_type: final_type = 'strength_training'
                
                act_data = {
                    "user_id": user_id,
                    "activity_type": final_type,
                    "distance": distance,
                    "duration": duration,
                    "avg_hr": avg_hr,
                    "calories": calories,
                    "start_time": start_time # Postgres should handle ISO strings
                }
                
                # We need a unique constraint or ID to avoid duplicates?
                # Activities usually have an 'activityId'.
                # Let's check if the table allowsupsert by ID or if we just insert.
                # PRD/Schema didn't specify activity_id from Garmin. 
                # Ideally we add `garmin_activity_id` to schema to upsert.
                # For now, we might just insert and risk dupes OR check if start_time+user_id is unique?
                # Let's try to upsert if we had an ID.
                # Adding garmin_id to schema is best practice.
                
                # Assuming simple insert for now based on Plan, but upsert is better.
                # Let's add 'garmin_id' to the payload and Schema recommendation.
                
                # Update: Plan didn't specify garmin_id. I will map it to 'id' if possible or ignore dupes?
                # Actually, standard supabase-py upsert needs a primary key match.
                # I will skip complex de-dupe for this MVP step and just log them.
                
                print(f"Found activity: {final_type} at {start_time}")
                
                # Quick fix: query existing by start_time to avoid dupe
                existing = supabase.table("activities").select("id").eq("start_time", start_time).execute()
                if not existing.data:
                     supabase.table("activities").insert(act_data).execute()

        print(f"Activities synced.")

    except Exception as e:
        print(f"Error syncing Garmin data: {e}")
        sys.exit(1)

if __name__ == "__main__":
    sync_garmin_data()
