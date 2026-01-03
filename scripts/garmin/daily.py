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
            "body_battery_min": int(summary.get('bodyBatteryLowestValue')) if summary.get('bodyBatteryLowestValue') is not None else None,
            "body_battery_max": int(summary.get('bodyBatteryHighestValue')) if summary.get('bodyBatteryHighestValue') is not None else None,
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

        # Extract sleep start/end
        sleep_dto = sleep.get('dailySleepDTO', {})
        sleep_start = sleep_dto.get('sleepStartTimestampGMT') # Note: Ideally local, but API varies. daily.py runs locally? 
        # Actually dailySleepDTO usually has sleepStartTimestampLocal in some versions.
        # Let's rely on basic extraction. If needed convert.
        # sleepStartTimestampLocal is safer if available.
        # Checking Garmin returns.
        
        # New Table Sync (Garmin Specific)
        supabase_client.table("garmin_daily_metrics").upsert(data).execute()

        # Unified Daily Metrics Sync (for Protocols)
        # We assume specific columns exist in daily_metrics: bedtime, wakeup_time, sleep_duration_seconds, sleep_score, resting_hr, hrv_avg_ms
        
        unified_data = {
            "date": target_date.isoformat(),
            "user_id": USER_ID,
            "sleep_score": data.get('sleep_score'),
            "resting_hr": data.get('resting_hr'),
            "stress_avg": data.get('stress_avg'),
            "body_battery_max": data.get('body_battery_max'),
            "sleep_duration_seconds": data.get('sleep_seconds')
        }
        
        # Best effort bedtime (approximate from sleep seconds if start not available, but try to get start)
        # We need to add logic to parse sleepWindow or timestamps if available. 
        # For now, just syncing the metrics we have.
        
        supabase_client.table("daily_metrics").upsert(unified_data).execute()
        
        print("  -> Daily Metrics synced.")

    except Exception as e:
        print(f"  -> Failed Daily Metrics: {e}")
