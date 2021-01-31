import axios from 'axios';
import { cloneDeep } from 'lodash';
import { getUserFromAPIData } from './user';
import { convertToFormData, mergeFormData } from './setting';

const initialState = [];

const initialTimelineSetting = {
    sortByRetweetCount: {
        description: 'リツイート数でソートする',
        enabled: false
    },
    sortByLikedCount: {
        description: 'いいね数でソートする',
        enabled: false
    },
    trimRetweet: {
        description: 'リツイートを除く',
        enabled: false
    },
    trimLikedTweet: {
        description: 'いいねしたツイートを除く',
        enabled: false
    },
    showMediaTweet: {
        description: 'メディアツイートのみ表示',
        enabled: false
    },
    makeUserUnique: {
        description: '１ユーザーにつき１ツイート',
        enabled: false
    },
    likeByClickTweetPanel: {
        description: 'パネルクリックでいいねする',
        enabled: false
    }
};

// Action Type
const SET_TIMELINES = 'SET_TIMELINES';
const SET_TIMELINE = 'SET_TIMELINE';
const ADD_TIMELINE = 'ADD_TIMELINE';
const REMOVE_TIMELINE = 'REMOVE_TIMELINE';

// Reducer
export const reducer = (state = initialState, action) => {
    switch (action.type) {
        case SET_TIMELINES: {
            const timelines = action.payload;
            return timelines;
        }
        case SET_TIMELINE: {
            const timeline = action.payload;
            const id = timeline.id;
            const timelines = cloneDeep(state);
            const index = timelines.findIndex(column => id === column.id);
            timelines[index] = timeline;
            return timelines;
        }
        case ADD_TIMELINE: {
            const timeline = action.payload;
            const timelines = state.concat(timeline);
            return timelines;
        }
        case REMOVE_TIMELINE: {
            const timeline = action.payload;
            const id = timeline.id;
            const timelines = state.filter(column => id !== column.id);
            return timelines;
        }
        default: {
            return state;
        }
    }
};

// Action Creator
export const setTimelinesAction = (timelines) => {
    return { type: SET_TIMELINES, payload: timelines };
};
export const setTimelineAction = (timeline) => {
    return { type: SET_TIMELINE, payload: timeline };
};
export const addTimelineAction = (timeline) => {
    return { type: ADD_TIMELINE, payload: timeline };
};
export const removeTimelineAction = (timeline) => {
    return { type: REMOVE_TIMELINE, payload: timeline };
};

// タイムラインオブジェクト作成
export const createTimeline = (timelineItem) => {
    const { type, name, endpoint, iconClass, setting = {} } = timelineItem;
    return {
        id: Math.floor(Math.random() * 10 ** 5),
        type: type,
        name: name,
        endpoint: endpoint,
        iconClass: iconClass,
        isLoading: false,
        tweets: [],
        setting: mergeFormData(setting, initialTimelineSetting)
    };
};

// APIデータからツイート取得
export const getTweetFromAPIData = (tweet, index) => {
    if (tweet === null) return null;
    const user = tweet.user;
    return {
        id: tweet.id_str,
        text: tweet.full_text,
        imageUrls: tweet.image_urls,
        videoUrls: tweet.video_urls,
        retweeted: tweet.retweeted,
        retweetCount: tweet.retweet_count,
        liked: tweet.favorited,
        likeCount: tweet.favorite_count,
        time: tweet.time,
        quotedStatus: getTweetFromAPIData(tweet.quoted_status),
        user: getUserFromAPIData(user),
        retweetUser: getUserFromAPIData(tweet.retweet_user),
        index: index,
        display: false,
        matched: true
    };
};

