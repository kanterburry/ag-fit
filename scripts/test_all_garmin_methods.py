#!/usr/bin/env python3
"""
Systematic Garmin API Method Tester
Tests all available methods to find VO2 max data
"""

import json
from datetime import date, timedelta
from garmin.auth import login_garmin

# Login using existing auth module
print("Logging in to Garmin Connect...")
client = login_garmin()
print("[OK] Logged in successfully\n")

# Get all methods
all_methods = [m for m in dir(client) if not m.startswith('_') and callable(getattr(client, m))]
print(f"Total methods available: {len(all_methods)}\n")

# Filter to health/fitness related methods
keywords = ['health', 'metric', 'vo2', 'max', 'fitness', 'training', 'stat', 'summary', 'body', 'heart']
relevant_methods = [m for m in all_methods if any(k in m.lower() for k in keywords)]

print(f"Testing {len(relevant_methods)} health/fitness related methods:\n")
print("=" * 80)

# Test parameters
today = date.today().isoformat()
week_ago = (date.today() - timedelta(days=7)).isoformat()

results = {}

for method_name in sorted(relevant_methods):
    print(f"\nTesting: {method_name}")
    print("-" * 80)
    
    try:
        method = getattr(client, method_name)
        
        # Try calling with different parameter combinations
        call_attempts = [
            ("no args", lambda: method()),
            ("date arg", lambda: method(today)),
            ("cdate arg", lambda: method(cdate=today)),
            ("start/end dates", lambda: method(week_ago, today)),
        ]
        
        response = None
        successful_call = None
        
        for attempt_name, attempt_func in call_attempts:
            try:
                response = attempt_func()
                successful_call = attempt_name
                break
            except TypeError as e:
                continue  # Try next parameter combination
            except Exception as e:
                print(f"  [FAIL] {attempt_name}: {type(e).__name__}: {str(e)[:100]}")
                break
        
        if response is not None:
            print(f"  [OK] Success with {successful_call}")
            
            # Analyze response
            response_type = type(response).__name__
            print(f"  Type: {response_type}")
            
            if isinstance(response, dict):
                keys = list(response.keys())
                print(f"  Keys ({len(keys)}): {keys[:10]}")  # First 10 keys
                
                # Look for VO2 max related keys
                vo2_keys = [k for k in keys if 'vo2' in str(k).lower()]
                if vo2_keys:
                    print(f"  *** VO2-RELATED KEYS FOUND: {vo2_keys}")
                    for k in vo2_keys:
                        print(f"     {k} = {response[k]}")
                
                # Show sample data (truncated)
                sample = json.dumps(response, indent=2, default=str)
                if len(sample) > 500:
                    print(f"  Sample: {sample[:500]}...")
                else:
                    print(f"  Data: {sample}")
                    
            elif isinstance(response, list):
                print(f"  List length: {len(response)}")
                if response and isinstance(response[0], dict):
                    print(f"  First item keys: {list(response[0].keys())[:10]}")
            else:
                print(f"  Value: {str(response)[:200]}")
            
            results[method_name] = {
                'success': True,
                'call': successful_call,
                'type': response_type,
                'has_vo2': bool(vo2_keys) if isinstance(response, dict) else False
            }
        else:
            results[method_name] = {'success': False, 'reason': 'No successful call pattern'}
            
    except Exception as e:
        print(f"  [ERROR] Fatal error: {type(e).__name__}: {e}")
        results[method_name] = {'success': False, 'reason': str(e)}

# Summary
print("\n" + "=" * 80)
print("SUMMARY")
print("=" * 80)

successful = [m for m, r in results.items() if r.get('success')]
with_vo2 = [m for m, r in results.items() if r.get('has_vo2')]

print(f"\n[OK] Successful calls: {len(successful)}/{len(relevant_methods)}")
print(f"*** Methods with VO2 data: {len(with_vo2)}")

if with_vo2:
    print(f"\n*** VO2 MAX FOUND IN THESE METHODS:")
    for method in with_vo2:
        print(f"  - {method} ({results[method]['call']})")
else:
    print("\n[WARNING] No VO2 max data found in any tested method")
    print("   User may need to:")
    print("   - Complete qualifying outdoor runs (GPS + HR)")
    print("   - Wait 24-48 hours for Garmin to calculate")
    print("   - Check if device/account supports VO2 max")
