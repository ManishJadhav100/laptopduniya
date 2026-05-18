from django.conf import settings
from django.contrib.auth import authenticate, get_user_model
from rest_framework import serializers

from .models import (
    Author, Brand, BuyingGuide, BuyingGuideItem, Category, Comment, Coupon,
    Laptop, NewsletterSubscription, News, PushSubscription, RetailerPrice,
    Review, ShortenedLink, Solution, SpecGroup, SpecKey, SpecValue, Store,
    UserReview, ensure_shortener_profile,
)
from .public_urls import build_public_short_url

User = get_user_model()


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
        fields = [
            'id', 'title', 'slug', 'brand', 'categories', 'base_price', 'image',
            'processor_type', 'ram_gb', 'gpu_type', 'display_size', 'meta_title',
            'meta_description',
        ]


class ReviewListSerializer(serializers.ModelSerializer):
    laptop_title = serializers.CharField(source='laptop.title', read_only=True)
    laptop_slug = serializers.CharField(source='laptop.slug', read_only=True)
    overall_rating = serializers.ReadOnlyField()
    author = AuthorSerializer(read_only=True)

    class Meta:
        model = Review
        fields = [
            'id', 'title', 'slug', 'laptop_title', 'laptop_slug',
            'overall_rating', 'created_at', 'verdict', 'performance_rating',
            'battery_rating', 'display_rating', 'value_rating', 'author',
        ]


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
        queryset=Brand.objects.all(),
        source='brand',
        write_only=True,
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
    alias = serializers.RegexField(
        regex=r'^[A-Za-z0-9_-]+$',
        required=False,
        allow_blank=True,
        max_length=24,
        write_only=True,
        error_messages={
            'invalid': 'Alias can only contain letters, numbers, hyphens, and underscores.',
        },
    )
    short_path = serializers.SerializerMethodField()
    short_url = serializers.SerializerMethodField()
    owner_username = serializers.CharField(source='owner.username', read_only=True)

    class Meta:
        model = ShortenedLink
        fields = [
            'id',
            'alias',
            'short_code',
            'short_path',
            'short_url',
            'destination_url',
            'title',
            'brand_name',
            'store_name',
            'coupon_code',
            'link_type',
            'click_count',
            'last_visited_at',
            'owner_username',
            'is_active',
            'created_at',
            'updated_at',
        ]
        read_only_fields = [
            'id', 'short_code', 'short_path', 'short_url', 'click_count',
            'last_visited_at', 'owner_username', 'is_active', 'created_at',
            'updated_at',
        ]

    def get_short_path(self, obj):
        return f"/s/{obj.short_code}"

    def get_short_url(self, obj):
        return build_public_short_url(
            self.get_short_path(obj),
            request=self.context.get('request'),
        )

    def validate_alias(self, value):
        normalized_value = value.strip()

        if not normalized_value:
            return ''

        existing = ShortenedLink.objects.filter(short_code__iexact=normalized_value)

        if self.instance:
            existing = existing.exclude(pk=self.instance.pk)

        if existing.exists():
            raise serializers.ValidationError('This alias is already in use.')

        return normalized_value

    def create(self, validated_data):
        alias = validated_data.pop('alias', '')

        if alias:
            validated_data['short_code'] = alias

        return super().create(validated_data)


class AuthUserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'date_joined']
        read_only_fields = fields


class RegisterSerializer(serializers.Serializer):
    username = serializers.CharField(max_length=150)
    email = serializers.EmailField()
    password = serializers.CharField(write_only=True, min_length=8)

    def validate_username(self, value):
        if User.objects.filter(username__iexact=value).exists():
            raise serializers.ValidationError('This username is already taken.')
        return value

    def validate_email(self, value):
        normalized_value = value.lower()
        if User.objects.filter(email__iexact=normalized_value).exists():
            raise serializers.ValidationError('This email is already registered.')
        return normalized_value

    def create(self, validated_data):
        user = User.objects.create_user(
            username=validated_data['username'],
            email=validated_data['email'],
            password=validated_data['password'],
        )
        ensure_shortener_profile(user)
        return user


class LoginSerializer(serializers.Serializer):
    login = serializers.CharField()
    password = serializers.CharField(write_only=True)

    def validate(self, attrs):
        login_value = attrs['login'].strip()
        password = attrs['password']

        user = User.objects.filter(email__iexact=login_value).first()
        username = user.username if user else login_value
        authenticated_user = authenticate(
            request=self.context.get('request'),
            username=username,
            password=password,
        )

        if not authenticated_user:
            raise serializers.ValidationError('Invalid username/email or password.')

        if not authenticated_user.is_active:
            raise serializers.ValidationError('This account is inactive.')

        attrs['user'] = authenticated_user
        return attrs


class RefreshTokenSerializer(serializers.Serializer):
    refresh = serializers.CharField()


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
