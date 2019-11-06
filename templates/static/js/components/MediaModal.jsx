import React, { Component } from 'react';

export default class MediaModal extends Component {
    render() {
        return (
            <div className="modal fade" id="mediaModal" tabindex="-1" role="dialog">
                <div className="modal-dialog" role="document">
                    <img className="img-thumbnail" src={this.props.modal.mediaLink} />
                </div>
            </div>
        );
    }
}
