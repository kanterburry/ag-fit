
import os
import shutil
import garth
from garminconnect import Garmin

def clean_slate():
    print("--- DEBUGGING GARTH PATHS ---")
    
    # 1. Check Standard Home Paths
    home = os.path.expanduser("~")
    paths = [
        os.path.join(home, ".garth"),
        os.path.join(home, ".garminconnect"),
        "C:\\Users\\kante\\.garth",
        "C:\\Users\\kante\\.garminconnect"
    ]

    # 2. Check Local AppData (just in case)
    if os.name == 'nt':
        appdata = os.getenv('LOCALAPPDATA')
        if appdata:
            paths.append(os.path.join(appdata, "garth"))

    found = False
    for p in paths:
        if os.path.exists(p):
            print(f"FOUND token directory at: {p}")
            try:
                if os.path.isdir(p):
                    shutil.rmtree(p)
                else:
                    os.remove(p)
                print(f" -> DELETED {p}")
                found = True
            except Exception as e:
                print(f" -> FAILED to delete {p}: {e}")
        else:
            print(f"Checked {p}: Not found")

    if not found:
        print("No obvious token directories found.")
    else:
        print("Cleanup complete.")

if __name__ == "__main__":
    clean_slate()
