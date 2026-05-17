import os
import django
import random
from decimal import Decimal

# Setup Django environment
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'laptop_duniya.settings')
django.setup()

from core.models import Laptop, Store, RetailerPrice

def populate():
    print("Populating Multi-Store pricing data...")

    # 1. Create Stores
    amazon, _ = Store.objects.get_or_create(name="Amazon", defaults={'base_url': 'https://amazon.com'})
    flipkart, _ = Store.objects.get_or_create(name="Flipkart", defaults={'base_url': 'https://flipkart.com'})
    dell_store, _ = Store.objects.get_or_create(name="Dell Official", defaults={'base_url': 'https://dell.com'})
    
    laptops = Laptop.objects.all()
    
    if not laptops.exists():
        print("No laptops found. Please run populate_deals.py first.")
        return

    for laptop in laptops:
        # Create 2-3 prices for each laptop
        stores_to_add = random.sample([amazon, flipkart, dell_store], k=random.randint(2, 3))
        
        # Base price as reference
        base = float(laptop.base_price or 1000)
        
        for store in stores_to_add:
            # Generate a slightly different price
            variance = random.uniform(-100, 100)
            store_price = Decimal(f"{max(base + variance, 100):.2f}")
            
            RetailerPrice.objects.get_or_create(
                laptop=laptop,
                store=store,
                defaults={
                    'price': store_price,
                    'url': f"{store.base_url}/dp/{laptop.slug}",
                    'is_available': True
                }
            )
            print(f"  Added {store.name} price ${store_price} for {laptop.title}")

    print("Success: Multi-Store pricing populated.")

if __name__ == '__main__':
    populate()
