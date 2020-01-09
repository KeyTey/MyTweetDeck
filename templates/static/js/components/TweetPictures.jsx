import React, { Component } from 'react';

export default class TweetPictures extends Component {
    constructor(props) {
        super(props);
        this.handleClick = (e, mediaLink) => {
            e.stopPropagation();
            this.props.action.updateState({ modal: { mediaLink: mediaLink } });
        }
    }
    render() {
        return (
            <div className="row mb-0 no-gutters">
                {this.props.tweet.media_links.map((mediaLink) => {
                    return (
                        <div className="col-6">
                            <img
                                src={mediaLink}
                                className="picture border mb-1"
                                data-toggle="modal"
                                data-target="#mediaModal"
                                onClick={(e) => { this.handleClick(e, mediaLink) }}
                            />
                        </div>
                    );
                })}
            </div>
        );
    }
}
