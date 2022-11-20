from flask import request
from flask_restful import Resource
from ..utils import db
from ..utils.general import token_required
from ..utils.mail import send_mail

class Alert(Resource):
    @token_required
    def post(payload, self):
        user_data = request.json

        data = {
        "total_amount": user_data["total_amount"],
        "pending_amount": user_data["pending_amount"],
        "percentage": user_data["percentage"],
        "date": user_data["date"]
        }
        templateID = "d-24f02e45da0b4852a23550a0ab1a2478"
        res = send_mail(payload["email"], data, templateID)
        if(not res):
            return {"message": "Error Occured"}, 400
        sql_update_query = "UPDATE user SET is_send=? where id=?"
        params = (user_data["is_send"], payload["id"])
        run_status = db.run_sql_update(sql_update_query, params=params)

        if(not run_status):
            return {"message": "Error Occured"}, 400
        
        return {"message": "mail sent"}, 200
    
    @token_required
    def put(payload, self):
        user_data = request.json
        sql_update_query = "UPDATE user SET alert = ?, is_send = ? where id=?"
        params = (user_data["amount"], user_data["is_send"], payload["id"])
        run_status = db.run_sql_update(sql_update_query, params=params)

        if(not run_status):
            return {"message": "Error Occured"}, 400
        
        return {"message": "Successful"}, 200