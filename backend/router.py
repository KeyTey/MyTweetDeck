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
OAUTH_CALLBACK = os.getenv('OAUTH_CALLBACK')

# Twitter認証
def get_oauth():
    access_token = session.get('access_token', '')
    access_secret = session.get('access_secret', '')
    oauth = OAuth1Session(CONSUMER_KEY, CONSUMER_SECRET, access_token, access_secret)
    return oauth

# レスポンス
def response(data = None):
    return Response(
        json.dumps(data),
        mimetype = 'application/json',
        headers = {
            'Cache-Control': 'no-cache',
            'Access-Control-Allow-Origin': '*'
        }
    )

@twitter_blueprint.route('/')
def index():
    # アクセストークン取得時
    oauth_token = request.args.get('oauth_token')
    oauth_verifier = request.args.get('oauth_verifier')
    if oauth_token and oauth_verifier:
        oauth = OAuth1Session(CONSUMER_KEY, CONSUMER_SECRET, oauth_token, oauth_verifier)
        url = "https://api.twitter.com/oauth/access_token"
        res = oauth.post(url, params = {'oauth_verifier': oauth_verifier})
        access_data = dict(parse_qsl(res.content.decode('utf-8')))
        access_token = access_data['oauth_token']
        access_secret = access_data['oauth_token_secret']
        oauth = OAuth1Session(CONSUMER_KEY, CONSUMER_SECRET, access_token, access_secret)
        user_id = twitter.get_user_id(oauth)
        if user_id != '':
            session['access_token'] = access_token
            session['access_secret'] = access_secret
            session['user_id'] = user_id
        return redirect(url_for('twitter.index'))
    # 認証完了時
    return render_template('index.html')

# 認証用URL取得
@twitter_blueprint.route('/api/auth', methods = ['GET'])
def auth():
    oauth = OAuth1Session(CONSUMER_KEY, CONSUMER_SECRET)
    url = "https://api.twitter.com/oauth/request_token"
    res = oauth.post(url, params = {'oauth_callback': OAUTH_CALLBACK})
    request_token = dict(parse_qsl(res.content.decode('utf-8')))
    oauth_token = request_token['oauth_token']
    authenticate_endpoint = f"https://api.twitter.com/oauth/authenticate?oauth_token={oauth_token}"
    return response(authenticate_endpoint)

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
    user_id = session.get('user_id', '')
    user = twitter.get_user(oauth, user_id)
    return response(user)

# リスト取得
@twitter_blueprint.route('/api/lists', methods = ['GET'])
def lists():
    oauth = get_oauth()
    user_id = session.get('user_id', '')
    lists = twitter.get_lists(oauth, user_id)
    return response({'lists': lists})

# ホームタイムライン取得
@twitter_blueprint.route('/api/home_timeline', methods = ['GET'])
def home_timeline():
    tweets = []
    oauth = get_oauth()
    user_id = session.get('user_id', '')
    if user_id == '':
        query = '#ハムスター OR #ハムスターのいる生活 OR #ハムスター好きと繋がりたい filter:media'
        tweets = twitter.get_searched_tweets(oauth, query, 100)
    else:
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
    user_id = session.get('user_id', '')
    if user_id == '': return response()
    timelines = json.loads(request.form['timelines'])
    session['timelines'] = timelines
    return response()

# ログアウト
@twitter_blueprint.route('/api/logout', methods = ['POST'])
def logout():
    session.clear()
    return response()
