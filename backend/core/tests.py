from django.contrib.auth import get_user_model
from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase

from .models import ShortenedLink, ShortenerUserProfile

User = get_user_model()


class AuthApiTests(APITestCase):
    def test_register_returns_tokens_and_api_key(self):
        response = self.client.post(
            reverse('auth-register'),
            {
                'username': 'creator',
                'email': 'creator@example.com',
                'password': 'StrongPass123',
            },
            format='json',
        )

        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(response.data['user']['username'], 'creator')
        self.assertTrue(response.data['api_key'])
        self.assertTrue(response.data['tokens']['access'])
        self.assertTrue(response.data['tokens']['refresh'])
        self.assertTrue(
            ShortenerUserProfile.objects.filter(user__username='creator').exists()
        )

    def test_login_and_me_endpoint_work_with_bearer_token(self):
        user = User.objects.create_user(
            username='member',
            email='member@example.com',
            password='StrongPass123',
        )
        ShortenerUserProfile.objects.create(user=user)

        login_response = self.client.post(
            reverse('auth-login'),
            {
                'login': 'member@example.com',
                'password': 'StrongPass123',
            },
            format='json',
        )

        self.assertEqual(login_response.status_code, status.HTTP_200_OK)
        access_token = login_response.data['tokens']['access']
        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {access_token}')

        me_response = self.client.get(reverse('auth-me'))

        self.assertEqual(me_response.status_code, status.HTTP_200_OK)
        self.assertEqual(me_response.data['user']['username'], 'member')
        self.assertEqual(me_response.data['api_key'], user.shortener_profile.api_key)


class ShortenedLinkApiTests(APITestCase):
    def setUp(self):
        self.user = User.objects.create_user(
            username='owner',
            email='owner@example.com',
            password='StrongPass123',
        )
        self.profile = ShortenerUserProfile.objects.create(user=self.user)

    def authenticate(self):
        login_response = self.client.post(
            reverse('auth-login'),
            {
                'login': self.user.username,
                'password': 'StrongPass123',
            },
            format='json',
        )
        access_token = login_response.data['tokens']['access']
        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {access_token}')

    def test_shortened_link_creation_requires_authentication(self):
        response = self.client.post(
            reverse('short-link-list'),
            {'destination_url': 'https://example.com/deal'},
            format='json',
        )

        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_create_shortened_link_assigns_owner_and_alias(self):
        self.authenticate()

        response = self.client.post(
            reverse('short-link-list'),
            {
                'destination_url': 'https://example.com/deal',
                'title': 'Example Deal',
                'brand_name': 'Example Brand',
                'store_name': 'Example Store',
                'coupon_code': 'SAVE10',
                'link_type': 'coupon',
                'alias': 'owner-deal',
            },
            HTTP_ORIGIN='http://localhost:3000',
            format='json',
        )

        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(response.data['short_code'], 'owner-deal')
        self.assertEqual(response.data['short_path'], '/s/owner-deal')
        self.assertEqual(
            response.data['short_url'],
            'http://localhost:3000/s/owner-deal',
        )

        short_link = ShortenedLink.objects.get(short_code='owner-deal')
        self.assertEqual(short_link.owner, self.user)

    def test_dashboard_only_returns_authenticated_users_links(self):
        self.authenticate()
        own_link = ShortenedLink.objects.create(
            owner=self.user,
            destination_url='https://example.com/one',
            title='Owned Link',
            click_count=9,
            link_type='deal',
        )
        ShortenedLink.objects.create(
            destination_url='https://example.com/public',
            title='Other Link',
            click_count=25,
        )

        response = self.client.get(reverse('short-link-dashboard'))

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['summary']['total_links'], 1)
        self.assertEqual(response.data['summary']['total_views'], 9)
        self.assertEqual(response.data['api_key'], self.profile.api_key)
        self.assertEqual(response.data['top_link']['id'], own_link.id)
        self.assertEqual(len(response.data['links']), 1)
        self.assertEqual(response.data['links'][0]['short_code'], own_link.short_code)

    def test_public_api_creates_owned_short_link_from_user_api_key(self):
        response = self.client.get(
            '/api',
            {
                'api': self.profile.api_key,
                'url': 'example.com/deal',
                'alias': 'api-owned',
                'title': 'API Deal',
                'brand': 'Brand X',
                'store': 'Store Y',
                'coupon': 'SAVE25',
                'type': 'coupon',
            },
            HTTP_ORIGIN='http://localhost:3000',
        )

        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(response.json()['status'], 'success')
        self.assertEqual(
            response.json()['shortenedUrl'],
            'http://localhost:3000/s/api-owned',
        )

        short_link = ShortenedLink.objects.get(short_code='api-owned')
        self.assertEqual(short_link.owner, self.user)
        self.assertEqual(short_link.click_count, 0)

    def test_backend_short_code_route_redirects_to_frontend_short_url(self):
        short_link = ShortenedLink.objects.create(
            owner=self.user,
            destination_url='https://example.com/legacy',
            short_code='legacy-link',
        )

        response = self.client.get(
            reverse('legacy-short-code', kwargs={'short_code': short_link.short_code}),
            follow=False,
            HTTP_HOST='127.0.0.1:8000',
        )

        self.assertEqual(response.status_code, status.HTTP_302_FOUND)
        self.assertEqual(
            response['Location'],
            'http://localhost:3000/s/legacy-link',
        )

    def test_visit_action_increments_click_count(self):
        short_link = ShortenedLink.objects.create(
            owner=self.user,
            destination_url='https://example.com/store',
            title='Store Link',
            link_type='retailer',
        )

        response = self.client.post(
            reverse('short-link-visit', kwargs={'short_code': short_link.short_code})
        )

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        short_link.refresh_from_db()
        self.assertEqual(short_link.click_count, 1)
        self.assertIsNotNone(short_link.last_visited_at)

    def test_retrieve_shortened_link_by_code(self):
        short_link = ShortenedLink.objects.create(
            owner=self.user,
            destination_url='https://example.com/store',
            title='Store Link',
            link_type='retailer',
        )

        response = self.client.get(
            reverse('short-link-detail', kwargs={'short_code': short_link.short_code})
        )

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['short_code'], short_link.short_code)
        self.assertEqual(response.data['destination_url'], 'https://example.com/store')
