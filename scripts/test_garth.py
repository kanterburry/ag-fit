
import os
import garth
import shutil
from dotenv import load_dotenv

load_dotenv('.env.local')
email = os.getenv("GARMIN_EMAIL")
password = os.getenv("GARMIN_PASS")

print(f"--- TESTING GARTH DIRECT LOGIN ---")
print(f"User: {email}")


print(f"User: {email}")
print(f"HOME: {os.path.expanduser('~')}")
print(f"CWD: {os.getcwd()}")

# Probe Garth
print(f"Garth Dir: {dir(garth)}")
try:
    print(f"Garth Home: {garth.home}")
except:
    pass

# 3. Attempt Login
try:
    garth.login(email, password)
    print("✅ LOGIN SUCCESS!")
except Exception as e:
    print(f"❌ LOGIN FAILED: {e}")

