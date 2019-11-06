import React, { Component } from 'react';

export default class TweetButton extends Component {
    render() {
        return (
            <button className="btn btn-primary w-100" data-toggle="modal" data-target="#tweetModal">
                <i className="fas fa-edit"></i>
            </button>
        );
    }
}
