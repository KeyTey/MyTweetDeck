import React, { Component } from 'react';

export default class RetweetModal extends Component {
    constructor(props) {
        super(props);
        this.handleClick = () => {
            $.ajax({
                url: "/api/retweet",
                dataType: "json",
                type: "POST",
                data: { id: this.props.modal.tweetID }
            })
            .then(
                data => {
                    if (data.status === 200) {
                        const timelineIndex = this.props.modal.timelineIndex;
                        const tweetIndex = this.props.modal.tweetIndex;
                        let tweet = this.props.timelines[timelineIndex].tweets[tweetIndex];
                        tweet.retweet_count++;
                        tweet.retweeted = true;
                        this.props.action.updateTweet(timelineIndex, tweetIndex, tweet);
                        this.props.action.addNotice("success", "Retweet succeeded.");
                    }
                    else {
                        this.props.action.addNotice("danger", "Retweet failed.");
                    }
                },
                error => console.log(error)
            );
        }
    }
    render() {
        return (
            <div className="modal fade" id="retweetModal" tabindex="-1" role="dialog">
                <div className="modal-dialog" role="document">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title">Confirmation</h5>
                            <button className="close" data-dismiss="modal" aria-label="Close">
                                <span aria-hidden="true">&times;</span>
                            </button>
                        </div>
                        <div className="modal-body">
                            <p>Are you sure you want to RT?</p>
                        </div>
                        <div className="modal-footer">
                            <button className="btn btn-secondary" data-dismiss="modal">Close</button>
                            <button className="btn btn-primary" data-dismiss="modal" onClick={this.handleClick}>Retweet</button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}
