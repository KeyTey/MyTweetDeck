import React, { Component } from 'react';
import TweetContent from './TweetContent';
import TweetPictures from './TweetPictures';
import TweetVideo from './TweetVideo';

export default class QuotedItem extends Component {
    render() {
        const style = {'margin-bottom': '5px'};
        return (
            <div className={`tweet-item list-group-item p-1`} style={style} onClick="event.cancelBubble=true">
                <TweetHeader tweet={this.props.tweet} />
                <TweetContent tweet={this.props.tweet} />
                <TweetPictures tweet={this.props.tweet} action={this.props.action} />
                <TweetVideo tweet={this.props.tweet} />
            </div>
        );
    }
}

class TweetHeader extends Component {
    render() {
        const tweet = this.props.tweet;
        const iconStyle = {'height': '20px'};
        const nameStyle = {'font-weight': 'bold', 'font-size': '14px'};
        return (
            <div className="d-flex w-100 mb-1">
                <a href={`https://twitter.com/${tweet.user.screen_name}`} target="_blank">
                    <img src={tweet.user.profile_image_url} className="rounded-circle border" style={iconStyle} />
                </a>
                <p className="ml-1 my-auto text-truncate w-100" style={nameStyle}>
                    <a href={`https://twitter.com/${tweet.user.screen_name}`} target="_blank">
                        {tweet.user.name}
                    </a>
                </p>
                <small>
                    <a href={`https://twitter.com/${tweet.user.screen_name}/status/${tweet.id_str}`} target="_blank">
                        {tweet.time}
                    </a>
                </small>
            </div>
        );
    }
}
