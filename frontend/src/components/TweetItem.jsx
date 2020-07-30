import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useAlert } from 'react-alert';
import { postLike } from '../modules/timelines';
import { setModalDataAction } from '../modules/modal';
import { status } from '../modules/user';
import TweetHeader from './TweetHeader';
import TweetContent from './TweetContent';
import TweetImages from './TweetImages';
import TweetVideo from './TweetVideo';
import TweetFooter from './TweetFooter';
import QuotedItem from './QuotedItem';

const TweetItem = (props) => {
    const dispatch = useDispatch();
    const alert = useAlert();
    const user = useSelector(state => state.user);
    const { timeline, tweet } = props;

    // パネルクリック
    const clickPanel = () => {
        if (timeline.setting.likeByClickTweetPanel.enabled) {
            // ゲストユーザーの場合 -> 認証モーダル表示
            if (user.status === status.GUEST) {
                $('.modal').modal('hide');
                $('#authModal').modal('show');
                return;
            }
            // いいね実行
            dispatch(postLike(tweet.id, alert));
        }
    };

    // いいねアクション
    const postLikeAction = () => dispatch(postLike(tweet.id, alert));
    // リツイートアクション
    const sendRetweetId = () => dispatch(setModalDataAction({ retweetId: tweet.id }));

    // 引用ツイート
    const quotedItem = tweet.quotedStatus ? <QuotedItem tweet={tweet.quotedStatus} /> : null;

    return (
        <div className="tweet-item list-group-item p-1" tabIndex="0" onKeyDown={(e) => handleKeyDown(e, postLikeAction, sendRetweetId)} onClick={clickPanel}>
            <TweetHeader tweet={tweet} />
            <TweetContent tweet={tweet} />
            <TweetImages tweet={tweet} />
            <TweetVideo tweet={tweet} />
            {quotedItem}
            <TweetFooter tweet={tweet} />
        </div>
    );
};

export default TweetItem;

// キーハンドル
const handleKeyDown = (e, postLikeAction, sendRetweetId) => {
    const [LEFT, UP, RIGHT, DOWN, F, T] = [37, 38, 39, 40, 70, 84];
    const [timelineClass, tweetClass] = ['.timeline', '.tweet-item'];
    // 左キー (左のタイムラインへフォーカス)
    if (e.keyCode === LEFT) {
        const tweetItems = $(e.target).closest(timelineClass).prev().find(tweetClass);
        if ($(tweetItems).length > 0) $(tweetItems)[0].focus();
    }
    // 右キー (右のタイムラインへフォーカス)
    else if (e.keyCode === RIGHT) {
        const tweetItems = $(e.target).closest(timelineClass).next().find(tweetClass);
        if ($(tweetItems).length > 0) $(tweetItems)[0].focus();
    }
    // 上キー (上のツイートへフォーカス)
    else if (e.keyCode === UP) {
        $(e.target).prev().focus();
    }
    // 下キー (下のツイートへフォーカス)
    else if (e.keyCode === DOWN) {
        $(e.target).next().focus();
    }
    // Fキー (いいね)
    else if (e.keyCode === F) {
        postLikeAction();
    }
    // Tキー (リツイート)
    else if (e.keyCode === T) {
        $('.modal').modal('hide');
        $('#retweetModal').modal('show');
        sendRetweetId();
    }
};
