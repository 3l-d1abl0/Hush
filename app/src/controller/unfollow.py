from flask import Blueprint, render_template, request, redirect, flash, url_for, session, Response, jsonify
import requests
from flask import current_app
import logging

unfollow = Blueprint('unfollow', __name__)

@unfollow.route('/', methods=["POST"])
def unfollowuser():

    content = request.json
    print(content)
    username = content["username"]
    username = username.strip()

    if username == "":
        resp = jsonify("{'error': 'Invalid username'}")
        resp.status_code = 400
        return resp

    try:
        response = requests.post(current_app.config['USER_SERVER']+"/unfollow/", headers={
            "authorization": "Bearer "+session["token"]}, json={"username": username})

        response_data = response.json()
        if response.status_code == 200:
            if response_data['error'] == False:
                resp = jsonify("{'message': 'Unfollowed'}")
                resp.status_code = 200
                return resp
            else:
                # some Issue
                logging.error(response_data)
                resp = jsonify("{'error': "+response_data['message']+"}")
                resp.status_code = 200
                return resp
        else:
            # Internal Server Error OR Unauthorized
            logging.critical(response_data)
            resp = jsonify("{'error': "+response_data['message']+"}")
            resp.status_code = response.status_code
            return resp

    except requests.exceptions.RequestException as e:
        # Service not avaiable // connection refused
        # raise SystemExit(e)
        logging.critical(e)
        resp = jsonify("{'error': 'Internal Server Error'}")
        resp.status_code = 500
        return resp
