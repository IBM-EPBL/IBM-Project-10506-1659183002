from flask import request
from flask_restful import Resource
from ..utils import validate, general, db

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