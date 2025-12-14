
import os
import json
import base64

def export_tokens():
    possible_dirs = [
        os.path.expanduser("~/.garth"),
        os.path.expanduser("~/.garminconnect")
    ]
    
    token_dir = None
    for d in possible_dirs:
        if os.path.exists(d) and os.listdir(d):
            token_dir = d
            break
            
    if not token_dir:
        print(f"Error: No token directories found in {possible_dirs}")
        print("Run 'py -3.12 scripts/generate_keys.py' first.")
        return

    tokens = {}
    print(f"Reading tokens from {token_dir}...")
    
    files = [f for f in os.listdir(token_dir) if os.path.isfile(os.path.join(token_dir, f))]
    if not files:
         print("No token files found.")
         return

    for filename in files:
        with open(os.path.join(token_dir, filename), "r", encoding="utf-8") as f:
            tokens[filename] = f.read()

    # Serialize to JSON then Base64
    tokens_json = json.dumps(tokens)
    tokens_b64 = base64.b64encode(tokens_json.encode('utf-8')).decode('utf-8')

    print("\nSUCCESS! Copy the string below and add it as a GitHub Secret named 'GARMIN_TOKENS':\n")
    print(tokens_b64)
    print("\n---------------------------------------------------")

if __name__ == "__main__":
    export_tokens()
