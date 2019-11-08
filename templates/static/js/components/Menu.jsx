import React, { Component } from 'react';
import uniqueId from 'lodash/uniqueId';
import Sortable from 'react-sortablejs';

export default class Menu extends Component {
    constructor(props) {
        super(props);
        this.handleClick = (idx, timeline) => {
            let timelines = this.props.timelines;
            if (timeline.display) {
                timelines[idx].display = false;
                timelines[idx].tweets = [];
            }
            else {
                timelines[idx].display = true;
                this.props.action.updateTimeline(idx);
            }
            this.props.action.updateState({timelines: timelines});
        }
        this.handleChange = (order) => {
            const timelines = order.map(id => this.props.timelines.find(timeline => id === timeline.id));
            this.props.action.updateState({timelines: timelines});
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
                {this.props.timelines.map((timeline, idx) => {
                    const btnClass = timeline.display ? "btn-light" : "btn-secondary";
                    const icon = <i className={timeline.icon}></i>;
                    const initial = <span>{timeline.name[0]}</span>;
                    return (
                        <li id={timeline.id} key={uniqueId()} data-id={timeline.id}>
                            <button
                                className={`btn ${btnClass} w-100`}
                                onClick={() => this.handleClick(idx, timeline)}
                                onMouseEnter={() => this.handleMouseEnter(timeline.id)}
                                onMouseLeave={() => this.handleMouseLeave(timeline.id)}
                            >
                                {(timeline.icon === "fas fa-list") ? initial : icon}
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
