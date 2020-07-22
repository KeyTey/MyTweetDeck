import React, { Component } from 'react';

export default class TweetVideo extends Component {
    render() {
        const videoLink = this.props.tweet.video_link;
        const videoItem = videoLink ? <video className="video" src={videoLink} onClick={e => e.stopPropagation()} controls /> : '';
        return <div className="w-100">{videoItem}</div>;
    }
}
