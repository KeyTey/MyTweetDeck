import React, { Component } from 'react';

export default class TweetContent extends Component {
    render() {
        const tweetContent = this.props.small ? 'tweet-content-small' : 'tweet-content';
        return <p className={`${tweetContent} mb-1`}>{this.props.tweet.full_text}</p>;
    }
}
