from datetime import datetime
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
        if(user[0]["NEXT_RESEND"] > int(datetime.now().timestamp() * 1000)):
            return {"message": "Please wait", "next_resend": user[0]["NEXT_RESEND"]}, 400

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
        if(user[0]["VERIFIED"]):
            return {"message": "Already Verirfied"}, 400

        sql_query = "UPDATE user SET verified=? WHERE email=?";
        params = (True, email)
        db.run_sql_update(sql_query, params=params)

        jwt_data = {
            "id": user[0]["ID"],
            "email": email,
            "timestamp": 0
        }
        token = general.create_jwt_token(jwt_data)

        @after_this_request
        def set_cookie(response):
            # response.set_cookie('auth_token', value=token, path="/", httponly=True)
            response.headers.add('Set-Cookie',f'auth_token={token}; HttpOnly; Path=/')
            return response
        
        return {"message": "User Verified"}, 200

class Login(Resource):
    @token_required
    def get(payload, self):
        sql_query_user = "SELECT total_amount, alert, is_send, timestamp FROM user WHERE id=?"
        sql_query_split = "SELECT label, sum(amount) as amount FROM split_income WHERE user_id=? GROUP BY label ORDER BY LABEL"
        params = (payload["id"],)

        user_data = db.run_sql_select(sql_query_user, params)
        split_data = db.run_sql_select(sql_query_split, params)

        sql_query_expense = "SELECT id, amount, is_income, label, timestamp FROM expense WHERE user_id = ? AND timestamp >= ? order by timestamp desc"
        sql_balance = "select label, sum(case when is_income = true then amount else -amount end) as balance from expense where user_id = ? AND timestamp >= ? group by label"
        params = (payload["id"], user_data[0]["TIMESTAMP"])
        
        balance_data = db.run_sql_select(sql_balance, params)
        expense_data = db.run_sql_select(sql_query_expense, params)
        
        return {"message": "User Logged In", "user_data": user_data[0], "split_data":split_data, "balance_data": balance_data, "expense_data":expense_data, "email": payload['email']}, 200

    def post(self):   
        validate_result = validate.validate_login(user_data=request.json)

        if("user" not in validate_result.keys()):
            return validate_result["error"]
        
        user = validate_result["user"]
        jwt_data = {
            "id": user["ID"],
            "email": user["EMAIL"],
            "timestamp": user["TIMESTAMP"]
        }
        token = general.create_jwt_token(jwt_data)
        @after_this_request
        def set_cookie(response):
            # response.set_cookie('auth_token', value=token, path="/", httponly=True)
            response.headers.add('Set-Cookie',f'auth_token={token}; HttpOnly; Path=/')
            return response
        return {"message": "Successfully Logged In"}, 200

class Logout(Resource):
    @token_required
    def get(payload, self):
        @after_this_request
        def set_cookie(response):
            # response.set_cookie('auth_token', value="", path="/", httponly=True)
            response.headers.add('Set-Cookie',f'auth_token=""; HttpOnly; Path=/')
            return response
        return {"message": "Successfully Logged Out"}, 200