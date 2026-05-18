from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    AuthLoginAPIView, AuthMeAPIView, AuthRefreshAPIView, AuthRegisterAPIView,
    LaptopViewSet, NewsViewSet, ReviewViewSet, 
    SolutionViewSet, BuyingGuideViewSet, CouponViewSet, 
    BrandViewSet, CategoryViewSet, HomeAPIView, BrandHubAPIView, 
    GlobalSearchAPIView, PushSubscriptionViewSet, NewsletterSubscriptionViewSet,
    UserReviewViewSet, CommentViewSet, ShortenedLinkViewSet
)

router = DefaultRouter()
router.register(r'laptops', LaptopViewSet, basename='laptop')
router.register(r'news', NewsViewSet, basename='news')
router.register(r'reviews', ReviewViewSet, basename='review')
router.register(r'solutions', SolutionViewSet, basename='solution')
router.register(r'guides', BuyingGuideViewSet, basename='guide')
router.register(r'coupons', CouponViewSet, basename='coupon')
router.register(r'brands', BrandViewSet, basename='brand')
router.register(r'categories', CategoryViewSet, basename='category')
router.register(r'push-subscriptions', PushSubscriptionViewSet, basename='push-subscription')
router.register(r'newsletter', NewsletterSubscriptionViewSet, basename='newsletter')
router.register(r'short-links', ShortenedLinkViewSet, basename='short-link')
router.register(r'user-reviews', UserReviewViewSet, basename='user-review')
router.register(r'comments', CommentViewSet, basename='comment')

urlpatterns = [
    path('auth/register/', AuthRegisterAPIView.as_view(), name='auth-register'),
    path('auth/login/', AuthLoginAPIView.as_view(), name='auth-login'),
    path('auth/refresh/', AuthRefreshAPIView.as_view(), name='auth-refresh'),
    path('auth/me/', AuthMeAPIView.as_view(), name='auth-me'),
    path('home/', HomeAPIView.as_view(), name='home'),
    path('brands/<slug:slug>/hub/', BrandHubAPIView.as_view(), name='brand-hub'),
    path('search/', GlobalSearchAPIView.as_view(), name='global-search'),
    path('', include(router.urls)),
]
