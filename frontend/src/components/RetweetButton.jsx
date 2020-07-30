import React from 'react';
import { useDispatch } from 'react-redux';
import { setModalDataAction } from '../modules/modal';
import classNames from 'classnames';

const RetweetButton = (props) => {
    const dispatch = useDispatch();
    const { tweet } = props;

    // リツイートモーダル表示
    const clickButton = (e) => {
        e.stopPropagation();
        dispatch(setModalDataAction({ retweetId: tweet.id }));
    };

    // リツイートボタンのクラス
    const buttonClass = classNames('action', { 'retweeted active': tweet.retweeted });

    return (
        <span className={buttonClass} data-toggle="modal" data-target="#retweetModal" onClick={clickButton}>
            <i className="fas fa-retweet mr-1"></i>
            {tweet.retweetCount}
        </span>
    );
};

export default RetweetButton;
