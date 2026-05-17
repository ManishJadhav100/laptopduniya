import os
import django
from django.utils import timezone
from datetime import timedelta

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'laptop_duniya.settings')
django.setup()

from core.models import Brand, Coupon, News, Review, Solution, BuyingGuide, Laptop

def run():
    print("Populating Coupons and Linking Brands...")
    
    # 1. Create Coupons
    brands = Brand.objects.all()
    for brand in brands:
        Coupon.objects.update_or_create(
            brand=brand,
            title=f"Exclusive {brand.name} Student Discount",
            defaults={
                'code': f"{brand.name.upper()}EDU10",
                'description': f"Get an extra 10% off all {brand.name} laptops with this verified student promo code.",
                'link': "https://www.hp.com/in-en/shop/",
                'expiry_date': timezone.now().date() + timedelta(days=30),
                'is_active': True,
                'is_deal': False
            }
        )
        
        Coupon.objects.update_or_create(
            brand=brand,
            title=f"Flat $200 Off on {brand.name} Gaming Laptops",
            defaults={
                'code': "",
                'description': f"Direct discount applied at checkout for all high-end gaming machines from {brand.name}.",
                'link': "https://www.dell.com/en-in",
                'expiry_date': timezone.now().date() + timedelta(days=15),
                'is_active': True,
                'is_deal': True
            }
        )

    print("Linking Content to Brands...")
    
    # 2. Link News
    for n in News.objects.all():
        for brand in brands:
            if brand.name.lower() in n.title.lower():
                n.brand = brand
                n.save()
                break
    
    # 3. Link Reviews
    for r in Review.objects.all():
        if r.laptop and r.laptop.brand:
            r.brand = r.laptop.brand
            r.save()

    # 4. Link Solutions
    for s in Solution.objects.all():
        # Check if any related laptop has a brand
        related_laptop = s.related_laptops.first()
        if related_laptop and related_laptop.brand:
            s.brand = related_laptop.brand
            s.save()
        else:
            # Fallback to title keyword
            for brand in brands:
                if brand.name.lower() in s.title.lower():
                    s.brand = brand
                    s.save()
                    break

    # 5. Link Guides
    for g in BuyingGuide.objects.all():
        for brand in brands:
            if brand.name.lower() in g.title.lower():
                g.brand = brand
                g.save()
                break

    print("Data Population and Linking Complete!")

if __name__ == '__main__':
    run()
