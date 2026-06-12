import os
from decimal import Decimal
from urllib.parse import quote_plus

import django
from django.db import transaction

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "laptop_duniya.settings")
django.setup()

from core.models import (  # noqa: E402
    Author,
    Brand,
    BuyingGuide,
    BuyingGuideItem,
    Category,
    Comment,
    Coupon,
    Laptop,
    News,
    PushSubscription,
    RetailerPrice,
    Review,
    Solution,
    SpecGroup,
    SpecKey,
    SpecValue,
    Store,
    UserReview,
)


PHONE_CATALOG = [
    {
        "title": "Apple iPhone 16",
        "brand": "Apple",
        "base_price": 79900,
        "image": "mobiles/apple-iphone-16.png",
        "chipset": "Apple A18",
        "ram": 8,
        "camera_summary": "48MP dual camera",
        "display_size": 6.1,
        "categories": ["Flagship", "Compact"],
        "storage": "128GB / 256GB / 512GB",
        "rear_camera": "48MP main + 12MP ultra wide",
        "front_camera": "12MP TrueDepth",
        "battery": "All-day battery life",
        "charging": "USB-C wired, MagSafe wireless",
        "refresh_rate": "60Hz OLED",
        "network": "5G, Wi-Fi 7, eSIM",
        "durability": "IP68",
        "verdict": "A balanced premium phone with dependable cameras, fast performance, and polished software.",
        "pros": [
            "Reliable point-and-shoot camera tuning",
            "Excellent performance for years of updates",
            "Compact body that still feels premium",
        ],
        "cons": [
            "No high-refresh display",
            "Charging speeds trail Android rivals",
        ],
        "ratings": {"performance": 9.0, "battery": 8.5, "display": 8.4, "value": 8.1},
    },
    {
        "title": "Apple iPhone 16 Pro",
        "brand": "Apple",
        "base_price": 119900,
        "image": "mobiles/apple-iphone-16-pro.png",
        "chipset": "Apple A18 Pro",
        "ram": 8,
        "camera_summary": "48MP pro camera system",
        "display_size": 6.3,
        "categories": ["Flagship", "Camera", "Compact"],
        "storage": "128GB / 256GB / 512GB / 1TB",
        "rear_camera": "48MP main + 48MP ultra wide + telephoto",
        "front_camera": "12MP TrueDepth",
        "battery": "All-day Pro battery life",
        "charging": "USB-C wired, MagSafe wireless",
        "refresh_rate": "120Hz ProMotion OLED",
        "network": "5G, Wi-Fi 7, eSIM",
        "durability": "IP68 titanium frame",
        "verdict": "One of the best compact flagships for creators who want top-tier video and long software support.",
        "pros": [
            "Outstanding photo and video consistency",
            "Bright, smooth ProMotion display",
            "Premium titanium build",
        ],
        "cons": [
            "Expensive base price",
            "Fast charging is still conservative",
        ],
        "ratings": {"performance": 9.5, "battery": 8.8, "display": 9.4, "value": 7.8},
    },
    {
        "title": "Samsung Galaxy S25 Ultra",
        "brand": "Samsung",
        "base_price": 129999,
        "image": "mobiles/samsung-galaxy-s25-ultra.png",
        "chipset": "Snapdragon 8 Elite for Galaxy",
        "ram": 12,
        "camera_summary": "200MP quad camera",
        "display_size": 6.9,
        "categories": ["Flagship", "Camera", "Battery"],
        "storage": "256GB / 512GB / 1TB",
        "rear_camera": "200MP main + 50MP ultra wide + dual telephoto",
        "front_camera": "12MP selfie camera",
        "battery": "5000mAh",
        "charging": "45W wired, fast wireless",
        "refresh_rate": "120Hz AMOLED 2X",
        "network": "5G, Wi-Fi 7, S Pen",
        "durability": "IP68 titanium frame",
        "verdict": "The do-everything Android flagship with elite zoom, giant display, and strong battery life.",
        "pros": [
            "Excellent zoom range and detail",
            "Huge, bright anti-reflective display",
            "Versatile productivity tools with S Pen",
        ],
        "cons": [
            "Big and heavy for one-handed use",
            "Premium price tier",
        ],
        "ratings": {"performance": 9.7, "battery": 9.1, "display": 9.8, "value": 8.4},
    },
    {
        "title": "Samsung Galaxy Z Fold6",
        "brand": "Samsung",
        "base_price": 154999,
        "image": "mobiles/samsung-galaxy-z-fold6.png",
        "chipset": "Snapdragon 8 Gen 3 for Galaxy",
        "ram": 12,
        "camera_summary": "50MP triple camera",
        "display_size": 7.6,
        "categories": ["Flagship", "Foldable"],
        "storage": "256GB / 512GB / 1TB",
        "rear_camera": "50MP wide + 12MP ultra wide + 10MP telephoto",
        "front_camera": "10MP cover + 4MP under display",
        "battery": "4400mAh",
        "charging": "25W wired, wireless charging",
        "refresh_rate": "120Hz foldable AMOLED",
        "network": "5G, Wi-Fi 6E",
        "durability": "Armor aluminum, IP48",
        "verdict": "A polished foldable for multitaskers who want tablet-like productivity in a pocketable form.",
        "pros": [
            "Excellent multitasking software",
            "Large inner display for work and reading",
            "Refined foldable hardware",
        ],
        "cons": [
            "Still pricey even for enthusiasts",
            "Battery life is only average for the size",
        ],
        "ratings": {"performance": 9.2, "battery": 7.9, "display": 9.5, "value": 7.4},
    },
    {
        "title": "Samsung Galaxy A56 5G",
        "brand": "Samsung",
        "base_price": 41999,
        "image": "mobiles/samsung-galaxy-a56.png",
        "chipset": "Exynos mid-premium platform",
        "ram": 8,
        "camera_summary": "50MP triple camera",
        "display_size": 6.7,
        "categories": ["Midrange", "Value", "Battery"],
        "storage": "128GB / 256GB",
        "rear_camera": "50MP main + ultra wide + macro",
        "front_camera": "12MP selfie camera",
        "battery": "5000mAh",
        "charging": "45W wired charging",
        "refresh_rate": "120Hz Super AMOLED",
        "network": "5G, stereo speakers",
        "durability": "IP67",
        "verdict": "A dependable upper-midrange phone for users who want a big AMOLED screen and clean everyday performance.",
        "pros": [
            "Bright AMOLED panel with slim body",
            "Good battery life for daily use",
            "Trusted software support track record",
        ],
        "cons": [
            "Cameras are solid, not class-leading",
            "Performance trails true flagship killers",
        ],
        "ratings": {"performance": 7.8, "battery": 8.7, "display": 8.8, "value": 8.6},
    },
    {
        "title": "Google Pixel 9 Pro",
        "brand": "Google",
        "base_price": 109999,
        "image": "mobiles/google-pixel-9-pro.png",
        "chipset": "Google Tensor G4",
        "ram": 16,
        "camera_summary": "50MP AI camera system",
        "display_size": 6.3,
        "categories": ["Flagship", "Camera", "Compact"],
        "storage": "128GB / 256GB / 512GB / 1TB",
        "rear_camera": "50MP main + ultra wide + telephoto",
        "front_camera": "42MP selfie camera",
        "battery": "4700mAh",
        "charging": "27W wired, fast wireless",
        "refresh_rate": "120Hz OLED",
        "network": "5G, Wi-Fi 7, Satellite SOS",
        "durability": "IP68",
        "verdict": "The smartest camera-first Android flagship for users who love clean software and fast AI features.",
        "pros": [
            "Excellent still photography and editing tools",
            "Compact flagship with 16GB RAM",
            "Smart software features feel genuinely useful",
        ],
        "cons": [
            "Gaming power trails Snapdragon rivals",
            "Charging remains slower than Chinese flagships",
        ],
        "ratings": {"performance": 8.8, "battery": 8.5, "display": 9.1, "value": 8.2},
    },
    {
        "title": "OnePlus 13",
        "brand": "OnePlus",
        "base_price": 69999,
        "image": "mobiles/oneplus-13.png",
        "chipset": "Snapdragon 8 Elite",
        "ram": 12,
        "camera_summary": "50MP Hasselblad triple camera",
        "display_size": 6.82,
        "categories": ["Flagship", "Battery", "Gaming"],
        "storage": "256GB / 512GB",
        "rear_camera": "50MP wide + ultra wide + telephoto",
        "front_camera": "32MP selfie camera",
        "battery": "6000mAh",
        "charging": "80W SUPERVOOC, 50W wireless",
        "refresh_rate": "120Hz ProXDR AMOLED",
        "network": "5G, Wi-Fi 7, IP69/IP68",
        "durability": "IP69/IP68",
        "verdict": "A flagship killer with huge battery reserves, elite speed, and refined everyday polish.",
        "pros": [
            "Class-leading battery capacity",
            "Fast, fluid performance under load",
            "Excellent value for a premium feature set",
        ],
        "cons": [
            "Camera tuning is strong but not best-in-class",
            "Large size will not suit everyone",
        ],
        "ratings": {"performance": 9.6, "battery": 9.5, "display": 9.3, "value": 9.2},
    },
    {
        "title": "OnePlus 13R",
        "brand": "OnePlus",
        "base_price": 42999,
        "image": "mobiles/oneplus-13r.png",
        "chipset": "Snapdragon 8 Gen 3",
        "ram": 12,
        "camera_summary": "50MP Sony main camera",
        "display_size": 6.78,
        "categories": ["Gaming", "Value", "Battery"],
        "storage": "256GB",
        "rear_camera": "50MP main + ultra wide + telephoto",
        "front_camera": "16MP selfie camera",
        "battery": "6000mAh",
        "charging": "55W SUPERVOOC",
        "refresh_rate": "120Hz ProXDR AMOLED",
        "network": "5G, Wi-Fi 7",
        "durability": "IP65",
        "verdict": "One of the easiest recommendations for performance-focused buyers below flagship pricing.",
        "pros": [
            "Flagship-grade chipset at a lower price",
            "Long battery life with fast top-ups",
            "Great thermal behavior while gaming",
        ],
        "cons": [
            "Secondary cameras are less exciting",
            "Design is more practical than premium",
        ],
        "ratings": {"performance": 9.1, "battery": 9.2, "display": 8.9, "value": 9.4},
    },
    {
        "title": "Xiaomi 15 Ultra",
        "brand": "Xiaomi",
        "base_price": 109999,
        "image": "mobiles/xiaomi-15-ultra.png",
        "chipset": "Snapdragon 8 Elite",
        "ram": 16,
        "camera_summary": "Leica quad camera",
        "display_size": 6.73,
        "categories": ["Flagship", "Camera"],
        "storage": "512GB",
        "rear_camera": "50MP main + 200MP telephoto + 50MP ultra wide",
        "front_camera": "32MP selfie camera",
        "battery": "5240mAh",
        "charging": "90W wired, 50W wireless",
        "refresh_rate": "120Hz WQHD+ AMOLED",
        "network": "5G, Wi-Fi 7",
        "durability": "IP68",
        "verdict": "A camera powerhouse for mobile photographers who want serious zoom reach and flagship speed.",
        "pros": [
            "Outstanding zoom hardware",
            "Fast charging on both wired and wireless",
            "High-resolution WQHD+ panel",
        ],
        "cons": [
            "Large camera module is polarizing",
            "Software polish varies more than rivals",
        ],
        "ratings": {"performance": 9.5, "battery": 9.0, "display": 9.4, "value": 8.5},
    },
    {
        "title": "Nothing Phone (3)",
        "brand": "Nothing",
        "base_price": 62999,
        "image": "mobiles/nothing-phone-3.png",
        "chipset": "Snapdragon 8s Gen 4",
        "ram": 12,
        "camera_summary": "Four 50MP cameras",
        "display_size": 6.7,
        "categories": ["Flagship", "Style", "Value"],
        "storage": "256GB / 512GB",
        "rear_camera": "50MP multi-camera system",
        "front_camera": "50MP selfie camera",
        "battery": "Long-life battery",
        "charging": "Fast wired charging",
        "refresh_rate": "120Hz AMOLED",
        "network": "5G, Glyph Interface",
        "durability": "IP68",
        "verdict": "A design-forward flagship alternative that still delivers serious performance and camera flexibility.",
        "pros": [
            "Distinctive hardware and software identity",
            "Balanced flagship-level performance",
            "Strong camera hardware across the board",
        ],
        "cons": [
            "Availability can vary by market",
            "Some software extras are still maturing",
        ],
        "ratings": {"performance": 8.9, "battery": 8.7, "display": 8.9, "value": 8.8},
    },
    {
        "title": "Nothing Phone (3a) Pro",
        "brand": "Nothing",
        "base_price": 31999,
        "image": "mobiles/nothing-phone-3a-pro.png",
        "chipset": "Snapdragon 7s Gen 3",
        "ram": 8,
        "camera_summary": "50MP periscope camera",
        "display_size": 6.77,
        "categories": ["Midrange", "Camera", "Value"],
        "storage": "128GB / 256GB",
        "rear_camera": "50MP main + 50MP periscope + ultra wide",
        "front_camera": "50MP selfie camera",
        "battery": "5000mAh",
        "charging": "Fast wired charging",
        "refresh_rate": "120Hz AMOLED",
        "network": "5G, Essential Space",
        "durability": "IP64",
        "verdict": "A standout midrange phone for users who care about personality and stronger zoom than the usual segment pick.",
        "pros": [
            "Periscope camera is rare at this price",
            "Clean software with fun design touches",
            "Great value for camera-first buyers",
        ],
        "cons": [
            "Raw performance is not gaming-focused",
            "Water protection is only basic",
        ],
        "ratings": {"performance": 7.9, "battery": 8.6, "display": 8.7, "value": 9.1},
    },
    {
        "title": "Motorola Edge 60 Pro",
        "brand": "Motorola",
        "base_price": 34999,
        "image": "mobiles/motorola-edge-60-pro.png",
        "chipset": "MediaTek Dimensity 8350 Extreme",
        "ram": 12,
        "camera_summary": "50MP triple camera",
        "display_size": 6.67,
        "categories": ["Midrange", "Battery", "Value"],
        "storage": "256GB / 512GB",
        "rear_camera": "50MP main + ultra wide + telephoto",
        "front_camera": "50MP selfie camera",
        "battery": "6000mAh",
        "charging": "90W wired, 15W wireless",
        "refresh_rate": "120Hz pOLED",
        "network": "5G, Wi-Fi 6E",
        "durability": "IP68/IP69",
        "verdict": "A battery-centric all-rounder that feels more premium than its price tag suggests.",
        "pros": [
            "Massive battery with fast charging",
            "Slim, attractive hardware",
            "Good balance of performance and cameras",
        ],
        "cons": [
            "Software update cadence is not the best",
            "Video tuning can be inconsistent",
        ],
        "ratings": {"performance": 8.2, "battery": 9.3, "display": 8.8, "value": 9.0},
    },
    {
        "title": "vivo X200 Pro",
        "brand": "vivo",
        "base_price": 94999,
        "image": "mobiles/vivo-x200-pro.png",
        "chipset": "Dimensity 9400",
        "ram": 16,
        "camera_summary": "200MP ZEISS telephoto",
        "display_size": 6.78,
        "categories": ["Flagship", "Camera", "Battery"],
        "storage": "512GB",
        "rear_camera": "50MP main + 200MP telephoto + 50MP ultra wide",
        "front_camera": "32MP selfie camera",
        "battery": "6000mAh",
        "charging": "90W FlashCharge",
        "refresh_rate": "120Hz AMOLED",
        "network": "5G, Wi-Fi 7",
        "durability": "IP68/IP69",
        "verdict": "A premium camera flagship with exceptional portrait and telephoto capabilities plus monster battery life.",
        "pros": [
            "Best-in-class telephoto portraits",
            "Long battery endurance",
            "Fast, efficient flagship chipset",
        ],
        "cons": [
            "Large camera housing",
            "Software taste is not for everyone",
        ],
        "ratings": {"performance": 9.4, "battery": 9.4, "display": 9.2, "value": 8.7},
    },
    {
        "title": "OPPO Find X8 Pro",
        "brand": "OPPO",
        "base_price": 99999,
        "image": "mobiles/oppo-find-x8-pro.png",
        "chipset": "MediaTek Dimensity 9400",
        "ram": 16,
        "camera_summary": "Dual periscope 50MP cameras",
        "display_size": 6.78,
        "categories": ["Flagship", "Camera"],
        "storage": "512GB",
        "rear_camera": "50MP quad camera with dual periscope zoom",
        "front_camera": "32MP selfie camera",
        "battery": "5910mAh",
        "charging": "80W SUPERVOOC, 50W AIRVOOC",
        "refresh_rate": "120Hz AMOLED",
        "network": "5G, Wi-Fi 7",
        "durability": "IP68/IP69",
        "verdict": "A premium imaging flagship that blends flagship power with one of the most flexible zoom stacks around.",
        "pros": [
            "Two periscope lenses add rare versatility",
            "Large battery without a bulky feel",
            "Very fast charging on and off the cable",
        ],
        "cons": [
            "Premium pricing lands close to bigger rivals",
            "ColorOS takes some getting used to",
        ],
        "ratings": {"performance": 9.3, "battery": 9.1, "display": 9.1, "value": 8.4},
    },
]

