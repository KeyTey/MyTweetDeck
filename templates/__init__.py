from flask import Flask
app = Flask(__name__, static_folder = "./public", template_folder = "./static")

from templates.twitter.views import twitter_blueprint
app.register_blueprint(twitter_blueprint)
