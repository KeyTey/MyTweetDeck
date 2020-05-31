import React, { Component } from 'react';

export default class TopButton extends Component {
    constructor(props) {
        super(props);
        this.handleClick = (e) => {
            e.stopPropagation();
            $(".tweet-container").each((_, container) => {
                $(container).scrollTop(0);
            });
            $(":focus").blur();
        }
    }
    render() {
        const style = {'font-size': '70px', 'color': '#00ACEE', 'cursor': 'pointer'};
        return (
            <div className="top-btn" onClick={this.handleClick}>
                <i className="fas fa-chevron-circle-up" style={style}></i>
            </div>
        );
    }
}
