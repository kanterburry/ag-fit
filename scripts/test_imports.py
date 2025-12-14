"""
Test script to verify all Garmin modules import correctly
Run this to check for any import errors before deploying to GitHub Actions
"""

print("Testing Garmin module imports...")

try:
    from scripts.garmin.auth import login_garmin
    print("✅ auth.py imported")
except Exception as e:
    print(f"❌ auth.py failed: {e}")

try:
    from scripts.garmin.db import get_supabase
    print("✅ db.py imported")
except Exception as e:
    print(f"❌ db.py failed: {e}")

try:
    from scripts.garmin.daily import sync_daily_metrics
    print("✅ daily.py imported")
except Exception as e:
    print(f"❌ daily.py failed: {e}")

try:
    from scripts.garmin.biometrics import sync_weight
    print("✅ biometrics.py imported")
except Exception as e:
    print(f"❌ biometrics.py failed: {e}")

try:
    from scripts.garmin.training import sync_hrv, sync_training_status, sync_training_readiness
    print("✅ training.py imported (all 3 functions)")
except Exception as e:
    print(f"❌ training.py failed: {e}")

try:
    from scripts.garmin.activities import sync_activities
    print("✅ activities.py imported")
except Exception as e:
    print(f"❌ activities.py failed: {e}")

try:
    from scripts.garmin.gear import sync_gear
    print("✅ gear.py imported")
except Exception as e:
    print(f"❌ gear.py failed: {e}")

try:
    from scripts.garmin.wellness import sync_wellness
    print("✅ wellness.py imported")
except Exception as e:
    print(f"❌ wellness.py failed: {e}")

try:
    from scripts.garmin.social import sync_social
    print("✅ social.py imported")
except Exception as e:
    print(f"❌ social.py failed: {e}")

try:
    from scripts.garmin.config import validate_config
    print("✅ config.py imported")
except Exception as e:
    print(f"❌ config.py failed: {e}")

print("\n✅ All modules imported successfully!")
print("You can now run: python scripts/garmin_bridge.py")
