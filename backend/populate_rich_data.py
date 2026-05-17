import os
import django
from django.core.files import File
from django.core.files.temp import NamedTemporaryFile
import urllib.request

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'laptop_duniya.settings')
django.setup()

from core.models import (
    Brand, Category, SpecGroup, SpecKey, SpecValue, Laptop, Review
)

def run():
    print("Clearing some old data to avoid duplicates...")
    Laptop.objects.filter(title__icontains="ThinkPad X1 Carbon").delete()
    Laptop.objects.filter(title__icontains="Razer Blade 16").delete()

    print("Setting up Brands & Categories...")
    b_lenovo, _ = Brand.objects.get_or_create(name="Lenovo")
    b_razer, _ = Brand.objects.get_or_create(name="Razer")
    
    c_business, _ = Category.objects.get_or_create(name="Business")
    c_gaming, _ = Category.objects.get_or_create(name="Gaming")

    print("Creating FULL Specification Taxonomy...")
    groups = {
        "General": ["Model", "Type", "Color", "Operating System"],
        "Processor": ["CPU", "Cores", "Clock Speed", "Cache"],
        "Memory": ["RAM", "RAM Type", "Max RAM Supported", "Memory Slots"],
        "Storage": ["Storage Capacity", "Storage Type", "Storage Interface"],
        "Display": ["Screen Size", "Resolution", "Panel Type", "Refresh Rate", "Brightness"],
        "Graphics": ["GPU", "GPU VRAM", "Dedicated Graphics"],
        "Connectivity": ["Wi-Fi", "Bluetooth", "Ethernet"],
        "Ports": ["USB Type-C", "USB Type-A", "HDMI", "Headphone Jack", "Card Reader"],
        "Battery": ["Capacity", "Power Adapter", "Battery Life (Claimed)"],
        "Dimensions & Weight": ["Weight", "Dimensions (W x D x H)"]
    }

    spec_keys = {}
    for g_name, keys in groups.items():
        sg, _ = SpecGroup.objects.get_or_create(name=g_name)
        spec_keys[g_name] = {}
        for k_name in keys:
            sk, _ = SpecKey.objects.get_or_create(name=k_name, group=sg)
            spec_keys[g_name][k_name] = sk

    # Helper to download dummy image
    def get_image(seed_url, filename):
        img_temp = NamedTemporaryFile(delete=True)
        img_temp.write(urllib.request.urlopen(seed_url).read())
        img_temp.flush()
        return File(img_temp, name=filename)

    print("Adding ThinkPad X1 Carbon (Full Specs + Image)...")
    l1, _ = Laptop.objects.get_or_create(
        title="Lenovo ThinkPad X1 Carbon Gen 12",
        brand=b_lenovo,
        base_price=1750.00,
        meta_description="The ultimate business laptop with full specifications.",
        pros="<ul><li>World-class keyboard</li><li>Incredibly lightweight</li><li>Excellent battery life</li></ul>",
        cons="<ul><li>Very expensive</li><li>Fingerprint magnet</li></ul>"
    )
    l1.categories.set([c_business])
    
    # Save Image
    print("Downloading laptop image 1...")
    l1.image.save('thinkpad_x1.jpg', get_image("https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=800&q=80", "thinkpad_x1.jpg"))
    l1.save()

    l1_specs = {
        "General": { "Model": "ThinkPad X1 Carbon Gen 12", "Type": "Ultrabook", "Color": "Deep Black", "Operating System": "Windows 11 Pro" },
        "Processor": { "CPU": "Intel Core Ultra 7 155U", "Cores": "12 Cores (2 P-core + 8 E-core + 2 LPE-core)", "Clock Speed": "Up to 4.8 GHz", "Cache": "12MB Smart Cache" },
        "Memory": { "RAM": "32GB", "RAM Type": "LPDDR5x 6400MHz", "Max RAM Supported": "32GB (Soldered)", "Memory Slots": "0" },
        "Storage": { "Storage Capacity": "1TB", "Storage Type": "SSD", "Storage Interface": "PCIe NVMe Gen 4" },
        "Display": { "Screen Size": "14 inches", "Resolution": "2.8K (2880 x 1800)", "Panel Type": "OLED", "Refresh Rate": "120Hz", "Brightness": "400 nits" },
        "Graphics": { "GPU": "Intel Graphics", "GPU VRAM": "Shared", "Dedicated Graphics": "No" },
        "Connectivity": { "Wi-Fi": "Wi-Fi 6E (802.11ax)", "Bluetooth": "Bluetooth 5.3", "Ethernet": "No native port (via dongle)" },
        "Ports": { "USB Type-C": "2x Thunderbolt 4", "USB Type-A": "2x USB 3.2 Gen 1", "HDMI": "1x HDMI 2.1", "Headphone Jack": "Yes", "Card Reader": "No" },
        "Battery": { "Capacity": "57 Wh", "Power Adapter": "65W USB-C", "Battery Life (Claimed)": "Up to 14 hours" },
        "Dimensions & Weight": { "Weight": "1.09 kg", "Dimensions (W x D x H)": "312.8 x 214.75 x 14.96 mm" }
    }
    
    for g_name, kvs in l1_specs.items():
        for k_name, val in kvs.items():
            SpecValue.objects.get_or_create(laptop=l1, spec_key=spec_keys[g_name][k_name], value=val)

    Review.objects.get_or_create(
        laptop=l1,
        title="Lenovo ThinkPad X1 Carbon Gen 12 Review",
        content="<p>The legendary business laptop continues to reign supreme.</p>",
        performance_rating=8.0,
        battery_rating=9.5,
        display_rating=9.0,
        value_rating=7.0,
        verdict="The undeniable king of corporate laptops gets a solid, iterative upgrade."
    )

    print("Adding Razer Blade 16 (Full Specs + Image)...")
    l2, _ = Laptop.objects.get_or_create(
        title="Razer Blade 16 (2024)",
        brand=b_razer,
        base_price=2999.00,
        meta_description="Premium gaming laptop with RTX 4090.",
        pros="<ul><li>Stunning CNC aluminum chassis</li><li>Incredible Mini-LED dual-mode display</li><li>Desktop-class performance</li></ul>",
        cons="<ul><li>Price is astronomical</li><li>Gets warm under heavy load</li></ul>"
    )
    l2.categories.set([c_gaming])
    
    print("Downloading laptop image 2...")
    l2.image.save('razer_blade.jpg', get_image("https://images.unsplash.com/photo-1625842268584-8f3296236761?w=800&q=80", "razer_blade.jpg"))
    l2.save()

    l2_specs = {
        "General": { "Model": "Blade 16", "Type": "Gaming", "Color": "Mercury White", "Operating System": "Windows 11 Home" },
        "Processor": { "CPU": "Intel Core i9-14900HX", "Cores": "24 Cores (8 P-core + 16 E-core)", "Clock Speed": "Up to 5.8 GHz", "Cache": "36MB" },
        "Memory": { "RAM": "32GB", "RAM Type": "DDR5 5600MHz", "Max RAM Supported": "96GB", "Memory Slots": "2" },
        "Storage": { "Storage Capacity": "2TB", "Storage Type": "SSD", "Storage Interface": "PCIe NVMe Gen 4 x4" },
        "Display": { "Screen Size": "16 inches", "Resolution": "UHD+ (3840 x 2400)", "Panel Type": "Dual-Mode Mini-LED", "Refresh Rate": "120Hz/240Hz", "Brightness": "1000 nits (HDR)" },
        "Graphics": { "GPU": "NVIDIA GeForce RTX 4090", "GPU VRAM": "16GB GDDR6", "Dedicated Graphics": "Yes, 175W TGP" },
        "Connectivity": { "Wi-Fi": "Wi-Fi 7", "Bluetooth": "Bluetooth 5.4", "Ethernet": "No native port" },
        "Ports": { "USB Type-C": "1x Thunderbolt 4, 1x USB-C 3.2 Gen 2", "USB Type-A": "3x USB-A 3.2 Gen 2", "HDMI": "1x HDMI 2.1", "Headphone Jack": "Yes", "Card Reader": "UHS-II SD Card Reader" },
        "Battery": { "Capacity": "95.2 Wh", "Power Adapter": "330W GaN Adapter", "Battery Life (Claimed)": "Up to 5 hours (Gaming)" },
        "Dimensions & Weight": { "Weight": "2.45 kg", "Dimensions (W x D x H)": "355 x 244 x 21.9 mm" }
    }
    
    for g_name, kvs in l2_specs.items():
        for k_name, val in kvs.items():
            SpecValue.objects.get_or_create(laptop=l2, spec_key=spec_keys[g_name][k_name], value=val)

    Review.objects.get_or_create(
        laptop=l2,
        title="Razer Blade 16 Review: Gaming Luxury",
        content="<p>An outrageously powerful, outrageously expensive portable powerhouse.</p>",
        performance_rating=10.0,
        battery_rating=6.0,
        display_rating=10.0,
        value_rating=6.0,
        verdict="If money is no object, this is the most beautifully crafted gaming laptop on the market."
    )

    print("Dummy Rich Data Populated Successfully!")

if __name__ == '__main__':
    run()
