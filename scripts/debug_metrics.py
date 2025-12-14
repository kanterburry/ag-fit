
from scripts.garmin.db import get_supabase

def check_metrics():
    supabase = get_supabase()
    response = supabase.table('garmin_daily_metrics').select('date, body_battery_max, sleep_score').order('date', desc=True).limit(5).execute()
    print("Recent Daily Metrics:")
    for row in response.data:
        print(row)

if __name__ == "__main__":
    check_metrics()
