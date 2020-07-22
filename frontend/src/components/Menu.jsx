import React, { Component } from 'react';
import uniqueId from 'lodash/uniqueId';
import Sortable from 'react-sortablejs';

export default class Menu extends Component {
    constructor(props) {
        super(props);
        this.handleChange = (order) => {
            const timelines = order.map(id => this.props.timelines.find(timeline => id === timeline.id));
            this.props.action.updateState({ timelines: timelines }, this.props.action.saveTimelineState);
        }
        this.handleMouseEnter = (id) => {
            $(`#${id} .timeline-name`).css('display', 'inline');
        }
        this.handleMouseLeave = (id) => {
            $(`#${id} .timeline-name`).css('display', 'none');
        }
    }
    render() {
        return (
            <Sortable tag="ul" className="sidebar-nav sidebar-middle" onChange={this.handleChange}>
                {this.props.timelines.map((timeline) => {
                    return (
                        <li id={timeline.id} key={uniqueId()} data-id={timeline.id}>
                            <button
                                className="btn btn-secondary w-100"
                                onMouseEnter={() => this.handleMouseEnter(timeline.id)}
                                onMouseLeave={() => this.handleMouseLeave(timeline.id)}
                            >
                                <i className={timeline.icon}></i>
                            </button>
                            <div className="timeline-name alert">
                                {timeline.name}
                            </div>
                        </li>
                    );
                })}
            </Sortable>
        );
    }
}
