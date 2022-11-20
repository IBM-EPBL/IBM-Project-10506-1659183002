from ..utils.db import run_sql_select
from ..utils import general

def validate_register(user_data):
    if(user_data["email"] == "" or user_data["password"] == "" or user_data["re_password"] == ""):
        return {'message': 'Please fill the Required data'}, 400

    get_user_query = "SELECT * FROM user WHERE email = ?";
    if(run_sql_select(get_user_query, (user_data["email"],))):
        return {'message': 'User already exist'}, 409

    if(user_data["password"] != user_data["re_password"]):
        return {'message': 'Password or confirm password does not match'}, 400

    if(len(user_data["password"]) < 8 or len(user_data["password"]) > 16):
        return {'message': 'Password length must be 8 to 16'}, 400
    
    return False

def validate_login(user_data):
    if(user_data["email"] == "" or user_data["password"] == ""):
        return { "error": ({'message': 'Please fill the Required data'}, 400) }

    get_user_query = "SELECT * FROM user WHERE email = ?";
    get_user = run_sql_select(get_user_query, (user_data["email"],))
    if(not (get_user)):
        return { "error": ({'message': 'User Does not Exist'}, 404) }
    
    get_user = get_user[0]
    if(not (general.compare_hash(user_data["password"], get_user["PASSWORD_HASH"]))):
        return { "error": ({"message": "Username or Password Incorrect"}, 404) }
    if(get_user["VERIFIED"] == False):
        return {"error": ({"message": "Please verify the E-Mail to Login", "next_resend": get_user["NEXT_RESEND"]}, 401)}

    return {"user" : get_user}

def validate_add_income(user_data):
    if(user_data["amount"] == "" or user_data["timestamp"] == ""):
        return { "error": ({'message': 'Please fill the Required data'}, 400) }
    
    return False
 
def validate_split_income(user_data):
    if(user_data["amount"] == 0 or user_data["label"] == ""):
        return { "error": ({'message': 'Please fill the Required data'}, 400) }
    
    return False

def validate_add_expense(user_data):
    if(user_data["amount"] == 0 or user_data["label"] == "" or user_data["timestamp"] == "" or user_data["is_income"] == ""):
        return { "error": ({'message': 'Please fill the Required data'}, 400) }
    
    return False