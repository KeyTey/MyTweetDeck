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
    const [openSetting, setOpenSetting] = useState(false);
    const { timeline } = props;

    // タイムラインのロード + スクロールのリセット
    const clickNavBar = (e) => {
        dispatch(loadTimeline(timeline, alert));
        $(e.target).closest('.timeline').find('.tweet-container').animate({ scrollTop: 0 }, 200);
    };

    // 設定パネルの開閉
    const toggleSettingPanel = (e) => {
        e.stopPropagation();
        setOpenSetting(!openSetting);
    };

    // 設定パネルを開く (条件付き)
    const openSettingPanel = () => {
        if (setting.toggleSettingByMouseOverOut.enabled) {
            setOpenSetting(true);
        }
    };

    // 設定パネルを閉じる (条件付き)
    const closeSettingPanel = () => {
        if (setting.toggleSettingByMouseOverOut.enabled) {
            setOpenSetting(false);
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
    const panelHeight = openSetting ? (44 * Object.keys(timeline.setting).length + 53) : 0;
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
