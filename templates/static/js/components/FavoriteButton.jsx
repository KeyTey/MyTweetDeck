import React, { Component } from 'react';

export default class FavoriteButton extends Component {
    constructor(props) {
        super(props);
        this.handleClick = () => {
            $.ajax({
                url: "/api/favorite",
                dataType: "json",
                type: "POST",
                data: {id: this.props.tweet.id_str}
            })
            .then(
                data => {
                    if(data.status === 200) {
                        const timelineIndex = this.props.timelineIndex;
                        const tweetIndex = this.props.tweetIndex;
                        let tweet = this.props.tweet;
                        tweet.favorite_count++;
                        tweet.favorited = true;
                        this.props.action.setTweet(timelineIndex, tweetIndex, tweet);
                        this.props.action.addNotice("success", "Like succeeded.");
                    }
                    else {
                        this.props.action.addNotice("danger", "Like failed.");
                    }
                },
                error => console.log(error)
            );
        }
    }
    render() {
        const tweet = this.props.tweet;
        const favoriteStyle = tweet.favorited ? {color: "red"} : {color: "gray"};
        return (
            <button className="favorite btn btn-light border w-50 p-0" onClick={this.handleClick}>
                <i className="fas fa-heart mr-1" style={favoriteStyle}></i>{tweet.favorite_count}
            </button>
        );
    }
}
