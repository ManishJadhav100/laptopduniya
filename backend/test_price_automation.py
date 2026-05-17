import os
import django
from decimal import Decimal

# Setup Django environment
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'laptop_duniya.settings')
django.setup()

from core.models import Laptop, Store, RetailerPrice, PushSubscription

def test_automation():
    print("Testing Price Drop Automation Signals...")

    # 1. Get a laptop and store
    laptop = Laptop.objects.first()
    store = Store.objects.first()
    
    if not laptop or not store:
        print("Error: Need at least one laptop and one store to test.")
        return

    # 2. Ensure a subscription exists for this laptop
    PushSubscription.objects.get_or_create(
        laptop=laptop,
        endpoint="https://fcm.googleapis.com/fcm/send/test-token-123",
        defaults={'p256dh': 'test', 'auth': 'test'}
    )
    print(f"Created/Verified test subscription for: {laptop.title}")

    # 3. Get current price
    rp, _ = RetailerPrice.objects.get_or_create(
        laptop=laptop, 
        store=store, 
        defaults={'price': Decimal('1500.00'), 'url': 'http://test.com'}
    )
    original_price = rp.price
    print(f"Current price at {store.name}: ${original_price}")

    # 4. Trigger a PRICE DROP
    new_price = original_price - Decimal('50.00')
    print(f"\n--- SCENARIO 1: PRICE DROP (${original_price} -> ${new_price}) ---")
    rp.price = new_price
    rp.save()

    # 5. Trigger a PRICE INCREASE (Should NOT trigger alert)
    increased_price = new_price + Decimal('100.00')
    print(f"\n--- SCENARIO 2: PRICE INCREASE (${new_price} -> ${increased_price}) ---")
    rp.price = increased_price
    rp.save()

    print("\nTest complete. Check console output for '--- [SENDING PUSH] ---' logs.")

if __name__ == '__main__':
    test_automation()
