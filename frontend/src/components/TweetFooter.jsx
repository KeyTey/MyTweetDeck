import React from 'react';
import LikeButton from './LikeButton';
import RetweetButton from './RetweetButton';

const TweetFooter = (props) => {
    const { tweet } = props;

    return (
        <div className="d-flex w-100 justify-content-around">
            <RetweetButton tweet={tweet} />
            <LikeButton tweet={tweet} />
        </div>
    );
};

export default TweetFooter;
