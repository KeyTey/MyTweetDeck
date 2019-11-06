import React, { Component } from 'react';
import TweetHeader from './TweetHeader';
import TweetContent from './TweetContent';
import TweetPictures from './TweetPictures';
import TweetVideo from './TweetVideo';
import TweetFooter from './TweetFooter';

export default class TweetItem extends Component {
    render() {
        let newItem = this.props.tweet.new ? 'new-item' : '';
        return (
            <div className={`list-group-item p-1 ${newItem}`}>
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
