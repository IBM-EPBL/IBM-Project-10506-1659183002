from flask import request
from flask_restful import Resource
from ..utils import validate, db
from ..utils.general import token_required

class Income(Resource):
    @token_required
    def post(payload, self):
        user_data = request.json
        validate_result = validate.validate_add_income(user_data=user_data)

        if(validate_result):
            return validate_result["error"]
        
        sql_query = "UPDATE user SET total_amount=?, timestamp=? WHERE id=?"
        params = (user_data["amount"], user_data["timestamp"], payload["id"])
        run_status = db.run_sql_update(sql_query, params=params)

        if(not run_status):
            return {"message": "Error Occured"}, 400
        
        return {"message": "Successful"}, 200

class SplitIncome(Resource):
    @token_required
    def get(payload, self, id):
        timestamp = id
        sql_balance = "select label, sum(case when is_income = true then amount else -amount end) as balance from expense where user_id = ? AND timestamp >= ? group by label"
        params = (payload["id"])
        params = (payload["id"], timestamp)
        balance_data = db.run_sql_select(sql_balance, params)
        return {"balance_data": balance_data}, 200
    
    @token_required
    def post(payload, self):
        user_data = request.json
        validate_result = validate.validate_split_income(user_data=user_data)

        if(validate_result):
            return validate_result["error"]
           
        sql_query = "INSERT INTO split_income (user_id, amount, label) VALUES(?, ?, ?)"
        params = ( payload["id"], user_data["amount"], user_data["label"])
        run_status = db.run_sql_insert(sql_query, params=params)
        
        if(not run_status):
            return {"message": "Error Occured"}, 400
        
        return {"message": "Successful"}, 200

    @token_required
    def delete(payload, self, id):
        labelId = {
                    0: "Food & Drinks",
                    1:"Entertainment",
                    2:"Shopping",
                    3:"Transportation",
                    4:"Vehicle",
                    5:"Trip",
                    6:"General Expense",
                    7:"Financial Expense",
                    8:"Income"
                }
        label = labelId[id]
        sql_query = "DELETE FROM split_income WHERE user_id=? AND label=?"
        params = (payload["id"], label)
        run_status = db.run_sql_delete(sql_query, params=params)

        if(not run_status):
            return {"message": "Error Occured"}, 400
        
        return {"message": "Successful"}, 200