from datetime import date
from .db import get_supabase
from .config import USER_ID

def check_smart_logging(garmin_client, supabase_client, target_date):
    """
    Evaluates active protocols against Garmin data and auto-logs compliance.
    """
    print(f"Running Smart Logging for {target_date}...")
    
    # 1. Fetch Active Protocols
    # Note: We need to join with protocol_library logic eventually, 
    # but for now we look at the 'protocols' table or 'vault_content.protocol_library' if migrated.
    # Assuming 'protocols' table has the 'protocol_type' column based on previous chat OR we use the new schema.
    # Let's try to fetch from the new 'vault_content.protocol_library' first, if valid, else fallback.
    # Actually, the user's active protocols are likely in the 'protocols' table (legacy) linked to 'protocol_library'.
    # For this MVP, we will query the 'protocols' table and assume it has 'protocol_type'.
    
    try:
        response = supabase_client.table("protocols")\
            .select("*")\
            .eq("user_id", USER_ID)\
            .eq("status", "active")\
            .execute()
        
        active_protocols = response.data
        
        if not active_protocols:
            print("  -> No active protocols found.")
            return

        # 2. Fetch Daily Metrics (the source of truth)
        metrics_res = supabase_client.table("garmin_daily_metrics")\
            .select("*")\
            .eq("date", target_date.isoformat())\
            .eq("user_id", USER_ID)\
            .execute()
            
        if not metrics_res.data:
            print("  -> No metrics data available for evaluation.")
            return
            
        daily_data = metrics_res.data[0]

        # 3. Evaluate Each Protocol
        for p in active_protocols:
            # Check if PASSIVE
            p_type = p.get('protocol_type', 'ACTIVE') # Default to ACTIVE
            
            if p_type == 'PASSIVE':
                evaluate_passive_protocol(supabase_client, p, daily_data, target_date)
            elif p_type == 'HYBRID':
                evaluate_hybrid_protocol(supabase_client, p, daily_data, target_date)

    except Exception as e:
        print(f"  -> Smart Logging Failed: {e}")

def evaluate_passive_protocol(supabase, protocol, daily_data, date_obj):
    """
    Auto-logs if metrics meet criteria.
    Protocol 'description' or 'hypothesis' might contain the logic for now.
    In a real app, we'd have a structured 'config' column.
    """
    title = protocol.get('title', '').lower()
    
    # Logic 1: Sleep Protocols
    if 'sleep' in title:
        sleep_score = daily_data.get('sleep_score')
        duration = daily_data.get('sleep_seconds')
        
        # Criteria: Sleep Score > 60 OR Duration > 7 hours
        if (sleep_score and sleep_score > 60) or (duration and duration > 7*3600):
            log_compliance(supabase, protocol['id'], date_obj, True, {"source": "garmin_passive", "metric": "sleep_score", "value": sleep_score})
            print(f"  -> Auto-verified: {protocol['title']}")
    
    # Logic 2: Steps / Movement
    elif 'step' in title or 'walk' in title:
        steps = daily_data.get('total_steps')
        if steps and steps > 5000: # Arbitrary threshold for MVP
             log_compliance(supabase, protocol['id'], date_obj, True, {"source": "garmin_passive", "value": steps})
             print(f"  -> Auto-verified: {protocol['title']}")

def evaluate_hybrid_protocol(supabase, protocol, daily_data, date_obj):
    # Hybrid requires SOME sensor data but maybe verification
    # For now, we just log a note that data is present
    pass

def log_compliance(supabase, protocol_id, date_obj, completed, meta_data):
    # Upsert to daily_logs
    data = {
        "user_id": USER_ID,
        "protocol_id": protocol_id,
        "date": date_obj.isoformat(),
        "completed": completed,
        "data": meta_data
    }
    
    try:
        supabase.table("daily_logs").upsert(data).execute()
    except Exception as e:
        print(f"  -> Failed to insert log: {e}")
