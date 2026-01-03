"""
Debug script to investigate body battery field names and values from Garmin API
"""
from garmin.auth import login_garmin
from datetime import date, timedelta
import json

def debug_body_battery():
    print("Connecting to Garmin...")
    garmin = login_garmin()
    
    today = date.today()
    yesterday = today - timedelta(days=1)
    
    print(f"\n=== Testing get_body_battery_data() (CORRECT METHOD) ===")
    try:
        # This is the correct function according to python-garminconnect docs
        body_battery_data = garmin.get_body_battery_data(yesterday.isoformat(), today.isoformat())
        print("SUCCESS! Body battery data retrieved:")
        print(json.dumps(body_battery_data, indent=2, default=str))
    except Exception as e:
        print(f"ERROR: {e}")
    
    print(f"\n=== Checking get_user_summary() (OLD METHOD) ===")
    summary = garmin.get_user_summary(today.isoformat())
    
    # Search for body battery related fields in summary
    print("\n=== BODY BATTERY FIELDS IN SUMMARY ===")
    found_any = False
    for key in summary.keys():
        if 'body' in key.lower() or 'battery' in key.lower():
            print(f"{key}: {summary[key]}")
            found_any = True
    
    if not found_any:
        print("No body battery fields found in get_user_summary()")
        print("\nThis confirms we need to use get_body_battery_data() instead!")

if __name__ == "__main__":
    debug_body_battery()