// カスタマイズされたツイートリストの取得
export const getCustomizedTweets = (tweets, setting) => {
    // リセット
    tweets.sort((a, b) => a.index - b.index);
    tweets.forEach((_, i) => tweets[i].matched = true);
    // いいね数またはリツイート数の降順でソートする
    const sortLiked = setting.sortByLikedCount.enabled;
    const sortRetweet = setting.sortByRetweetCount.enabled;
    if (sortLiked || sortRetweet) {
        const getCount = (tweet) => (tweet.likeCount * sortLiked + tweet.retweetCount * sortRetweet);
        tweets.sort((a, b) => (getCount(b) - getCount(a)));
    }
    // リツイートを除く
    if (setting.trimRetweet.enabled) {
        tweets.forEach((tweet, i) => {
            if (tweet.retweetUser) tweets[i].matched = false;
        });
    }
    // いいね済みのツイートを除く
    if (setting.trimLikedTweet.enabled) {
        tweets.forEach((tweet, i) => {
            if (tweet.liked) tweets[i].matched = false;
        });
    }
    // メディアツイートのみ取得する
    if (setting.showMediaTweet.enabled) {
        tweets.forEach((tweet, i) => {
            const isMediaTweet = (tweet.imageUrls.length > 0 || tweet.videoUrls.length > 0);
            if (!isMediaTweet) tweets[i].matched = false;
        });
    }
    // 1ユーザーにつき1ツイートとする
    if (setting.makeUserUnique.enabled) {
        const userIds = tweets.map(tweet => tweet.matched ? tweet.user.id : '');
        tweets.forEach((tweet, i) => {
            if (userIds.indexOf(tweet.user.id) !== i) tweets[i].matched = false;
        });
    }
    return tweets;
};

// タイムラインの初期化
export const initTimelines = (alert) => {
    return async (dispatch, getState) => {
        const timelines = [];
        const dictionary = getState().dictionary;
        const userId = getState().user.id;
        // 認証済みユーザーが存在する場合
        if (userId !== '') {
            // タイムライン一覧の取得
            const timelineItems = await axios.get('/api/account/timeline/items')
                .then(response => response.data.timelines)
                .catch(error => console.error(error) || []);
            // タイムラインオブジェクトへ変換
            timelineItems.forEach(timelineItem => timelines.push(createTimeline(timelineItem)));
            // タイムラインが存在しない場合
            if (timelines.length === 0) {
                // ホームタイムラインの追加
                timelines.push(createTimeline(dictionary.home.items[0]));
            }
        }
        // タイムラインの更新
        dispatch(setTimelinesAction(timelines));
        // タイムラインのロード
        timelines.map(timeline => dispatch(loadTimeline(timeline, alert)));
    };
};

// タイムラインのロード
export const loadTimeline = (timeline, alert) => {
    return async (dispatch) => {
        // ローディング開始
        timeline.isLoading = true;
        dispatch(setTimelineAction(timeline));
        // ツイートリスト取得
        const params = (timeline.type === 'trends') ? { query: timeline.name } : {};
        const fetchedTweets = await axios.get(timeline.endpoint, { params })
            .then(response => response.data.tweets)
            .catch(error => console.error(error) || []);
        const tweets = fetchedTweets.map((tweet, index) => getTweetFromAPIData(tweet, index));
        timeline.tweets = getCustomizedTweets(tweets, timeline.setting);
        // 取得失敗
        if (fetchedTweets.length === 0) alert.error('読み込みに失敗しました');
        // ローディング終了
        timeline.isLoading = false;
        dispatch(addDisplayTweets(timeline, 10));
    };
};

// タイムラインの追加
export const addTimeline = (timelineItem, alert) => {
    return async (dispatch, getState) => {
        const timeline = createTimeline(timelineItem);
        dispatch(addTimelineAction(timeline));
        dispatch(loadTimeline(timeline, alert));
        postUpdateTimelines(getState().timelines);
    };
};

// ユーザータイムラインの追加
export const addUserTimeline = (user, alert) => {
    return async (dispatch) => {
        const name = user.name;
        const endpoint = `/api/user/timeline/${user.id}`;
        const iconClass = 'fas fa-user';
        dispatch(addTimeline({ name, endpoint, iconClass }, alert));
    };
};

// タイムラインの削除
export const removeTimeline = (timeline) => {
    return (dispatch, getState) => {
        dispatch(removeTimelineAction(timeline));
        postUpdateTimelines(getState().timelines);
    };
};

// タイムラインリストの更新
export const updateTimelines = (timelines) => {
    return (dispatch) => {
        dispatch(setTimelinesAction(timelines));
        postUpdateTimelines(timelines);
    };
};

