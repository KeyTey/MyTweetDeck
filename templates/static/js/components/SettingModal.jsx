import React, { Component } from 'react';

export default class SettingModal extends Component {
    constructor(props) {
        super(props);
        this.getButton = (key) => {
            if(this.props.setting[key]) {
                return <button className="btn-on btn-sm mr-2" onClick={() => this.handleClick(key)}>ON</button>;
            }
            else {
                return <button className="btn-off btn-sm mr-2" onClick={() => this.handleClick(key)}>OFF</button>;
            }
        }
        this.handleClick = (key) => {
            let setting = this.props.setting;
            setting[key] = Boolean(setting[key] ^ true);
            this.props.action.updateState({setting: setting});
        }
    }
    render() {
        return (
            <div className="modal fade" id="settingModal" tabindex="-1" role="dialog">
                <div className="modal-dialog" role="document">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title">Setting</h5>
                            <button className="close" data-dismiss="modal" aria-label="Close">
                                <span aria-hidden="true">&times;</span>
                            </button>
                        </div>
                        <div className="modal-body">
                            <ul class="list-group">
                                <li class="list-group-item">
                                    {this.getButton('likeByClickTweetPanel')}
                                    Like by clicking on Tweet panel
                                </li>
                                <li class="list-group-item">
                                    <kbd className="keyboard mr-2">N</kbd>New Tweet
                                </li>
                                <li class="list-group-item">
                                    <kbd className="keyboard mr-2">F</kbd>Like
                                </li>
                                <li class="list-group-item">
                                    <kbd className="keyboard mr-2">T</kbd>Retweet
                                </li>
                                <li class="list-group-item">
                                    <kbd className="keyboard mr-1">←</kbd>
                                    <kbd className="keyboard mr-1">→</kbd>
                                    <kbd className="keyboard mr-1">↑</kbd>
                                    <kbd className="keyboard mr-2">↓</kbd>
                                    Move focus to Tweet
                                </li>
                                <li class="list-group-item">
                                    <kbd className="keyboard mr-1">1</kbd>
                                    ...
                                    <kbd className="keyboard ml-1 mr-2">9</kbd>
                                    Column 1 - 9
                                </li>
                                <li class="list-group-item">
                                    <kbd className="keyboard mr-2">0</kbd>Final column
                                </li>
                                <li class="list-group-item">
                                    <kbd className="keyboard mr-2">Esc</kbd>Release focus
                                </li>
                            </ul>
                        </div>
                        <div className="modal-footer">
                            <button className="btn btn-secondary" data-dismiss="modal">Close</button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}
