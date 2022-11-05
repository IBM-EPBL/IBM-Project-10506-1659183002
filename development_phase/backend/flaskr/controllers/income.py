from flask import request
from flask_restful import Resource
import ibm_db
from ..utils import validate, general, db
from ..utils.general import token_required

class Income(Resource):
    @token_required
    def get(payload, self):
        sql_query = "UPDATE user SET total_amount=?, timestamp=? WHERE id=?"
        params = (user_data["amount"], user_data["timestamp"], payload["id"])

    @token_required
    def post(payload, self):
        user_data = request.json
        validate_result = validate.validate_add_income(user_data=user_data)

        if(validate_result):
            return validate_result
        
        sql_query = "UPDATE user SET total_amount=?, timestamp=? WHERE id=?"
        params = (user_data["amount"], user_data["timestamp"], payload["id"])
        run_status = db.run_sql_update(sql_query, params=params)

        if(not run_status):
            return {"message": "Error Occured"}, 400
        
        return {"message": "Successful"}, 200

class SplitIncome(Resource):
    @token_required
    def post(payload, self):
        user_data = request.json
        validate_result = validate.validate_add_income(user_data=user_data)

        if(validate_result):
            return validate_result

        sql_query = "SELECT * FROM split_income WHERE user_id=? and label=?"
        params = (payload["id"], user_data["label"])
        run_status = db.run_sql_select(sql_query, params=params)
        print(run_status)
        if(run_status):
            print('update')
            sql_query = "UPDATE split_income SET amount=? WHERE user_id=? AND label=?"
            params = (user_data["amount"], payload["id"], user_data["label"])
            run_status = db.run_sql_update(sql_query, params=params)
        else:
            print('hi')
            sql_query = "INSERT INTO split_income (user_id, amount, label) VALUES(?, ?, ?)"
            params = ( payload["id"], user_data["amount"], user_data["label"])
            run_status = db.run_sql_insert(sql_query, params=params)
        
        print('status')
        print(run_status)
        if(not run_status):
            return {"message": "Error Occured"}, 400
        
        return {"message": "Successful"}, 200