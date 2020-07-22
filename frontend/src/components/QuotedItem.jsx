import React, { Component } from 'react';
import TweetHeader from './TweetHeader';
import TweetContent from './TweetContent';
import TweetPictures from './TweetPictures';
import TweetVideo from './TweetVideo';

export default class QuotedItem extends Component {
    render() {
        const style = { 'marginBottom': '5px' };
        return (
            <div className={`tweet-item list-group-item p-1`} style={style} onClick={e => e.stopPropagation()}>
                <TweetHeader tweet={this.props.tweet} action={this.props.action} small={true} />
                <TweetContent tweet={this.props.tweet} action={this.props.action} small={true} />
                <TweetPictures tweet={this.props.tweet} action={this.props.action} />
                <TweetVideo tweet={this.props.tweet} />
            </div>
        );
    }
}
