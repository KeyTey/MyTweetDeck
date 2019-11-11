import React, { Component } from 'react';

export default class SettingPanel extends Component {
    constructor(props) {
        super(props);
        this.getButton = (key) => {
            if(this.props.timeline.setting[key]) {
                return <button className="btn-on btn-sm" onClick={() => this.handleClick(key)}>ON</button>;
            }
            else {
                return <button className="btn-off btn-sm" onClick={() => this.handleClick(key)}>OFF</button>;
            }
        }
        this.handleClick = (key) => {
            let timeline = this.props.timeline;
            timeline.setting[key] = Boolean(timeline.setting[key] ^ true);
            this.props.action.setTimeline(this.props.timelineIndex, timeline);
            this.props.action.updateTimeline(this.props.timelineIndex);
        }
    }
    componentDidMount() {
        const height = $('.setting-panel').height();
        $('#blank').css('height', height + 'px');
        $('#blank').css('margin-bottom', '5px');
    }
    render() {
        return (
            <div>
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
                        <label className="setting-label">Make user unique</label>
                        {this.getButton('makeUserUnique')}
                    </div>
                </div>
                <div id="blank"></div>
            </div>
        );
    }
}
