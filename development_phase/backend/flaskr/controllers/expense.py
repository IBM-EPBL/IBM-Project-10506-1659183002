from flask import request
from flask_restful import Resource
from ..utils import validate, db
from ..utils.general import token_required

class Expense(Resource):
    @token_required
    def post(payload, self):
        user_data = request.json
        validate_result = validate.validate_add_expense(user_data=user_data)
        if(validate_result):
            return validate_result["error"]
            
        sql_query = "INSERT INTO expense (user_id, amount, is_income, label, timestamp) values(?, ?, ?, ?, ?)"
        params = (payload["id"], user_data["amount"], user_data["is_income"], user_data["label"], user_data["timestamp"])
        run_status = db.run_sql_update(sql_query, params=params)

        if(not run_status):
            return {"message": "Error Occured"}, 400
        
        return {"message": "Successful"}, 200

    @token_required
    def delete(payload, self, id):
        sql_query = "DELETE FROM expense WHERE id=?"
        params = (id)
        run_status = db.run_sql_delete(sql_query, params=params)

        if(not run_status):
            return {"message": "Error Occured"}, 400
        
        return {"message": "Successful"}, 200

class ExpenseFilter(Resource):
    @token_required
    def post(payload, self):
        user_date = request.json
        sql_query = "SELECT * FROM expense WHERE user_id = ? AND timestamp BETWEEN ? AND ?"
        params = (payload["id"], user_date["fromTimestamp"], user_date["toTimestamp"])
        expense_data = db.run_sql_select(sql_query, params=params)
        
        return {"expense_data": expense_data}, 200