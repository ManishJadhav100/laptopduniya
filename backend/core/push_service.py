import json
import logging

from django.db import models
from pywebpush import WebPushException, webpush

logger = logging.getLogger(__name__)

# Config - Ideally moved to settings.py
VAPID_PRIVATE_KEY = "-0cI_wDcXX97vCHPrjA2muipWIhsfKl7Ua93bwU68iU"
VAPID_PUBLIC_KEY = "BEaMKE1tcl8nT1gxIGI75TkqT0SiW2YSxSdqjf6GA6jW93WUyf4Od8KvzRgxypwdkJCiJPRBrrEjAz3DNeRNofE"
VAPID_CLAIMS = {
    "sub": "mailto:hello@phoneradar.in",
}


def send_push_notification(subscription_instance, payload):
    """
    Core function to send push using pywebpush
    """
    try:
        webpush(
            subscription_info={
                "endpoint": subscription_instance.endpoint,
                "keys": {
                    "p256dh": subscription_instance.p256dh,
                    "auth": subscription_instance.auth,
                },
            },
            data=json.dumps(payload),
            vapid_private_key=VAPID_PRIVATE_KEY,
            vapid_claims=VAPID_CLAIMS,
        )
        return True
    except WebPushException as ex:
        logger.error("WebPush error: %s", ex)
        if ex.response is not None and ex.response.status_code in [404, 410]:
            subscription_instance.is_active = False
            subscription_instance.save()
        return False
    except Exception as error:  # noqa: BLE001
        logger.error("Unknown push error: %s", error)
        return False


def send_price_drop_notification(subscription, current_price, store_name):
    laptop_title = subscription.laptop.title
    payload = {
        "title": "Price Drop Alert!",
        "body": f"The {laptop_title} just dropped to Rs. {current_price} at {store_name}! View the deal now.",
        "url": f"https://phoneradar.in/mobiles/{subscription.laptop.slug}",
        "icon": "https://cdn-icons-png.flaticon.com/512/428/428001.png",
    }
    return send_push_notification(subscription, payload)


def trigger_laptop_price_alerts(laptop, new_price, store_name):
    from .models import PushSubscription

    subscriptions = PushSubscription.objects.filter(laptop=laptop, is_active=True)
    success_count = 0
    for sub in subscriptions:
        if send_price_drop_notification(sub, new_price, store_name):
            success_count += 1
    return success_count


def broadcast_to_topic(topic, title, message, url="/"):
    from .models import PushSubscription

    subscriptions = PushSubscription.objects.filter(
        models.Q(interest_type=topic) | models.Q(interest_type="ALL"),
        is_active=True,
    )

    success_count = 0
    payload = {
        "title": title,
        "body": message,
        "url": f"https://phoneradar.in{url}",
        "icon": "https://cdn-icons-png.flaticon.com/512/428/428001.png",
    }

    for sub in subscriptions:
        if send_push_notification(sub, payload):
            success_count += 1

    return success_count
