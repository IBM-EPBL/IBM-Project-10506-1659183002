from sendgrid.helpers.mail import *
from ..config.mail_config import get_mail_config
from os import getenv

def send_mail(email, mail_subject, mail_content_type, mail_content):
    try:
        sg = get_mail_config()

        from_email = Email(getenv("FROM_MAIL"))
        to_email = To(email)
        subject = mail_subject
        content = Content(mail_content_type, mail_content)
        mail = Mail(from_email, to_email, subject, content)

        sg.client.mail.send.post(request_body=mail.get())
        return True
    
    except:
        return False