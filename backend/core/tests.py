from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase

from .models import ShortenedLink


class ShortenedLinkApiTests(APITestCase):
    def test_create_shortened_link_returns_generated_code_and_path(self):
        response = self.client.post(
            reverse('short-link-list'),
            {
                'destination_url': 'https://example.com/deal',
                'title': 'Example Deal',
                'brand_name': 'Example Brand',
                'store_name': 'Example Store',
                'coupon_code': 'SAVE10',
                'link_type': 'coupon',
            },
            format='json',
        )

        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertTrue(response.data['short_code'])
        self.assertEqual(response.data['short_path'], f"/s/{response.data['short_code']}")
        self.assertEqual(ShortenedLink.objects.count(), 1)

    def test_retrieve_shortened_link_by_code(self):
        short_link = ShortenedLink.objects.create(
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
