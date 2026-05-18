import base64
import hashlib
import hmac
import json
from datetime import timedelta

from django.conf import settings
from django.contrib.auth import get_user_model
from django.utils import timezone
from rest_framework import exceptions
from rest_framework.authentication import BaseAuthentication, get_authorization_header

User = get_user_model()


def _base64url_encode(data):
    return base64.urlsafe_b64encode(data).rstrip(b'=')


def _base64url_decode(data):
    padding = b'=' * ((4 - len(data) % 4) % 4)
    return base64.urlsafe_b64decode(data + padding)


def _sign(message):
    return _base64url_encode(
        hmac.new(
            settings.JWT_SECRET_KEY.encode('utf-8'),
            message,
            hashlib.sha256,
        ).digest()
    )


def _encode_token(payload):
    header = {'alg': 'HS256', 'typ': 'JWT'}
    encoded_header = _base64url_encode(
        json.dumps(header, separators=(',', ':')).encode('utf-8')
    )
    encoded_payload = _base64url_encode(
        json.dumps(payload, separators=(',', ':')).encode('utf-8')
    )
    signing_input = b'.'.join([encoded_header, encoded_payload])
    signature = _sign(signing_input)
    return b'.'.join([signing_input, signature]).decode('utf-8')


def _decode_token(token):
    try:
        encoded_header, encoded_payload, encoded_signature = token.split('.')
    except ValueError as exc:
        raise exceptions.AuthenticationFailed('Invalid token format.') from exc

    signing_input = f'{encoded_header}.{encoded_payload}'.encode('utf-8')
    expected_signature = _sign(signing_input)
    provided_signature = encoded_signature.encode('utf-8')

    if (
        len(expected_signature) != len(provided_signature) or
        not hmac.compare_digest(expected_signature, provided_signature)
    ):
        raise exceptions.AuthenticationFailed('Invalid token signature.')

    try:
        payload_bytes = _base64url_decode(encoded_payload.encode('utf-8'))
        payload = json.loads(payload_bytes.decode('utf-8'))
    except (ValueError, json.JSONDecodeError) as exc:
        raise exceptions.AuthenticationFailed('Invalid token payload.') from exc

    exp = payload.get('exp')
    if not exp or exp <= int(timezone.now().timestamp()):
        raise exceptions.AuthenticationFailed('Token has expired.')

    return payload


def create_token_pair(user):
    now = timezone.now()
    access_exp = now + timedelta(seconds=settings.JWT_ACCESS_TOKEN_LIFETIME_SECONDS)
    refresh_exp = now + timedelta(seconds=settings.JWT_REFRESH_TOKEN_LIFETIME_SECONDS)

    access_payload = {
        'sub': str(user.pk),
        'type': 'access',
        'username': user.get_username(),
        'iat': int(now.timestamp()),
        'exp': int(access_exp.timestamp()),
    }
    refresh_payload = {
        'sub': str(user.pk),
        'type': 'refresh',
        'iat': int(now.timestamp()),
        'exp': int(refresh_exp.timestamp()),
    }

    return {
        'access': _encode_token(access_payload),
        'refresh': _encode_token(refresh_payload),
    }


def validate_token(token, expected_type='access'):
    payload = _decode_token(token)

    if payload.get('type') != expected_type:
        raise exceptions.AuthenticationFailed('Invalid token type.')

    return payload


class JWTAuthentication(BaseAuthentication):
    keyword = 'Bearer'

    def authenticate(self, request):
        auth = get_authorization_header(request).split()

        if not auth or auth[0].lower() != self.keyword.lower().encode('utf-8'):
            return None

        if len(auth) != 2:
            raise exceptions.AuthenticationFailed('Invalid authorization header.')

        token = auth[1].decode('utf-8')
        payload = validate_token(token, expected_type='access')
        user = User.objects.filter(pk=payload.get('sub'), is_active=True).first()

        if not user:
            raise exceptions.AuthenticationFailed('User not found.')

        return user, payload