BRANDS = {
    "Apple": {
        "description": "<p>Apple leads the premium smartphone space with tightly integrated hardware, long software support, and excellent video quality.</p>",
        "meta_title": "Apple Phones, Prices, Reviews & Deals | PhoneRadar",
        "meta_description": "Track Apple iPhone prices, camera performance, reviews, and buying advice on PhoneRadar.",
    },
    "Samsung": {
        "description": "<p>Samsung covers everything from foldables to camera-first flagships and dependable mid-range Galaxy phones.</p>",
        "meta_title": "Samsung Phones, Prices, Reviews & Deals | PhoneRadar",
        "meta_description": "Explore Samsung Galaxy phones with up-to-date pricing, reviews, and buying guides on PhoneRadar.",
    },
    "Google": {
        "description": "<p>Google Pixel phones combine smart software, clean Android, and some of the best computational photography in the market.</p>",
        "meta_title": "Google Pixel Phones, Reviews & Deals | PhoneRadar",
        "meta_description": "Browse Google Pixel pricing, camera insights, and clean Android recommendations on PhoneRadar.",
    },
    "OnePlus": {
        "description": "<p>OnePlus focuses on smooth performance, big batteries, and premium-feeling hardware at aggressive prices.</p>",
        "meta_title": "OnePlus Phones, Prices, Reviews & Deals | PhoneRadar",
        "meta_description": "Compare OnePlus phones, performance, and value picks on PhoneRadar.",
    },
    "Xiaomi": {
        "description": "<p>Xiaomi pushes flagship camera hardware and high-end displays with strong charging tech across its lineup.</p>",
        "meta_title": "Xiaomi Phones, Prices, Reviews & Deals | PhoneRadar",
        "meta_description": "Find Xiaomi phone prices, Leica camera highlights, and PhoneRadar reviews.",
    },
    "Nothing": {
        "description": "<p>Nothing brings a distinct design language, clean software, and fun hardware ideas to Android buyers.</p>",
        "meta_title": "Nothing Phones, Prices, Reviews & Deals | PhoneRadar",
        "meta_description": "Follow Nothing phone launches, prices, and reviews on PhoneRadar.",
    },
    "Motorola": {
        "description": "<p>Motorola delivers practical, battery-friendly Android phones with clean software and competitive pricing.</p>",
        "meta_title": "Motorola Phones, Prices, Reviews & Deals | PhoneRadar",
        "meta_description": "See Motorola phone prices, battery-focused picks, and PhoneRadar buying advice.",
    },
    "vivo": {
        "description": "<p>vivo stands out with camera-driven flagships, especially for portraits, zoom, and low-light photography.</p>",
        "meta_title": "vivo Phones, Prices, Reviews & Deals | PhoneRadar",
        "meta_description": "Track vivo phone prices, ZEISS camera phones, and reviews on PhoneRadar.",
    },
    "OPPO": {
        "description": "<p>OPPO blends sleek hardware, fast charging, and advanced zoom camera systems in its premium phones.</p>",
        "meta_title": "OPPO Phones, Prices, Reviews & Deals | PhoneRadar",
        "meta_description": "Discover OPPO phones, camera highlights, and pricing trends on PhoneRadar.",
    },
}

