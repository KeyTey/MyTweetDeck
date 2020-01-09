import React, { Component } from 'react';

export default class SettingButton extends Component {
    render() {
        return (
            <button
                className="btn btn-secondary mb-2 w-100"
                data-toggle="modal"
                data-target="#settingModal"
            >
                <i className="fas fa-cog"></i>
            </button>
        );
    }
}
