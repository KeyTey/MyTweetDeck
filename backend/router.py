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

# OAuth認証
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

# トップページ
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

########################################
# account - アカウント
########################################

# 認証用URLを取得する
@twitter_blueprint.route('/api/account/authorization', methods = ['GET'])
def get_account_authorization():
    oauth = OAuth1Session(CONSUMER_KEY, CONSUMER_SECRET)
    url = "https://api.twitter.com/oauth/request_token"
    res = oauth.post(url, params = {'oauth_callback': OAUTH_CALLBACK})
    request_token = dict(parse_qsl(res.content.decode('utf-8')))
    oauth_token = request_token['oauth_token']
    authenticate_endpoint = f"https://api.twitter.com/oauth/authenticate?oauth_token={oauth_token}"
    return response({'endpoint': authenticate_endpoint})

# 認証ユーザーを取得する
@twitter_blueprint.route('/api/account/user', methods = ['GET'])
def get_account_user():
    oauth = get_oauth()
    user_id = session.get('user_id', '')
    user = twitter.get_user(oauth, user_id)
    return response({'user': user})

# タイムラインの一覧を取得する
@twitter_blueprint.route('/api/account/timeline/items', methods = ['GET'])
def get_account_timeline_items():
    timelines = session.get('timelines', [])
    return response({'timelines': timelines})

# タイムラインの一覧を更新する
@twitter_blueprint.route('/api/account/timeline/items', methods = ['POST'])
def post_account_timeline_items():
    user_id = session.get('user_id', '')
    if user_id == '': return response()
    timelines = json.loads(request.form['timelines'])
    session['timelines'] = timelines
    return response()

# 設定を取得する
@twitter_blueprint.route('/api/account/setting', methods = ['GET'])
def get_account_setting():
    setting = session.get('setting', {})
    return response({'setting': setting})

# 設定を更新する
@twitter_blueprint.route('/api/account/setting', methods = ['POST'])
def post_account_setting():
    user_id = session.get('user_id', '')
    if user_id == '': return response()
    setting = json.loads(request.form['setting'])
    session['setting'] = setting
    return response()

# ログアウトする
@twitter_blueprint.route('/api/account/logout', methods = ['POST'])
def post_account_logout():
    session.clear()
    return response()

########################################
# tweet - ツイート
########################################

# ツイートを投稿する
@twitter_blueprint.route('/api/tweet/create', methods = ['POST'])
def post_tweet_create():
    oauth = get_oauth()
    url = "https://api.twitter.com/1.1/statuses/update.json"
    content = request.form['content']
    params = {'status': content}
    res = oauth.post(url, params = params)
    tweet = json.loads(res.text) if res.status_code == 200 else None
    tweet = twitter.get_formed_tweet(tweet)
    return response({'tweet': tweet})

########################################
# like - いいね
########################################

# 対象ツイートにいいねを付ける
@twitter_blueprint.route('/api/like/create', methods = ['POST'])
def post_like_create():
    oauth = get_oauth()
    url = "https://api.twitter.com/1.1/favorites/create.json"
    tweet_id = request.form['id']
    params = {'id': tweet_id}
    res = oauth.post(url, params = params)
    tweet = json.loads(res.text) if res.status_code == 200 else None
    tweet = twitter.get_formed_tweet(tweet)
    return response({'tweet': tweet})

########################################
# retweet - リツイート
########################################

# リツイートを実行する
@twitter_blueprint.route('/api/retweet/create', methods = ['POST'])
def post_retweet_create():
    oauth = get_oauth()
    tweet_id = request.form['id']
    url = f"https://api.twitter.com/1.1/statuses/retweet/{tweet_id}.json"
    res = oauth.post(url)
    tweet = json.loads(res.text) if res.status_code == 200 else None
    tweet = twitter.get_formed_tweet(tweet)
    return response({'tweet': tweet})

########################################
# list - リスト
########################################

# 対象ユーザーのリスト一覧を取得する
@twitter_blueprint.route('/api/list/items/<user_id>', methods = ['GET'])
def get_list_items(user_id):
    oauth = get_oauth()
    items = twitter.get_list_items(oauth, user_id)
    return response({'items': items})

# リストのタイムラインを取得する
@twitter_blueprint.route('/api/list/timeline/<list_id>', methods = ['GET'])
def get_list_timeline(list_id):
    oauth = get_oauth()
    tweets = twitter.get_list_timeline(oauth, list_id, count = 200)
    return response({'tweets': tweets})

########################################
# home - ホーム
########################################

# ホームタイムラインを取得する
@twitter_blueprint.route('/api/home/timeline', methods = ['GET'])
def get_home_timeline():
    tweets = []
    oauth = get_oauth()
    user_id = session.get('user_id', '')
    tweets = twitter.get_home_timeline(oauth, count = 200)
    return response({'tweets': tweets})

########################################
# anime - Anime
########################################

# Kawaiiタイムラインを取得する
@twitter_blueprint.route('/api/anime/kawaii/timeline', methods = ['GET'])
def get_kawaii_timeline():
    oauth = get_oauth()
    tweets = twitter.get_anime_timeline(oauth, count = 200, restricted = False)
    return response({'tweets': tweets})

# Hentaiタイムラインを取得する
@twitter_blueprint.route('/api/anime/hentai/timeline', methods = ['GET'])
def get_hentai_timeline():
    oauth = get_oauth()
    tweets = twitter.get_anime_timeline(oauth, count = 200, restricted = True)
    return response({'tweets': tweets})

########################################
# user - ユーザー
########################################

# ユーザータイムラインを取得する
@twitter_blueprint.route('/api/user/timeline/<user_id>', methods = ['GET'])
def get_user_timeline(user_id):
    oauth = get_oauth()
    tweets = twitter.get_user_timeline(oauth, user_id, count = 200)
    return response({'tweets': tweets})

########################################
# search - 検索
########################################

# ツイートを検索する
@twitter_blueprint.route('/api/search/tweets', methods = ['GET'])
def get_search_tweets():
    oauth = get_oauth()
    query = request.args.get('query', '')
    tweets = twitter.get_searched_tweets(oauth, query, count = 200)
    return response({'tweets': tweets})

########################################
# trends - トレンド
########################################

# トレンドを取得する
@twitter_blueprint.route('/api/trends/<where_id>', methods = ['GET'])
def get_trends(where_id):
    oauth = get_oauth()
    url = "https://api.twitter.com/1.1/trends/place.json"
    params = {'id': where_id}
    res = oauth.get(url, params = params)
    trends = json.loads(res.text)[0]['trends'] if res.status_code == 200 else []
    return response({'trends': trends})
