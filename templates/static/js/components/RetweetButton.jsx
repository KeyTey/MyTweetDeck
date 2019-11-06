import React, { Component } from 'react';

export default class RetweetButton extends Component {
    constructor(props) {
        super(props);
        this.handleClick = () => {
            const tweetID = this.props.tweet.id_str;
            const timelineIndex = this.props.timelineIndex;
            const tweetIndex = this.props.tweetIndex;
            this.props.action.updateState({
                modal: {
                    tweetID: tweetID, timelineIndex: timelineIndex, tweetIndex: tweetIndex
                }
            });
        }
    }
    render() {
        const tweet = this.props.tweet;
        const retweetStyle = tweet.retweeted ? { color: "green" } : { color: "gray" };
        return (
            <button className="retweet btn btn-light border w-50 p-0" data-toggle="modal" data-target="#retweetModal" onClick={this.handleClick}>
                <i className="fas fa-retweet mr-1" style={retweetStyle}></i>{tweet.retweet_count}
            </button>
        );
    }
}
