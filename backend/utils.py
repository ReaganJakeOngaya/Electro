import jwt
from datetime import datetime, timedelta
import os

SECRET_KEY = os.environ.get('SECRET_KEY', 'dev-secret-key-change-in-production')

def generate_token(user_id):
    payload = {
        'user_id': user_id,
        'exp': datetime.utcnow() + timedelta(days=1)
    }
    return jwt.encode(payload, SECRET_KEY, algorithm='HS256')

def verify_token(token):
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=['HS256'])
        return payload['user_id']
    except jwt.InvalidTokenError:
        return None