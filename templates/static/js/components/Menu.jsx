import React, { Component } from 'react';

export default class Menu extends Component {
    constructor(props) {
        super(props);
        this.state = {
            timelines: [
                { name: "Home", url: "/api/home_timeline", icon: "fas fa-home", display: true, load: false },
                { name: "Kawaii", url: "/api/kawaii", icon: "fas fa-venus-mars", display: false, load: false }
            ]
        };
        this.listIcon = "fas fa-list";
        this.handleClick = (idx, timeline) => {
            if (timeline.display) {
                let timelines = this.state.timelines;
                timelines[idx].display = false;
                this.setState({ timelines: timelines });
                this.props.action.removeTimeline(idx);
            }
            else {
                let timelines = this.state.timelines;
                timelines[idx].display = true;
                this.setState({ timelines: timelines });
                this.props.action.addTimeline(idx, timeline);
            }
        }
    }
    componentDidMount() {
        $.ajax({
            url: "/api/lists",
            dataType: "json"
        })
        .then(
            data => {
                const lists = data.lists;
                let timelines = this.state.timelines;
                lists.forEach((list) => {
                    const timeline = {
                        name: list.name,
                        url: `/api/list_timeline/${list.id_str}`,
                        icon: this.listIcon,
                        display: false,
                        load: false
                    };
                    timelines.push(timeline);
                });
                this.setState({ timelines: timelines });
                this.state.timelines.forEach((timeline, idx) => {
                    if (timeline.display) this.props.action.addTimeline(idx, timeline);
                });
            },
            error => console.log(error)
        );
    }
    render() {
        return (
            <ul className="sidebar-nav sidebar-middle">
                {this.state.timelines.map((timeline, idx) => {
                    const btnClass = timeline.display ? "btn-light" : "btn-secondary";
                    const icon = <i className={timeline.icon}></i>;
                    const initial = <span>{timeline.name[0]}</span>;
                    return (
                        <button className={`btn ${btnClass} w-100`} onClick={() => { this.handleClick(idx, timeline) }}>
                            {(timeline.icon === this.listIcon) ? initial : icon}
                        </button>
                    );
                })}
            </ul>
        );
    }
}
