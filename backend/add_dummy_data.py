import os
import django
import random

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'laptop_duniya.settings')
django.setup()

from core.models import (
    Brand, Category, SpecGroup, SpecKey, SpecValue, Laptop,
    News, Review, Solution, BuyingGuide, BuyingGuideItem
)
from django.utils.text import slugify

def run():
    print("Flushing old data...")
    Brand.objects.all().delete()
    Category.objects.all().delete()
    SpecGroup.objects.all().delete()

    print("Creating Brands...")
    b_apple, _ = Brand.objects.get_or_create(name="Apple")
    b_dell, _ = Brand.objects.get_or_create(name="Dell")
    b_asus, _ = Brand.objects.get_or_create(name="ASUS")
    b_lenovo, _ = Brand.objects.get_or_create(name="Lenovo")

    print("Creating Categories...")
    c_gaming, _ = Category.objects.get_or_create(name="Gaming")
    c_business, _ = Category.objects.get_or_create(name="Business")
    c_student, _ = Category.objects.get_or_create(name="Student")
    c_premium, _ = Category.objects.get_or_create(name="Premium")

    print("Creating Specs Taxonomy...")
    sg_cpu, _ = SpecGroup.objects.get_or_create(name="Processor")
    sg_display, _ = SpecGroup.objects.get_or_create(name="Display")
    sg_battery, _ = SpecGroup.objects.get_or_create(name="Battery")

    sk_cpu_model, _ = SpecKey.objects.get_or_create(name="CPU Model", group=sg_cpu)
    sk_cores, _ = SpecKey.objects.get_or_create(name="Cores", group=sg_cpu)
    sk_screen, _ = SpecKey.objects.get_or_create(name="Screen Size", group=sg_display)
    sk_refresh, _ = SpecKey.objects.get_or_create(name="Refresh Rate", group=sg_display)
    sk_capacity, _ = SpecKey.objects.get_or_create(name="Capacity", group=sg_battery)

    print("Creating Laptops...")
    laptops_data = [
        {
            "title": "MacBook Pro 14 M3 Pro",
            "brand": b_apple,
            "cats": [c_premium, c_business],
            "price": 1999.00,
            "pros": "<ul><li>Incredible battery life</li><li>Stunning Mini-LED screen</li></ul>",
            "cons": "<ul><li>Expensive</li><li>Cannot be upgraded</li></ul>",
            "specs": {
                sk_cpu_model: "Apple M3 Pro",
                sk_cores: "11-Core",
                sk_screen: "14.2 inches Mini-LED",
                sk_refresh: "120Hz ProMotion",
                sk_capacity: "72.4 Wh"
            }
        },
        {
            "title": "Dell XPS 15 (2024)",
            "brand": b_dell,
            "cats": [c_premium, c_business],
            "price": 1699.00,
            "pros": "<ul><li>Beautiful edge-to-edge display</li><li>Premium build</li></ul>",
            "cons": "<ul><li>Webcam is mediocre</li></ul>",
            "specs": {
                sk_cpu_model: "Intel Core Ultra 7 155H",
                sk_cores: "16-Core",
                sk_screen: "15.6 inches OLED",
                sk_refresh: "60Hz",
                sk_capacity: "86 Wh"
            }
        },
        {
            "title": "ASUS ROG Zephyrus G14",
            "brand": b_asus,
            "cats": [c_gaming, c_premium],
            "price": 1599.00,
            "pros": "<ul><li>Amazing gaming performance</li><li>Premium aluminum chassis</li></ul>",
            "cons": "<ul><li>Runs hot</li></ul>",
            "specs": {
                sk_cpu_model: "AMD Ryzen 9 8945HS",
                sk_cores: "8-Core",
                sk_screen: "14 inches OLED",
                sk_refresh: "120Hz",
                sk_capacity: "73 Wh"
            }
        },
        {
            "title": "Lenovo IdeaPad Slim 3",
            "brand": b_lenovo,
            "cats": [c_student],
            "price": 499.00,
            "pros": "<ul><li>Very affordable</li><li>Good keyboard</li></ul>",
            "cons": "<ul><li>Plastic build</li><li>Average screen</li></ul>",
            "specs": {
                sk_cpu_model: "Intel Core i3-1315U",
                sk_cores: "6-Core",
                sk_screen: "15.6 inches IPS",
                sk_refresh: "60Hz",
                sk_capacity: "42 Wh"
            }
        }
    ]

    laptop_instances = []
    for ld in laptops_data:
        l, _ = Laptop.objects.get_or_create(
            title=ld['title'],
            brand=ld['brand'],
            base_price=ld['price'],
            pros=ld['pros'],
            cons=ld['cons'],
            meta_description=f"Check out the specs and details of the {ld['title']}"
        )
        l.categories.set(ld['cats'])
        
        for skey, val in ld['specs'].items():
            SpecValue.objects.get_or_create(laptop=l, spec_key=skey, value=val)
        
        laptop_instances.append(l)

    print("Creating News...")
    n1, _ = News.objects.get_or_create(
        title="Apple Announces New M4 Chips",
        category="Industry News",
        content="<p>Apple has surprisingly unveiled its new M4 processor family, built on a second-generation 3nm process.</p>",
        meta_description="Apple M4 chips are here sooner than expected."
    )
    n1.related_laptops.add(laptop_instances[0])

    print("Creating Solution...")
    s1, _ = Solution.objects.get_or_create(
        title="How to Fix Laptop Overheating",
        content="<h3>1. Clean the fans</h3><p>Dust is the enemy.</p><h3>2. Undervolt CPU</h3><p>Reduces temps significantly.</p>",
        meta_description="Step by step guide to fixing laptop overheating issues."
    )
    s1.related_laptops.add(laptop_instances[2])

    print("Creating Review...")
    Review.objects.get_or_create(
        laptop=laptop_instances[0],
        title="MacBook Pro 14 M3 Pro Review: The Perfect Machine",
        content="<p>We tested the MacBook over 2 weeks and the battery is unbelievable.</p>",
        performance_rating=9.5,
        battery_rating=10.0,
        display_rating=9.5,
        value_rating=7.5,
        verdict="If you have the budget, this is the best laptop you can buy right now.",
        meta_description="Read our comprehensive review of the MacBook Pro 14 M3 Pro."
    )

    Review.objects.get_or_create(
        laptop=laptop_instances[2],
        title="ASUS ROG Zephyrus G14 (2024) Review",
        content="<p>The redesign makes it look like a MacBook that can game.</p>",
        performance_rating=9.0,
        battery_rating=7.0,
        display_rating=9.5,
        value_rating=8.0,
        verdict="A gorgeous, incredibly powerful thin and light gaming laptop.",
        meta_description="Read our review of the Zephyrus G14."
    )

    print("Creating Buying Guide...")
    bg, _ = BuyingGuide.objects.get_or_create(
        title="Best Laptops for College Students (2026)",
        intro="<p>Heading to college? Here are the best options that balance performance, battery life, and price.</p>",
        meta_description="Top laptops for students in 2026."
    )
    
    BuyingGuideItem.objects.get_or_create(
        guide=bg,
        laptop=laptop_instances[0],
        ordering=1,
        custom_note="<p>Best for students with larger budgets who need a machine that handles anything.</p>"
    )
    BuyingGuideItem.objects.get_or_create(
        guide=bg,
        laptop=laptop_instances[3],
        ordering=2,
        custom_note="<p>The absolute budget king for basic essay writing and web browsing.</p>"
    )

    print("Dummy data populated successfully!")

if __name__ == '__main__':
    run()
