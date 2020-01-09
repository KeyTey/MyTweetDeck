import React, { Component } from 'react';

export default class TweetVideo extends Component {
    render() {
        const videoLink = this.props.tweet.video_link;
        const videoItem = videoLink ? <video className="video" src={videoLink} controls></video> : '';
        return <div className="w-100" onClick="event.cancelBubble=true">{videoItem}</div>;
    }
}
