from flask import Flask
from backend.router import twitter_blueprint

app = Flask(__name__, static_folder = './frontend/public', template_folder = './frontend/public')
app.register_blueprint(twitter_blueprint)
app.secret_key = '0123456789'

if __name__ == '__main__':
    app.run(host = '0.0.0.0', port = 8000, debug = True)
