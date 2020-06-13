import React, { Component } from 'react';

export default class SettingPanel extends Component {
    constructor(props) {
        super(props);
        this.getButton = (key) => {
            if (this.props.timeline.setting[key]) {
                return <button className="btn-on btn-sm" onClick={() => this.handleClick(key)}>ON</button>;
            }
            else {
                return <button className="btn-off btn-sm" onClick={() => this.handleClick(key)}>OFF</button>;
            }
        }
        this.handleClick = (key) => {
            const timeline = this.props.timeline;
            timeline.setting[key] = Boolean(timeline.setting[key] ^ true);
            this.props.action.setTimeline(this.props.timelineIndex, timeline);
            this.props.action.updateTimeline(this.props.timelineIndex);
            this.props.action.saveTimelineState();
        }
        this.removeTimeline = () => {
            const timeline = this.props.timeline;
            this.props.action.removeTimeline(timeline.id);
        }
    }
    render() {
        return (
            <div className="setting-panel rounded-lg">
                <div>
                    <label className="setting-label">Sort by liked count</label>
                    {this.getButton('sortByLikedCount')}
                </div>
                <div>
                    <label className="setting-label">Trim liked tweet</label>
                    {this.getButton('trimLikedTweet')}
                </div>
                <div>
                    <label className="setting-label">Show media tweet</label>
                    {this.getButton('showMediaTweet')}
                </div>
                <div>
                    <label className="setting-label">Make user unique</label>
                    {this.getButton('makeUserUnique')}
                </div>
                <div className="text-center">
                    <button className="btn-remove btn-sm btn-outline-danger" onClick={this.removeTimeline}>Remove</button>
                </div>
            </div>
        );
    }
}
