import json, datetime, re
import urllib.request
from requests_oauthlib import OAuth1Session

# ユーザーID取得
def get_user_id(twitter):
    url = "https://api.twitter.com/1.1/account/verify_credentials.json"
    res = twitter.get(url)
    user_id = json.loads(res.text)['id_str'] if res.status_code == 200 else ''
    return user_id

# ツイート取得
def get_tweet(tweet):
    tweet = tweet.get('retweeted_status', tweet)
    date = datetime.datetime.strptime(tweet['created_at'], "%a %b %d %H:%M:%S +0000 %Y")
    diff = datetime.datetime.now() - date - datetime.timedelta(hours = 9)
    minute = diff.seconds // 60
    hour = minute // 60
    tweet['time'] = f"{diff.days}d" if diff.days else f"{hour}h" if hour else f"{minute}m"
    try:
        videos = tweet['extended_entities']['media'][0]['video_info']['variants']
        videos = [video for video in videos if video['content_type'] == "video/mp4"]
        tweet['video_link'] = max(videos, key = lambda video: video['bitrate'])['url']
    except:
        tweet['video_link'] = ''
    try:
        tweet['media_links'] = [] if tweet['video_link'] else [media['media_url'] for media in tweet['extended_entities']['media']]
    except:
        tweet['media_links'] = []
    if tweet.get('quoted_status'):
        tweet['quoted_status'] = get_tweet(tweet['quoted_status'])
    return tweet

# ユーザー取得
def get_user(twitter, user_id):
    url = "https://api.twitter.com/1.1/users/lookup.json"
    params = {"user_id": user_id}
    res = twitter.get(url, params = params)
    user = json.loads(res.text)[0] if res.status_code == 200 else {}
    return user

# ダイレクトメッセージ
def direct_message(twitter, target, message):
    url = "https://api.twitter.com/1.1/direct_messages/events/new.json"
    data = {
        "event": {
            "type": "message_create",
            "message_create": {
                "target": { "recipient_id": target },
                "message_data": { "text": message }
            }
        }
    }
    twitter.post(url, data = json.dumps(data))

# リスト取得
def get_lists(twitter, user_id):
    url = "https://api.twitter.com/1.1/lists/list.json"
    params = {"user_id": user_id}
    res = twitter.get(url, params = params)
    lists = json.loads(res.text) if res.status_code == 200 else []
    return lists

# ホームタイムライン取得
def get_home_timeline(twitter, count):
    url = "https://api.twitter.com/1.1/statuses/home_timeline.json"
    params = {
        "exclude_replies": True,
        "include_rts": False,
        "count": count,
        "tweet_mode": "extended"
    }
    res = twitter.get(url, params = params)
    tweets = json.loads(res.text) if res.status_code == 200 else []
    return tweets

# Kawaiiチェック
def is_kawaii(user):
    accept = False
    NEED_words = ["アニメーター", "イラスト", "絵描き", "pixiv"]
    if True in [word in user["description"] for word in NEED_words]: accept = True
    try:
        if "pixiv" in user["entities"]["url"]["urls"][0]["display_url"]: accept = True
    except:
        pass
    if True in ["pixiv" in url["display_url"] for url in user["entities"]["description"]["urls"]]: accept = True
    BAN_words = [
        "18", "DLsite", "FANZA", "NTR", "えろ", "えち", "えっち", "おっぱい", "ふたなり",
        "エロ", "エッチ", "スケベ", "成人", "成年", "以下", "未満", "同人", "性癖", "不健全", "🔞"
    ]
    if True in [word in user["description"] for word in BAN_words]: accept = False
    return accept

# Kawaiiタイムライン取得
def get_kawaii_timeline(twitter, count):
    url = "https://api.twitter.com/1.1/lists/statuses.json"
    list_id = "998201788170887169"
    params = {
        "list_id": list_id,
        "exclude_replies": True,
        "include_rts": True,
        "count": count,
        "tweet_mode": "extended"
    }
    res = twitter.get(url, params = params)
    tweets = json.loads(res.text) if res.status_code == 200 else []
    tweets = [tweet.get('retweeted_status', tweet) for tweet in tweets]
    tweets = [
        tweet for tweet in tweets \
        if tweet["entities"].get("media") \
        and tweet["favorite_count"] > 100 \
        and is_kawaii(tweet["user"])
    ]
    return tweets

# ユーザーのツイート取得
def get_tweets(twitter, user_id, count):
    url = "https://api.twitter.com/1.1/statuses/user_timeline.json"
    params = {
        "user_id": user_id,
        "exclude_replies": True,
        "include_rts": False,
        "count": count,
        "tweet_mode": "extended"
    }
    res = twitter.get(url, params = params)
    tweets = json.loads(res.text) if res.status_code == 200 else []
    return tweets

# リストタイムライン取得
def get_list_timeline(twitter, list_id, count):
    url = "https://api.twitter.com/1.1/lists/statuses.json"
    params = {
        "list_id": list_id,
        "exclude_replies": True,
        "include_rts": False,
        "count": count,
        "tweet_mode": "extended"
    }
    res = twitter.get(url, params = params)
    tweets = json.loads(res.text) if res.status_code == 200 else []
    return tweets

# ユーザータイムライン取得
def get_user_timeline(twitter, user_id, count):
    url = "https://api.twitter.com/1.1/statuses/user_timeline.json"
    params = {
        "user_id": user_id,
        "exclude_replies": True,
        "include_rts": False,
        "count": count,
        "tweet_mode": "extended"
    }
    res = twitter.get(url, params = params)
    tweets = json.loads(res.text) if res.status_code == 200 else []
    return tweets
