from sendgrid.helpers.mail import Mail
from ..config.mail_config import get_mail_config
from os import getenv

def send_mail(email, data, templateID):
    # try:
    print(email, data, templateID)
    sg = get_mail_config()

    FROM_EMAIL = getenv("FROM_MAIL")
    TO_EMAIL = [(email, 'User')]
    message = Mail(
        from_email=FROM_EMAIL,
        to_emails=TO_EMAIL)
    message.dynamic_template_data = data
    message.template_id = templateID

    response = sg.send(message)
    code, body, headers = response.status_code, response.body, response.headers
    print(f"Response code: {code}")
    print(f"Response headers: {headers}")
    print(f"Response body: {body}")
    print("Dynamic Messages Sent!")
    return True
    
    # except:
    #     return False