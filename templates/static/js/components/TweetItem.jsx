import React, { Component } from 'react';
import TweetHeader from './TweetHeader';
import TweetContent from './TweetContent';
import TweetPictures from './TweetPictures';
import TweetVideo from './TweetVideo';
import TweetFooter from './TweetFooter';

export default class TweetItem extends Component {
    constructor(props) {
        super(props);
        this.handleKeyDown = (e) => {
            const timelineIndex = this.props.timelineIndex;
            const tweetIndex = this.props.tweetIndex;
            const tweetItem = (i, j) => $(`.tweet-item[timelineIndex='${i}'][tweetIndex='${j}']`);
            // 左キー
            if (e.keyCode == 37) {
                tweetItem(timelineIndex - 1, 0).focus();
            }
            // 上キー
            else if(e.keyCode == 38) {
                tweetItem(timelineIndex, tweetIndex - 1).focus();
            }
            // 右キー
            else if(e.keyCode == 39) {
                tweetItem(timelineIndex + 1, 0).focus();
            }
            // 下キー
            else if(e.keyCode == 40) {
                tweetItem(timelineIndex, tweetIndex + 1).focus();
            }
            // Fキー
            else if(e.keyCode == 70) {
                tweetItem(timelineIndex, tweetIndex).find('button.favorite').click();
            }
        }
    }
    render() {
        let newItem = this.props.tweet.new ? 'new-item' : '';
        return (
            <div
                className={`tweet-item list-group-item p-1 ${newItem}`}
                timelineIndex={this.props.timelineIndex}
                tweetIndex={this.props.tweetIndex}
                tabindex="0"
                onKeyDown={this.handleKeyDown}
            >
                <TweetHeader tweet={this.props.tweet} />
                <TweetContent tweet={this.props.tweet} />
                <TweetPictures tweet={this.props.tweet} action={this.props.action} />
                <TweetVideo tweet={this.props.tweet} />
                <TweetFooter
                    tweet={this.props.tweet}
                    timelineIndex={this.props.timelineIndex}
                    tweetIndex={this.props.tweetIndex}
                    action={this.props.action}
                />
            </div>
        );
    }
}
