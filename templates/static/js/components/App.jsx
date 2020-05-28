import React, { Component } from 'react';
import Sidebar from './Sidebar';
import Timeline from './Timeline';
import TweetModal from './TweetModal';
import RetweetModal from './RetweetModal';
import MediaModal from './MediaModal';
import SettingModal from './SettingModal';
import Alert from './Alert';

export default class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            timelines: [],
            notices: [],
            modal: {},
            setting: {
                likeByClickTweetPanel: false
            }
        };
        this.updateState = (state) => {
            this.setState(state);
        }
        this.updateTimeline = (idx) => {
            let timeline = this.state.timelines[idx];
            let tweets = timeline.defaultTweets.concat();
            if (timeline.setting.sortByLikedCount) {
                tweets.sort((a, b) => (b.favorite_count - a.favorite_count));
            }
            if (timeline.setting.trimLikedTweet) {
                tweets = tweets.filter((tweet) => (!tweet.favorited));
            }
            if (timeline.setting.showMediaTweet) {
                tweets = tweets.filter((tweet) => (tweet.media_links.length > 0));
            }
            if (timeline.setting.makeUserUnique) {
                tweets = tweets.filter((tweet, i, tweets) => (
                    tweets.map(tweet => tweet.user.id_str).indexOf(tweet.user.id_str) === i
                ));
            }
            timeline.tweets = tweets;
            this.setTimeline(idx, timeline);
        }
        this.loadTimeline = (idx) => {
            let timeline = this.state.timelines[idx];
            timeline.load = true;
            this.setTimeline(idx, timeline);
            $.ajax({
                url: timeline.url,
                dataType: "json"
            })
            .then(
                data => {
                    let defaultTweets = data.tweets;
                    if (defaultTweets.length === 0) {
                        this.addNotice("danger", "Load failed.");
                    }
                    else {
                        const tweetIDs = timeline.defaultTweets.map(tweet => tweet.id_str);
                        defaultTweets.forEach((tweet, i) => {
                            defaultTweets[i].new = tweetIDs.includes(tweet.id_str) ? false : true;
                        });
                    }
                    timeline.defaultTweets = defaultTweets;
                    timeline.load = false;
                    idx = this.state.timelines.findIndex(child => timeline.id === child.id);
                    this.setTimeline(idx, timeline);
                    this.updateTimeline(idx);
                },
                error => console.error(error)
            );
            const width = 280 * this.state.timelines.filter(timeline => timeline.display).length;
            $(".timeline-container").css("width", width + "px");
        }
        this.setTimeline = (timelineIndex, timeline) => {
            let timelines = this.state.timelines;
            timelines[timelineIndex] = timeline;
            this.setState({timelines: timelines});
        }
        this.saveTimelineState = () => {
            const timelines = this.state.timelines.map(timeline => (
                {id: timeline.id, display: timeline.display, setting: timeline.setting}
            ));
            $.ajax({
                url: "/api/timelines",
                dataType: "json",
                type: "POST",
                data: {timelines: JSON.stringify(timelines)}
            });
        }
        this.setTweet = (timelineIndex, tweetIndex, tweet) => {
            let timelines = this.state.timelines;
            timelines[timelineIndex][tweetIndex] = tweet;
            this.setState({timelines: timelines});
        }
        this.addNotice = (status, text) => {
            let notices = this.state.notices;
            if (!notices.find(notice => notice.display)) notices = [];
            if (notices.length >= 10) notices = [];
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
            loadTimeline: this.loadTimeline,
            setTimeline: this.setTimeline,
            saveTimelineState: this.saveTimelineState,
            setTweet: this.setTweet,
            addNotice: this.addNotice
        };
    }
    componentDidMount() {
        let timelines = [];
        const createTimeline = (id, name, url, icon, display) => ({
            id: id,
            name: name,
            url: url,
            icon: icon,
            display: display,
            load: false,
            defaultTweets: [],
            tweets: [],
            setting: {
                sortByLikedCount: false,
                trimLikedTweet: false,
                showMediaTweet: false,
                makeUserUnique: false
            }
        });
        timelines.push(createTimeline("HOME", "Home", "/api/home_timeline", "fas fa-home", true));
        timelines.push(createTimeline("KAWAII", "Kawaii", "/api/kawaii", "fas fa-grin-hearts", false));
        $.ajax({
            url: "/api/lists",
            dataType: "json"
        })
        .then(
            data => {
                const lists = data.lists;
                lists.forEach((list) => {
                    timelines.push(createTimeline(list.id_str, list.name, `/api/list_timeline/${list.id_str}`, "fas fa-list", false));
                });
                $.ajax({
                    url: "/api/timelines",
                    dataType: "json"
                })
                .then(
                    data => {
                        let timelineDataList = data.timelines;
                        if (timelineDataList !== []) {
                            let sortedTimelines = [];
                            let timelineIds = timelines.map(timeline => timeline.id);
                            timelineDataList = timelineDataList.filter(data => timelineIds.includes(data.id));
                            sortedTimelines = timelineDataList.map(data => {
                                let timeline = timelines.find(timeline => data.id === timeline.id);
                                timeline.display = data.display;
                                timeline.setting = data.setting;
                                return timeline;
                            });
                            timelineIds = sortedTimelines.map(timeline => timeline.id);
                            const newTimelines = timelines.filter(timeline => !timelineIds.includes(timeline.id));
                            timelines = sortedTimelines.concat(newTimelines);
                        }
                        this.setState({timelines: timelines});
                        this.state.timelines.forEach((timeline, idx) => {
                            if (timeline.display) this.loadTimeline(idx);
                        });
                    },
                    error => console.error(error)
                );
            },
            error => console.error(error)
        );
        $.ajax({
            url: "/api/log",
            dataType: "json",
            type: "POST",
            data: {status: "Access to MyTweetDeck"}
        });
    }
    render() {
        return (
            <div>
                <Sidebar action={this.action} timelines={this.state.timelines} />
                <ul className="timeline-container">
                    {this.state.timelines.map((timeline, idx) => {
                        if (timeline.display) {
                            return <Timeline
                                timeline={timeline}
                                timelineIndex={idx}
                                setting={this.state.setting}
                                action={this.action}
                            />;
                        }
                    })}
                </ul>
                <TweetModal action={this.action} />
                <RetweetModal modal={this.state.modal} action={this.action} />
                <MediaModal modal={this.state.modal} />
                <SettingModal setting={this.state.setting} action={this.action} />
                <div className="notice-container">
                    {this.state.notices.map(notice => <Alert notice={notice} />)}
                </div>
            </div>
        );
    }
}
