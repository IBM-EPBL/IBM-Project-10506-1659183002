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
        if(not (db.run_sql_insert("INSERT INTO user (email, password_hash, next_resend) values (?, ?, ?)", (user_data["email"], hash, next_resend)))):
            return {"message": "Some Error Occured Try Again"}, 400

        return {"message": "User Registered Successfully"}, 201

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
