import os
import django
from django.utils.text import slugify

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'laptop_duniya.settings')
django.setup()

from core.models import Author, News, Review, Solution, BuyingGuide

def run():
    print("Creating Authors...")
    a1, _ = Author.objects.get_or_create(
        name="Ram Raiga",
        defaults={
            'bio': "Editor-in-Chief at Laptop Duniya. Over 10 years of experience testing high-performance workstations and gaming rigs.",
            'designation': "Editor-in-Chief"
        }
    )
    
    a2, _ = Author.objects.get_or_create(
        name="Sarah Smith",
        defaults={
            'bio': "Senior Tech Reviewer specializing in thin-and-light ultrabooks and creative professional laptops.",
            'designation': "Senior Reviewer"
        }
    )

    print("Linking Authors to Content...")
    
    # News
    News.objects.all().update(author=a1)
    
    # Reviews
    Review.objects.all().update(author=a2)
    
    # Solutions
    Solution.objects.all().update(author=a1)
    
    # Buying Guides
    BuyingGuide.objects.all().update(author=a2)

    print("Authors Populated and Linked Successfully!")

if __name__ == '__main__':
    run()