CATEGORIES = {
    "Flagship": "Premium smartphones with top-tier chips, displays, and cameras.",
    "Camera": "Phones prioritized for photography, zoom, portraits, and video.",
    "Gaming": "Performance-first devices with stable thermals and strong endurance.",
    "Battery": "Long-lasting phones built for heavy all-day use and fast charging.",
    "Midrange": "Balanced phones with strong value and polished everyday performance.",
    "Foldable": "Phones with folding displays for multitasking and tablet-like use.",
    "Compact": "Easy-to-hold phones that still deliver flagship-grade performance.",
    "Value": "Price-conscious picks that maximize features per rupee.",
    "Style": "Design-led phones that feel unique without sacrificing capability.",
}

AUTHORS = [
    {
        "name": "Manish Rai",
        "bio": "Smartphone reviewer focused on camera systems, real-world battery life, and long-term buying value.",
        "designation": "Editor, PhoneRadar",
    },
    {
        "name": "Aarav Khanna",
        "bio": "Android specialist covering mobile gaming, thermals, charging tech, and performance tuning.",
        "designation": "Senior Devices Analyst",
    },
    {
        "name": "Rhea Kapoor",
        "bio": "Consumer tech writer focused on camera phones, software polish, and buyer-friendly explainers.",
        "designation": "Mobile Features Writer",
    },
]

