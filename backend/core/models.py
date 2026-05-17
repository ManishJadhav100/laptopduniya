from django.db import models
from django.utils.text import slugify
from django.utils.crypto import get_random_string
from tinymce.models import HTMLField
from django.contrib.contenttypes.fields import GenericForeignKey, GenericRelation
from django.contrib.contenttypes.models import ContentType


def generate_short_link_code():
    return get_random_string(7, allowed_chars='abcdefghjkmnpqrstuvwxyz23456789')

class Brand(models.Model):
    name = models.CharField(max_length=255, unique=True)
    slug = models.SlugField(max_length=255, unique=True, blank=True)
    logo = models.ImageField(upload_to='brands/', blank=True, null=True)
    description = HTMLField(blank=True, help_text="Brand overview and history for SEO")
    meta_title = models.CharField(max_length=255, blank=True)
    meta_description = models.TextField(blank=True)

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.name)
        super().save(*args, **kwargs)

    def __str__(self):
        return self.name

class Category(models.Model):
    name = models.CharField(max_length=255, unique=True)
    slug = models.SlugField(max_length=255, unique=True, blank=True)
    description = models.TextField(blank=True)

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.name)
        super().save(*args, **kwargs)

    class Meta:
        verbose_name_plural = 'Categories'

    def __str__(self):
        return self.name

class SpecGroup(models.Model):
    name = models.CharField(max_length=255, unique=True)
    
    def __str__(self):
        return self.name

class SpecKey(models.Model):
    name = models.CharField(max_length=255)
    group = models.ForeignKey(SpecGroup, on_delete=models.CASCADE, related_name='keys')

    class Meta:
        unique_together = ('name', 'group')

    def __str__(self):
        return f"{self.group.name} - {self.name}"

class Laptop(models.Model):
    title = models.CharField(max_length=255)
    slug = models.SlugField(max_length=255, unique=True, blank=True)
    brand = models.ForeignKey(Brand, on_delete=models.CASCADE, related_name='laptops')
    categories = models.ManyToManyField(Category, related_name='laptops')
    base_price = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)
    image = models.ImageField(upload_to='laptops/', null=True, blank=True)
    pros = HTMLField(blank=True, help_text="List of pros")
    cons = HTMLField(blank=True, help_text="List of cons")
    affiliate_link = models.URLField(blank=True, max_length=500)
    
    # Filterable Spec Fields
    processor_type = models.CharField(max_length=100, blank=True, help_text="e.g. Core i7, Ryzen 7")
    ram_gb = models.IntegerField(null=True, blank=True, help_text="RAM capacity in GB")
    gpu_type = models.CharField(max_length=100, blank=True, help_text="e.g. RTX 4060, Iris Xe")
    display_size = models.DecimalField(max_digits=4, decimal_places=1, null=True, blank=True, help_text="Display size in inches")
    
    # Meta SEO
    meta_title = models.CharField(max_length=255, blank=True)
    meta_description = models.TextField(blank=True)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.title)
        super().save(*args, **kwargs)

    def __str__(self):
        return self.title

class SpecValue(models.Model):
    laptop = models.ForeignKey(Laptop, on_delete=models.CASCADE, related_name='specifications')
    spec_key = models.ForeignKey(SpecKey, on_delete=models.CASCADE)
    value = models.CharField(max_length=255)

    class Meta:
        unique_together = ('laptop', 'spec_key')

    def __str__(self):
        return f"{self.laptop.title} - {self.spec_key.name}: {self.value}"

class Author(models.Model):
    name = models.CharField(max_length=255)
    slug = models.SlugField(max_length=255, unique=True, blank=True)
    bio = models.TextField(blank=True)
    designation = models.CharField(max_length=100, default='Tech Expert')
    profile_image = models.ImageField(upload_to='authors/', blank=True, null=True)
    
    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.name)
        super().save(*args, **kwargs)

    def __str__(self):
        return self.name

class News(models.Model):
    CATEGORY_CHOICES = [
        ('Launches', 'Launches'),
        ('Industry News', 'Industry News'),
        ('Deals', 'Deals'),
    ]
    title = models.CharField(max_length=255)
    slug = models.SlugField(max_length=255, unique=True, blank=True)
    brand = models.ForeignKey(Brand, on_delete=models.SET_NULL, null=True, blank=True, related_name='news')
    author = models.ForeignKey(Author, on_delete=models.SET_NULL, null=True, blank=True, related_name='news')
    category = models.CharField(max_length=50, choices=CATEGORY_CHOICES, default='Industry News')
    content = HTMLField()
    image = models.ImageField(upload_to='news/', blank=True, null=True)
    related_laptops = models.ManyToManyField(Laptop, blank=True)
    
    meta_title = models.CharField(max_length=255, blank=True)
    meta_description = models.TextField(blank=True)
    
    created_at = models.DateTimeField(auto_now_add=True)
    comments = GenericRelation('Comment')
    
    class Meta:
        verbose_name_plural = 'News'

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.title)
        super().save(*args, **kwargs)

    def __str__(self):
        return self.title

