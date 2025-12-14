import os
import json
import base64
import sys
from garminconnect import Garmin
from .config import GARMIN_EMAIL, GARMIN_PASS, GARMIN_TOKENS

def login_garmin():
    garminconnect_dir = os.path.expanduser("~/.garminconnect")
    garth_dir = os.path.expanduser("~/.garth")
    os.makedirs(garminconnect_dir, exist_ok=True)
    os.makedirs(garth_dir, exist_ok=True)

    # Restore tokens FIRST if available
    if GARMIN_TOKENS:
        print("Found GARMIN_TOKENS. Restoring session...")
        try:
            tokens_dict = json.loads(base64.b64decode(GARMIN_TOKENS).decode('utf-8'))
            
            # Restore to both .garminconnect and .garth directories
            for directory in [garminconnect_dir, garth_dir]:
                print(f"Restoring {len(tokens_dict)} tokens to {directory}...")
                for filename, content in tokens_dict.items():
                    filepath = os.path.join(directory, filename)
                    with open(filepath, "w", encoding="utf-8") as f:
                        f.write(content)
                
                # Verify tokens were written
                written_files = os.listdir(directory)
                print(f"Contents of {directory}: {written_files}")
            
            print("Session restored successfully.")
        except Exception as e:
            print(f"Warning: Failed to restore tokens: {e}")

    # Attempt login
    try:
        print("Logging in to Garmin Connect...")
        garmin = Garmin()  # No email/password - use tokens only
        garmin.login(garminconnect_dir)
        print("✅ Login successful using stored tokens.")
        return garmin
    except Exception as token_error:
        print(f"Token login failed: {token_error}")
        
        # Fallback to email/password if tokens don't work
        if GARMIN_EMAIL and GARMIN_PASS:
            print("Attempting login with email/password...")
            try:
                garmin = Garmin(GARMIN_EMAIL, GARMIN_PASS)
                garmin.login(garminconnect_dir)
                print("✅ Login successful using credentials.")
                return garmin
            except Exception as cred_error:
                print(f"Credential login also failed: {cred_error}")
                raise Exception(f"All login methods failed. Token error: {token_error}, Credential error: {cred_error}")
        else:
            raise Exception(f"Token login failed and no credentials provided: {token_error}")
