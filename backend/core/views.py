from rest_framework import viewsets, filters, generics, mixins
from django.db.models import Q
from rest_framework.response import Response
from django_filters.rest_framework import DjangoFilterBackend
from .models import Laptop, News, Review, Solution, BuyingGuide, Coupon, Brand, Category, PushSubscription, NewsletterSubscription, UserReview, Comment, ShortenedLink
from .filters import LaptopFilter
from .serializers import (
    LaptopListSerializer, LaptopDetailSerializer,
    NewsSerializer, ReviewListSerializer, ReviewDetailSerializer,
    SolutionSerializer, BuyingGuideSerializer, CouponSerializer, BrandSerializer, CategorySerializer, PushSubscriptionSerializer, NewsletterSubscriptionSerializer,
    UserReviewSerializer, CommentSerializer, ShortenedLinkSerializer
)

class BrandViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Brand.objects.all().order_by('name')
    serializer_class = BrandSerializer
    lookup_field = 'slug'

class CategoryViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Category.objects.all().order_by('name')
    serializer_class = CategorySerializer
    lookup_field = 'slug'

class LaptopViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Laptop.objects.all().order_by('-created_at')
    lookup_field = 'slug'
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_class = LaptopFilter
    search_fields = ['title', 'brand__name']
    ordering_fields = ['base_price', 'created_at']

    def get_serializer_class(self):
        if self.action == 'retrieve':
            return LaptopDetailSerializer
        return LaptopListSerializer

class NewsViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = News.objects.all().order_by('-created_at')
    serializer_class = NewsSerializer
    lookup_field = 'slug'
    filter_backends = [DjangoFilterBackend, filters.SearchFilter]
    filterset_fields = ['category', 'brand__slug']
    search_fields = ['title']

class ReviewViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Review.objects.all().order_by('-created_at')
    lookup_field = 'slug'
    filter_backends = [DjangoFilterBackend, filters.SearchFilter]
    filterset_fields = ['brand__slug']
    search_fields = ['title', 'laptop__title']

    def get_serializer_class(self):
        if self.action == 'retrieve':
            return ReviewDetailSerializer
        return ReviewListSerializer

class SolutionViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Solution.objects.all().order_by('-created_at')
    serializer_class = SolutionSerializer
    lookup_field = 'slug'
    filter_backends = [DjangoFilterBackend, filters.SearchFilter]
    filterset_fields = ['brand__slug']
    search_fields = ['title']

class BuyingGuideViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = BuyingGuide.objects.all().order_by('-created_at')
    serializer_class = BuyingGuideSerializer
    lookup_field = 'slug'
    filter_backends = [DjangoFilterBackend, filters.SearchFilter]
    filterset_fields = ['brand__slug']
    search_fields = ['title']

class CouponViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Coupon.objects.filter(is_active=True).order_by('-created_at')
    serializer_class = CouponSerializer
    filter_backends = [DjangoFilterBackend, filters.SearchFilter]
    filterset_fields = ['brand__slug', 'is_deal']
    search_fields = ['title', 'brand__name']

class HomeAPIView(generics.GenericAPIView):
    def get(self, request, *args, **kwargs):
        latest_laptops = Laptop.objects.all().order_by('-created_at')[:6]
        latest_news = News.objects.all().order_by('-created_at')[:4]
        latest_reviews = Review.objects.all().order_by('-created_at')[:4]
        latest_guides = BuyingGuide.objects.all().order_by('-created_at')[:3]
        
        return Response({
            'featured_laptops': LaptopListSerializer(latest_laptops, many=True).data,
            'latest_news': NewsSerializer(latest_news, many=True).data,
            'latest_reviews': ReviewListSerializer(latest_reviews, many=True).data,
            'buying_guides_highlights': BuyingGuideSerializer(latest_guides, many=True).data,
            'popular_brands': BrandSerializer(Brand.objects.all()[:8], many=True).data,
        })

