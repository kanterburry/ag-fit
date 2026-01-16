
from datetime import datetime, timedelta
import sys
import os

sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from garmin.db import get_supabase
from garmin.config import USER_ID
from garmin.smart_logger import evaluate_passive_protocol

def fix_and_backfill():
    supabase = get_supabase()
    print("Starting Fix and Backfill...")

    # 1. Fetch Active Protocols
    response = supabase.table("protocols")\
        .select("*")\
        .eq("user_id", USER_ID)\
        .eq("status", "active")\
        .execute()
    
    protocols = response.data
    if not protocols:
        print("No active protocols found.")
        return

    # 2. Filter for Sleep Optimization & Fix Type
    target_protocols = [p for p in protocols if "Sleep Optimization" in p['title']]
    
    print(f"Found {len(target_protocols)} Sleep Optimization protocols.")
    
    for p in target_protocols:
        # Update Type to PASSIVE if not already
        if p.get('protocol_type') != 'PASSIVE':
            print(f"  Fixing type for {p['id']} -> PASSIVE")
            supabase.table("protocols")\
                .update({"protocol_type": "PASSIVE"})\
                .eq("id", p['id'])\
                .execute()
            p['protocol_type'] = 'PASSIVE' # Update local object

        # 3. Backfill Logic
        print(f"Processing '{p['title']}' Backfill...")
        start_date = datetime.fromisoformat(p['created_at']).date()
        today = datetime.now().date()
        
        delta = today - start_date
        
        for i in range(delta.days + 1):
            target_date = start_date + timedelta(days=i)
            target_date_iso = target_date.isoformat()

            # Check for existing log
            existing_log = supabase.table("daily_logs")\
                .select("id")\
                .eq("protocol_id", p['id'])\
                .eq("date", target_date_iso)\
                .execute()
            
            if existing_log.data:
                continue

            # Fetch Metrics
            metrics_res = supabase.table("garmin_daily_metrics")\
                .select("*")\
                .eq("date", target_date_iso)\
                .eq("user_id", USER_ID)\
                .execute()
            
            if not metrics_res.data:
                # print(f"  - {target_date_iso}: No metrics data found.")
                continue

            # Run Evaluation
            daily_data = metrics_res.data[0]
            evaluate_passive_protocol(supabase, p, daily_data, target_date)
            print(f"  + Backfilled {target_date_iso}")

    print("Fix and Backfill Complete.")

if __name__ == "__main__":
    fix_and_backfill()
