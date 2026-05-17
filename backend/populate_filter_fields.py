import os
import django
import re

# Set up Django environment
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'laptop_duniya.settings')
django.setup()

from core.models import Laptop, SpecValue

def extract_ram(val):
    match = re.search(r'(\d+)\s*GB', val, re.IGNORECASE)
    return int(match.group(1)) if match else None

def extract_display(val):
    match = re.search(r'(\d+\.?\d*)\s*inches', val, re.IGNORECASE)
    return float(match.group(1)) if match else None

def extract_cpu(val):
    # Standardize family names
    val = val.lower()
    if 'core i9' in val or 'ultra 9' in val: return 'Core i9'
    if 'core i7' in val or 'ultra 7' in val: return 'Core i7'
    if 'core i5' in val or 'ultra 5' in val: return 'Core i5'
    if 'ryzen 9' in val: return 'Ryzen 9'
    if 'ryzen 7' in val: return 'Ryzen 7'
    if 'ryzen 5' in val: return 'Ryzen 5'
    if 'm1' in val: return 'Apple M1'
    if 'm2' in val: return 'Apple M2'
    if 'm3' in val: return 'Apple M3'
    if 'm4' in val: return 'Apple M4'
    return val.split(' ')[0].capitalize() # Fallback

def populate():
    laptops = Laptop.objects.all()
    count = 0
    for laptop in laptops:
        specs = {s.spec_key.name: s.value for s in laptop.specifications.all()}
        
        # CPU
        cpu_val = specs.get('CPU Model') or specs.get('CPU')
        if cpu_val:
            laptop.processor_type = extract_cpu(cpu_val)
        
        # RAM
        ram_val = specs.get('RAM')
        if ram_val:
            laptop.ram_gb = extract_ram(ram_val)
            
        # GPU
        gpu_val = specs.get('GPU')
        if gpu_val:
            laptop.gpu_type = gpu_val.split(' (')[0] # Clean up e.g. "RTX 4060 (Laptop)"
            
        # Display
        display_val = specs.get('Screen Size')
        if display_val:
            laptop.display_size = extract_display(display_val)
            
        laptop.save()
        count += 1
        print(f"Updated {laptop.title}: CPU={laptop.processor_type}, RAM={laptop.ram_gb}, GPU={laptop.gpu_type}, Screen={laptop.display_size}")

    print(f"Successfully updated {count} laptops.")

if __name__ == "__main__":
    populate()
