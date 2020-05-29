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

### Amazon Linux 2 AMI

#### Local

```shell
# Login
$ ssh -i ~/.ssh/MyTweetDeck.pem ec2-user@{ELASTIC_IP}
```

#### EC2

```shell
# Update
$ sudo yum update -y

# Install Docker
$ sudo amazon-linux-extras install docker
$ sudo service docker start
$ sudo usermod -a -G docker ec2-user

# Install Docker Compose
$ sudo curl -L https://github.com/docker/compose/releases/download/1.22.0/docker-compose-$(uname -s)-$(uname -m) -o /usr/local/bin/docker-compose
$ sudo chmod +x /usr/local/bin/docker-compose

# Install Git
$ sudo yum install git

# Deploy
$ git clone https://github.com/KeyTey/MyTweetDeck.git
$ cd ~/MyTweetDeck
$ vim environ.json
$ docker-compose up -d
```
