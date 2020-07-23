import React, { Component } from 'react';

export default class TweetModal extends Component {
    constructor(props) {
        super(props);
        this.state = { content: '' };
        this.handleChange = (e) => {
            this.setState({ content: e.target.value });
        }
        this.handleClick = () => {
            $.ajax({
                url: '/api/tweet',
                dataType: 'json',
                type: 'POST',
                data: { content: this.state.content }
            })
            .then(
                data => {
                    const addNotice = this.props.action.addNotice;
                    if(data.status === 200) addNotice('success', 'Tweet succeeded.');
                    else addNotice('danger', 'Tweet failed.');
                    this.setState({ content: '' });
                },
                error => console.error(error)
            );
        }
    }
    render() {
        return (
            <div className="modal" id="tweetModal" tabIndex="-1" role="dialog">
                <div className="modal-dialog" role="document">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title">Tweet</h5>
                            <button className="close" data-dismiss="modal" aria-label="Close">
                                <span aria-hidden="true">&times;</span>
                            </button>
                        </div>
                        <div className="modal-body">
                            <textarea className="form-control" rows="5" value={this.state.content} onChange={this.handleChange}></textarea>
                        </div>
                        <div className="modal-footer">
                            <button className="btn btn-secondary" data-dismiss="modal">Close</button>
                            <button className="btn btn-primary" data-dismiss="modal" onClick={this.handleClick}>Tweet</button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}
