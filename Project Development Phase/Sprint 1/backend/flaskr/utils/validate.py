from ..utils.db import run_sql_select
from ..utils import general

def validate_register(user_data):
    if(user_data["email"] == "" or user_data["password"] == "" or user_data["re_password"] == ""):
        return {'message': 'Please fill the Required data'}, 400

    get_user_query = "SELECT * FROM user WHERE email = ?";
    if(run_sql_select(get_user_query, (user_data["email"],))):
        return {'message': 'User already exist'}, 409

    if(user_data["password"] != user_data["re_password"]):
        return {'message': 'Password and confirm password does not match'}, 400

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
    
    if(not (general.compare_hash(user_data["password"], get_user["PASSWORD_HASH"]))):
        return { "error": ({"message": "Username or Password Incorrect"}, 404) }
    print(get_user)
    if(get_user["VERIFIED"] == False):
        print("in")
        return {"error": ({"message": "Please verify the E-Mail to Login", "next_resend": get_user["NEXT_RESEND"]}, 401)}

    return {"user" : get_user}