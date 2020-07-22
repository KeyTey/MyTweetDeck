import json, os
from . import twitter
from dotenv import load_dotenv
from urllib.parse import parse_qsl
from requests_oauthlib import OAuth1Session
from flask import Blueprint, Response, render_template, request, session, redirect, url_for

twitter_blueprint = Blueprint('twitter', __name__)

load_dotenv()

CONSUMER_KEY = os.getenv('TWITTER_CONSUMER_KEY')
CONSUMER_SECRET = os.getenv('TWITTER_CONSUMER_SECRET')
OWNER_TOKEN = os.getenv('TWITTER_ACCESS_TOKEN')
OWNER_SECRET = os.getenv('TWITTER_ACCESS_SECRET')
OWNER_ID = os.getenv('TWITTER_OWNER_ID')
OAUTH_CALLBACK = os.getenv('OAUTH_CALLBACK')

@twitter_blueprint.route('/')
def index():
    oauth_token = request.args.get('oauth_token')
    oauth_verifier = request.args.get('oauth_verifier')
    # アクセストークン取得
    if oauth_token and oauth_verifier:
        oauth = OAuth1Session(CONSUMER_KEY, CONSUMER_SECRET, oauth_token, oauth_verifier)
        response = oauth.post(
            "https://api.twitter.com/oauth/access_token",
            params = {'oauth_verifier': oauth_verifier}
        )
        access_data = dict(parse_qsl(response.content.decode('utf-8')))
        access_token = access_data['oauth_token']
        access_secret = access_data['oauth_token_secret']
        oauth = OAuth1Session(CONSUMER_KEY, CONSUMER_SECRET, access_token, access_secret)
        user_id = twitter.get_user_id(oauth)
        if user_id:
            session['access_token'] = access_token
            session['access_secret'] = access_secret
            session['user_id'] = user_id
        return redirect(url_for('twitter.index'))
    # 認証画面リダイレクト
    if not session.get('user_id'):
        oauth = OAuth1Session(CONSUMER_KEY, CONSUMER_SECRET)
        res = oauth.post(
            "https://api.twitter.com/oauth/request_token",
            params = {'oauth_callback': OAUTH_CALLBACK}
        )
        request_token = dict(parse_qsl(res.content.decode('utf-8')))
        oauth_token = request_token['oauth_token']
        authenticate_endpoint = f"https://api.twitter.com/oauth/authenticate?oauth_token={oauth_token}"
        return redirect(authenticate_endpoint)
    return render_template('index.html')

# Twitter認証
def get_oauth():
    oauth = OAuth1Session(CONSUMER_KEY, CONSUMER_SECRET, session['access_token'], session['access_secret'])
    return oauth

# レスポンス
def response(data = {}):
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
    oauth = get_oauth()
    url = "https://api.twitter.com/1.1/statuses/update.json"
    content = request.form['content']
    params = {'status': content}
    res = oauth.post(url, params = params)
    return response({'status': res.status_code})

# いいね
@twitter_blueprint.route('/api/favorite', methods = ['POST'])
def favorite():
    oauth = get_oauth()
    url = "https://api.twitter.com/1.1/favorites/create.json"
    tweet_id = request.form['id']
    params = {'id': tweet_id}
    res = oauth.post(url, params = params)
    return response({'status': res.status_code})

# リツイート
@twitter_blueprint.route('/api/retweet', methods = ['POST'])
def retweet():
    oauth = get_oauth()
    tweet_id = request.form['id']
    url = f"https://api.twitter.com/1.1/statuses/retweet/{tweet_id}.json"
    res = oauth.post(url)
    return response({'status': res.status_code})

# マイアカウント取得
@twitter_blueprint.route('/api/myself', methods = ['GET'])
def myself():
    oauth = get_oauth()
    user = twitter.get_user(oauth, session['user_id'])
    return response(user)

# リスト取得
@twitter_blueprint.route('/api/lists', methods = ['GET'])
def lists():
    oauth = get_oauth()
    lists = twitter.get_lists(oauth, session['user_id'])
    return response({'lists': lists})

# ホームタイムライン取得
@twitter_blueprint.route('/api/home_timeline', methods = ['GET'])
def home_timeline():
    oauth = get_oauth()
    tweets = twitter.get_home_timeline(oauth, 200)
    tweets = [twitter.get_tweet(tweet) for tweet in tweets]
    return response({'tweets': tweets})

# Kawaiiタイムライン取得
@twitter_blueprint.route('/api/kawaii', methods = ['GET'])
def kawaii():
    oauth = get_oauth()
    tweets = twitter.get_kawaii_timeline(oauth, 200)
    tweets = [twitter.get_tweet(tweet) for tweet in tweets]
    return response({'tweets': tweets})

# リストタイムライン取得
@twitter_blueprint.route('/api/list_timeline/<list_id>', methods = ['GET'])
def list_timeline(list_id):
    oauth = get_oauth()
    tweets = twitter.get_list_timeline(oauth, list_id, 200)
    tweets = [twitter.get_tweet(tweet) for tweet in tweets]
    return response({'tweets': tweets})

# ユーザータイムライン取得
@twitter_blueprint.route('/api/user_timeline/<user_id>', methods = ['GET'])
def user_timeline(user_id):
    oauth = get_oauth()
    tweets = twitter.get_user_timeline(oauth, user_id, 200)
    tweets = [twitter.get_tweet(tweet) for tweet in tweets]
    return response({'tweets': tweets})

# タイムラインの状態取得
@twitter_blueprint.route('/api/timelines', methods = ['GET'])
def get_timelines():
    timelines = session.get('timelines', [])
    return response({'timelines': timelines})

# タイムラインの状態更新
@twitter_blueprint.route('/api/timelines', methods = ['POST'])
def post_timelines():
    timelines = json.loads(request.form['timelines'])
    session['timelines'] = timelines
    return response()

# ログ
@twitter_blueprint.route('/api/log', methods = ['POST'])
def log():
    oauth = get_oauth()
    status = request.form['status']
    if session['user_id'] != OWNER_ID:
        user = twitter.get_user(oauth, session['user_id'])
        message = f"{user['name']}\n@{user['screen_name']}\n\n{status}"
        oauth = OAuth1Session(CONSUMER_KEY, CONSUMER_SECRET, OWNER_TOKEN, OWNER_SECRET)
        twitter.direct_message(oauth, OWNER_ID, message)
    return response()

# ログアウト
@twitter_blueprint.route('/api/logout', methods = ['POST'])
def logout():
    session.clear()
    return response()
