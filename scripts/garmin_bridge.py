

import sys
from datetime import date, timedelta
from garmin.auth import login_garmin
from garmin.db import get_supabase
from garmin.daily import sync_daily_metrics
from garmin.biometrics import sync_weight
from garmin.training import sync_hrv, sync_training_status, sync_training_readiness
from garmin.activities import sync_activities
from garmin.gear import sync_gear
from garmin.wellness import sync_wellness
from garmin.social import sync_social
from garmin.config import validate_config

class GarminBridge:
    def __init__(self):
        validate_config()
        self.garmin = login_garmin()
        self.supabase = get_supabase()

    def run(self):
        today = date.today()
        # Sync last 3 days of daily metrics
        for i in range(3):
            d = today - timedelta(days=i)
            try:
                sync_daily_metrics(self.garmin, self.supabase, d)
            except Exception as e:
                print(f"Failed to sync daily metrics for {d}: {e}")
            
            try:
                sync_hrv(self.garmin, self.supabase, d)
            except Exception as e:
                print(f"Failed to sync HRV for {d}: {e}")
            
            try:
                sync_weight(self.garmin, self.supabase, d)
            except Exception as e:
                print(f"Failed to sync weight for {d}: {e}")
        
        # Sync wellness data (respiration, SpO2, BP, pregnancy)
        try:
            sync_wellness(self.garmin, self.supabase)
        except Exception as e:
            print(f"Failed to sync wellness data: {e}")
        
        # Sync training metrics (status, readiness, VO2 max, fitness age)
        try:
            sync_training_status(self.garmin, self.supabase)
        except Exception as e:
            print(f"Failed to sync training status: {e}")
        
        try:
            sync_training_readiness(self.garmin, self.supabase)
        except Exception as e:
            print(f"Failed to sync training readiness: {e}")
        
        # Sync social features (challenges, goals, race predictions)
        try:
            sync_social(self.garmin, self.supabase)
        except Exception as e:
            print(f"Failed to sync social data: {e}")
        
        # Sync activities and gear
        try:
            sync_activities(self.garmin, self.supabase, limit=10)
        except Exception as e:
            print(f"Failed to sync activities: {e}")
        
        try:
            sync_gear(self.garmin, self.supabase)
        except Exception as e:
            print(f"Failed to sync gear: {e}")
        
        print("✅ Garmin sync completed!")

if __name__ == "__main__":
    try:
        bridge = GarminBridge()
        bridge.run()
    except Exception as e:
        print(f"Bridge failed: {e}")
        sys.exit(1)
