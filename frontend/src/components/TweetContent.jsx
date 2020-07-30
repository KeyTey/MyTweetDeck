import React from 'react';

const TweetContent = (props) => {
    const { tweet } = props;

    return (
        <p className="tweet-content mb-1">
            {tweet.text}
        </p>
    );
};

export default TweetContent;
