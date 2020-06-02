import React, { Component } from 'react';
import TweetHeader from './TweetHeader';
import TweetContent from './TweetContent';
import TweetPictures from './TweetPictures';
import TweetVideo from './TweetVideo';
import TweetFooter from './TweetFooter';
import QuotedItem from './QuotedItem';

export default class TweetItem extends Component {
    constructor(props) {
        super(props);
        this.handleKeyCode = (keyCode) => {
            const timelineIndex = this.props.timelineIndex;
            const tweetIndex = this.props.tweetIndex;
            const tweetItem = (i, j) => $(`.tweet-item[timeline-index='${i}'][tweet-index='${j}']`);
            // 左キー (左のタイムラインに移動)
            if (keyCode === 37) {
                tweetItem(timelineIndex - 1, 0).focus();
            }
            // 上キー (上のツイートに移動)
            else if(keyCode === 38) {
                tweetItem(timelineIndex, tweetIndex - 1).focus();
            }
            // 右キー (右のタイムラインに移動)
            else if(keyCode === 39) {
                tweetItem(timelineIndex + 1, 0).focus();
            }
            // 下キー (下のツイートに移動)
            else if(keyCode === 40) {
                tweetItem(timelineIndex, tweetIndex + 1).focus();
            }
            // Fキー (いいね)
            else if(keyCode === 70) {
                tweetItem(timelineIndex, tweetIndex).find('button.favorite').click();
            }
            // Tキー (リツイート)
            else if(keyCode === 84) {
                tweetItem(timelineIndex, tweetIndex).find('button.retweet').click();
            }
            // Escキー (フォーカス解除)
            else if(keyCode === 27) {
                tweetItem(timelineIndex, 0).focus();
                $(":focus").blur();
            }
        }
        this.handleKeyDown = (e) => {
            this.handleKeyCode(e.keyCode);
        }
        this.handleClick = () => {
            if(this.props.setting.likeByClickTweetPanel) {
                this.handleKeyCode(70);
            }
        }
    }
    render() {
        let newItem = this.props.tweet.new ? 'new-item' : '';
        return (
            <div
                className={`tweet-item list-group-item p-1 ${newItem}`}
                timeline-index={this.props.timelineIndex}
                tweet-index={this.props.tweetIndex}
                tabIndex="0"
                onKeyDown={this.handleKeyDown}
                onClick={this.handleClick}
            >
                <TweetHeader tweet={this.props.tweet} />
                <TweetContent tweet={this.props.tweet} />
                <TweetPictures tweet={this.props.tweet} action={this.props.action} />
                <TweetVideo tweet={this.props.tweet} />
                {(() => {
                    if('quoted_status' in this.props.tweet) {
                        return <QuotedItem
                            tweet={this.props.tweet.quoted_status}
                            action={this.props.action}
                        />;
                    }
                })()}
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
