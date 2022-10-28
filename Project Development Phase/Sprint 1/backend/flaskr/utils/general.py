import bcrypt
from dotenv import load_dotenv
from os import getenv

load_dotenv()

def hash_password(user_password):
    encoded_pw = user_password.encode('utf-8')
    salt = bcrypt.gensalt();
    hash = bcrypt.hashpw(encoded_pw, salt)
    return hash