GUIDE_BLUEPRINTS = [
    {
        "title": "Best Camera Phones You Can Buy in India",
        "brand": None,
        "intro": "<p>These are the phones we recommend when camera quality matters more than specs on paper. We weighed daylight consistency, portrait depth, night processing, zoom reach, and video stability.</p>",
        "meta_description": "Our top camera-phone recommendations across flagship and upper-midrange budgets.",
        "items": [
            ("Xiaomi 15 Ultra", "Best zoom range and creator-grade flexibility."),
            ("vivo X200 Pro", "Outstanding portraits with class-leading telephoto detail."),
            ("Apple iPhone 16 Pro", "Still the safest choice for video shooters."),
            ("Google Pixel 9 Pro", "Top computational photography and clean edits."),
        ],
    },
    {
        "title": "Best Phones for Gaming and Heavy Multitasking",
        "brand": None,
        "intro": "<p>Performance phones need more than a fast benchmark number. We focused on sustained frame rates, heat control, battery drop during gaming, and charger speed after long sessions.</p>",
        "meta_description": "Performance-driven smartphone picks for gaming, streaming, and heavy multitasking.",
        "items": [
            ("OnePlus 13", "Huge battery plus elite thermals make it an easy performance favorite."),
            ("OnePlus 13R", "The value king for gamers on a tighter budget."),
            ("Samsung Galaxy S25 Ultra", "Premium gaming with a giant display and flagship headroom."),
            ("OPPO Find X8 Pro", "Fast, fluid, and unusually flexible for camera-heavy gamers."),
        ],
    },
    {
        "title": "Best Battery Phones for Travel and Heavy Daily Use",
        "brand": None,
        "intro": "<p>Battery winners need both efficiency and charging confidence. These are the devices we trust for travel days, hotspot duty, navigation, and nonstop scrolling.</p>",
        "meta_description": "Battery-focused smartphone recommendations for all-day endurance and fast charging.",
        "items": [
            ("OnePlus 13", "Our favorite endurance flagship right now."),
            ("Motorola Edge 60 Pro", "Massive battery life without a bulky body."),
            ("vivo X200 Pro", "Power-user battery life with true flagship cameras."),
            ("Samsung Galaxy A56 5G", "Reliable all-day stamina in the upper midrange."),
        ],
    },
]

