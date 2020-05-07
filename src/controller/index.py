from flask import Blueprint, render_template

index = Blueprint('/', __name__)

@index.route('/')
def welcome():
    # Do some stuff
    print('index.html')
    return render_template('index/index.html', title="Welcome to hush")

@index.route('/signup')
def signup():
    # Do some stuff
    return render_template('index/signup.html', title="Join hush")

@index.route('/login')
def login():
    # Do some stuff
    return render_template('index/login.html')

@index.route('/logout')
def register():
    # Do some stuff
    return render_template('index/logout.html')