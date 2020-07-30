import React from 'react';
import { useDispatch } from 'react-redux';
import { useAlert } from 'react-alert';
import { addUserTimeline } from '../modules/timelines';

const TweetHeader = (props) => {
    const dispatch = useDispatch();
    const alert = useAlert();
    const { tweet } = props;

    // ユーザーリンクのクリックイベント
    const clickProfile = (e) => {
        e.stopPropagation();
        // 新しいタブで開く場合
        const isNewTarget = (e.button !== 0 || e.altKey || e.ctrlKey || e.shiftKey || e.metaKey);
        if (isNewTarget) return true;
        // ユーザータイムラインの追加
        dispatch(addUserTimeline(tweet.user, alert));
        e.preventDefault();
        return false;
    };

    const profileUrl = `https://twitter.com/${tweet.user.screenName}`;
    const tweetUrl = `https://twitter.com/${tweet.user.screenName}/status/${tweet.id}`;

    return (
        <div className="d-flex w-100 mb-1">
            <a href={profileUrl} target="_blank" onClick={clickProfile}>
                <img src={tweet.user.profileImageUrl} className="icon rounded-circle border" />
            </a>
            <p className="px-1 my-auto text-truncate font-weight-bold w-100">
                <a className="username" href={profileUrl} target="_blank" onClick={clickProfile}>
                    {tweet.user.name}
                </a>
            </p>
            <small>
                <a className="text-mute" href={tweetUrl} target="_blank" onClick={(e) => e.stopPropagation()}>
                    {tweet.time}
                </a>
            </small>
        </div>
    );
};

export default TweetHeader;
