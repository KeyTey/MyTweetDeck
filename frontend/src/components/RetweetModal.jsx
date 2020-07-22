import React, { Component } from 'react';

export default class RetweetModal extends Component {
    constructor(props) {
        super(props);
        this.handleClick = () => {
            let tweet = this.props.modal.tweet;
            $.ajax({
                url: '/api/retweet',
                dataType: 'json',
                type: 'POST',
                data: { id: tweet.id_str }
            })
            .then(
                data => {
                    if(data.status === 200) {
                        const timelineIndex = this.props.modal.timelineIndex;
                        const tweetIndex = this.props.modal.tweetIndex;
                        tweet.retweet_count++;
                        tweet.retweeted = true;
                        this.props.action.setTweet(timelineIndex, tweetIndex, tweet);
                        this.props.action.addNotice('success', 'Retweet succeeded.');
                    }
                    else {
                        this.props.action.addNotice('danger', 'Retweet failed.');
                    }
                },
                error => console.error(error)
            );
        }
    }
    render() {
        return (
            <div className="modal" id="retweetModal" tabIndex="-1" role="dialog">
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
