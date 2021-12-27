from flask import Blueprint, render_template, session
from ..model.user import User

profile = Blueprint('profile', __name__)

@profile.route('/<user_url_slug>')
def timeline(user_url_slug):
    # Do some stuff

    if user_url_slug != "":
        user = User(user_url_slug)
        posts = user.get_user_post()

        if session["username"] == user_url_slug:
            timeline_header = "Your recent posts ..."
        else:
            timeline_header = "{}'s Recent posts ... ".format(user_url_slug)

    print(posts)
    return render_template('profile/timeline.html', header=timeline_header, posts=posts, username=user_url_slug, title="{}'s Profile".format(user_url_slug))

@profile.route('/<user_url_slug>/photos')
def photos(user_url_slug):
    # Do some stuff
    return render_template('profile/photos.html')

@profile.route('/<user_url_slug>/about')
def about(user_url_slug):
    # Do some stuff
    return render_template('profile/about.html')