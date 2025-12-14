
import os
import sys

print("--- DIAGNOSTICS START ---", flush=True)
print(f"CWD: {os.getcwd()}", flush=True)
print(f"Home: {os.path.expanduser('~')}", flush=True)
if os.name == 'nt':
    print(f"AppData: {os.getenv('LOCALAPPDATA')}", flush=True)

print("--- CHECKING TOKENS ---", flush=True)
tokens = os.getenv("GARMIN_TOKENS")
if tokens:
    print(f"GARMIN_TOKENS: Present (Length: {len(tokens)})", flush=True)
else:
    print("GARMIN_TOKENS: MISSING", flush=True)

print("--- CHECKING FILE SYSTEM ---", flush=True)
paths_to_check = [
    os.path.expanduser("~/.garminconnect"),
    os.path.expanduser("~/.garth"),
    os.path.join(os.getenv('LOCALAPPDATA', ''), 'garth') if os.name == 'nt' else None
]

for p in paths_to_check:
    if p and os.path.exists(p):
        print(f"Found directory: {p}", flush=True)
    else:
        print(f"Not found: {p}", flush=True)

print("--- DIAGNOSTICS END ---", flush=True)
