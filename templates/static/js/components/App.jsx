import React, { Component } from 'react';
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
        this.getTimeline = (idx, url) => {
            let timelines = this.state.timelines;
            timelines[idx].load = true;
            this.setState({ timelines: timelines });
            $.ajax({
                url: url,
                dataType: "json"
            })
            .then(
                data => {
                    if (data.tweets.length === 0) {
                        this.addNotice("danger", "Load failed.");
                    }
                    else {
                        const tweetIDs = timelines[idx].tweets.map(tweet => tweet.id_str);
                        data.tweets.forEach((tweet, i) => {
                            if (tweetIDs.includes(tweet.id_str)) data.tweets[i].new = false;
                            else data.tweets[i].new = true;
                        });
                        this.updateTimeline(idx, data.tweets);
                    }
                    timelines[idx].load = false;
                    this.setState({ timelines: timelines });
                },
                error => console.log(error)
            );
        }
        this.addTimeline = (idx, timeline) => {
            let timelines = this.state.timelines;
            timelines.push({ id: idx, name: timeline.name, url: timeline.url, icon: timeline.icon, tweets: [] })
            this.setState({ timelines: timelines });
            this.getTimeline(timelines.length - 1, timeline.url);
        }
        this.removeTimeline = (idx) => {
            let timelines = this.state.timelines;
            timelines = timelines.filter(timeline => timeline.id !== idx);
            this.setState({ timelines: timelines });
        }
        this.updateTimeline = (idx, tweets) => {
            let timelines = this.state.timelines;
            timelines[idx].tweets = tweets;
            this.setState({ timelines: timelines });
        }
        this.updateTweet = (timelineIndex, tweetIndex, tweet) => {
            let tweets = this.state.timelines[timelineIndex].tweets;
            tweets[tweetIndex] = tweet;
            this.updateTimeline(timelineIndex, tweets);
        }
        this.addNotice = (status, text) => {
            let notices = this.state.notices;
            notices.push({ status: status, text: text });
            this.setState({ notices: notices });
            setTimeout(() => {
                let notices = this.state.notices;
                notices.shift();
                this.setState({ notices: notices });
            }, 3000);
        }
        this.action = {
            updateState: this.updateState,
            getTimeline: this.getTimeline,
            addTimeline: this.addTimeline,
            removeTimeline: this.removeTimeline,
            updateTimeline: this.updateTimeline,
            updateTweet: this.updateTweet,
            addNotice: this.addNotice
        };
    }
    render() {
        return (
            <div>
                <Sidebar action={this.action} />
                <div className="timeline-container">
                    {this.state.timelines.map((timeline, idx) => {
                        return <Timeline
                            timeline={timeline}
                            timelineIndex={idx}
                            action={this.action}
                        />;
                    })}
                </div>
                <TweetModal action={this.action} />
                <RetweetModal
                    modal={this.state.modal}
                    timelines={this.state.timelines}
                    action={this.action}
                />
                <MediaModal modal={this.state.modal} />
                <div className="notice-container">
                    {this.state.notices.map(notice => <Alert notice={notice} />)}
                </div>
            </div>
        );
    }
}
