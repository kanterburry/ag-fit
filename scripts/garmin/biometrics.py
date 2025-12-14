from .config import USER_ID

def sync_weight(garmin_client, supabase_client, target_date):
    print(f"Syncing Weight for {target_date}...")
    try:
        weight_data = garmin_client.get_body_composition(target_date.isoformat())
        if weight_data and 'totalAverage' in weight_data:
            avg = weight_data['totalAverage']
            data = {
                "date": target_date.isoformat(),
                "user_id": USER_ID,
                "weight_kg": avg.get('weight') / 1000.0 if avg.get('weight') else None,
                "bmi": avg.get('bmi'),
                "body_fat_percent": avg.get('bodyFat'),
                "body_water_percent": avg.get('bodyWater'),
                "muscle_mass_kg": avg.get('muscleMass') / 1000.0 if avg.get('muscleMass') else None,
                "bone_mass_kg": avg.get('boneMass') / 1000.0 if avg.get('boneMass') else None,
            }
            supabase_client.table("garmin_weight").upsert(data).execute()
            print("  -> Weight synced.")
        else:
            # print("  -> No weight data.")
            pass
    except Exception as e:
        print(f"  -> Failed Weight: {e}")