NEWS_BLUEPRINTS = [
    {
        "title": "Why 2026 Flagships Are Finally Getting Better Battery Life",
        "category": "Industry News",
        "brand": None,
        "author": "Aarav Khanna",
        "summary": "Bigger silicon-carbon batteries and more efficient flagship chips are finally reducing the usual performance-versus-endurance tradeoff.",
        "related": ["OnePlus 13", "vivo X200 Pro", "OPPO Find X8 Pro"],
    },
    {
        "title": "Periscope Cameras Are Now the New Midrange Differentiator",
        "category": "Industry News",
        "brand": None,
        "author": "Rhea Kapoor",
        "summary": "Zoom hardware is no longer reserved for ultra-premium flagships, and buyers are starting to notice the difference.",
        "related": ["Nothing Phone (3a) Pro", "vivo X200 Pro", "Xiaomi 15 Ultra"],
    },
    {
        "title": "PhoneRadar Picks: Best Deals to Watch Before the Festive Sales",
        "category": "Deals",
        "brand": None,
        "author": "Manish Rai",
        "summary": "These are the phones most likely to see meaningful discounts without forcing buyers into compromised hardware.",
        "related": ["OnePlus 13R", "Samsung Galaxy A56 5G", "Apple iPhone 16"],
    },
    {
        "title": "Foldables Are Getting Better, But They Still Need the Right Buyer",
        "category": "Launches",
        "brand": "Samsung",
        "author": "Manish Rai",
        "summary": "Foldables are more polished than ever, yet the value equation still depends heavily on how much you multitask on the go.",
        "related": ["Samsung Galaxy Z Fold6"],
    },
]

