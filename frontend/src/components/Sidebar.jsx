import React, { Component } from 'react';
import Menu from './Menu';

export default class Sidebar extends Component {
    render() {
        const user = this.props.user;
        const screen_name = (user === null) ? 'Twitter' : user.screen_name;
        const profile_image_url = (user === null) ? 'public/img/default.png' : user.profile_image_url;
        return (
            <div className="sidebar">
                <ul className="sidebar-nav sidebar-top">
                    <li>
                        <button className="tweet-btn btn btn-primary w-100" data-toggle="modal" data-target="#tweetModal">
                            <i className="fas fa-edit"></i>
                        </button>
                    </li>
                </ul>
                <Menu action={this.props.action} timelines={this.props.timelines} />
                <ul className="sidebar-nav sidebar-bottom">
                    <li>
                        <button className="btn btn-secondary mb-2 w-100" data-toggle="modal" data-target="#addModal">
                            <i className="fas fa-plus"></i>
                        </button>
                    </li>
                    <li>
                        <button className="btn btn-secondary mb-2 w-100" data-toggle="modal" data-target="#settingModal">
                            <i className="fas fa-cog"></i>
                        </button>
                    </li>
                    <li>
                        <a href={`https://twitter.com/${screen_name}`} target="_blank">
                            <img className="rounded-circle w-100" src={profile_image_url} />
                        </a>
                    </li>
                </ul>
            </div>
        );
    }
}
