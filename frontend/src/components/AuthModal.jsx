import React, { Component } from 'react';

export default class AuthModal extends Component {
    constructor(props) {
        super(props);
        this.endpoint = '';
    }
    componentDidMount() {
        $('#authModal').modal('show');
        $.ajax({
            url: '/api/auth',
            dataType: 'json'
        })
        .then(
            data => this.endpoint = data,
            error => console.error(error)
        );
    }
    render() {
        return (
            <div className="modal fade" id="authModal" tabIndex="-1" role="dialog">
                <div className="modal-dialog" role="document">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h6 className="modal-title">Log in with your Twitter account</h6>
                        </div>
                        <div className="modal-body text-center">
                            <a href={this.endpoint}>
                                <button className="btn btn-primary font-weight-bold w-50">Log in</button>
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}
