from .config import USER_ID

def sync_daily_metrics(garmin_client, supabase_client, target_date):
    print(f"Syncing Daily Metrics for {target_date}...")
    try:
        summary = garmin_client.get_user_summary(target_date.isoformat())
        sleep = garmin_client.get_sleep_data(target_date.isoformat())
        
        data = {
            "date": target_date.isoformat(),
            "user_id": USER_ID,
            "total_steps": int(summary.get('totalSteps')) if summary.get('totalSteps') is not None else None,
            "total_distance_meters": summary.get('totalDistanceMeters'),
            "floors_climbed": int(summary.get('floorsClimbed')) if summary.get('floorsClimbed') is not None else None,
            "calories_active": int(summary.get('activeKilocalories')) if summary.get('activeKilocalories') is not None else None,
            "calories_consumed": int(summary.get('consumedKilocalories')) if summary.get('consumedKilocalories') is not None else None,
            "resting_hr": int(summary.get('restingHeartRate')) if summary.get('restingHeartRate') is not None else None,
            "max_hr": int(summary.get('maxHeartRate')) if summary.get('maxHeartRate') is not None else None,
            "stress_avg": int(summary.get('averageStressLevel')) if summary.get('averageStressLevel') is not None else None,
            "body_battery_min": int(summary.get('minBodyBattery')) if summary.get('minBodyBattery') is not None else None,
            "body_battery_max": int(summary.get('maxBodyBattery')) if summary.get('maxBodyBattery') is not None else None,
            "sleep_score": sleep.get('dailySleepDTO', {}).get('sleepScores', {}).get('overall', {}).get('value'),
            "sleep_seconds": sleep.get('dailySleepDTO', {}).get('sleepTimeSeconds'),
            "rem_sleep_seconds": sleep.get('dailySleepDTO', {}).get('remSleepSeconds'),
            "deep_sleep_seconds": sleep.get('dailySleepDTO', {}).get('deepSleepSeconds'),
            "light_sleep_seconds": sleep.get('dailySleepDTO', {}).get('lightSleepSeconds'),
        }
        
        # Legacy Biometrics Sync
        bio_data = {
             "date": target_date.isoformat(),
             "user_id": USER_ID,
             "resting_hr": data.get('resting_hr'),
             "body_battery": data.get('body_battery_min'), 
             "sleep_score": data.get('sleep_score'),
             "last_synced_at": "now()"
        }
        supabase_client.table("biometrics").upsert(bio_data).execute()

        # New Table Sync
        supabase_client.table("garmin_daily_metrics").upsert(data).execute()
        print("  -> Daily Metrics synced.")

    except Exception as e:
        print(f"  -> Failed Daily Metrics: {e}")
