import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useAlert } from 'react-alert';
import { postLike } from '../modules/timelines';
import { status } from '../modules/user';
import classNames from 'classnames';

const LikeButton = (props) => {
    const dispatch = useDispatch();
    const alert = useAlert();
    const user = useSelector(state => state.user);
    const { tweet } = props;

    // いいねボタンのクリックイベント
    const clickButton = (e) => {
        e.stopPropagation();
        // ゲストユーザーの場合 -> 認証モーダル表示
        if (user.status === status.GUEST) {
            $('.modal').modal('hide');
            $('#authModal').modal('show');
            return;
        }
        // いいね実行
        dispatch(postLike(tweet.id, alert));
    };

    // いいねボタンのクラス
    const buttonClass = classNames('action', { 'liked active': tweet.liked });

    return (
        <span className={buttonClass} onClick={clickButton}>
            <i className="fas fa-heart mr-1"></i>
            {tweet.likeCount}
        </span>
    );
};

export default LikeButton;
