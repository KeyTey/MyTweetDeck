from templates import app

app.secret_key = "1234567890"

if __name__ == '__main__':
    app.run(host = '0.0.0.0', port = 8000, debug = True)
