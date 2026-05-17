from rest_framework import serializers
from .models import (
    Brand, Category, SpecGroup, SpecKey, SpecValue, Laptop,
    News, Review, Solution, BuyingGuide, BuyingGuideItem, Author, Coupon, Store, RetailerPrice, PushSubscription, NewsletterSubscription,
    UserReview, Comment, ShortenedLink
)

class AuthorSerializer(serializers.ModelSerializer):
    class Meta:
        model = Author
        fields = '__all__'

class BrandSerializer(serializers.ModelSerializer):
    class Meta:
        model = Brand
        fields = '__all__'

class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = '__all__'

class StoreSerializer(serializers.ModelSerializer):
    class Meta:
        model = Store
        fields = '__all__'

class RetailerPriceSerializer(serializers.ModelSerializer):
    store = StoreSerializer(read_only=True)
    class Meta:
        model = RetailerPrice
        fields = '__all__'

class SpecValueSerializer(serializers.ModelSerializer):
    spec_key = serializers.StringRelatedField()
    spec_group = serializers.CharField(source='spec_key.group.name', read_only=True)

    class Meta:
        model = SpecValue
        fields = ['spec_group', 'spec_key', 'value']

class LaptopListSerializer(serializers.ModelSerializer):
    brand = BrandSerializer(read_only=True)
    categories = CategorySerializer(many=True, read_only=True)

    class Meta:
        model = Laptop
        fields = ['id', 'title', 'slug', 'brand', 'categories', 'base_price', 'image', 'processor_type', 'ram_gb', 'gpu_type', 'display_size', 'meta_title', 'meta_description']

class ReviewListSerializer(serializers.ModelSerializer):
    laptop_title = serializers.CharField(source='laptop.title', read_only=True)
    laptop_slug = serializers.CharField(source='laptop.slug', read_only=True)
    overall_rating = serializers.ReadOnlyField()
    author = AuthorSerializer(read_only=True)

    class Meta:
        model = Review
        fields = ['id', 'title', 'slug', 'laptop_title', 'laptop_slug', 'overall_rating', 'created_at', 'verdict', 'performance_rating', 'battery_rating', 'display_rating', 'value_rating', 'author']

class LaptopDetailSerializer(serializers.ModelSerializer):
    brand = BrandSerializer(read_only=True)
    categories = CategorySerializer(many=True, read_only=True)
    specifications = SpecValueSerializer(many=True, read_only=True)
    expert_review = ReviewListSerializer(read_only=True)
    retailer_prices = RetailerPriceSerializer(many=True, read_only=True)
    
    class Meta:
        model = Laptop
        fields = '__all__'

class NewsSerializer(serializers.ModelSerializer):
    related_laptops = LaptopListSerializer(many=True, read_only=True)
    author = AuthorSerializer(read_only=True)
    brand = BrandSerializer(read_only=True)

    class Meta:
        model = News
        fields = '__all__'

class ReviewDetailSerializer(serializers.ModelSerializer):
    laptop = LaptopListSerializer(read_only=True)
    overall_rating = serializers.ReadOnlyField()
    author = AuthorSerializer(read_only=True)
    brand = BrandSerializer(read_only=True)

    class Meta:
        model = Review
        fields = '__all__'

class SolutionSerializer(serializers.ModelSerializer):
    related_laptops = LaptopListSerializer(many=True, read_only=True)
    author = AuthorSerializer(read_only=True)
    brand = BrandSerializer(read_only=True)

    class Meta:
        model = Solution
        fields = '__all__'

class BuyingGuideItemSerializer(serializers.ModelSerializer):
    laptop = LaptopListSerializer(read_only=True)

    class Meta:
        model = BuyingGuideItem
        fields = ['ordering', 'laptop', 'custom_note']

class BuyingGuideSerializer(serializers.ModelSerializer):
    items = BuyingGuideItemSerializer(many=True, read_only=True)
    author = AuthorSerializer(read_only=True)
    brand = BrandSerializer(read_only=True)

    class Meta:
        model = BuyingGuide
        fields = '__all__'

class CouponSerializer(serializers.ModelSerializer):
    brand = BrandSerializer(read_only=True)
    brand_id = serializers.PrimaryKeyRelatedField(
        queryset=Brand.objects.all(), source='brand', write_only=True
    )
    
    class Meta:
        model = Coupon
        fields = '__all__'

class PushSubscriptionSerializer(serializers.ModelSerializer):
    class Meta:
        model = PushSubscription
        fields = '__all__'

class NewsletterSubscriptionSerializer(serializers.ModelSerializer):
    class Meta:
        model = NewsletterSubscription
        fields = '__all__'


class ShortenedLinkSerializer(serializers.ModelSerializer):
    short_path = serializers.SerializerMethodField()

    class Meta:
        model = ShortenedLink
        fields = [
            'id',
            'short_code',
            'short_path',
            'destination_url',
            'title',
            'brand_name',
            'store_name',
            'coupon_code',
            'link_type',
            'click_count',
            'is_active',
            'created_at',
            'updated_at',
        ]
        read_only_fields = ['id', 'short_code', 'short_path', 'click_count', 'is_active', 'created_at', 'updated_at']

    def get_short_path(self, obj):
        return f"/s/{obj.short_code}"

class UserReviewSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserReview
        fields = ['id', 'laptop', 'user_name', 'rating', 'content', 'created_at']

    def validate_content(self, value):
        import re
        if re.search(r'(http|https|www\.)', value):
            raise serializers.ValidationError("Links are not allowed in reviews.")
        return value

class CommentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Comment
        fields = ['id', 'content_type', 'object_id', 'user_name', 'content', 'created_at']

    def validate_content(self, value):
        import re
        if re.search(r'(http|https|www\.)', value):
            raise serializers.ValidationError("Links are not allowed in comments.")
        return value
