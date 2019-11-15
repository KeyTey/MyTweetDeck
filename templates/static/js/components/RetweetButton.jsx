import React, { Component } from 'react';

export default class RetweetButton extends Component {
    constructor(props) {
        super(props);
        this.handleClick = () => {
            this.props.action.updateState({
                modal: {
                    tweet: this.props.tweet,
                    timelineIndex: this.props.timelineIndex,
                    tweetIndex: this.props.tweetIndex
                }
            });
        }
    }
    render() {
        const tweet = this.props.tweet;
        const retweetStyle = tweet.retweeted ? { color: "green" } : { color: "gray" };
        return (
            <button
                className="retweet btn btn-light border w-50 p-0"
                data-toggle="modal"
                data-target="#retweetModal"
                onClick={this.handleClick}
            >
                <i className="fas fa-retweet mr-1" style={retweetStyle}></i>{tweet.retweet_count}
            </button>
        );
    }
}
