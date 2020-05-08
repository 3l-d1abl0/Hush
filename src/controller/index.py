from flask import Blueprint, render_template, request, redirect, flash, url_for, session
from ..model.user import User

index = Blueprint('/', __name__)

@index.route('/')
def welcome():

    if "username" in session:
        return render_template('index/home_timeline.html', title="welcome {}".format(session["username"]))
    
    return render_template('index/index.html', title="Welcome to hush")

@index.route('/signup', methods=["POST", "GET"])
def signup():
    
    if request.method == "POST":
        username = request.form["username"]
        password = request.form["password"]
        password_con = request.form["password-confirm"]

        if password != password_con:
            flash("Passwords do not match !")
        else:
            user = User(username)
            if user.register_user(password):
                flash("You successfully Registered !")
                return redirect(url_for("/.login"))
            else:
                flash("Username already in use !")

    return render_template('index/signup.html', title="Join hush")

@index.route('/login', methods=["POST", "GET"])
def login():
    
    if request.method == "POST":
        username = request.form["username"]
        password = request.form["password"]

        user = User(username)

        if not user.verify_password(password):
            flash('Please check your Password !')
        else:
            flash('Logged in !')
            session["username"] = user.username
            return redirect(url_for("/.welcome"))


    return render_template('index/login.html', title="Log in to Hush")

@index.route('/logout')
def register():
    # Do some stuff
    return render_template('index/logout.html')