class Review(models.Model):
    laptop = models.OneToOneField(Laptop, on_delete=models.CASCADE, related_name='expert_review')
    title = models.CharField(max_length=255)
    slug = models.SlugField(max_length=255, unique=True, blank=True)
    brand = models.ForeignKey(Brand, on_delete=models.SET_NULL, null=True, blank=True, related_name='reviews')
    author = models.ForeignKey(Author, on_delete=models.SET_NULL, null=True, blank=True, related_name='reviews')
    content = HTMLField()
    
    # Ratings out of 10
    performance_rating = models.DecimalField(max_digits=3, decimal_places=1)
    battery_rating = models.DecimalField(max_digits=3, decimal_places=1)
    display_rating = models.DecimalField(max_digits=3, decimal_places=1)
    value_rating = models.DecimalField(max_digits=3, decimal_places=1)
    
    verdict = models.TextField()
    meta_title = models.CharField(max_length=255, blank=True)
    meta_description = models.TextField(blank=True)

    created_at = models.DateTimeField(auto_now_add=True)

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.title)
        super().save(*args, **kwargs)

    @property
    def overall_rating(self):
        return round((self.performance_rating + self.battery_rating + self.display_rating + self.value_rating) / 4, 1)

    def __str__(self):
        return f"Review: {self.laptop.title}"

class Solution(models.Model):
    title = models.CharField(max_length=255)
    slug = models.SlugField(max_length=255, unique=True, blank=True)
    brand = models.ForeignKey(Brand, on_delete=models.SET_NULL, null=True, blank=True, related_name='solutions')
    author = models.ForeignKey(Author, on_delete=models.SET_NULL, null=True, blank=True, related_name='solutions')
    content = HTMLField(help_text="Full step-by-step guide")
    related_laptops = models.ManyToManyField(Laptop, blank=True)
    
    meta_title = models.CharField(max_length=255, blank=True)
    meta_description = models.TextField(blank=True)
    
    created_at = models.DateTimeField(auto_now_add=True)

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.title)
        super().save(*args, **kwargs)

    def __str__(self):
        return self.title

class BuyingGuide(models.Model):
    title = models.CharField(max_length=255)
    slug = models.SlugField(max_length=255, unique=True, blank=True)
    brand = models.ForeignKey(Brand, on_delete=models.SET_NULL, null=True, blank=True, related_name='guides')
    author = models.ForeignKey(Author, on_delete=models.SET_NULL, null=True, blank=True, related_name='guides')
    intro = HTMLField(blank=True)
    
    meta_title = models.CharField(max_length=255, blank=True)
    meta_description = models.TextField(blank=True)
    
    created_at = models.DateTimeField(auto_now_add=True)

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.title)
        super().save(*args, **kwargs)

    def __str__(self):
        return self.title

class BuyingGuideItem(models.Model):
    guide = models.ForeignKey(BuyingGuide, on_delete=models.CASCADE, related_name='items')
    laptop = models.ForeignKey(Laptop, on_delete=models.CASCADE)
    RANK_CHOICES = [(i, f"Rank {i}") for i in range(1, 21)]
    ordering = models.IntegerField(default=1, choices=RANK_CHOICES, help_text="Select Rank (1 is Best)")
    custom_note = HTMLField(blank=True, help_text="Why did you pick this one?")

    class Meta:
        ordering = ['ordering']

    def __str__(self):
        return f"{self.guide.title} - {self.laptop.title}"

class Coupon(models.Model):
    brand = models.ForeignKey(Brand, on_delete=models.CASCADE, related_name='coupons')
    title = models.CharField(max_length=255)
    code = models.CharField(max_length=50, blank=True, help_text="Leave blank for direct deal")
    description = models.TextField(blank=True)
    link = models.URLField(max_length=500)
    expiry_date = models.DateField(null=True, blank=True)
    is_active = models.BooleanField(default=True)
    is_deal = models.BooleanField(default=False, help_text="Check if this is a direct discount deal")
    
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.brand.name} - {self.title}"

class Store(models.Model):
    name = models.CharField(max_length=100, unique=True)
    logo = models.ImageField(upload_to='stores/', blank=True, null=True)
    base_url = models.URLField(blank=True)

    def __str__(self):
        return self.name

