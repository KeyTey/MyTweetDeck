# MyTweetDeck

## Deployment

### Heroku

```
$ git push heroku master
```

### Ubuntu 18.04 LTS with AWS EC2

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
