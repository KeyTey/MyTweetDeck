import React, { Component } from 'react';

export default class TweetContent extends Component {
    render() {
        return <p className="tweet-content mb-1">{this.props.tweet.full_text}</p>;
    }
}
