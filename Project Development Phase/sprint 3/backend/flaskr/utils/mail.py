from sendgrid.helpers.mail import Mail
from ..config.mail_config import get_mail_config
from os import getenv

def send_mail(email, data, templateID):
    try:
        sg = get_mail_config()

        FROM_EMAIL = getenv("FROM_MAIL")
        TO_EMAIL = [(email, 'User')]
        message = Mail(
            from_email=FROM_EMAIL,
            to_emails=TO_EMAIL)
        message.dynamic_template_data = data
        message.template_id = templateID

        sg.send(message)
        return True
    
    except:
        return False