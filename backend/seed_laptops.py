import os
import django
import random
from decimal import Decimal

# Setup Django environment
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'laptop_duniya.settings')
django.setup()

from core.models import Brand, Category, Laptop, SpecGroup, SpecKey, SpecValue, Author, Review

def seed_data():
    print("Starting data seeding (INR)...")
    
    # 1. Ensure Brands exist
    brands_data = ['Apple', 'Dell', 'ASUS', 'Lenovo', 'HP', 'Acer', 'MSI', 'Razer']
    brands = {}
    for b_name in brands_data:
        brand, _ = Brand.objects.get_or_create(name=b_name)
        brands[b_name] = brand

    # 2. Ensure Categories exist
    categories_data = ['Gaming', 'Business', 'Premium', 'Student', 'Budget', 'Workstation']
    categories = {}
    for c_name in categories_data:
        cat, _ = Category.objects.get_or_create(name=c_name)
        categories[c_name] = cat

    # 3. Ensure Author exists
    author, _ = Author.objects.get_or_create(
        name="Ram Rai", 
        defaults={'bio': "Veteran tech journalist with 10+ years experience reviewing consumer electronics.", 'designation': 'Senior Tech Editor'}
    )

    # 4. Ensure Spec Groups & Keys
    cpu_group, _ = SpecGroup.objects.get_or_create(name="Processor")
    mem_group, _ = SpecGroup.objects.get_or_create(name="Memory & Storage")
    disp_group, _ = SpecGroup.objects.get_or_create(name="Display")
    gpu_group, _ = SpecGroup.objects.get_or_create(name="Graphics")

    cpu_key, _ = SpecKey.objects.get_or_create(name="Model", group=cpu_group)
    ram_key, _ = SpecKey.objects.get_or_create(name="RAM Size", group=mem_group)
    ssd_key, _ = SpecKey.objects.get_or_create(name="SSD Capacity", group=mem_group)
    res_key, _ = SpecKey.objects.get_or_create(name="Resolution", group=disp_group)
    gpu_key, _ = SpecKey.objects.get_or_create(name="GPU Model", group=gpu_group)

    # Archetype Images mapping (adjust paths to where they were saved in media/)
    # I'll manually copy them to media/laptops/ later or use the absolute paths if possible.
    # For the script, I'll set the image field to the relative path in media/laptops/
    
    laptop_list = [
        {
            'title': 'Apple MacBook Air M3 (13-inch)',
            'brand': 'Apple',
            'base_price': 114900,
            'image': 'laptops/apple_m3.png',
            'cpu': 'Apple M3 Chip (8-core)',
            'ram': 8,
            'gpu': '10-core GPU',
            'display': 13.6,
            'cats': ['Premium', 'Student'],
            'verdict': 'The perfect balance of power and portability for most users.',
            'p': 9.2, 'b': 9.8, 'd': 9.5, 'v': 9.0
        },
        {
            'title': 'Dell XPS 15 9530',
            'brand': 'Dell',
            'base_price': 245000,
            'image': 'laptops/dell_xps.png',
            'cpu': 'Intel Core i9-13900H',
            'ram': 32,
            'gpu': 'NVIDIA RTX 4060',
            'display': 15.6,
            'cats': ['Business', 'Premium', 'Workstation'],
            'verdict': 'Unmatched craftsmanship meets workstation-grade performance.',
            'p': 9.5, 'b': 8.5, 'd': 9.8, 'v': 8.2
        },
        {
            'title': 'ASUS ROG Zephyrus G14 (2024)',
            'brand': 'ASUS',
            'base_price': 189990,
            'image': 'laptops/asus_rog.png',
            'cpu': 'AMD Ryzen 9 8945HS',
            'ram': 32,
            'gpu': 'NVIDIA RTX 4070',
            'display': 14.0,
            'cats': ['Gaming', 'Premium'],
            'verdict': 'The best 14-inch gaming laptop ever made, now with an OLED screen.',
            'p': 9.8, 'b': 8.0, 'd': 9.9, 'v': 8.8
        },
        {
            'title': 'Lenovo Legion Pro 5i Gen 9',
            'brand': 'Lenovo',
            'base_price': 158000,
            'image': 'laptops/lenovo_legion.png',
            'cpu': 'Intel Core i7-14700HX',
            'ram': 16,
            'gpu': 'NVIDIA RTX 4060',
            'display': 16.0,
            'cats': ['Gaming', 'Business'],
            'verdict': 'Solid build quality with professional aesthetics and raw gaming power.',
            'p': 9.0, 'b': 7.5, 'd': 8.8, 'v': 9.2
        },
        {
            'title': 'HP Spectre x360 14 (2024)',
            'brand': 'HP',
            'base_price': 164999,
            'image': 'laptops/hp_spectre.png',
            'cpu': 'Intel Core Ultra 7 155H',
            'ram': 16,
            'gpu': 'Intel Arc Graphics',
            'display': 14.0,
            'cats': ['Premium', 'Business'],
            'verdict': 'Elegant 2-in-1 design with a stunning OLED display and great battery life.',
            'p': 8.8, 'b': 9.2, 'd': 9.7, 'v': 8.5
        },
        {
            'title': 'Razer Blade 14 (Mercury White)',
            'brand': 'Razer',
            'base_price': 255000,
            'image': 'laptops/razer_blade.png',
            'cpu': 'AMD Ryzen 9 7940HS',
            'ram': 16,
            'gpu': 'NVIDIA RTX 4070',
            'display': 14.0,
            'cats': ['Gaming', 'Premium'],
            'verdict': 'Exceptional build quality in a compact, hyper-portable chassis.',
            'p': 9.4, 'b': 7.8, 'd': 9.2, 'v': 7.5
        },
        {
            'title': 'ASUS Zenbook S 13 OLED',
            'brand': 'ASUS',
            'base_price': 124990,
            'image': 'laptops/asus_zenbook.png',
            'cpu': 'Intel Core i7-1355U',
            'ram': 16,
            'gpu': 'Intel Iris Xe',
            'display': 13.3,
            'cats': ['Student', 'Premium'],
            'verdict': 'Impossibly thin and light without compromising on the OLED experience.',
            'p': 8.2, 'b': 9.4, 'd': 9.8, 'v': 8.8
        },
        {
            'title': 'Acer Predator Helios Neo 16',
            'brand': 'Acer',
            'base_price': 109990,
            'image': 'laptops/acer_predator.png',
            'cpu': 'Intel Core i7-13700HX',
            'ram': 16,
            'gpu': 'NVIDIA RTX 4050',
            'display': 16.0,
            'cats': ['Gaming', 'Budget'],
            'verdict': 'Incredible value for gamers looking for HX-series performance.',
            'p': 8.8, 'b': 6.5, 'd': 8.2, 'v': 9.8
        },
        {
            'title': 'MSI Vector GP68 HX',
            'brand': 'MSI',
            'base_price': 210000,
            'image': 'laptops/msi_vector.png',
            'cpu': 'Intel Core i9-13980HX',
            'ram': 32,
            'gpu': 'NVIDIA RTX 4080',
            'display': 16.0,
            'cats': ['Gaming', 'Workstation'],
            'verdict': 'A performance monster that stays surprisingly cool under load.',
            'p': 9.9, 'b': 6.0, 'd': 8.5, 'v': 8.0
        },
        {
            'title': 'Dell Inspiron 15 3520',
            'brand': 'Dell',
            'base_price': 42990,
            'image': 'laptops/dell_inspiron.png',
            'cpu': 'Intel Core i3-1215U',
            'ram': 8,
            'gpu': 'Intel UHD Graphics',
            'display': 15.6,
            'cats': ['Budget', 'Student'],
            'verdict': 'The reliable choice for basic office work and classroom needs.',
            'p': 6.5, 'b': 7.5, 'd': 6.8, 'v': 9.5
        },
        # Adding 10 more to reach 20 as requested
        { 'title': 'Apple MacBook Pro M3 Max (16-inch)', 'brand': 'Apple', 'base_price': 349900, 'image': 'laptops/apple_m3_pro.png', 'cpu': 'Apple M3 Max (14-core)', 'ram': 36, 'gpu': '30-core GPU', 'display': 16.2, 'cats': ['Premium', 'Workstation'], 'verdict': 'The definitive workstation for creative professionals.', 'p': 9.9, 'b': 9.9, 'd': 10.0, 'v': 7.8 },
        { 'title': 'HP Victus 15', 'brand': 'HP', 'base_price': 68000, 'image': 'laptops/hp_victus.png', 'cpu': 'Intel Core i5-13420H', 'ram': 16, 'gpu': 'RTX 3050', 'display': 15.6, 'cats': ['Gaming', 'Budget'], 'verdict': 'Decent entry-level gaming with a clean design.', 'p': 7.5, 'b': 7.0, 'd': 7.2, 'v': 9.0 },
        { 'title': 'Lenovo Yoga Slim 7i Carbon', 'brand': 'Lenovo', 'base_price': 115000, 'image': 'laptops/lenovo_yoga.png', 'cpu': 'Intel Core i7-1360P', 'ram': 16, 'gpu': 'Intel Iris Xe', 'display': 13.3, 'cats': ['Premium', 'Student'], 'verdict': 'Incredibly light with a durable carbon fiber build.', 'p': 8.2, 'b': 8.5, 'd': 9.0, 'v': 8.5 },
        { 'title': 'ASUS TUF Gaming F15', 'brand': 'ASUS', 'base_price': 74000, 'image': 'laptops/asus_tuf.png', 'cpu': 'Intel Core i5-12500H', 'ram': 16, 'gpu': 'RTX 3050', 'display': 15.6, 'cats': ['Gaming', 'Budget'], 'verdict': 'Rugged durability with solid mid-range performance.', 'p': 7.8, 'b': 7.2, 'd': 7.0, 'v': 9.2 },
        { 'title': 'Acer Swift Go 14', 'brand': 'Acer', 'base_price': 62000, 'image': 'laptops/acer_swift.png', 'cpu': 'AMD Ryzen 5 7535U', 'ram': 16, 'gpu': 'AMD Radeon 660M', 'display': 14.0, 'cats': ['Student', 'Business'], 'verdict': 'Surprisingly powerful for its weight and price point.', 'p': 7.5, 'b': 8.8, 'd': 8.5, 'v': 9.0 },
        { 'title': 'Dell Alienware m16 R2', 'brand': 'Dell', 'base_price': 210000, 'image': 'laptops/dell_alienware.png', 'cpu': 'Intel Core Ultra 7 155H', 'ram': 16, 'gpu': 'RTX 4070', 'display': 16.0, 'cats': ['Gaming', 'Premium'], 'verdict': 'Stealthy new design for gamers who need a versatile machine.', 'p': 9.4, 'b': 7.5, 'd': 9.2, 'v': 8.2 },
        { 'title': 'HP Envy x360 15', 'brand': 'HP', 'base_price': 82000, 'image': 'laptops/hp_envy.png', 'cpu': 'AMD Ryzen 7 7730U', 'ram': 16, 'gpu': 'AMD Radeon Graphics', 'display': 15.6, 'cats': ['Premium', 'Student'], 'verdict': 'Versatile 2-in-1 that feels more expensive than it is.', 'p': 8.0, 'b': 8.2, 'd': 8.5, 'v': 8.8 },
        { 'title': 'Lenovo IdeaPad Slim 3', 'brand': 'Lenovo', 'base_price': 38000, 'image': 'laptops/lenovo_ideapad.png', 'cpu': 'Intel Core i3-1215U', 'ram': 8, 'gpu': 'Intel UHD', 'display': 15.6, 'cats': ['Budget', 'Student'], 'verdict': 'Basic computing done right at a fair price.', 'p': 6.2, 'b': 7.8, 'd': 6.5, 'v': 9.4 },
        { 'title': 'MSI cyborg 15', 'brand': 'MSI', 'base_price': 89000, 'image': 'laptops/msi_cyborg.png', 'cpu': 'Intel Core i7-12650H', 'ram': 16, 'gpu': 'RTX 4050', 'display': 15.6, 'cats': ['Gaming', 'Budget'], 'verdict': 'Translucent design with modern 40-series graphics.', 'p': 8.2, 'b': 6.5, 'd': 7.5, 'v': 8.8 },
        { 'title': 'Apple MacBook Pro M3 (14-inch)', 'brand': 'Apple', 'base_price': 169900, 'image': 'laptops/apple_m3_14.png', 'cpu': 'Apple M3 Chip (8-core)', 'ram': 8, 'gpu': '10-core GPU', 'display': 14.2, 'cats': ['Premium', 'Business'], 'verdict': 'The entry-level Pro is still a masterclass in display tech.', 'p': 8.8, 'b': 9.8, 'd': 10.0, 'v': 8.0 }
    ]

    for item in laptop_list:
        laptop, created = Laptop.objects.get_or_create(
            title=item['title'],
            brand=brands[item['brand']],
            defaults={
                'base_price': Decimal(item['base_price']),
                'image': item['image'],
                'processor_type': item['cpu'],
                'ram_gb': item['ram'],
                'gpu_type': item['gpu'],
                'display_size': Decimal(item['display']),
                'meta_title': f"{item['title']} - Price, Specs & Review | Laptop Duniya",
                'meta_description': f"Check out details for {item['title']} in India. {item['verdict']}",
                'pros': "<ul><li>Excellent build quality</li><li>Great performance</li><li>Portability</li></ul>",
                'cons': "<ul><li>Heats up under heavy load</li><li>Expensive upgrades</li></ul>"
            }
        )
        
        # Add Categories
        for cat_name in item['cats']:
            laptop.categories.add(categories[cat_name])

        # Add Spec Values
        SpecValue.objects.get_or_create(laptop=laptop, spec_key=cpu_key, defaults={'value': item['cpu']})
        SpecValue.objects.get_or_create(laptop=laptop, spec_key=ram_key, defaults={'value': f"{item['ram']}GB DDR5"})
        SpecValue.objects.get_or_create(laptop=laptop, spec_key=ssd_key, defaults={'value': "512GB NVMe Gen4"})
        SpecValue.objects.get_or_create(laptop=laptop, spec_key=res_key, defaults={'value': "2560 x 1600 OLED"})
        SpecValue.objects.get_or_create(laptop=laptop, spec_key=gpu_key, defaults={'value': item['gpu']})

        # Add Expert Review
        Review.objects.get_or_create(
            laptop=laptop,
            defaults={
                'title': f"{item['title']} - One Month Later Review",
                'author': author,
                'content': f"<p>{item['verdict']} After using the {item['title']} for several weeks, we found it to be one of the best choices for {item['cats'][0].lower()} tasks.</p>",
                'performance_rating': Decimal(item['p']),
                'battery_rating': Decimal(item['b']),
                'display_rating': Decimal(item['d']),
                'value_rating': Decimal(item['v']),
                'verdict': item['verdict']
            }
        )

    print("Successfully seeded 20 laptops in INR!")

if __name__ == '__main__':
    seed_data()
