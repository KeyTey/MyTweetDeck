import React, { Component } from 'react';
import uniqueId from 'lodash/uniqueId';
import Sidebar from './Sidebar';
import Timeline from './Timeline';
import TweetModal from './TweetModal';
import RetweetModal from './RetweetModal';
import MediaModal from './MediaModal';
import Alert from './Alert';

export default class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            timelines: [],
            notices: [],
            modal: {}
        };
        this.updateState = (state) => {
            this.setState(state);
        }
        this.updateTimeline = (idx) => {
            let timelines = this.state.timelines;
            timelines[idx].load = true;
            this.setState({timelines: timelines});
            $.ajax({
                url: timelines[idx].url,
                dataType: "json"
            })
            .then(
                data => {
                    let tweets = data.tweets;
                    if (tweets.length === 0) {
                        this.addNotice("danger", "Load failed.");
                    }
                    else {
                        const tweetIDs = timelines[idx].tweets.map(tweet => tweet.id_str);
                        tweets.forEach((tweet, i) => {
                            tweets[i].new = tweetIDs.includes(tweet.id_str) ? false : true;
                        });
                    }
                    timelines[idx].tweets = tweets;
                    timelines[idx].load = false;
                    this.setState({timelines: timelines});
                },
                error => console.log(error)
            );
            const width = 280 * timelines.filter(timeline => timeline.display).length;
            $(".timeline-container").css("width", width + "px");
        }
        this.updateTweet = (timelineIndex, tweetIndex, tweet) => {
            let timelines = this.state.timelines;
            timelines[timelineIndex][tweetIndex] = tweet;
            this.setState({timelines: timelines});
        }
        this.addNotice = (status, text) => {
            let notices = this.state.notices;
            if (!notices.find(notice => notice.display)) notices = [];
            this.setState({notices: notices});
            notices.push({status: status, text: text, display: true});
            const idx = notices.length - 1;
            this.setState({notices: notices});
            setTimeout(() => {
                let notices = this.state.notices;
                notices[idx].display = false;
                this.setState({notices: notices});
            }, 3000);
        }
        this.action = {
            updateState: this.updateState,
            updateTimeline: this.updateTimeline,
            updateTweet: this.updateTweet,
            addNotice: this.addNotice
        };
    }
    componentDidMount() {
        let timelines = [];
        const createTimeline = (name, url, icon, display) => ({
            id: uniqueId(),
            name: name,
            url: url,
            icon: icon,
            display: display,
            load: false,
            tweets: []
        });
        timelines.push(createTimeline("Home", "/api/home_timeline", "fas fa-home", true));
        timelines.push(createTimeline("Kawaii", "/api/kawaii", "fas fa-venus-mars", false));
        $.ajax({
            url: "/api/lists",
            dataType: "json"
        })
        .then(
            data => {
                const lists = data.lists;
                lists.forEach((list) => {
                    timelines.push(createTimeline(list.name, `/api/list_timeline/${list.id_str}`, "fas fa-list", false));
                });
                this.setState({timelines: timelines});
                this.state.timelines.forEach((timeline, idx) => {
                    if (timeline.display) this.updateTimeline(idx);
                });
            },
            error => console.log(error)
        );
    }
    render() {
        return (
            <div>
                <Sidebar action={this.action} timelines={this.state.timelines} />
                <ul className="timeline-container">
                    {this.state.timelines.map((timeline, idx) => {
                        if(timeline.display) {
                            return <Timeline timeline={timeline} timelineIndex={idx} action={this.action} />;
                        }
                    })}
                </ul>
                <TweetModal action={this.action} />
                <RetweetModal modal={this.state.modal} action={this.action} />
                <MediaModal modal={this.state.modal} />
                <div className="notice-container">
                    {this.state.notices.map(notice => <Alert notice={notice} />)}
                </div>
            </div>
        );
    }
}
