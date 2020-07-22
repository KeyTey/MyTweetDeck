import React, { Component } from 'react';

export default class SettingModal extends Component {
    constructor(props) {
        super(props);
        this.getButton = (key) => {
            if (this.props.setting[key]) {
                return <button className="btn-on btn-sm" onClick={() => this.handleClick(key)}>ON</button>;
            }
            else {
                return <button className="btn-off btn-sm" onClick={() => this.handleClick(key)}>OFF</button>;
            }
        }
        this.handleClick = (key) => {
            let setting = this.props.setting;
            setting[key] = Boolean(setting[key] ^ true);
            this.props.action.updateState({setting: setting});
        }
        this.logout = () => {
            $.ajax({
                url: "/api/logout",
                type: "POST"
            })
            .then(
                data => location.reload(),
                error => console.error(error)
            );
        }
    }
    render() {
        return (
            <div className="modal" id="settingModal" tabIndex="-1" role="dialog">
                <div className="modal-dialog" role="document">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title">Setting</h5>
                            <button className="close" data-dismiss="modal" aria-label="Close">
                                <span aria-hidden="true">&times;</span>
                            </button>
                        </div>
                        <div className="modal-body">
                            <ul className="list-group">
                                <li className="list-group-item">
                                    {this.getButton('likeByClickTweetPanel')}
                                    Like by clicking on Tweet panel
                                </li>
                                <li className="list-group-item">
                                    {this.getButton('resetScrollByClickOuter')}
                                    Reset scroll by clicking on outside
                                </li>
                                <li className="list-group-item">
                                    <kbd className="keyboard mr-2">N</kbd>New Tweet
                                </li>
                                <li className="list-group-item">
                                    <kbd className="keyboard mr-2">F</kbd>Like
                                </li>
                                <li className="list-group-item">
                                    <kbd className="keyboard mr-2">T</kbd>Retweet
                                </li>
                                <li className="list-group-item">
                                    <kbd className="keyboard mr-1">←</kbd>
                                    <kbd className="keyboard mr-1">→</kbd>
                                    <kbd className="keyboard mr-1">↑</kbd>
                                    <kbd className="keyboard mr-2">↓</kbd>
                                    Move focus to Tweet
                                </li>
                                <li className="list-group-item">
                                    <kbd className="keyboard mr-1">1</kbd>
                                    ...
                                    <kbd className="keyboard ml-1 mr-2">9</kbd>
                                    Column 1 - 9
                                </li>
                                <li className="list-group-item">
                                    <kbd className="keyboard mr-2">0</kbd>Final column
                                </li>
                                <li className="list-group-item">
                                    <kbd className="keyboard mr-2">Esc</kbd>Release focus
                                </li>
                            </ul>
                        </div>
                        <div className="modal-footer">
                            <button className="btn btn-danger" data-dismiss="modal" onClick={this.logout}>Logout</button>
                            <button className="btn btn-secondary" data-dismiss="modal">Close</button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}
