import React from 'react';

const TweetVideo = (props) => {
    const { tweet } = props;
    if (tweet.videoUrls.length === 0) return null;

    return (
        <div className="w-100">
            <video className="video-preview" src={tweet.videoUrls[0]} onClick={(e) => e.stopPropagation()} controls />
        </div>
    );
};

export default TweetVideo;
