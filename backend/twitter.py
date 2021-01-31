import json, datetime

# 認証ユーザーのIDを取得する
def get_user_id(oauth):
    url = "https://api.twitter.com/1.1/account/verify_credentials.json"
    res = oauth.get(url)
    user_id = json.loads(res.text)['id_str'] if res.status_code == 200 else ''
    return user_id

# 単体のユーザーを取得する
def get_user(oauth, user_id):
    url = "https://api.twitter.com/1.1/users/show.json"
    params = {'user_id': user_id}
    res = oauth.get(url, params = params)
    user = json.loads(res.text) if res.status_code == 200 else None
    return user

# ツイートを整形する
def get_formed_tweet(tweet):
    if tweet is None: return None
    retweeted_status = tweet.get('retweeted_status')
    tweet, retweet_user = (retweeted_status, tweet['user']) if retweeted_status else (tweet, None)
    tweet['retweet_user'] = retweet_user
    date = datetime.datetime.strptime(tweet['created_at'], "%a %b %d %H:%M:%S +0000 %Y")
    diff = datetime.datetime.now() - date - datetime.timedelta(hours = 9)
    minute = diff.seconds // 60
    hour = minute // 60
    tweet['time'] = f"{diff.days}d" if diff.days else f"{hour}h" if hour else f"{minute}m"
    try:
        videos = tweet['extended_entities']['media'][0]['video_info']['variants']
        videos = [video for video in videos if video['content_type'] == 'video/mp4']
        videos = sorted(videos, key = lambda video: video['bitrate'])
        tweet['video_urls'] = [video['url'] for video in videos]
    except:
        tweet['video_urls'] = []
    try:
        tweet['image_urls'] = [] if tweet['video_urls'] else [media['media_url_https'] for media in tweet['extended_entities']['media']]
    except:
        tweet['image_urls'] = []
    quoted_status = tweet.get('quoted_status')
    tweet['quoted_status'] = get_formed_tweet(quoted_status) if quoted_status else None
    return tweet

# ツイートリストを整形する
def get_formed_tweets(tweets):
    tweets = [get_formed_tweet(tweet) for tweet in tweets]
    return tweets

# ダイレクトメッセージを送信する
def send_direct_message(oauth, target, message):
    url = "https://api.twitter.com/1.1/direct_messages/events/new.json"
    data = {
        'event': {
            'type': 'message_create',
            'message_create': {
                'target': { 'recipient_id': target },
                'message_data': { 'text': message }
            }
        }
    }
    oauth.post(url, data = json.dumps(data))

# 対象ユーザーのリスト一覧を取得する
def get_list_items(oauth, user_id):
    url = "https://api.twitter.com/1.1/lists/list.json"
    params = {'user_id': user_id}
    res = oauth.get(url, params = params)
    items = json.loads(res.text) if res.status_code == 200 else []
    return items

# リストのタイムラインを取得する
def get_list_timeline(oauth, list_id, count = 200, exclude_replies = True, include_rts = True):
    url = "https://api.twitter.com/1.1/lists/statuses.json"
    params = {
        'list_id': list_id,
        'count': count,
        'exclude_replies': exclude_replies,
        'include_rts': include_rts,
        'tweet_mode': 'extended'
    }
    res = oauth.get(url, params = params)
    tweets = json.loads(res.text) if res.status_code == 200 else []
    tweets = get_formed_tweets(tweets)
    return tweets

# ホームタイムラインを取得する
def get_home_timeline(oauth, count = 200, exclude_replies = True, include_rts = True):
    url = "https://api.twitter.com/1.1/statuses/home_timeline.json"
    params = {
        'count': count,
        'exclude_replies': exclude_replies,
        'include_rts': include_rts,
        'tweet_mode': 'extended'
    }
    res = oauth.get(url, params = params)
    tweets = json.loads(res.text) if res.status_code == 200 else []
    tweets = get_formed_tweets(tweets)
    return tweets

# ユーザータイムラインを取得する
def get_user_timeline(oauth, user_id, count = 200, exclude_replies = True, include_rts = True):
    url = "https://api.twitter.com/1.1/statuses/user_timeline.json"
    params = {
        'user_id': user_id,
        'count': count,
        'exclude_replies': exclude_replies,
        'include_rts': include_rts,
        'tweet_mode': 'extended'
    }
    res = oauth.get(url, params = params)
    tweets = json.loads(res.text) if res.status_code == 200 else []
    tweets = get_formed_tweets(tweets)
    return tweets

# ツイートの検索結果を取得する
def get_searched_tweets(oauth, query, count = 200, result_type = 'mixed'):
    url = "https://api.twitter.com/1.1/search/tweets.json"
    params = {
        'q': query,
        'count': count,
        'result_type': result_type,
        'tweet_mode': 'extended'
    }
    res = oauth.get(url, params = params)
    statuses = json.loads(res.text)['statuses'] if res.status_code == 200 else []
    tweets = []
    for status in statuses:
        status = status.get('retweeted_status', status)
        tweet_ids = [tweet['id_str'] for tweet in tweets]
        if status['id_str'] in tweet_ids: continue
        tweets.append(status)
    tweets = get_formed_tweets(tweets)
    return tweets
