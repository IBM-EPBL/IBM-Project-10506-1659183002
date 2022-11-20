from dotenv import load_dotenv
from os import getenv

load_dotenv()

def get_mail_config():
    import sendgrid

    sg = sendgrid.SendGridAPIClient(api_key=getenv('SENDGRID_API_KEY'))

    return sg
