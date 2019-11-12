import MyTwitter, os, json
from urllib.parse import parse_qsl
from requests_oauthlib import OAuth1Session
from flask import Blueprint, Response, render_template, request, session, redirect, url_for

twitter_blueprint = Blueprint('twitter', __name__)

@twitter_blueprint.route('/')
def index():
    CK = os.environ["TWITTER_CONSUMER_KEY"]
    CS = os.environ["TWITTER_CONSUMER_SECRET"]
    oauth_token = request.args.get('oauth_token')
    oauth_verifier = request.args.get('oauth_verifier')
    # アクセストークン取得
    if oauth_token and oauth_verifier:
        twitter = OAuth1Session(CK, CS, oauth_token, oauth_verifier)
        response = twitter.post(
            "https://api.twitter.com/oauth/access_token",
            params = {'oauth_verifier': oauth_verifier}
        )
        access_token = dict(parse_qsl(response.content.decode("utf-8")))
        AT = access_token['oauth_token']
        AS = access_token['oauth_token_secret']
        twitter = OAuth1Session(CK, CS, AT, AS)
        user_id = MyTwitter.get_user_id(twitter)
        if user_id:
            session['CK'] = CK
            session['CS'] = CS
            session['AT'] = AT
            session['AS'] = AS
            session['user_id'] = user_id
        return redirect(url_for('twitter.index'))
    # 認証画面リダイレクト
    if not session.get('user_id'):
        oauth_callback = os.environ["OAUTH_CALLBACK"]
        twitter = OAuth1Session(CK, CS)
        response = twitter.post(
            "https://api.twitter.com/oauth/request_token",
            params = {'oauth_callback': oauth_callback}
        )
        request_token = dict(parse_qsl(response.content.decode("utf-8")))
        authenticate_endpoint = f"https://api.twitter.com/oauth/authenticate?oauth_token={request_token['oauth_token']}"
        return redirect(authenticate_endpoint)
    return render_template("index.html")

# Twitter認証
def get_twitter():
    twitter = OAuth1Session(session['CK'], session['CS'], session['AT'], session['AS'])
    return twitter

# レスポンス
def response(data):
    return Response(
        json.dumps(data),
        mimetype = 'application/json',
        headers = {
            'Cache-Control': 'no-cache',
            'Access-Control-Allow-Origin': '*'
        }
    )

# ツイート
@twitter_blueprint.route('/api/tweet', methods = ['POST'])
def tweet():
    twitter = get_twitter()
    url = "https://api.twitter.com/1.1/statuses/update.json"
    content = request.form['content']
    params = {"status": content}
    res = twitter.post(url, params = params)
    return response({'status': res.status_code})

# いいね
@twitter_blueprint.route('/api/favorite', methods = ['POST'])
def favorite():
    twitter = get_twitter()
    url = "https://api.twitter.com/1.1/favorites/create.json"
    tweet_id = request.form['id']
    params = {"id": tweet_id}
    res = twitter.post(url, params = params)
    return response({'status': res.status_code})

# リツイート
@twitter_blueprint.route('/api/retweet', methods = ['POST'])
def retweet():
    twitter = get_twitter()
    url = f"https://api.twitter.com/1.1/statuses/retweet/{request.form['id']}.json"
    res = twitter.post(url)
    return response({'status': res.status_code})

# マイアカウント取得
@twitter_blueprint.route('/api/myself', methods = ['GET'])
def myself():
    twitter = get_twitter()
    user = MyTwitter.get_user(twitter, session['user_id'])
    return response(user)

# リスト取得
@twitter_blueprint.route('/api/lists', methods = ['GET'])
def lists():
    twitter = get_twitter()
    lists = MyTwitter.get_lists(twitter, session['user_id'])
    return response({'lists': lists})

# ホームタイムライン取得
@twitter_blueprint.route('/api/home_timeline', methods = ['GET'])
def home_timeline():
    twitter = get_twitter()
    tweets = MyTwitter.get_home_timeline(twitter, 200)
    tweets = [MyTwitter.get_tweet(tweet) for tweet in tweets]
    return response({'tweets': tweets})

# Kawaiiタイムライン取得
@twitter_blueprint.route('/api/kawaii', methods = ['GET'])
def kawaii():
    twitter = get_twitter()
    tweets = MyTwitter.get_kawaii_timeline(twitter, 200)
    tweets = [MyTwitter.get_tweet(tweet) for tweet in tweets]
    return response({'tweets': tweets})

# リストタイムライン取得
@twitter_blueprint.route('/api/list_timeline/<list_id>', methods = ['GET'])
def list_timeline(list_id):
    twitter = get_twitter()
    tweets = MyTwitter.get_list_timeline(twitter, list_id, 200)
    tweets = [MyTwitter.get_tweet(tweet) for tweet in tweets]
    return response({'tweets': tweets})
