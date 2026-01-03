from .config import USER_ID

def sync_body_battery(garmin_client, supabase_client, target_date):
    """Sync body battery data for a specific date"""
    print(f"Syncing Body Battery for {target_date}...")
    try:
        # Get body battery data using the dedicated API endpoint
        body_battery = garmin_client.get_body_battery(target_date.isoformat(), target_date.isoformat())
        
        if body_battery and len(body_battery) > 0:
            # Find the data for our target date
            day_data = None
            for item in body_battery:
                if item.get('date') == target_date.isoformat():
                    day_data = item
                    break
            
            if day_data:
                # Extract charged/drained values (summary for the day)
                charged = day_data.get('charged')
                drained = day_data.get('drained')
                
                # Extract battery levels from the values array
                # Format: [[timestamp1, level1], [timestamp2, level2], ...]
                values_array = day_data.get('bodyBatteryValuesArray', [])
                battery_levels = [item[1] for item in values_array if item and len(item) > 1 and item[1] is not None]
                
                if battery_levels:
                    data = {
                        "date": target_date.isoformat(),
                        "user_id": USER_ID,
                        "body_battery_min": min(battery_levels),
                        "body_battery_max": max(battery_levels),
                        "body_battery_charged": charged,
                        "body_battery_drained": drained,
                        "body_battery_readings_json": day_data  # Store full data
                    }
                    
                    supabase_client.table("garmin_body_battery").upsert(data).execute()
                    print(f"  -> Body Battery synced: min={min(battery_levels)}, max={max(battery_levels)}, charged={charged}, drained={drained}")
                else:
                    print("  -> No valid body battery readings for this date")
            else:
                print(f"  -> No body battery data found for {target_date}")
        else:
            print("  -> API returned empty body battery data")
            
    except AttributeError as e:
        print(f"  -> Body Battery API not available: {e}")
    except Exception as e:
        print(f"  -> Failed Body Battery: {e}")
