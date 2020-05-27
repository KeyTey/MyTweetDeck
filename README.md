# MyTweetDeck

https://mytweetdeck.herokuapp.com

## Development

#### ~/MyTweetDeck

```shell
$ pip install -r requirements.txt
$ python3 server.py
```

#### ~/MyTweetDeck/templates/static

```shell
$ npm install
$ npm run watch
```

## Deployment

### Docker

```shell
# Create and Start
$ docker-compose up -d

# Stop
$ docker-compose stop

# Start
$ docker-compose start

# Remove
$ docker-compose down (--rmi all)
```

### Heroku

```shell
$ heroku config:set TWITTER_CONSUMER_KEY="<YOUR CONSUMER KEY>"
$ heroku config:set TWITTER_CONSUMER_SECRET="<YOUR CONSUMER SECRET>"
$ heroku config:set TWITTER_ACCESS_TOKEN="<YOUR ACCESS TOKEN>"
$ heroku config:set TWITTER_ACCESS_SECRET="<YOUR ACCESS SECRET>"
$ heroku config:set TWITTER_OWNER_ID="<YOUR ID>"
$ heroku config:set OAUTH_CALLBACK="<CALLBACK URL>"
$ heroku config:add TZ=Asia/Tokyo
$ git push heroku master
```

### Ubuntu 18.04 LTS with AWS EC2

#### Login

```shell
$ ssh -i ~/.ssh/MyTweetDeck.pem ubuntu@{ELASTIC_IP}
```

#### Setup

```shell
$ sudo apt update
$ sudo apt install -y nginx gunicorn python3-pip python3-dev supervisor git
$ git clone https://github.com/KeyTey/MyTweetDeck.git
$ cd ~/MyTweetDeck
$ sudo pip3 install -r requirements.txt
$ sudo vim /etc/nginx/sites-enabled/default
$ sudo /etc/init.d/nginx restart
$ sudo vim /etc/supervisor/conf.d/MyTweetDeck
```

#### Deploy

```shell
$ cd ~/MyTweetDeck
$ git pull origin master
$ sudo supervisorctl reread
$ sudo supervisorctl reload
$ sudo supervisorctl update
$ sudo supervisorctl restart MyTweetDeck
```

#### /etc/nginx/sites-enabled/default

```
upstream MyTweetDeckServer {
    server unix:/tmp/MyTweetDeck.sock fail_timeout=0;
}

server {
    server_name [server_name];
    charset utf-8;
    client_max_body_size 75M;

    error_log /var/log/nginx/error.log;
    access_log /var/log/nginx/access.log;

    location / {
        try_files $uri @MyTweetDeck;
    }

    location @MyTweetDeck {

        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_redirect off;

        proxy_pass http://MyTweetDeckServer;
    }

}
```

#### /etc/supervisor/conf.d/MyTweetDeck.conf

```
[program:MyTweetDeck]
command = gunicorn server:app --config /home/ubuntu/MyTweetDeck/gunicorn_conf.py
directory = /home/ubuntu/MyTweetDeck
user = ubuntu
```
