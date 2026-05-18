from django.conf import settings
from django.contrib.auth import get_user_model
from django.db.models import Count, F, Q, Sum
from django.http import HttpResponse, JsonResponse
from django.shortcuts import get_object_or_404, redirect
from django.utils import timezone
from django.views import View
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework import filters, generics, mixins, permissions, status, viewsets
from rest_framework.decorators import action
from rest_framework.exceptions import AuthenticationFailed
from rest_framework.response import Response
from rest_framework.views import APIView

from .filters import LaptopFilter
from .jwt_auth import create_token_pair, validate_token
from .models import (
    Brand, BuyingGuide, Category, Comment, Coupon, Laptop, NewsletterSubscription,
    News, PushSubscription, Review, ShortenedLink, ShortenerUserProfile,
    Solution, UserReview, ensure_shortener_profile,
)
from .public_urls import build_public_base_url, build_public_short_url
from .serializers import (
    AuthUserSerializer, BrandSerializer, BuyingGuideSerializer, CategorySerializer,
    CommentSerializer, CouponSerializer, LaptopDetailSerializer, LaptopListSerializer,
    LoginSerializer, NewsletterSubscriptionSerializer, NewsSerializer,
    PushSubscriptionSerializer, RefreshTokenSerializer, RegisterSerializer,
    ReviewDetailSerializer, ReviewListSerializer, ShortenedLinkSerializer,
    SolutionSerializer, UserReviewSerializer,
)

User = get_user_model()


def _first_error_message(errors, default_message):
    first_error = next(iter(errors.values()), [default_message])
    if isinstance(first_error, (list, tuple)):
        return str(first_error[0])
    return str(first_error)


def _build_public_base_url(request):
    return build_public_base_url(request)


def _build_auth_payload(user, include_tokens=False, tokens=None):
    profile = ensure_shortener_profile(user)
    payload = {
        'user': AuthUserSerializer(user).data,
        'api_key': profile.api_key,
    }

    if include_tokens:
        payload['tokens'] = tokens or create_token_pair(user)

    return payload


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
                'news': [], 'reviews': [], 'guides': [], 'solutions': [],
            })

        brands = Brand.objects.filter(name__icontains=query)[:5]
        categories = Category.objects.filter(name__icontains=query)[:5]
        news = News.objects.filter(title__icontains=query)[:4]
        guides = BuyingGuide.objects.filter(title__icontains=query)[:4]
        reviews = Review.objects.filter(title__icontains=query)[:4]
        solutions = Solution.objects.filter(title__icontains=query)[:4]

        laptop_query = (
            Q(title__icontains=query) |
            Q(processor_type__icontains=query) |
            Q(gpu_type__icontains=query)
        )

        try:
            price_limit = float(query)
            laptop_query |= Q(base_price__lte=price_limit)
        except ValueError:
            pass

        laptops = Laptop.objects.filter(laptop_query).order_by('-created_at')[:8]

        return Response({
            'brands': BrandSerializer(brands, many=True).data,
            'categories': CategorySerializer(categories, many=True).data,
            'laptops': LaptopListSerializer(laptops, many=True).data,
            'news': NewsSerializer(news, many=True).data,
            'guides': BuyingGuideSerializer(guides, many=True).data,
            'reviews': ReviewListSerializer(reviews, many=True).data,
            'solutions': SolutionSerializer(solutions, many=True).data,
        })


class AuthRegisterAPIView(APIView):
    authentication_classes = []
    permission_classes = [permissions.AllowAny]

    def post(self, request, *args, **kwargs):
        serializer = RegisterSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()
        return Response(
            _build_auth_payload(user, include_tokens=True),
            status=status.HTTP_201_CREATED,
        )


class AuthLoginAPIView(APIView):
    authentication_classes = []
    permission_classes = [permissions.AllowAny]

    def post(self, request, *args, **kwargs):
        serializer = LoginSerializer(data=request.data, context={'request': request})
        serializer.is_valid(raise_exception=True)
        user = serializer.validated_data['user']
        return Response(_build_auth_payload(user, include_tokens=True))


class AuthRefreshAPIView(APIView):
    authentication_classes = []
    permission_classes = [permissions.AllowAny]

    def post(self, request, *args, **kwargs):
        serializer = RefreshTokenSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        payload = validate_token(
            serializer.validated_data['refresh'],
            expected_type='refresh',
        )
        user = User.objects.filter(
            pk=payload.get('sub'),
            is_active=True,
        ).first()

        if not user:
            raise AuthenticationFailed('User not found.')

        return Response(_build_auth_payload(user, include_tokens=True))


class AuthMeAPIView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request, *args, **kwargs):
        return Response(_build_auth_payload(request.user))


class PushSubscriptionViewSet(viewsets.ModelViewSet):
    queryset = PushSubscription.objects.all()
    serializer_class = PushSubscriptionSerializer

    def create(self, request, *args, **kwargs):
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


