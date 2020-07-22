import React, { Component } from 'react';
import TweetItem from './TweetItem';
import SettingPanel from './SettingPanel';

export default class Timeline extends Component {
    constructor(props) {
        super(props);
        this.state = {
            openSetting: false
        };
        this.handleClick = (e) => {
            e.stopPropagation();
            const openSetting = Boolean(this.state.openSetting ^ true);
            this.setState({openSetting: openSetting});
        }
    }
    render() {
        const loadTimeline = this.props.action.loadTimeline;
        const timelineIndex = this.props.timelineIndex;
        return (
            <li className="timeline">
                <nav className="navbar navbar-light border" onClick={() => loadTimeline(timelineIndex)}>
                    <span className="navbar-brand text-truncate w-75">
                        <i className={`${this.props.timeline.icon} mr-2`}></i>
                        <span className="header">{this.props.timeline.name}</span>
                    </span>
                    <button className="setting-btn btn btn-link" onClick={this.handleClick}>
                        <i className="fas fa-cog"></i>
                    </button>
                </nav>
                {(() => {
                    if(this.state.openSetting && !this.props.timeline.load) {
                        return <SettingPanel
                            timeline={this.props.timeline}
                            timelineIndex={timelineIndex}
                            action={this.props.action}
                        />;
                    }
                })()}
                <div className="tweet-container">
                    {(() => {
                        if(this.props.timeline.load) {
                            return <div className="spinner-grow"></div>;
                        }
                    })()}
                    {(() => {
                        if(!this.props.timeline.load) {
                            return this.props.timeline.tweets.map((tweet, idx) => {
                                return <TweetItem
                                    key={tweet.id_str}
                                    tweet={tweet}
                                    timelineIndex={timelineIndex}
                                    tweetIndex={idx}
                                    setting={this.props.setting}
                                    action={this.props.action}
                                />;
                            });
                        }
                    })()}
                </div>
            </li>
        );
    }
}
