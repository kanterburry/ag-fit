
import os
import garth
import json
import base64
from dotenv import load_dotenv

def generate_and_export():
    # Load env vars
    load_dotenv('.env.local')
    email = os.getenv("GARMIN_EMAIL")
    password = os.getenv("GARMIN_PASS")
    
    if not email or not password:
        print("Error: GARMIN_EMAIL and GARMIN_PASS must be set in .env.local")
        return

    print(f"--- GARMIN TOKEN GENERATOR ---")
    print(f"Logging in as: {email}")
    print("If prompted, please enter your MFA code.")

    # 1. Login (Interactive)
    # Garth will automatically handle prompt for MFA
    try:
        garth.login(email, password)
        print("\n✅ Login Successful!")
    except Exception as e:
        print(f"\n❌ Login Failed: {e}")
        return

    # 2. Export Tokens from Memory
    # Garth stores tokens in garth.client.Client.sess_args usually, 
    # but we can also dump them using the library's save logic or iterating internal state.
    # Actually, garth.client.dumps() returns the cache!
    
    print("Exporting tokens...")
    try:
        # Get the internal token dictionary
        # garth.save() writes to disk. We want memory.
        # We can use a temp dir, save, read, then delete.
        import tempfile
        import shutil
        
        with tempfile.TemporaryDirectory() as temp_dir:
            garth.save(temp_dir)
            
            # Read files back
            tokens = {}
            for filename in os.listdir(temp_dir):
                with open(os.path.join(temp_dir, filename), "r", encoding="utf-8") as f:
                    tokens[filename] = f.read()

            # Encode
            tokens_json = json.dumps(tokens)
            tokens_b64 = base64.b64encode(tokens_json.encode('utf-8')).decode('utf-8')

            print("\n" + "="*60)
            print("SUCCESS! COPY THE KEY BELOW FOR GITHUB SECRETS (GARMIN_TOKENS):")
            print("="*60 + "\n")
            print(tokens_b64)
            print("\n" + "="*60)
            
    except Exception as e:
        print(f"Export failed: {e}")

if __name__ == "__main__":
    generate_and_export()
