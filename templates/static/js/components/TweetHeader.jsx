import React, { Component } from 'react';

export default class TweetHeader extends Component {
    render() {
        const tweet = this.props.tweet;
        return (
            <div className="d-flex w-100 mb-1">
                <a href={`https://twitter.com/${tweet.user.screen_name}`} target="_blank" onClick={e => e.stopPropagation()}>
                    <img src={tweet.user.profile_image_url} className="icon rounded-circle border" />
                </a>
                <p className="ml-1 my-auto text-truncate font-weight-bold w-100">
                    <a className="username" href={`https://twitter.com/${tweet.user.screen_name}`} target="_blank" onClick={e => e.stopPropagation()}>
                        {tweet.user.name}
                    </a>
                </p>
                <small>
                    <a className="text-mute" href={`https://twitter.com/${tweet.user.screen_name}/status/${tweet.id_str}`} target="_blank" onClick={e => e.stopPropagation()}>
                        {tweet.time}
                    </a>
                </small>
            </div>
        );
    }
}
