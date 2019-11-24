import MyTwitter
from templates import app

app.secret_key = MyTwitter.environ("FLASK_SECRET_KEY")

if __name__ == '__main__':
    app.run(host = '0.0.0.0', port = 8080, debug = True)
