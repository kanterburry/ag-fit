"""
Debug script to see exact body battery API response
"""
from garmin.auth import login_garmin
from datetime import date, timedelta
import json

garmin = login_garmin()

today = date.today()
yesterday = today - timedelta(days=1)
week_ago = today - timedelta(days=7)

print(f"\n=== Body Battery API Response ===")
print(f"Date range: {week_ago} to {today}")

try:
    result = garmin.get_body_battery(week_ago.isoformat(), today.isoformat())
    print(f"\nRaw result type: {type(result)}")
    print(f"Result length: {len(result) if result else 0}")
    print(f"\nFull response:")
    print(json.dumps(result, indent=2, default=str))
    
    if result and len(result) > 0:
        print(f"\n=== First item structure ===")
        print(json.dumps(result[0], indent=2, default=str))
except Exception as e:
    print(f"ERROR: {e}")
    import traceback
    traceback.print_exc()
