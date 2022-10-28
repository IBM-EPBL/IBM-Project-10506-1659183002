from datetime import datetime
from lib2to3.pgen2 import token
from flask import request, after_this_request
from flask_restful import Resource
from ..utils import validate, general, db
from ..utils.general import token_required

class Register(Resource):
    def post(self):
        validate_result = validate.validate_register(user_data=request.json)

        if(validate_result):
            return validate_result
        
        user_data = request.json
        hash = general.hash_password(user_password=user_data["password"])
        next_resend = general.generate_timestamp(2, False)
        if(not (db.run_sql_insert("INSERT INTO user (email, password_hash, next_resend) values (?, ?, ?)", (user_data["email"], hash, next_resend)))):
            return {"message": "Some Error Occured Try Again"}, 400
        general.send_confirmation_token(user_data["email"])

        return {"message": "User Registered Successfully"}, 201

class EmailVerification(Resource):
    def get(post):
        email = request.args.get('email')
        user = db.run_sql_select("SELECT EMAIL, VERIFIED, NEXT_RESEND FROM USER WHERE EMAIL = ?", (email,))
        print(user)
        if(user["NEXT_RESEND"] > int(datetime.now().timestamp() * 1000)):
            return {"message": "Please wait", "next_resend": user["NEXT_RESEND"]}, 400

        sql_query = "UPDATE user SET next_resend=? WHERE email=?";
        next_time = general.generate_timestamp(2, False)
        params = (next_time, email)
        db.run_sql_update(sql_query, params=params)
        general.send_confirmation_token(email=email)

        return {"message": "Mail sent", "next_resend": next_time}, 200

    def post(self):
        token = request.json["token"]
        email = general.confirm_token(token)
        if(not email):
            return {"message": "Invalid Token"}, 404
        
        user = db.run_sql_select("SELECT ID, EMAIL, VERIFIED FROM USER WHERE EMAIL = ?", (email,))
        if(not user):
            return {"message": "No user exist with the mail ID"}, 404
        if(user["VERIFIED"]):
            return {"message": "Already Verirfied"}, 400

        sql_query = "UPDATE user SET verified=? WHERE email=?";
        params = (True, email)
        db.run_sql_update(sql_query, params=params)

        jwt_data = {
            "id": user["ID"],
            "email": email
        }
        token = general.create_jwt_token(jwt_data)

        @after_this_request
        def set_cookie(response):
            response.set_cookie('auth_token', value=token, path="/", secure="None", samesite="None", httponly=True)
            return response
        
        return {"message": "User Verified"}, 200

class Login(Resource):
    @token_required
    def get(payload, self):
        print(payload)
        return {"message": "User Logged In", "email": payload['email']}, 200

    def post(self):   
        validate_result = validate.validate_login(user_data=request.json)

        if("user" not in validate_result.keys()):
            return validate_result["error"]
        
        user = validate_result["user"]
        jwt_data = {
            "email": user["EMAIL"]
        }
        token = general.create_jwt_token(jwt_data)
        @after_this_request
        def set_cookie(response):
            response.set_cookie('auth_token', value=token, path="/", secure="None", samesite="None", httponly=True)
            return response
        return {"message": "Successfully Logged In"}, 200

class Logout(Resource):
    @token_required
    def get(payload, self):
        @after_this_request
        def set_cookie(response):
            response.set_cookie('auth_token', value="", path="/", secure="None", samesite="None", httponly=True)
            return response
        return {"message": "Successfully Logged Out"}, 200