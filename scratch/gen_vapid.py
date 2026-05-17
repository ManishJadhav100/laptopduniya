from pywebpush import webpush, WebPushException
import base64
import os

# To generate keys if not present
# This is just a scratch script
try:
    from cryptography.hazmat.primitives import serialization
    from cryptography.hazmat.primitives.asymmetric import ec
    
    private_key = ec.generate_private_key(ec.SECP256R1())
    public_key = private_key.public_key()
    
    private_base64 = base64.urlsafe_b64encode(
        private_key.private_numbers().private_value.to_bytes(32, byteorder='big')
    ).decode('utf-8').strip('=')
    
    public_base64 = base64.urlsafe_b64encode(
        public_key.public_bytes(
            encoding=serialization.Encoding.X962,
            format=serialization.PublicFormat.UncompressedPoint
        )
    ).decode('utf-8').strip('=')
    
    print(f"PRIVATE_KEY={private_base64}")
    print(f"PUBLIC_KEY={public_base64}")
except ImportError:
    print("cryptography not installed")
