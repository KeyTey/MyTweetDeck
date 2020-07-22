import React, { Component } from 'react';
import LikeButton from './LikeButton';
import RetweetButton from './RetweetButton';

export default class TweetFooter extends Component {
    render() {
        return (
            <div className="d-flex w-100 justify-content-around">
                <RetweetButton
                    tweet={this.props.tweet}
                    timelineIndex={this.props.timelineIndex}
                    tweetIndex={this.props.tweetIndex}
                    action={this.props.action}
                />
                <LikeButton
                    tweet={this.props.tweet}
                    timelineIndex={this.props.timelineIndex}
                    tweetIndex={this.props.tweetIndex}
                    action={this.props.action}
                />
            </div>
        );
    }
}
