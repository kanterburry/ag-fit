from .config import USER_ID
from datetime import timedelta, date

def sync_hrv(garmin_client, supabase_client, target_date):
    print(f"Syncing HRV for {target_date}...")
    try:
        hrv = garmin_client.get_hrv_data(target_date.isoformat())
        if not hrv or 'hrvSummary' not in hrv:
             # print("  -> No HRV data found.")
             return

        s = hrv['hrvSummary']
        data = {
            "date": target_date.isoformat(),
            "user_id": USER_ID,
            "nightly_avg_ms": s.get('lastNightAvg') or s.get('weeklyAvg'), 
            "last_night_5min_max_ms": s.get('lastNight5MinHigh'),
            "baseline_low_ms": s.get('baseline', {}).get('low'),
            "baseline_high_ms": s.get('baseline', {}).get('high'),
            "status": s.get('status')
        }
        
        supabase_client.table("garmin_hrv").upsert(data).execute()
        print("  -> HRV synced.")
    except Exception as e:
        print(f"  -> Failed HRV: {e}")

def sync_training_status(garmin_client, supabase_client):
    """Sync comprehensive training status including VO2 Max, Fitness Age, Lactate Threshold"""
    print("Syncing Training Status...")
    today = date.today().isoformat()
    
    try:
        training_status = garmin_client.get_training_status(today)
        
        if not training_status:
            print("  -> No training status data")
            return
        
        # Extract VO2 Max from training status (already fetched above)
        vo2_max_running = None
        vo2_max_cycling = None
        
        # The training_status response contains mostRecentVO2Max field
        if 'mostRecentVO2Max' in training_status and training_status['mostRecentVO2Max']:
            vo2_data = training_status['mostRecentVO2Max']
            
            # VO2 max can be structured in different ways
            if isinstance(vo2_data, dict):
                # Check for generic (running) VO2 max
                if 'generic' in vo2_data:
                    vo2_max_running = vo2_data['generic'].get('value')
                elif 'value' in vo2_data:
                    vo2_max_running = vo2_data['value']
                    
                # Check for cycling VO2 max
                if 'cycling' in vo2_data:
                    vo2_max_cycling = vo2_data['cycling'].get('value')
            elif isinstance(vo2_data, (int, float)):
                # Simple numeric value
                vo2_max_running = vo2_data
                
            print(f"  -> VO2 Max - Running: {vo2_max_running}, Cycling: {vo2_max_cycling}")
        else:
            print(f"  -> No VO2 Max data available (user may need qualifying GPS+HR activities)")
        
        # Get Lactate Threshold
        lactate_threshold = None
        try:
            lactate_threshold = garmin_client.get_lactate_threshold()
        except:
            pass
        
        # Get Fitness Age
        fitness_age_data = None
        try:
            fitness_age_data = garmin_client.get_fitnessage_data(today)
        except:
            pass
        
        # Get Endurance Score
        endurance_score = None
        try:
            endurance_score = garmin_client.get_endurance_score(week_ago, today)
        except:
            pass
        
        # Get Hill Score
        hill_score = None
        try:
            hill_score = garmin_client.get_hill_score(week_ago, today)
        except:
            pass
        
        data = {
            "date": today,
            "user_id": USER_ID,
            "status": training_status.get('trainingStatus'),
            "load_balance_json": training_status.get('loadBalance'),
            "fitness_age": fitness_age_data.get('fitnessAge') if fitness_age_data else None,
            "lactate_threshold_bpm": lactate_threshold.get('lactateThresholdHeartRate') if lactate_threshold else None,
            "lactate_threshold_speed": lactate_threshold.get('lactateThresholdSpeed') if lactate_threshold else None,
            "vo2_max_running": vo2_max_running,
            "vo2_max_cycling": vo2_max_cycling,
            "endurance_score": endurance_score.get('enduranceScore') if endurance_score and isinstance(endurance_score, dict) else None,
            "heat_acclimation": training_status.get('heatAcclimation'),
            "altitude_acclimation": training_status.get('altitudeAcclimation'),
            "training_load_balance_json": training_status.get('loadBalance')
        }
        
        supabase_client.table("garmin_training_status").upsert(data).execute()
        print("  -> Training Status synced")
    except Exception as e:
        print(f"  -> Failed Training Status: {e}")

def sync_training_readiness(garmin_client, supabase_client):
    """Sync training readiness score"""
    print("Syncing Training Readiness...")
    today = date.today().isoformat()
    
    try:
        readiness = garmin_client.get_training_readiness(today)
        
        if not readiness:
            print("  -> No readiness data")
            return
        
        data = {
            "date": today,
            "user_id": USER_ID,
            "score": readiness.get('score'),
            "rating": readiness.get('scoreType'),
            "recovery_time_hours": readiness.get('recoveryTime')
        }
        
        supabase_client.table("garmin_training_readiness").upsert(data).execute()
        print("  -> Training Readiness synced")
    except Exception as e:
        print(f"  -> Failed Training Readiness: {e}")