class ShortenedLinkViewSet(
    mixins.CreateModelMixin,
    mixins.ListModelMixin,
    mixins.RetrieveModelMixin,
    viewsets.GenericViewSet,
):
    serializer_class = ShortenedLinkSerializer
    lookup_field = 'short_code'

    def get_queryset(self):
        if self.action in ['list', 'dashboard']:
            if not self.request.user.is_authenticated:
                return ShortenedLink.objects.none()
            return ShortenedLink.objects.filter(owner=self.request.user).order_by('-created_at')

        return ShortenedLink.objects.filter(is_active=True).select_related('owner')

    def get_permissions(self):
        if self.action in ['retrieve', 'visit']:
            permission_classes = [permissions.AllowAny]
        else:
            permission_classes = [permissions.IsAuthenticated]
        return [permission() for permission in permission_classes]

    def perform_create(self, serializer):
        ensure_shortener_profile(self.request.user)
        serializer.save(owner=self.request.user)

    @action(detail=True, methods=['post'], url_path='visit')
    def visit(self, request, *args, **kwargs):
        short_link = self.get_object()
        visit_timestamp = timezone.now()
        ShortenedLink.objects.filter(pk=short_link.pk).update(
            click_count=F('click_count') + 1,
            last_visited_at=visit_timestamp,
            updated_at=visit_timestamp,
        )
        short_link.refresh_from_db()
        return Response(self.get_serializer(short_link).data)

    @action(detail=False, methods=['get'], url_path='dashboard')
    def dashboard(self, request, *args, **kwargs):
        user_links = self.get_queryset()
        profile = ensure_shortener_profile(request.user)
        totals = user_links.aggregate(
            total_links=Count('id'),
            total_views=Sum('click_count'),
            active_links=Count('id', filter=Q(is_active=True)),
        )
        link_type_totals = {
            row['link_type']: row['total']
            for row in user_links.values('link_type').annotate(total=Count('id'))
        }
        top_link = user_links.order_by('-click_count', '-created_at').first()
        total_links = totals['total_links'] or 0
        total_views = totals['total_views'] or 0
        api_base = _build_public_base_url(request)

        return Response({
            'user': AuthUserSerializer(request.user).data,
            'api_key': profile.api_key,
            'api_endpoint_example': (
                f"{api_base}/api?api={profile.api_key}&url=example.com&alias=my-custom-link"
            ),
            'summary': {
                'total_links': total_links,
                'active_links': totals['active_links'] or 0,
                'total_views': total_views,
                'average_views_per_link': round(total_views / total_links, 2) if total_links else 0,
                'retailer_links': link_type_totals.get('retailer', 0),
                'deal_links': link_type_totals.get('deal', 0),
                'coupon_links': link_type_totals.get('coupon', 0),
            },
            'top_link': (
                ShortenedLinkSerializer(top_link, context={'request': request}).data
                if top_link else None
            ),
            'links': ShortenedLinkSerializer(
                user_links[:100],
                many=True,
                context={'request': request},
            ).data,
        })


class UserReviewViewSet(viewsets.ModelViewSet):
    queryset = UserReview.objects.filter(is_approved=True)
    serializer_class = UserReviewSerializer

    def get_queryset(self):
        if self.action == 'create':
            return UserReview.objects.all()
        return UserReview.objects.filter(is_approved=True)

    def perform_create(self, serializer):
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


class ShortenerApiView(View):
    http_method_names = ['get']

    def get(self, request, *args, **kwargs):
        response_format = request.GET.get('format', '').strip().lower() or 'json'
        response_mode = request.GET.get('response', '').strip().lower()
        if response_mode == 'text':
            response_format = 'text'

        def build_response(payload, status_code=status.HTTP_200_OK):
            if response_format == 'text':
                message = (
                    payload.get('shortenedUrl')
                    if payload.get('status') == 'success'
                    else payload.get('message', '')
                )
                return HttpResponse(
                    message,
                    content_type='text/plain; charset=utf-8',
                    status=status_code,
                )

            return JsonResponse(payload, status=status_code)

        provided_token = request.GET.get('api', '').strip()
        if not provided_token:
            return build_response(
                {'status': 'error', 'message': 'API token is required.'},
                status.HTTP_400_BAD_REQUEST,
            )

        profile = ShortenerUserProfile.objects.select_related('user').filter(
            api_key=provided_token
        ).first()
        owner = profile.user if profile else None

        if not owner and provided_token != settings.SHORTENER_API_TOKEN:
            return build_response(
                {'status': 'error', 'message': 'Invalid API token.'},
                status.HTTP_403_FORBIDDEN,
            )

        destination_url = request.GET.get('url', '').strip()
        if not destination_url:
            return build_response(
                {'status': 'error', 'message': 'The url parameter is required.'},
                status.HTTP_400_BAD_REQUEST,
            )

        if '://' not in destination_url:
            destination_url = f'https://{destination_url}'

        serializer = ShortenedLinkSerializer(
            data={
                'destination_url': destination_url,
                'alias': request.GET.get('alias', '').strip(),
                'title': request.GET.get('title', '').strip(),
                'brand_name': request.GET.get('brand', '').strip(),
                'store_name': request.GET.get('store', '').strip(),
                'coupon_code': request.GET.get('coupon', '').strip(),
                'link_type': request.GET.get('type', '').strip() or 'retailer',
            },
            context={'request': request},
        )

        if not serializer.is_valid():
            return build_response(
                {
                    'status': 'error',
                    'message': _first_error_message(
                        serializer.errors,
                        'Unable to shorten this URL.',
                    ),
                },
                status.HTTP_400_BAD_REQUEST,
            )

        short_link = serializer.save(owner=owner)
        response_serializer = ShortenedLinkSerializer(
            short_link,
            context={'request': request},
        )

        return build_response(
            {
                'status': 'success',
                'shortenedUrl': response_serializer.data['short_url'],
                'shortCode': short_link.short_code,
                'shortPath': response_serializer.data['short_path'],
            },
            status.HTTP_201_CREATED,
        )


class LegacyShortCodeRedirectView(View):
    http_method_names = ['get']

    def get(self, request, short_code, *args, **kwargs):
        short_link = get_object_or_404(
            ShortenedLink.objects.filter(is_active=True),
            short_code=short_code,
        )
        return redirect(
            build_public_short_url(
                f'/s/{short_link.short_code}',
                request=request,
            )
        )
