from flask import render_template, Blueprint
twitter_blueprint = Blueprint('twitter', __name__)

@twitter_blueprint.route('/')
def index():
    return render_template("index.html")
