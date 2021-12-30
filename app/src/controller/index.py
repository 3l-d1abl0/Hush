from flask import Blueprint, render_template, request, redirect, flash, url_for, session
from requests.models import Response
from ..model.user import User
import re
import bcrypt
import requests
from flask import current_app

index = Blueprint('/', __name__)


@index.route('/')
def welcome():

    if "username" in session:
        user = User(session["username"])
        posts = user.get_recent_post()
        return render_template('index/home_timeline.html', posts=posts, title="welcome {}".format(session["username"]))

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

            try:

                print(password)
                print(bcrypt.hashpw(password.encode('utf8'),bcrypt.gensalt(5)).decode('utf8'))

                response = requests.post(current_app.config['AUTH_SERVER']+"/auth/signup", json={
                                         "username": username, "password": bcrypt.hashpw(password.encode('utf8'),
                                                                               bcrypt.gensalt(5)).decode('utf8')})
                if response.status_code == 200:

                    response_data = response.json()
                    if response_data['error'] == False:
                        flash("You registered Successfully !")
                        return redirect(url_for(".login"))
                    else:
                        print(response_data)
                        flash("Not able to register ! Try Later !")

                else:
                    # Internal Server Error
                    flash("Something went Wrong ! Try again !")

            except requests.exceptions.RequestException as e:
                # Service not avaiable // connection refused
                #raise SystemExit(e)
                flash("Something went wrong! Try Again !")

    return render_template('index/signup.html', title="Join hush")


@index.route('/login', methods=["POST", "GET"])
def login():

    if request.method == "POST":
        username = str(request.form["username"])
        password = str(request.form["password"])

        try:
            print(password)
            print(bcrypt.hashpw(password.encode('utf8'),bcrypt.gensalt(5)).decode('utf8'))
            response = requests.post(current_app.config['AUTH_SERVER']+"/auth/login", json={
                                     "username": username, "password": bcrypt.hashpw(password.encode('utf8'),
                                                                               bcrypt.gensalt(5)).decode('utf8')})

            # Successful Response
            if response.status_code == 200:

                response_data = response.json()
                if response_data['error'] == False:
                    flash("Logged in!")
                    session["username"] = username
                    session["token"] = response_data["token"]
                    print(session)
                    return redirect(url_for(".welcome"))
                else:
                    # wrong username-password
                    print(response_data)
                    flash("Please check you Combination ! ")

            else:
                # Internal Server Error
                flash("Something went Wrong ! Try again !")

        except requests.exceptions.RequestException as e:
            # Service not avaiable // connection refused
            #raise SystemExit(e)
            flash("Something went wrong! Try Again !")

    else:
        if "username" in session:
            return redirect(url_for("/.welcome"))

    return render_template('index/login.html', title="Log in to Hush")


@index.route('/logout')
def logout():

    session.pop("username")
    return redirect(url_for("/.welcome"))


@index.route('/addPost', methods=["POST"])
def addPost():
    tags = []
    post_text = request.form["user-post"]

    tags += re.findall(r'[#][^\s#]+', post_text)
    tags = set(map(lambda x: x[1:], tags))

    user = User(session["username"])
    if not user.add_post(request.form["user-post"], tags):
        flash('Issue While posting !')
    else:
        flash('Successfully posted !')

    return redirect(url_for("/.welcome"))
