import React, { Component } from 'react';
import TweetItem from './TweetItem';
import SettingPanel from './SettingPanel';

export default class Timeline extends Component {
    constructor(props) {
        super(props);
        this.state = {
            open: false
        };
        this.handleClick = (e) => {
            e.stopPropagation();
            const open = Boolean(this.state.open ^ true);
            this.setState({open: open});
        }
    }
    render() {
        const loadTimeline = this.props.action.loadTimeline;
        const timelineIndex = this.props.timelineIndex;
        return (
            <li className="timeline">
                <nav className="navbar navbar-light border py-0 pl-2" onClick={() => loadTimeline(timelineIndex)}>
                    <span className="navbar-brand">
                        <i className={`${this.props.timeline.icon} mr-2`}></i>{this.props.timeline.name}
                    </span>
                    <i className="fas fa-cog" onClick={this.handleClick}></i>
                </nav>
                <div className="tweet-container">
                    {(() => {
                        if(this.state.open && !this.props.timeline.load) {
                            return <SettingPanel
                                timeline={this.props.timeline}
                                timelineIndex={timelineIndex}
                                action={this.props.action}
                            />;
                        }
                    })()}
                    {(() => {
                        if(this.props.timeline.load) {
                            return <div className="spinner-grow"></div>;
                        }
                    })()}
                    {(() => {
                        if(!this.props.timeline.load) {
                            return this.props.timeline.tweets.map((tweet, idx) => {
                                return <TweetItem
                                    tweet={tweet}
                                    timelineIndex={timelineIndex}
                                    tweetIndex={idx}
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
