
import os
import json
import base64

def export_tokens():
    token_dir = os.path.expanduser("~/.garminconnect")
    if not os.path.exists(token_dir):
        print(f"Error: Token directory not found at {token_dir}")
        print("Run 'py -3.12 scripts/garmin_bridge.py' interactively first to login.")
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
