from dotenv import load_dotenv
from os import getenv

load_dotenv()

def get_mail():
    from flask_mail import Mail
    from flask import current_app

    mail_settings = {
        "MAIL_SERVER": 'smtp.gmail.com',
        "MAIL_PORT": 465,
        "MAIL_USE_TLS": False,
        "MAIL_USE_SSL": True,
        "MAIL_USERNAME": getenv("MAIL_USERNAME"),
        "MAIL_PASSWORD": getenv("MAIL_PASSWORD")
    }
    current_app.config.update(mail_settings)
    mail = Mail(current_app)
    return mail