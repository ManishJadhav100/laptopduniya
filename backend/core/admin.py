from django.contrib import admin
from .models import (
    Brand, Category, SpecGroup, SpecKey, Laptop, SpecValue,
    News, Review, Solution, BuyingGuide, BuyingGuideItem,
    Store, RetailerPrice, PushSubscription, NewsletterSubscription, Coupon,
    UserReview, Comment, ShortenedLink, ShortenerUserProfile
)

@admin.register(Brand)
class BrandAdmin(admin.ModelAdmin):
    prepopulated_fields = {'slug': ('name',)}
    list_display = ('name', 'slug')
    search_fields = ['name']

@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    prepopulated_fields = {'slug': ('name',)}
    list_display = ('name', 'slug')
    search_fields = ['name']

@admin.register(SpecGroup)
class SpecGroupAdmin(admin.ModelAdmin):
    list_display = ('name',)
    search_fields = ['name']

@admin.register(SpecKey)
class SpecKeyAdmin(admin.ModelAdmin):
    list_display = ('name', 'group')
    list_filter = ('group',)
    search_fields = ['name']
    autocomplete_fields = ['group']

class SpecValueInline(admin.TabularInline):
    model = SpecValue
    extra = 1
    autocomplete_fields = ['spec_key']

@admin.register(Laptop)
class LaptopAdmin(admin.ModelAdmin):
    prepopulated_fields = {'slug': ('title',)}
    list_display = ('title', 'brand', 'base_price', 'created_at')
    list_filter = ('brand', 'categories')
    search_fields = ('title', 'brand__name')
    inlines = [SpecValueInline]
    filter_horizontal = ('categories',)
    autocomplete_fields = ['brand']
    actions = ['send_deal_broadcast']

    @admin.action(description="Send Deal Alert to Subscribers")
    def send_deal_broadcast(self, request, queryset):
        from .push_service import trigger_laptop_price_alerts
        count = 0
        for laptop in queryset:
            # We use the current base_price for the broadcast
            count += trigger_laptop_price_alerts(laptop, laptop.base_price, "Laptop Duniya")
        self.message_user(request, f"Triggered {count} notifications.")

@admin.register(News)
class NewsAdmin(admin.ModelAdmin):
    prepopulated_fields = {'slug': ('title',)}
    list_display = ('title', 'category', 'created_at')
    list_filter = ('category',)
    search_fields = ('title',)
    filter_horizontal = ('related_laptops',)
    actions = ['broadcast_news']

    @admin.action(description="Send Push Alert for this News")
    def broadcast_news(self, request, queryset):
        from .push_service import broadcast_to_topic
        for news in queryset:
            broadcast_to_topic(
                topic='NEWS', 
                title="New Tech Update! 📰", 
                message=news.title, 
                url=f"/news/{news.slug}"
            )
        self.message_user(request, "Broadcast triggers sent to News subscribers.")

@admin.register(Review)
class ReviewAdmin(admin.ModelAdmin):
    prepopulated_fields = {'slug': ('title',)}
    list_display = ('title', 'laptop', 'overall_rating', 'created_at')
    search_fields = ('title', 'laptop__title')
    autocomplete_fields = ['laptop']

@admin.register(Solution)
class SolutionAdmin(admin.ModelAdmin):
    prepopulated_fields = {'slug': ('title',)}
    list_display = ('title', 'created_at')
    search_fields = ('title',)
    filter_horizontal = ('related_laptops',)

class BuyingGuideItemInline(admin.TabularInline):
    model = BuyingGuideItem
    extra = 1
    autocomplete_fields = ['laptop']

@admin.register(BuyingGuide)
class BuyingGuideAdmin(admin.ModelAdmin):
    prepopulated_fields = {'slug': ('title',)}
    list_display = ('title', 'created_at')
    inlines = [BuyingGuideItemInline]

@admin.register(Store)
class StoreAdmin(admin.ModelAdmin):
    list_display = ('name', 'base_url')
    search_fields = ['name']

@admin.register(RetailerPrice)
class RetailerPriceAdmin(admin.ModelAdmin):
    list_display = ('laptop', 'store', 'price', 'is_available', 'updated_at')
    list_filter = ('store', 'is_available')
    autocomplete_fields = ['laptop', 'store']

@admin.register(PushSubscription)
class PushSubscriptionAdmin(admin.ModelAdmin):
    list_display = ('endpoint', 'laptop', 'interest_type', 'is_active', 'created_at')
    list_filter = ('interest_type', 'is_active')

@admin.register(NewsletterSubscription)
class NewsletterSubscriptionAdmin(admin.ModelAdmin):
    list_display = ('name', 'email', 'budget_range', 'created_at')
    list_filter = ('budget_range',)
    search_fields = ('name', 'email')

@admin.register(Coupon)
class CouponAdmin(admin.ModelAdmin):
    list_display = ('title', 'brand', 'code', 'is_active', 'is_deal')
    list_filter = ('is_active', 'is_deal', 'brand')
    actions = ['broadcast_coupon']

    @admin.action(description="Broadcast this Coupon/Deal")
    def broadcast_coupon(self, request, queryset):
        from .push_service import broadcast_to_topic
        for coupon in queryset:
            broadcast_to_topic(
                topic='DEALS', 
                title="New Hot Deal! 🔥", 
                message=coupon.title, 
                url="/coupons"
            )
        self.message_user(request, "Sent to deal hunters.")

@admin.register(ShortenerUserProfile)
class ShortenerUserProfileAdmin(admin.ModelAdmin):
    list_display = ('user', 'api_key', 'created_at', 'updated_at')
    search_fields = ('user__username', 'user__email', 'api_key')
    readonly_fields = ('api_key', 'created_at', 'updated_at')
    autocomplete_fields = ('user',)


@admin.register(ShortenedLink)
class ShortenedLinkAdmin(admin.ModelAdmin):
    list_display = (
        'short_code', 'owner', 'title', 'link_type', 'brand_name',
        'store_name', 'click_count', 'last_visited_at', 'is_active',
        'created_at',
    )
    list_filter = ('link_type', 'is_active', 'created_at')
    search_fields = (
        'short_code', 'owner__username', 'owner__email', 'title',
        'destination_url', 'brand_name', 'store_name', 'coupon_code',
    )
    readonly_fields = ('click_count', 'last_visited_at', 'created_at', 'updated_at')
    autocomplete_fields = ('owner',)

@admin.register(UserReview)
class UserReviewAdmin(admin.ModelAdmin):
    list_display = ('user_name', 'laptop', 'rating', 'is_approved', 'created_at')
    list_filter = ('is_approved', 'rating')
    search_fields = ('user_name', 'content', 'laptop__title')
    actions = ['approve_reviews']

    @admin.action(description="Approve selected reviews")
    def approve_reviews(self, request, queryset):
        queryset.update(is_approved=True)

@admin.register(Comment)
class CommentAdmin(admin.ModelAdmin):
    list_display = ('user_name', 'content_object', 'is_approved', 'created_at')
    list_filter = ('is_approved',)
    search_fields = ('user_name', 'content')
    actions = ['approve_comments']

    @admin.action(description="Approve selected comments")
    def approve_comments(self, request, queryset):
        queryset.update(is_approved=True)
