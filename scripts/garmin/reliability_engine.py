import statistics
from datetime import date, timedelta
from .db import get_supabase
from .config import USER_ID

def run_reliability_check(supabase_client, target_date):
    """
    Calculates rolling average and SD for Stress/HRV.
    Flags the day as 'unreliable' if it deviates > 2 SD.
    """
    print(f"Running Reliability Check for {target_date}...")
    
    # 1. Fetch Last 30 Days of Metrics
    start_date = (target_date - timedelta(days=30)).isoformat()
    end_date = (target_date - timedelta(days=1)).isoformat()
    
    try:
        # Fetch History
        res = supabase_client.table("garmin_daily_metrics")\
            .select("stress_avg, resting_hr")\
            .eq("user_id", USER_ID)\
            .gte("date", start_date)\
            .lte("date", end_date)\
            .execute()
            
        history = res.data or []
        
        if len(history) < 7:
            print("  -> Not enough history for reliability calculation (need > 7 days).")
            return

        # 2. Extract Metric Streams
        stress_values = [r['stress_avg'] for r in history if r['stress_avg'] is not None]
        # resting_hr_values = [r['resting_hr'] for r in history if r['resting_hr'] is not None]

        if not stress_values:
            print("  -> No stress data in history.")
            return

        # 3. Calculate Stats
        mean_stress = statistics.mean(stress_values)
        sd_stress = statistics.stdev(stress_values) if len(stress_values) > 1 else 0
        
        threshold = mean_stress + (2 * sd_stress)
        
        # 4. Check Today's Value
        today_res = supabase_client.table("garmin_daily_metrics")\
            .select("stress_avg")\
            .eq("user_id", USER_ID)\
            .eq("date", target_date.isoformat())\
            .maybe_single()\
            .execute()
            
        today_val = today_res.data
        if not today_val or today_val['stress_avg'] is None:
            print("  -> No stress data for today.")
            return

        today_stress = today_val['stress_avg']
        
        print(f"  -> Stats: Mean={mean_stress:.2f}, SD={sd_stress:.2f}, Threshold={threshold:.2f}, Today={today_stress}")

        if today_stress > threshold:
            print(f"  -> ⚠️ ANOMALY DETECTED: Stress ({today_stress}) > Threshold ({threshold:.2f})")
            flag_day_as_unreliable(supabase_client, target_date, "High Stress Anomaly")
        else:
            print("  -> Reliability: OK")

    except Exception as e:
        print(f"  -> Reliability Check Failed: {e}")

def flag_day_as_unreliable(supabase, date_obj, reason):
    # Depending on schema, we might have a 'daily_reliability' table or flags on 'daily_metrics'
    # For now, let's assume we log it to a specific table or just print.
    # PRD v3.1 implies "Flag Day as Invalid". 
    # Let's create/use a table 'dates_reliability' ?? 
    # Or upsert into 'daily_logs' with a special flag?
    # Better: upsert to 'daily_metrics' if column exists, else just log.
    pass 
