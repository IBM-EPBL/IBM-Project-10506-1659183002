from distutils.log import Log
from flask import Flask
from flask_cors import CORS
from flask_restful import Api, reqparse

parser = reqparse.RequestParser()

def create_app(test_config=None):
    app = Flask(__name__, instance_relative_config=True)
    api = Api(app)
    CORS(app)
    
    # Endpoint: Authentication
    from .controllers.auth import Register, Login, Logout, EmailVerification
    api.add_resource(Register, '/api/auth/register')
    api.add_resource(Login, '/api/auth/login')
    api.add_resource(EmailVerification, '/api/auth/verify')
    api.add_resource(Logout, '/api/auth/logout')

    # Endpoint: Income
    from .controllers.income import Income, SplitIncome
    api.add_resource(Income, '/api/income')
    api.add_resource(SplitIncome, '/api/income/split', '/api/income/split/<int:id>')
    
    #Endpoint: Expense
    from .controllers.expense import Expense
    api.add_resource(Expense, '/api/add/expense', '/api/delete/expense/<int:id>')

    @app.route('/hello')
    def hello():
        return 'Hello, World'

    @app.after_request
    def after_request(res):
        res.headers['Access-Control-Allow-Origin'] = 'http://localhost:5500'
        res.headers['Access-Control-Allow-Headers'] = 'Content-Type'
        res.headers['Access-Control-Expose-Headers'] = 'true'
        res.headers['Access-Control-Allow-Credentials'] = 'true'
        return res
        
    return app