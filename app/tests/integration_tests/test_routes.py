from flask import Flask
from src.controller.index import index
import os
from datetime import datetime
import time
from dotenv import load_dotenv
from pathlib import Path

def test_signup_page():

    app = Flask(__name__,
            static_url_path='',
            static_folder='../../src/static',
            template_folder='../../src/views')

    app.register_blueprint(index, url_prefix='/')

    client = app.test_client()
    url = '/signup'

    response = client.get(url)
    assert response.status_code == 200
    assert b"Register to Hush" in response.data

def test_successful_signup():

    app = Flask(__name__,
            static_url_path='',
            static_folder='../../src/static',
            template_folder='../../src/views')

    # Setup app Configs
    app.config.from_pyfile('../../config/dev_env.cfg')
    app.config['SECRET_KEY'] = os.environ.get('SECRET_KEY')
    app.config['SALT'] = os.environ.get('SALT')

    if os.environ.get('AUTH_SERVER') != 'None':
        app.config['AUTH_SERVER'] = os.environ.get('AUTH_SERVICE')

    if os.environ.get('USER_SERVER') != 'None':
        app.config['USER_SERVER'] = os.environ.get('USER_SERVICE')

    app.register_blueprint(index, url_prefix='/')

    client = app.test_client()
    url = '/signup'

    #Tru to register a New User
    response = client.post(url, data={
        "username" : "TestUser",
        "password": "TestUserPass",
        "password-confirm": "TestUserPass",
    })
    
    #After successful Signup, page is redirected to /login
    assert response.status_code == 302
    assert b"Redirecting..." in response.data
    