
from garminconnect import Garmin
import inspect

def list_methods():
    print("Methods in Garmin class:")
    for name, method in inspect.getmembers(Garmin, predicate=inspect.isfunction):
        if not name.startswith('_'):
             print(f"- {name}")

if __name__ == "__main__":
    list_methods()
