from urllib.parse import urlsplit

from django.conf import settings

LOCAL_BACKEND_HOSTS = {'127.0.0.1:8000', 'localhost:8000'}
LOCAL_FRONTEND_ORIGIN = 'http://localhost:3000'


def _normalize_origin(value):
    if not value:
        return ''

    parsed = urlsplit(value)
    if parsed.scheme not in {'http', 'https'} or not parsed.netloc:
        return ''

    return f'{parsed.scheme}://{parsed.netloc}'


def build_public_base_url(request=None):
    if settings.PUBLIC_SITE_URL:
        return settings.PUBLIC_SITE_URL

    django_request = getattr(request, '_request', request)
    if django_request is None:
        return LOCAL_FRONTEND_ORIGIN if settings.DEBUG else ''

    origin = _normalize_origin(
        django_request.META.get('HTTP_ORIGIN') or
        django_request.META.get('HTTP_REFERER') or
        ''
    )
    if origin:
        return origin

    forwarded_host = django_request.META.get('HTTP_X_FORWARDED_HOST') or django_request.get_host()
    forwarded_proto = django_request.META.get('HTTP_X_FORWARDED_PROTO') or django_request.scheme

    if settings.DEBUG and forwarded_host in LOCAL_BACKEND_HOSTS:
        return LOCAL_FRONTEND_ORIGIN

    if forwarded_host and forwarded_proto in {'http', 'https'}:
        return f'{forwarded_proto}://{forwarded_host}'

    absolute_root = django_request.build_absolute_uri('/').rstrip('/')

    if settings.DEBUG and absolute_root in {
        'http://127.0.0.1:8000',
        'http://localhost:8000',
    }:
        return LOCAL_FRONTEND_ORIGIN

    return absolute_root


def build_public_short_url(short_path, request=None):
    base_url = build_public_base_url(request)
    return f'{base_url}{short_path}' if base_url else short_path