class RetailerPrice(models.Model):
    laptop = models.ForeignKey(Laptop, on_delete=models.CASCADE, related_name='retailer_prices')
    store = models.ForeignKey(Store, on_delete=models.CASCADE, related_name='prices')
    price = models.DecimalField(max_digits=10, decimal_places=2)
    url = models.URLField(max_length=500)
    is_available = models.BooleanField(default=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['price']

    def __str__(self):
        return f"{self.laptop.title} at {self.store.name}: {self.price}"


class ShortenedLink(models.Model):
    LINK_TYPE_CHOICES = [
        ('retailer', 'Retailer'),
        ('deal', 'Deal'),
        ('coupon', 'Coupon'),
    ]

    short_code = models.SlugField(max_length=24, unique=True, db_index=True, blank=True)
    destination_url = models.URLField(max_length=2000)
    title = models.CharField(max_length=255, blank=True)
    brand_name = models.CharField(max_length=120, blank=True)
    store_name = models.CharField(max_length=120, blank=True)
    coupon_code = models.CharField(max_length=80, blank=True)
    link_type = models.CharField(max_length=20, choices=LINK_TYPE_CHOICES, default='retailer')
    click_count = models.PositiveIntegerField(default=0)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-created_at']

    def save(self, *args, **kwargs):
        if not self.short_code:
            candidate = generate_short_link_code()
            while ShortenedLink.objects.filter(short_code=candidate).exists():
                candidate = generate_short_link_code()
            self.short_code = candidate
        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.short_code} -> {self.destination_url}"

from django.db.models.signals import pre_save, post_save, post_delete
from django.dispatch import receiver

class PushSubscription(models.Model):
    INTEREST_CHOICES = [
        ('DEALS', 'Deals & Price Drops'),
        ('NEWS', 'Tech News'),
        ('REVIEWS', 'Expert Reviews'),
        ('ALL', 'Everything'),
    ]
    
    laptop = models.ForeignKey(Laptop, on_delete=models.CASCADE, related_name='push_subscriptions', null=True, blank=True)
    interest_type = models.CharField(max_length=10, choices=INTEREST_CHOICES, default='ALL')
    endpoint = models.URLField(max_length=500, unique=True)
    p256dh = models.TextField()
    auth = models.TextField()
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        target = self.laptop.title if self.laptop else "Global"
        return f"Subscription [{self.interest_type}] - {target}"

# Signals for Automated Price Drop Alerts
@receiver(pre_save, sender=RetailerPrice)
def capture_old_price(sender, instance, **kwargs):
    if instance.pk:
        try:
            instance._old_price = RetailerPrice.objects.get(pk=instance.pk).price
        except RetailerPrice.DoesNotExist:
            instance._old_price = None
    else:
        instance._old_price = None

@receiver(post_save, sender=RetailerPrice)
@receiver(post_delete, sender=RetailerPrice)
def sync_laptop_best_price(sender, instance, **kwargs):
    """
    Automatically syncs the Laptop's base_price and affiliate_link 
    to the lowest available retailer price.
    """
    laptop = instance.laptop
    best_deal = laptop.retailer_prices.filter(is_available=True).first()
    
    if best_deal:
        # Update laptop with the best deal found
        laptop.base_price = best_deal.price
        laptop.affiliate_link = best_deal.url
        laptop.save(update_fields=['base_price', 'affiliate_link', 'updated_at'])

class NewsletterSubscription(models.Model):
    BUDGET_CHOICES = [
        ('under_50k', 'Under ₹50,000'),
        ('50k_100k', '₹50,000 - ₹1,00,000'),
        ('100k_150k', '₹1,00,000 - ₹1,50,000'),
        ('over_150k', 'Above ₹1,50,000'),
    ]
    
    name = models.CharField(max_length=100)
    email = models.EmailField(unique=True, default="subscriber@laptopduniya.in")
    budget_range = models.CharField(max_length=20, choices=BUDGET_CHOICES)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.name} ({self.get_budget_range_display()})"

class UserReview(models.Model):
    laptop = models.ForeignKey(Laptop, on_delete=models.CASCADE, related_name='user_reviews')
    user_name = models.CharField(max_length=100)
    rating = models.IntegerField(default=5)
    content = models.TextField()
    is_approved = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Review by {self.user_name} on {self.laptop.title}"

class Comment(models.Model):
    content_type = models.ForeignKey(ContentType, on_delete=models.CASCADE)
    object_id = models.PositiveIntegerField()
    content_object = GenericForeignKey('content_type', 'object_id')
    
    user_name = models.CharField(max_length=100)
    content = models.TextField()
    is_approved = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Comment by {self.user_name} on {self.content_object}"
