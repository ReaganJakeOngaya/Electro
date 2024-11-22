import jwt
from datetime import datetime, timedelta

SECRET_KEY = 'your_secret_key_here'

def generate_token(user_id):
    exp = datetime.utcnow() + timedelta(days=7)
    return jwt.encode({"user_id": user_id, "exp": exp}, SECRET_KEY, algorithm="HS256")

def verify_token(token):
    try:
        return jwt.decode(token, SECRET_KEY, algorithms=["HS256"])
    except:
        return None