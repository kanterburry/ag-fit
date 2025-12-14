
from garminconnect import Garmin

def discover():
    methods = [m for m in dir(Garmin) if not m.startswith('_')]
    print("Available methods:", methods)

if __name__ == "__main__":
    discover()