class BrandHubAPIView(generics.GenericAPIView):
    def get(self, request, slug, *args, **kwargs):
        try:
            brand = Brand.objects.get(slug__iexact=slug)
        except Brand.DoesNotExist:
            return Response({'error': 'Brand not found'}, status=404)

        laptops = Laptop.objects.filter(brand=brand).order_by('-created_at')[:10]
        news = News.objects.filter(brand=brand).order_by('-created_at')[:5]
        reviews = Review.objects.filter(brand=brand).order_by('-created_at')[:5]
        solutions = Solution.objects.filter(brand=brand).order_by('-created_at')[:5]
        coupons = Coupon.objects.filter(brand=brand, is_active=True).order_by('-created_at')

        return Response({
            'brand': BrandSerializer(brand).data,
            'laptops': LaptopListSerializer(laptops, many=True).data,
            'news': NewsSerializer(news, many=True).data,
            'reviews': ReviewListSerializer(reviews, many=True).data,
            'solutions': SolutionSerializer(solutions, many=True).data,
            'coupons': CouponSerializer(coupons, many=True).data,
        })
class GlobalSearchAPIView(generics.GenericAPIView):
    def get(self, request, *args, **kwargs):
        query = request.query_params.get('q', '')
        if len(query) < 2:
            return Response({
                'brands': [], 'laptops': [], 'categories': [],
                'news': [], 'reviews': [], 'guides': [], 'solutions': []
            })

        # Search Brands & Categories
        brands = Brand.objects.filter(name__icontains=query)[:5]
        categories = Category.objects.filter(name__icontains=query)[:5]
        
        # Search Content
        news = News.objects.filter(title__icontains=query)[:4]
        guides = BuyingGuide.objects.filter(title__icontains=query)[:4]
        reviews = Review.objects.filter(title__icontains=query)[:4]
        solutions = Solution.objects.filter(title__icontains=query)[:4]

        # Search Laptops (Title, CPU, GPU)
        laptop_q = Q(title__icontains=query) | Q(processor_type__icontains=query) | Q(gpu_type__icontains=query)
        
        try:
            price_limit = float(query)
            laptop_q |= Q(base_price__lte=price_limit)
        except ValueError:
            pass
            
        laptops = Laptop.objects.filter(laptop_q).order_by('-created_at')[:8]

        return Response({
            'brands': BrandSerializer(brands, many=True).data,
            'categories': CategorySerializer(categories, many=True).data,
            'laptops': LaptopListSerializer(laptops, many=True).data,
            'news': NewsSerializer(news, many=True).data,
            'guides': BuyingGuideSerializer(guides, many=True).data,
            'reviews': ReviewListSerializer(reviews, many=True).data,
            'solutions': SolutionSerializer(solutions, many=True).data,
        })

class PushSubscriptionViewSet(viewsets.ModelViewSet):
    queryset = PushSubscription.objects.all()
    serializer_class = PushSubscriptionSerializer

    def create(self, request, *args, **kwargs):
        # Allow linking to a laptop by slug or ID
        laptop_id = request.data.get('laptop')
        laptop_slug = request.data.get('laptop_slug')
        
        if laptop_slug:
            try:
                laptop = Laptop.objects.get(slug=laptop_slug)
                request.data['laptop'] = laptop.id
            except Laptop.DoesNotExist:
                return Response({'error': 'Laptop not found'}, status=404)

        return super().create(request, *args, **kwargs)

class NewsletterSubscriptionViewSet(viewsets.ModelViewSet):
    queryset = NewsletterSubscription.objects.all()
    serializer_class = NewsletterSubscriptionSerializer


class ShortenedLinkViewSet(mixins.CreateModelMixin, mixins.RetrieveModelMixin, viewsets.GenericViewSet):
    queryset = ShortenedLink.objects.filter(is_active=True)
    serializer_class = ShortenedLinkSerializer
    lookup_field = 'short_code'

class UserReviewViewSet(viewsets.ModelViewSet):
    queryset = UserReview.objects.filter(is_approved=True)
    serializer_class = UserReviewSerializer

    def get_queryset(self):
        # Allow seeing all for POST/submissions if needed, but usually we filter by approved
        if self.action == 'create':
            return UserReview.objects.all()
        return UserReview.objects.filter(is_approved=True)

    def perform_create(self, serializer):
        # Force is_approved to False regardless of input
        serializer.save(is_approved=False)

class CommentViewSet(viewsets.ModelViewSet):
    queryset = Comment.objects.filter(is_approved=True)
    serializer_class = CommentSerializer

    def get_queryset(self):
        if self.action == 'create':
            return Comment.objects.all()
        return Comment.objects.filter(is_approved=True)

    def perform_create(self, serializer):
        serializer.save(is_approved=False)
