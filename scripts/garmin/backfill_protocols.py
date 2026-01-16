
from datetime import datetime, timedelta
import sys
import os

# Add parent directory to path to allow imports
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from garmin.db import get_supabase
from garmin.config import USER_ID
from garmin.smart_logger import evaluate_passive_protocol

def backfill_passive_protocols():
    supabase = get_supabase()
    print("Starting Passive Protocol Backfill...")

    # 1. Fetch Active Passive Protocols
    response = supabase.table("protocols")\
        .select("*")\
        .eq("user_id", USER_ID)\
        .eq("status", "active")\
        .execute()
    
    protocols = response.data
    if not protocols:
        print("No active protocols found.")
        return

    passive_protocols = [p for p in protocols if p.get('protocol_type') == 'PASSIVE']
    print(f"Found {len(passive_protocols)} passive protocols.")

    for p in passive_protocols:
        print(f"Processing '{p['title']}'...")
        # Determine date range: created_at to today
        start_date = datetime.fromisoformat(p['created_at']).date()
        today = datetime.now().date()
        
        delta = today - start_date
        
        for i in range(delta.days + 1):
            target_date = start_date + timedelta(days=i)
            target_date_iso = target_date.isoformat()

            # Check if log already exists
            existing_log = supabase.table("daily_logs")\
                .select("id")\
                .eq("protocol_id", p['id'])\
                .eq("date", target_date_iso)\
                .execute()
            
            if existing_log.data:
                # print(f"  - {target_date_iso}: Log exists. Skipping.")
                continue

            # Fetch Metrics for that day
            metrics_res = supabase.table("daily_metrics")\
                .select("*")\
                .eq("date", target_date_iso)\
                .eq("user_id", USER_ID)\
                .execute()
            
            if not metrics_res.data:
                print(f"  - {target_date_iso}: No metrics data found.")
                continue

            # Run Evaluation
            daily_data = metrics_res.data[0]
            # Use the existing logic from smart_logger
            # Capturing stdout to avoid spamming logs if needed, but for now let it print
            evaluate_passive_protocol(supabase, p, daily_data, target_date)

    print("Backfill Complete.")

if __name__ == "__main__":
    backfill_passive_protocols()
