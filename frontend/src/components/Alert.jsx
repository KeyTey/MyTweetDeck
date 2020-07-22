import React, { Component } from 'react';

export default class Alert extends Component {
    render() {
        const className = `alert alert-${this.props.notice.status}`;
        return (
            <div className={className}>
                {this.props.notice.text}
            </div>
        );
    }
}
