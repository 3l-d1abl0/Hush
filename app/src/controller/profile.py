from flask import Blueprint, render_template, session, redirect, url_for, current_app, flash
import requests

profile = Blueprint('profile', __name__)

@profile.route('/<user_url_slug>')
def timeline(user_url_slug):
    # Do some stuff

    if "username" in session:

        user_url_slug = user_url_slug.strip()
        print(user_url_slug)

        if user_url_slug != "":

            if session["username"] == user_url_slug:
                timeline_header = "Your recent posts ..."
                follow_button = False
            else:
                timeline_header = "{}'s Recent posts ... ".format(user_url_slug)
                follow_button = True

            try:
                response = requests.get(current_app.config['USER_SERVER']+"/profile/"+user_url_slug, headers={
                "authorization": "Bearer "+session["token"]})
                
                response_data = response.json()
                if response.status_code == 200:
                    
                    if response_data['error'] == False:
                        return render_template('profile/timeline.html', header=timeline_header, posts=response_data['posts'], username=user_url_slug, title="{}'s Profile".format(user_url_slug), follow_button=follow_button)
                    else:
                        # some Issue
                        flash("Not able to fetch timeline ! Try Later !")
                        return render_template('profile/timeline.html', header=timeline_header, posts=[], username=user_url_slug, title="{}'s Profile".format(user_url_slug), follow_button=follow_button)
                        
                else:
                    # Internal Server Error OR Unauthorized
                    flash("Not able to fetch your timeline ! Try again !")
                    return render_template('profile/timeline.html', header=timeline_header, posts=[], username=user_url_slug, title="{}'s Profile".format(user_url_slug), follow_button=follow_button)

            except requests.exceptions.RequestException as e:
                # Service not avaiable // connection refused
                #  raise SystemExit(e)
                flash("Something went wrong! Try Again !")
                return render_template('profile/timeline.html', header=timeline_header, posts=[], username=user_url_slug, title="{}'s Profile".format(user_url_slug))

        flash('User not found !')
        return render_template('profile/timeline.html', header=timeline_header, posts=[], username=user_url_slug, title="{}'s Profile".format(user_url_slug))

    else:
        return redirect(url_for("/.login"))

@profile.route('/<user_url_slug>/photos')
def photos(user_url_slug):
    # Do some stuff
    return render_template('profile/photos.html')

@profile.route('/<user_url_slug>/about')
def about(user_url_slug):
    # Do some stuff
    return render_template('profile/about.html')