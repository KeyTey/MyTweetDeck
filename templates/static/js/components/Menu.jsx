import React, { Component } from 'react';
import uniqueId from 'lodash/uniqueId';
import Sortable from 'react-sortablejs';

export default class Menu extends Component {
    constructor(props) {
        super(props);
        this.sortTimeline = (timelines) => {
            timelines.sort((a, b) => {
                if(a.display && !b.display) return -1;
                if(!a.display && b.display) return 1;
                return 0;
            });
            return timelines;
        }
        this.handleClick = (idx, timeline) => {
            let timelines = this.props.timelines;
            if(timeline.display) {
                timelines[idx].display = false;
                timelines[idx].tweets = [];
                timelines = this.sortTimeline(timelines);
            }
            else {
                timelines[idx].display = true;
                timelines = this.sortTimeline(timelines);
                idx = timelines.findIndex(child => timeline.id === child.id);
                this.props.action.loadTimeline(idx);
            }
            this.props.action.updateState({timelines: timelines});
        }
        this.handleChange = (order) => {
            let timelines = order.map(id => this.props.timelines.find(timeline => id === timeline.id));
            timelines = this.sortTimeline(timelines);
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
