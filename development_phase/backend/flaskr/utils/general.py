import bcrypt
import jwt
from dotenv import load_dotenv
from os import getenv
from itsdangerous import URLSafeTimedSerializer
from datetime import datetime, timedelta, timezone

load_dotenv()

def hash_password(user_password):
    encoded_pw = user_password.encode('utf-8')
    salt = bcrypt.gensalt()
    hash = bcrypt.hashpw(encoded_pw, salt)
    return hash

def compare_hash(user_password, hash):
    encoded_pw = user_password.encode('utf-8')
    encoded_hash = hash.encode('utf-8')
    result = bcrypt.checkpw(encoded_pw, encoded_hash)
    return result

def generate_timestamp(value, is_day):
    now = datetime.now()
    if(is_day):
        dt = now + timedelta(days=value)
        return int(dt.timestamp())
    dt = now + timedelta(minutes=value)
    return int(dt.timestamp() * 1000)

def create_jwt_token(data):
    data["exp"] = generate_timestamp(1, True)
    token = jwt.encode(data, getenv('JWT_SECRET_KEY'), algorithm="HS256")
    return token


def validate_jwt_token(token):
    try:
        decoded_content = jwt.decode(token, getenv('JWT_SECRET_KEY'), algorithms=["HS256"])
    except jwt.ExpiredSignatureError:
        return {"is_valid": False, "message": "Token expired"}
    except jwt.InvalidSignatureError:
        return {"is_valid": False, "message": "Invalid Token"}

    return {"is_valid": True, "payload": decoded_content}

from functools import wraps
from flask import request, after_this_request

def token_required(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        auth_token = request.cookies.get("auth_token")
        if(not auth_token):
            return ({"message": "No Token"}, 400)
        res = validate_jwt_token(auth_token)
        if(not res["is_valid"]):
            @after_this_request
            def set_cookie(response):
                response.set_cookie('auth_token', value="", path="/", secure="None", samesite="None", httponly=True)
                return response

            return ({"message": res["message"]}, 404)

        return f(res["payload"], *args, **kwargs)
    return decorated

def generate_confirmation_token(email):
    serializer = URLSafeTimedSerializer(getenv('JWT_SECRET_KEY'))
    return serializer.dumps(email, salt=getenv('PASSWORD_SALT'))


def confirm_token(token, expiration=900):
    serializer = URLSafeTimedSerializer(getenv('JWT_SECRET_KEY'))
    try:
        email = serializer.loads(
            token,
            salt=getenv('PASSWORD_SALT'),
            max_age=expiration
        )
        return email
    except:
        return False

from .mail import send_mail
def send_confirmation_token(email):
    token = generate_confirmation_token(email)    
    
    confirm_url =f"{getenv('BASE_URL')}/confirm.html?token={token}"
    data = {
        "confirm_url": confirm_url
    }

    to_email = email
    templateID = "d-51f0da2f2e9d444b814adb52a463e960"
    res = send_mail(to_email, data, templateID)

    return res