SOLUTION_BLUEPRINTS = [
    {
        "title": "How to Reduce Phone Heating While Gaming",
        "brand": None,
        "author": "Aarav Khanna",
        "content": (
            "<p>Heavy gaming will warm up even strong phones, but repeated heat spikes usually come from a mix of charging habits, network load, and brightness levels.</p>"
            "<ol><li>Pause charging during long gaming sessions.</li><li>Use 60fps mode if the phone is throttling.</li><li>Switch to Wi-Fi when possible.</li><li>Remove bulky cases while gaming indoors.</li></ol>"
            "<p>If the issue persists after software updates and lighter settings, check battery health and thermal service diagnostics.</p>"
        ),
        "meta_description": "Practical steps to reduce phone heat and stabilize gaming performance.",
        "related": ["OnePlus 13", "OnePlus 13R", "Samsung Galaxy S25 Ultra"],
    },
    {
        "title": "Fix Fast Battery Drain on 5G Phones",
        "brand": None,
        "author": "Rhea Kapoor",
        "content": (
            "<p>Battery drain on modern phones often comes from radios, sync behavior, and aggressive high-brightness usage rather than a bad battery alone.</p>"
            "<ol><li>Check signal strength in your usual commute areas.</li><li>Lower always-on display behavior.</li><li>Review background location access.</li><li>Let adaptive battery learn your routine for a few days after setup.</li></ol>"
            "<p>Endurance usually improves meaningfully after the first week once indexing, backups, and app restores settle down.</p>"
        ),
        "meta_description": "Troubleshoot battery drain on 5G phones with practical steps that actually help.",
        "related": ["Google Pixel 9 Pro", "Motorola Edge 60 Pro", "Samsung Galaxy A56 5G"],
    },
    {
        "title": "Blurry Night Photos? Tune Your Camera Before You Upgrade",
        "brand": None,
        "author": "Manish Rai",
        "content": (
            "<p>Low-light softness is often caused by dirty lenses, motion blur, or the wrong lens being selected automatically.</p>"
            "<ol><li>Clean the lens before every night session.</li><li>Brace against a wall or hold both elbows tight.</li><li>Use the main sensor in darker scenes instead of the zoom lens.</li><li>Turn off beautification and scene filters before testing.</li></ol>"
            "<p>Only upgrade after you confirm that the issue is the hardware and not the shooting technique or software mode.</p>"
        ),
        "meta_description": "Simple camera fixes for better low-light mobile photos before you spend on a new phone.",
        "related": ["Apple iPhone 16 Pro", "Xiaomi 15 Ultra", "Nothing Phone (3a) Pro"],
    },
]

COUPON_BLUEPRINTS = [
    ("Apple", "Extra exchange bonus on iPhone upgrades", "", True),
    ("Samsung", "Galaxy accessory bundle on flagship checkout", "GALAXYBONUS", False),
    ("Google", "Pixel bank cashback weekend", "", True),
    ("OnePlus", "Instant card discount on OnePlus phones", "FAST10", False),
    ("Xiaomi", "Xiaomi photography bundle offer", "", True),
    ("Nothing", "Nothing student savings", "GLYPH5", False),
    ("Motorola", "TurboPower charger combo discount", "MOTOEDGE", False),
    ("vivo", "Exchange offer on ZEISS camera phones", "", True),
    ("OPPO", "Find series upgrade offer", "FINDUP", False),
]


