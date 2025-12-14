from .config import USER_ID

def sync_social(garmin_client, supabase_client):
    """Sync challenges, badges, goals, and race predictions"""
    print("Syncing Social & Gamification Data...")
    
    # Sync Challenges
    try:
        adhoc_challenges = garmin_client.get_adhoc_challenges(0, 100)
        badge_challenges = garmin_client.get_badge_challenges(1, 100)
        
        all_challenges = []
        if adhoc_challenges:
            for c in adhoc_challenges:
                all_challenges.append({
                    "challenge_id": str(c.get('uuid') or c.get('id')),
                    "user_id": USER_ID,
                    "name": c.get('challengeName') or c.get('name'),
                    "type": 'adhoc',
                    "status": c.get('userChallengeStatus') or 'active',
                    "start_date": c.get('startDate'),
                    "end_date": c.get('endDate'),
                    "progress_json": c
                })
        
        if badge_challenges:
            for c in badge_challenges:
                all_challenges.append({
                    "challenge_id": str(c.get('badgeId') or c.get('id')),
                    "user_id": USER_ID,
                    "name": c.get('badgeName') or c.get('name'),
                    "type": 'badge',
                    "status": c.get('userBadgeStatus') or 'available',
                    "start_date": c.get('startDate'),
                    "end_date": c.get('endDate'),
                    "progress_json": c
                })
        
        if all_challenges:
            for challenge in all_challenges:
                supabase_client.table("garmin_challenges").upsert(challenge).execute()
            print(f"  -> Synced {len(all_challenges)} challenges")
    except Exception as e:
        print(f"  -> Challenges: {e}")
    
    # Sync Goals (active, future, past)
    try:
        active_goals = garmin_client.get_goals(status='active', start=0, limit=100)
        future_goals = garmin_client.get_goals(status='future', start=0, limit=100)
        
        all_goals = []
        for goals_list, status in [(active_goals, 'active'), (future_goals, 'future')]:
            if goals_list:
                for g in goals_list:
                    all_goals.append({
                        "goal_id": str(g.get('goalId') or g.get('id')),
                        "user_id": USER_ID,
                        "name": g.get('goalName') or g.get('name'),
                        "type": g.get('goalType'),
                        "target_value": g.get('targetValue'),
                        "current_value": g.get('currentValue'),
                        "start_date": g.get('startDate'),
                        "end_date": g.get('endDate'),
                        "status": status
                    })
        
        if all_goals:
            for goal in all_goals:
                supabase_client.table("garmin_goals").upsert(goal).execute()
            print(f"  -> Synced {len(all_goals)} goals")
    except Exception as e:
        print(f"  -> Goals: {e}")
    
    # Sync Race Predictions
    try:
        race_preds = garmin_client.get_race_predictions()
        if race_preds:
            for race in race_preds:
                race_data = {
                    "user_id": USER_ID,
                    "race_name": race.get('raceName'),
                    "predicted_time_seconds": race.get('predictedRaceTimeInSeconds'),
                    "distance_meters": race.get('raceDistanceInMeters'),
                    "confidence_score": race.get('confidenceScore')
                }
                supabase_client.table("garmin_races").insert(race_data).execute()
            print(f"  -> Synced {len(race_preds)} race predictions")
    except Exception as e:
        print(f"  -> Race Predictions: {e}")
    
    print("Social & Gamification sync complete!")
