import React, { Component } from 'react';
import TweetPictures from './TweetPictures';
import TweetVideo from './TweetVideo';

export default class QuotedItem extends Component {
    render() {
        const style = {'margin-bottom': '5px'};
        return (
            <div className={`tweet-item list-group-item p-1`} style={style} onClick={e => e.stopPropagation()}>
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
        const timeStyle = {'font-size': '11px'};
        return (
            <div className="d-flex w-100 mb-1">
                <a href={`https://twitter.com/${tweet.user.screen_name}`} target="_blank">
                    <img src={tweet.user.profile_image_url} className="rounded-circle border" style={iconStyle} />
                </a>
                <p className="ml-1 my-auto text-truncate w-100" style={nameStyle}>
                    <a className="username" href={`https://twitter.com/${tweet.user.screen_name}`} target="_blank">
                        {tweet.user.name}
                    </a>
                </p>
                <small>
                    <a className="text-mute" style={timeStyle} href={`https://twitter.com/${tweet.user.screen_name}/status/${tweet.id_str}`} target="_blank">
                        {tweet.time}
                    </a>
                </small>
            </div>
        );
    }
}

class TweetContent extends Component {
    render() {
        const style = {'color': '#657786', 'font-size': '12px'};
        return <p className="tweet-content text-mute mb-1" style={style}>{this.props.tweet.full_text}</p>;
    }
}
