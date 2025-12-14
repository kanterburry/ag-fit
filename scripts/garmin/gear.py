from .config import USER_ID

def sync_gear(garmin_client, supabase_client):
    print("Syncing Gear...")
    try:
        social = garmin_client.get_user_profile()
        if social:
            display_name = social.get('displayName')
            if not display_name:
                display_name = social.get('fullName') 
            
            if display_name:
                try:
                    gear_list = garmin_client.get_gear(display_name)
                except Exception as gx:
                    print(f"  -> get_gear failed: {gx}")
                    return

                for g in gear_list:
                    data = {
                        "uuid": g.get('uuid'),
                        "user_id": USER_ID,
                        "name": g.get('displayName'),
                        "type_key": g.get('type', {}).get('typeKey'),
                        "brand": g.get('brand'),
                        "model": g.get('model'),
                        "total_distance_meters": g.get('totalDistance'),
                        "status": 'active',
                        "date_added": g.get('createDate')
                    }
                    supabase_client.table("garmin_gear").upsert(data).execute()
                print(f"  -> Synced {len(gear_list)} gear items.")
            else:
                print("  -> Could not determine display name for gear sync.")
        else:
             print("  -> Social profile fetch failed.")
    except Exception as e:
        print(f"  -> Failed Gear: {e}")
