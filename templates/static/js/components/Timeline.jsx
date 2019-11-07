import React, { Component } from 'react';
import TweetItem from './TweetItem';

export default class Timeline extends Component {
    render() {
        const updateTimeline = this.props.action.updateTimeline;
        const timelineIndex = this.props.timelineIndex;
        const loadIcon = this.props.timeline.load ? <div className="spinner-grow"></div> : '';
        return (
            <li className="timeline">
                <nav className="navbar navbar-light border py-0 pl-2" onClick={() => { updateTimeline(timelineIndex) }}>
                    <span className="navbar-brand">
                        <i className={`${this.props.timeline.icon} mr-2`}></i>{this.props.timeline.name}
                    </span>
                </nav>
                <div className="tweet-container">
                    {loadIcon}
                    {this.props.timeline.tweets.map((tweet, idx) => {
                        if (loadIcon) return;
                        return <TweetItem
                            tweet={tweet}
                            timelineIndex={timelineIndex}
                            tweetIndex={idx}
                            action={this.props.action}
                        />;
                    })}
                </div>
            </li>
        );
    }
}
