from .config import USER_ID

def sync_activities(garmin_client, supabase_client, limit=10):
    print(f"Syncing Activities (Last {limit})...")
    try:
        activities = garmin_client.get_activities(0, limit)
        if not activities:
            print("  -> No activities found.")
            return

        for act in activities:
            act_id = act.get('activityId')
            start_time = act.get('startTimeLocal') # ISO string
            
            data = {
                "activity_id": act_id,
                "user_id": USER_ID,
                "name": act.get('activityName'),
                "activity_type": act.get('activityType', {}).get('typeKey'),
                "start_time": start_time,
                "duration_seconds": act.get('duration'),
                "distance_meters": act.get('distance'),
                "avg_hr": int(act.get('averageHR')) if act.get('averageHR') is not None else None,
                "max_hr": int(act.get('maxHR')) if act.get('maxHR') is not None else None,
                "calories": int(act.get('calories')) if act.get('calories') is not None else None,
                "avg_speed_mps": act.get('averageSpeed'),
                "max_speed_mps": act.get('maxSpeed'),
                "elevation_gain_meters": act.get('elevationGain'),
                "steps": int(act.get('steps')) if act.get('steps') is not None else None,
                "detailed_json": act
            }
            
            supabase_client.table("garmin_activities").upsert(data).execute()
            
            # Legacy Table Sync
            legacy_data = {
                 "user_id": USER_ID,
                 "activity_type": data["activity_type"],
                 "distance": float(data["distance_meters"]) if data["distance_meters"] is not None else None, 
                 "duration": int(data["duration_seconds"]) if data["duration_seconds"] is not None else None,
                 "avg_hr": data["avg_hr"],
                 "calories": data["calories"],
                 "start_time": data["start_time"]
            }
            
            existing = supabase_client.table("activities").select("id").eq("user_id", USER_ID).eq("start_time", start_time).execute()
            if existing.data:
                 supabase_client.table("activities").update(legacy_data).eq("id", existing.data[0]['id']).execute()
            else:
                 supabase_client.table("activities").insert(legacy_data).execute()

        print(f"  -> Synced {len(activities)} activities.")

    except Exception as e:
         print(f"  -> Failed Activities: {e}")
