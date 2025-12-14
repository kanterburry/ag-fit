from .config import USER_ID

def sync_wellness(garmin_client, supabase_client):
    """Sync comprehensive wellness data: Hydration, BP, SpO2, Respiration, Menstrual, Pregnancy"""
    print("Syncing Wellness Data...")
    
    from datetime import date
    today = date.today().isoformat()
    
    # Fetch all wellness data
    hydration = None
    blood_pressure = None
    spo2 = None
    respiration = None
    menstrual = None
    pregnancy = None
    
    try:
        hydration = garmin_client.get_hydration_data(today)
    except Exception as e:
        print(f"  -> Hydration: {e}")
    
    try:
        # Get BP for the last week
        from datetime import timedelta
        week_ago = (date.today() - timedelta(days=7)).isoformat()
        blood_pressure = garmin_client.get_blood_pressure(week_ago, today)
    except Exception as e:
        print(f"  -> Blood Pressure: {e}")
    
    try:
        spo2 = garmin_client.get_spo2_data(today)
    except Exception as e:
        print(f"  -> SpO2: {e}")
    
    try:
        respiration = garmin_client.get_respiration_data(today)
    except Exception as e:
        print(f"  -> Respiration: {e}")
    
    try:
        menstrual = garmin_client.get_menstrual_data_for_date(today)
    except Exception as e:
        print(f"  -> Menstrual: {e}")
    
    try:
        pregnancy = garmin_client.get_pregnancy_summary()
    except Exception as e:
        print(f"  -> Pregnancy: {e}")
    
    # Sync Respiration Data
    if respiration:
        resp_data = {
            "date": today,
            "user_id": USER_ID,
            "avg_waking_breaths_per_minute": respiration.get('avgWakingRespirationValue'),
            "avg_sleeping_breaths_per_minute": respiration.get('avgSleepRespirationValue'),
            "highest_breaths_per_minute": respiration.get('highestRespirationValue'),
            "lowest_breaths_per_minute": respiration.get('lowestRespirationValue')
        }
        supabase_client.table("garmin_respiration").upsert(resp_data).execute()
        print(f"  -> Synced Respiration")
    
    # Sync SpO2 Data
    if spo2 and isinstance(spo2, list) and len(spo2) > 0:
        latest_spo2 = spo2[0]  # Get most recent reading
        spo2_data = {
            "date": today,
            "user_id": USER_ID,
            "avg_spo2_percentage": latest_spo2.get('userProfilePK'),  # This needs correct mapping
            "lowest_spo2_percentage": latest_spo2.get('lowestSpO2Value')
        }
        supabase_client.table("garmin_spo2").upsert(spo2_data).execute()
        print(f"  -> Synced SpO2")
    
    # Sync Comprehensive Wellness Data
    wellness_data = {
        "date": today,
        "user_id": USER_ID,
        "hydration_liters": None,
        "hydration_goal_liters": None,
        "blood_pressure_systolic": None,
        "blood_pressure_diastolic": None,
        "blood_pressure_pulse": None,
        "menstrual_cycle_json": None,
        "pregnancy_json": None,
        "jet_lag_json": None
    }
    
    if hydration:
        ml_value = hydration.get('valueInML', 0)
        ml_goal = hydration.get('goalInML', 0)
        wellness_data["hydration_liters"] = ml_value / 1000 if ml_value else None
        wellness_data["hydration_goal_liters"] = ml_goal / 1000 if ml_goal else None
    
    if blood_pressure and isinstance(blood_pressure, dict):
        summaries = blood_pressure.get('measurementSummaries', [])
        if summaries and len(summaries) > 0:
            latest = summaries[0]
            measurements = latest.get('measurements', [])
            if measurements and len(measurements) > 0:
                latest_bp = measurements[0]
                wellness_data["blood_pressure_systolic"] = latest_bp.get('systolic')
                wellness_data["blood_pressure_diastolic"] = latest_bp.get('diastolic')
                wellness_data["blood_pressure_pulse"] = latest_bp.get('pulse')
    
    if menstrual:
        wellness_data["menstrual_cycle_json"] = menstrual
    
    if pregnancy:
        wellness_data["pregnancy_json"] = pregnancy
    
    # Only insert if we have some data
    if any(v is not None for k, v in wellness_data.items() if k not in ['date', 'user_id']):
        supabase_client.table("garmin_wellness").upsert(wellness_data).execute()
        print(f"  -> Synced Wellness Data")
    else:
        print(f"  -> No wellness data to sync")
    
    print("Wellness sync complete!")