// 表示ツイートの追加
export const addDisplayTweets = (timeline, size) => {
    return (dispatch) => {
        const startIndex = timeline.tweets.findIndex(tweet => !tweet.display && tweet.matched);
        if (startIndex === -1) return;
        // マッチしないツイートを除いてサイズ分のツイートを表示する
        let count = 0;
        for (let i = startIndex; i < timeline.tweets.length; i++) {
            if (count === size) break;
            if (!timeline.tweets[i].matched) continue;
            timeline.tweets[i].display = true;
            count++;
        }
        dispatch(setTimelineAction(timeline));
    };
};

// 表示ツイートのリセット
export const resetDisplayTweets = (timeline) => {
    return (dispatch) => {
        for (let i = 0; i < timeline.tweets.length; i++) timeline.tweets[i].display = false;
        dispatch(addDisplayTweets(timeline, 10));
    };
};

// 通知送信リクエスト
export const postNotification = (targetId, endpoint, errorHandler) => {
    return async (dispatch, getState) => {
        const formData = new FormData();
        formData.append('id', targetId);
        const tweetData = await axios.post(endpoint, formData)
            .then(response => response.data.tweet)
            .catch(error => console.error(error) || null);
        if (tweetData === null) return errorHandler();
        const newTweet = getTweetFromAPIData(tweetData);
        const keys = ['retweeted', 'retweetCount', 'liked', 'likeCount'];
        const data = Object.fromEntries(keys.map(key => [key, newTweet[key]]));
        const timelines = cloneDeep(getState().timelines);
        timelines.forEach((timeline, i) => {
            timeline.tweets.forEach((tweet, j) => {
                if (tweet.id === targetId) {
                    timelines[i].tweets[j] = { ...tweet, ...data };
                }
            });
        });
        dispatch(setTimelinesAction(timelines));
    };
};

// いいね
export const postLike = (tweetId, alert) => {
    return async (dispatch) => {
        const endpoint = '/api/like/create';
        const errorHandler = () => alert.error('いいねに失敗しました');
        dispatch(postNotification(tweetId, endpoint, errorHandler));
    };
};

// リツイート
export const postRetweet = (tweetId, alert) => {
    return async (dispatch) => {
        const endpoint = '/api/retweet/create';
        const errorHandler = () => alert.error('リツイートに失敗しました');
        dispatch(postNotification(tweetId, endpoint, errorHandler));
    };
};

// ツイート
export const postTweet = (content, alert) => {
    return async (dispatch, getState) => {
        const formData = new FormData();
        formData.append('content', content);
        const tweetData = await axios.post('/api/tweet/create', formData)
            .then(response => response.data.tweet)
            .catch(error => console.error(error) || null);
        if (tweetData === null) return alert.error('ツイートに失敗しました');
        else alert.success('ツイートに成功しました');
        const timelines = getState().timelines;
        const dictionary = getState().dictionary;
        const homeEndpoint = dictionary.home.items[0].endpoint;
        timelines.forEach((timeline) => {
            if (timeline.endpoint === homeEndpoint) {
                dispatch(loadTimeline(timeline, alert));
            }
        });
    };
};

// 設定の更新
export const setTimelineSetting = (timeline, setting) => {
    return (dispatch, getState) => {
        timeline.setting = mergeFormData(setting, timeline.setting);
        timeline.tweets = getCustomizedTweets(timeline.tweets, timeline.setting);
        dispatch(resetDisplayTweets(timeline));
        postUpdateTimelines(getState().timelines);
    };
};

// タイムライン一覧の更新リクエスト
export const postUpdateTimelines = (timelines) => {
    const timelineItems = timelines.map((timeline) => {
        const keys = ['type', 'name', 'endpoint', 'iconClass', 'setting'];
        const entries = keys.map((key) => {
            if (key === 'setting') return [key, convertToFormData(timeline[key])];
            return [key, timeline[key]];
        });
        return Object.fromEntries(entries);
    });
    const formData = new FormData();
    formData.append('timelines', JSON.stringify(timelineItems));
    axios.post('/api/account/timeline/items', formData)
        .catch(error => console.error(error));
};
