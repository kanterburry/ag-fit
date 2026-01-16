
import sys
import os
import json

sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from garmin.db import get_supabase
from garmin.config import USER_ID

def inspect_protocols():
    supabase = get_supabase()
    print(f"Inspecting protocols for User: {USER_ID}")

    response = supabase.table("protocols")\
        .select("*")\
        .eq("user_id", USER_ID)\
        .execute()
    
    protocols = response.data
    if not protocols:
        print("No protocols found.")
    else:
        print(f"Found {len(protocols)} protocols:")
        for p in protocols:
            print(f"- ID: {p['id']}")
            print(f"  Title: {p['title']}")
            print(f"  Status: {p['status']}")
            print(f"  Type: {p.get('protocol_type', 'N/A')}")
            print(f"  Created: {p['created_at']}")
            print("-" * 20)

if __name__ == "__main__":
    inspect_protocols()
