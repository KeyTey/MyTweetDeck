import React, { Component } from 'react';

export default class MyIcon extends Component {
    constructor(props) {
        super(props);
        this.state = { user: {} }
    }
    componentDidMount() {
        $.ajax({
            url: "/api/myself",
            dataType: "json"
        })
        .then(
            data => this.setState({ user: data }),
            error => console.log(error)
        );
    }
    render() {
        return (
            <a href={`https://twitter.com/${this.state.user.screen_name}`} target="_blank">
                <img className="rounded-circle w-100" src={this.state.user.profile_image_url} />
            </a>
        );
    }
}
