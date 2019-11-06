import React, { Component } from 'react';
import FavoriteButton from './FavoriteButton';
import RetweetButton from './RetweetButton';

export default class TweetFooter extends Component {
    render() {
        return (
            <div className="d-flex w-100 justify-content-around">
                <FavoriteButton
                    tweet={this.props.tweet}
                    timelineIndex={this.props.timelineIndex}
                    tweetIndex={this.props.tweetIndex}
                    action={this.props.action}
                />
                <RetweetButton
                    tweet={this.props.tweet}
                    timelineIndex={this.props.timelineIndex}
                    tweetIndex={this.props.tweetIndex}
                    action={this.props.action}
                />
            </div>
        );
    }
}
