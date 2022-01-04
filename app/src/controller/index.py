from flask import Blueprint, render_template, request, redirect, flash, url_for, session, Response, jsonify
from requests.models import Response
from ..model.user import User
import re
import bcrypt
import requests
from flask import current_app
import os
import hashlib

index = Blueprint('/', __name__)


@index.route('/')
def welcome():

    if "username" in session:
        user = User(session["username"])

        try:
            response = requests.post(current_app.config['USER_SERVER']+"/timeline", headers={
                                     "authorization": "Bearer "+session["token"]})

            if response.status_code == 200:

                response_data = response.json()
                if response_data['error'] == False:
                    print(response_data)
                    return render_template('index/home_timeline.html', posts=response_data["posts"], title="welcome {}".format(session["username"]))
                else:
                    # some Issue
                    print(response_data)
                    flash("Not able to fetch timeline ! Try Later !")
                    return render_template('index/home_timeline.html', posts=[], title="welcome {}".format(session["username"]))
            else:
                # Internal Server Error OR Unauthorized
                flash("Not able to fetch your timeline ! Try again !")
                return render_template('index/home_timeline.html', posts=[], title="welcome {}".format(session["username"]))

        except requests.exceptions.RequestException as e:
            # Service not avaiable // connection refused
            # raise SystemExit(e)
            flash("Something went wrong! Try Again !")
            return render_template('index/home_timeline.html', posts=[], title="welcome {}".format(session["username"]))

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

                password_wrapped = os.environ.get(
                    'PASSPHRASE1')+password+os.environ.get('PASSPHRASE2')
                hash_object = hashlib.sha256(password_wrapped.encode('utf-8'))

                response = requests.post(current_app.config['AUTH_SERVER']+"/auth/signup", json={
                                         "username": username, "password": hash_object.hexdigest()})
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
                # raise SystemExit(e)
                flash("Something went wrong! Try Again !")

    return render_template('index/signup.html', title="Join hush")


@index.route('/login', methods=["POST", "GET"])
def login():

    if request.method == "POST":
        username = str(request.form["username"])
        password = str(request.form["password"])

        try:
            password_wrapped = os.environ.get(
                'PASSPHRASE1')+password+os.environ.get('PASSPHRASE2')
            hash_object = hashlib.sha256(password_wrapped.encode('utf-8'))

            response = requests.post(current_app.config['AUTH_SERVER']+"/auth/login", json={
                                     "username": username, "password": hash_object.hexdigest()})

            # Successful Response
            if response.status_code == 200:

                response_data = response.json()
                if response_data['error'] == False:
                    flash("Logged in!")
                    session["username"] = username
                    session["token"] = response_data["token"]
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
            # raise SystemExit(e)
            flash("Something went wrong! Try Again !")

    else:
        if "username" in session:
            return redirect(url_for("/.welcome"))

    return render_template('index/login.html', title="Log in to Hush")


@index.route('/logout')
def logout():

    session.pop("username")
    session.pop("token")
    return redirect(url_for("/.welcome"))


@index.route('/addPost', methods=["POST"])
def addPost():
    tags = []

    content = request.json
    post_text = content["post"]
    post_text = post_text.strip()

    if post_text == "":
        resp = jsonify("{'error': 'empty post'}")
        resp.status_code = 400
        return resp

    tags += re.findall(r'[#][^\s#]+', post_text)
    tags = set(map(lambda x: x[1:], tags))
    if len(tags) == 0:
        tags = ""

    try:
        response = requests.post(current_app.config['USER_SERVER']+"/timeline/addPost/", headers={
            "authorization": "Bearer "+session["token"]}, json={"post": post_text, "tags": tags})

        response_data = response.json()
        if response.status_code == 200:
            if response_data['error'] == False:
                resp = jsonify("{'message': 'created'}")
                resp.status_code = 200
                return resp
            else:
                # some Issue
                print(response_data)
                resp = jsonify("{'error': 'Unable to post'}")
                resp.status_code = 500
                return resp
        else:
            # Internal Server Error OR Unauthorized
            resp = jsonify("{'error': response_data['message']}")
            resp.status_code = response.status_code
            return resp

    except requests.exceptions.RequestException as e:
        # Service not avaiable // connection refused
        # raise SystemExit(e)
        resp = jsonify("{'error': 'Internal Server Error'}")
        resp.status_code = 500
        return resp