def to_html_list(items):
    return "<ul>" + "".join(f"<li>{item}</li>" for item in items) + "</ul>"


def retailer_price_seed(index, base_price):
    offsets = [0, 1500, 3200, 4800]
    return max(base_price - offsets[index], 14999)


@transaction.atomic
def seed_phone_catalog():
    print("Replacing laptop catalog with mobile device content...")

    Comment.objects.all().delete()
    Coupon.objects.all().delete()
    BuyingGuide.objects.all().delete()
    Solution.objects.all().delete()
    Review.objects.all().delete()
    News.objects.all().delete()
    RetailerPrice.objects.all().delete()
    PushSubscription.objects.all().delete()
    UserReview.objects.all().delete()
    Laptop.objects.all().delete()
    Store.objects.all().delete()
    Brand.objects.all().delete()
    Category.objects.all().delete()
    SpecKey.objects.all().delete()
    SpecGroup.objects.all().delete()
    Author.objects.all().delete()

    brands = {}
    for name, details in BRANDS.items():
        brands[name] = Brand.objects.create(
            name=name,
            description=details["description"],
            meta_title=details["meta_title"],
            meta_description=details["meta_description"],
        )

    categories = {}
    for name, description in CATEGORIES.items():
        categories[name] = Category.objects.create(name=name, description=description)

    authors = {}
    for author_data in AUTHORS:
        author = Author.objects.create(**author_data)
        authors[author.name] = author

    stores = [
        Store.objects.create(name="Amazon", base_url="https://www.amazon.in/s"),
        Store.objects.create(name="Flipkart", base_url="https://www.flipkart.com/search"),
        Store.objects.create(name="Croma", base_url="https://www.croma.com/searchB"),
        Store.objects.create(name="Vijay Sales", base_url="https://www.vijaysales.com/search"),
    ]

    performance_group = SpecGroup.objects.create(name="Performance")
    display_group = SpecGroup.objects.create(name="Display")
    camera_group = SpecGroup.objects.create(name="Camera")
    battery_group = SpecGroup.objects.create(name="Battery & Charging")
    design_group = SpecGroup.objects.create(name="Build & Connectivity")

    spec_keys = {
        "chipset": SpecKey.objects.create(name="Chipset", group=performance_group),
        "ram": SpecKey.objects.create(name="RAM", group=performance_group),
        "storage": SpecKey.objects.create(name="Storage Options", group=performance_group),
        "display": SpecKey.objects.create(name="Panel", group=display_group),
        "refresh": SpecKey.objects.create(name="Refresh Rate", group=display_group),
        "rear_camera": SpecKey.objects.create(name="Rear Camera", group=camera_group),
        "front_camera": SpecKey.objects.create(name="Front Camera", group=camera_group),
        "battery": SpecKey.objects.create(name="Battery", group=battery_group),
        "charging": SpecKey.objects.create(name="Charging", group=battery_group),
        "network": SpecKey.objects.create(name="Connectivity", group=design_group),
        "durability": SpecKey.objects.create(name="Durability", group=design_group),
    }

    phones_by_title = {}

    for phone in PHONE_CATALOG:
        brand = brands[phone["brand"]]
        item = Laptop.objects.create(
            title=phone["title"],
            brand=brand,
            base_price=Decimal(str(phone["base_price"])),
            image=phone["image"],
            processor_type=phone["chipset"],
            ram_gb=phone["ram"],
            gpu_type=phone["camera_summary"],
            display_size=Decimal(str(phone["display_size"])),
            meta_title=f"{phone['title']} Price, Specs & Review | PhoneRadar",
            meta_description=f"{phone['title']} features, buying advice, and price tracking on PhoneRadar. {phone['verdict']}",
            pros=to_html_list(phone["pros"]),
            cons=to_html_list(phone["cons"]),
            affiliate_link=f"https://www.amazon.in/s?k={quote_plus(phone['title'])}",
        )
        item.categories.set([categories[name] for name in phone["categories"]])

        SpecValue.objects.bulk_create(
            [
                SpecValue(laptop=item, spec_key=spec_keys["chipset"], value=phone["chipset"]),
                SpecValue(laptop=item, spec_key=spec_keys["ram"], value=f"{phone['ram']}GB"),
                SpecValue(laptop=item, spec_key=spec_keys["storage"], value=phone["storage"]),
                SpecValue(laptop=item, spec_key=spec_keys["display"], value=f"{phone['display_size']} inch display"),
                SpecValue(laptop=item, spec_key=spec_keys["refresh"], value=phone["refresh_rate"]),
                SpecValue(laptop=item, spec_key=spec_keys["rear_camera"], value=phone["rear_camera"]),
                SpecValue(laptop=item, spec_key=spec_keys["front_camera"], value=phone["front_camera"]),
                SpecValue(laptop=item, spec_key=spec_keys["battery"], value=phone["battery"]),
                SpecValue(laptop=item, spec_key=spec_keys["charging"], value=phone["charging"]),
                SpecValue(laptop=item, spec_key=spec_keys["network"], value=phone["network"]),
                SpecValue(laptop=item, spec_key=spec_keys["durability"], value=phone["durability"]),
            ]
        )

        Review.objects.create(
            laptop=item,
            title=f"{phone['title']} Review: Should You Buy It?",
            brand=brand,
            author=authors["Manish Rai"] if brand.name in {"Apple", "Samsung", "Google"} else authors["Aarav Khanna"],
            content=(
                f"<p>{phone['title']} is positioned around buyers who care about {', '.join(phone['categories']).lower()} priorities.</p>"
                f"<p>In daily use, we liked the mix of {phone['chipset']}, {phone['camera_summary'].lower()}, and a {phone['display_size']}-inch panel. {phone['verdict']}</p>"
            ),
            performance_rating=Decimal(str(phone["ratings"]["performance"])),
            battery_rating=Decimal(str(phone["ratings"]["battery"])),
            display_rating=Decimal(str(phone["ratings"]["display"])),
            value_rating=Decimal(str(phone["ratings"]["value"])),
            verdict=phone["verdict"],
            meta_title=f"{phone['title']} Review | PhoneRadar",
            meta_description=f"Read our {phone['title']} review with camera, battery, display, and value analysis on PhoneRadar.",
        )

        for store_index, store in enumerate(stores[:3]):
            if store.name == "Amazon":
                url = f"{store.base_url}?k={quote_plus(phone['title'])}"
            elif store.name == "Flipkart":
                url = f"{store.base_url}?q={quote_plus(phone['title'])}"
            else:
                url = f"{store.base_url}?text={quote_plus(phone['title'])}"

            RetailerPrice.objects.create(
                laptop=item,
                store=store,
                price=Decimal(str(retailer_price_seed(store_index, phone["base_price"]))),
                url=url,
                is_available=True,
            )

        phones_by_title[phone["title"]] = item

    for blueprint in NEWS_BLUEPRINTS:
        article = News.objects.create(
            title=blueprint["title"],
            category=blueprint["category"],
            brand=brands[blueprint["brand"]] if blueprint["brand"] else None,
            author=authors[blueprint["author"]],
            content=(
                f"<p>{blueprint['summary']}</p>"
                "<p>At PhoneRadar, we look at how these shifts affect real buyers: camera quality, software longevity, battery consistency, and actual value at checkout.</p>"
            ),
            meta_title=f"{blueprint['title']} | PhoneRadar News",
            meta_description=blueprint["summary"],
        )
        article.related_laptops.set([phones_by_title[name] for name in blueprint["related"]])

    for blueprint in SOLUTION_BLUEPRINTS:
        solution = Solution.objects.create(
            title=blueprint["title"],
            brand=brands[blueprint["brand"]] if blueprint["brand"] else None,
            author=authors[blueprint["author"]],
            content=blueprint["content"],
            meta_title=f"{blueprint['title']} | PhoneRadar Help",
            meta_description=blueprint["meta_description"],
        )
        solution.related_laptops.set([phones_by_title[name] for name in blueprint["related"]])

    for blueprint in GUIDE_BLUEPRINTS:
        guide = BuyingGuide.objects.create(
            title=blueprint["title"],
            brand=brands[blueprint["brand"]] if blueprint["brand"] else None,
            author=authors["Rhea Kapoor"],
            intro=blueprint["intro"],
            meta_title=f"{blueprint['title']} | PhoneRadar Buying Guide",
            meta_description=blueprint["meta_description"],
        )
        for order, (phone_title, note) in enumerate(blueprint["items"], start=1):
            BuyingGuideItem.objects.create(
                guide=guide,
                laptop=phones_by_title[phone_title],
                ordering=order,
                custom_note=f"<p>{note}</p>",
            )

    for brand_name, title, code, is_deal in COUPON_BLUEPRINTS:
        brand = brands[brand_name]
        slug_hint = quote_plus(brand_name + " phone")
        Coupon.objects.create(
            brand=brand,
            title=title,
            code=code,
            description=f"PhoneRadar verified this {brand_name} shopping offer for mobile buyers looking for stronger checkout value.",
            link=f"https://www.amazon.in/s?k={slug_hint}",
            is_active=True,
            is_deal=is_deal,
        )

    print(f"Seeded {len(PHONE_CATALOG)} mobile devices with fresh editorial content for PhoneRadar.")


if __name__ == "__main__":
    seed_phone_catalog()
