import React, { Component } from 'react';

export default class AddTimelineModal extends Component {
    constructor(props) {
        super(props);
        this.timelines = [];
        this.getButton = (id) => {
            if (this.props.timelines.find(timeline => id === timeline.id)) {
                return (
                    <button className="btn-on btn-sm" onClick={() => this.handleClick(id)}>
                        <i className="fas fa-plus"></i>
                    </button>
                );
            }
            else {
                return (
                    <button className="btn-off btn-sm" onClick={() => this.handleClick(id)}>
                        <i className="fas fa-minus"></i>
                    </button>
                );
            }
        }
        this.handleClick = (id) => {
            let timelines = this.props.timelines;
            if (timelines.find(timeline => id === timeline.id)) {
                this.props.action.removeTimeline(id);
            }
            else {
                const { name, url, icon } = this.timelines.find(timeline => id === timeline.id);
                this.props.action.addTimeline(id, name, url, icon);
            }
        }
    }
    componentDidMount() {
        this.timelines.push({ id: 'HOME', name: 'Home', url: '/api/home_timeline', icon: 'fas fa-home' });
        this.timelines.push({ id: 'KAWAII', name: 'Kawaii', url: '/api/kawaii', icon: 'fas fa-grin-hearts' });
        $.ajax({
            url: '/api/lists',
            dataType: 'json'
        })
        .then(
            data => {
                const lists = data.lists;
                lists.forEach((list) => {
                    const timeline = { id: list.id_str, name: list.name, url: `/api/list_timeline/${list.id_str}`, icon: 'fas fa-bars' };
                    this.timelines.push(timeline);
                });
            },
            error => console.error(error)
        );
    }
    render() {
        return (
            <div className="modal" id="addModal" tabIndex="-1" role="dialog">
                <div className="modal-dialog" role="document">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title">Add Timeline</h5>
                            <button className="close" data-dismiss="modal" aria-label="Close">
                                <span aria-hidden="true">&times;</span>
                            </button>
                        </div>
                        <div className="modal-body">
                            <ul className="list-group">
                                {this.timelines.map((timeline) => {
                                    return (
                                        <li className="list-group-item d-flex justify-content-between align-items-center" key={timeline.id}>
                                            <span>
                                                {this.getButton(timeline.id)}
                                                {timeline.name}
                                            </span>
                                            <i className={timeline.icon}></i>
                                        </li>
                                    );
                                })}
                            </ul>
                        </div>
                        <div className="modal-footer">
                            <button className="btn btn-secondary" data-dismiss="modal">Close</button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}
