import React, { Component } from 'react';
import TweetButton from './TweetButton';
import Menu from './Menu';
import MyIcon from './MyIcon';

export default class Sidebar extends Component {
    render() {
        return (
            <div className="sidebar">
                <ul className="sidebar-nav sidebar-top">
                    <li><TweetButton /></li>
                </ul>
                <Menu action={this.props.action} timelines={this.props.timelines} />
                <ul className="sidebar-nav sidebar-bottom">
                    <li><MyIcon /></li>
                </ul>
            </div>
        );
    }
}
