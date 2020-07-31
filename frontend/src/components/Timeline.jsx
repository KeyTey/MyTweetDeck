import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useAlert } from 'react-alert';
import { loadTimeline, addDisplayTweets } from '../modules/timelines';
import classNames from 'classnames';
import TweetItem from './TweetItem';
import SettingPanel from './SettingPanel';

const Timeline = (props) => {
    const dispatch = useDispatch();
    const alert = useAlert();
    const setting = useSelector(state => state.setting);
    const [panelHeight, setPanelHeight] = useState(0);
    const { timeline } = props;

    // 設定パネルの高さ取得
    const getPanelHeight = (e) => {
        const settingPanel = $(e.target).closest('.timeline').find('.setting-panel');
        return $(settingPanel).get(0).scrollHeight;
    };

    // タイムラインのロード + スクロールのリセット
    const clickNavBar = (e) => {
        dispatch(loadTimeline(timeline, alert));
        $(e.target).closest('.timeline').find('.tweet-container').animate({ scrollTop: 0 }, 200);
    };

    // 設定パネルの開閉
    const toggleSettingPanel = (e) => {
        e.stopPropagation();
        setPanelHeight(panelHeight === 0 ? getPanelHeight(e) : 0);
    };

    // 設定パネルを開く (条件付き)
    const openSettingPanel = (e) => {
        if (setting.toggleSettingByMouseOverOut.enabled) {
            setPanelHeight(getPanelHeight(e));
        }
    };

    // 設定パネルを閉じる (条件付き)
    const closeSettingPanel = () => {
        if (setting.toggleSettingByMouseOverOut.enabled) {
            setPanelHeight(0);
        }
    };

    // 下部までスクロールした場合 -> 表示ツイートの追加
    const scrollContainer = (e) => {
        const { scrollTop, scrollHeight, clientHeight } = e.target;
        if (scrollTop + clientHeight > scrollHeight - 200) {
            dispatch(addDisplayTweets(timeline, 10));
        }
    };

    // 高さ調整
    const panelStyle = { height: panelHeight };
    const containerStyle = { height: `calc(100% - 40px - ${panelHeight}px)` };

    // コンポーネント
    const loadingItem = (
        <span className="spinner-border text-secondary" onClick={toggleSettingPanel} onMouseEnter={openSettingPanel} />
    );
    const settingButton = (
        <span className="setting-btn" onClick={toggleSettingPanel} onMouseEnter={openSettingPanel}>
            <i className="fas fa-cog"></i>
        </span>
    );
    const tweets = timeline.tweets.filter(tweet => tweet.display && tweet.matched);
    const tweetItems = tweets.map((tweet) => <TweetItem key={tweet.id} timeline={timeline} tweet={tweet} />);

    return (
        <li className="timeline" onMouseLeave={closeSettingPanel}>
            <nav className="navbar navbar-light border" onClick={clickNavBar}>
                <span className="navbar-brand text-truncate w-75">
                    <i className={classNames(timeline.iconClass, 'handle', 'mr-2')}></i>
                    <span className="header">{timeline.name}</span>
                </span>
                {timeline.isLoading ? loadingItem : settingButton}
            </nav>
            <SettingPanel timeline={timeline} style={panelStyle} />
            <div className="tweet-container" style={containerStyle} onScroll={scrollContainer} onMouseEnter={closeSettingPanel}>
                {tweetItems}
            </div>
        </li>
    );
};

export default Timeline;
