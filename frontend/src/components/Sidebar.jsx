import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useAlert } from 'react-alert';
import { addUserTimeline } from '../modules/timelines';
import { setTrends } from '../modules/dictionary';
import Menu from './Menu';

const Sidebar = () => {
    const dispatch = useDispatch();
    const alert = useAlert();
    const user = useSelector(state => state.user);
    const profileUrl = `https://twitter.com/${user.screenName}`;
    const profileImageUrl = user.profileImageUrl;

    // タイムライン追加ボタンのクリックイベント -> トレンドのセット
    const clickAddButton = () => dispatch(setTrends());

    // アイコンのクリックイベント
    const clickProfileIcon = (e) => {
        // 新しいタブで開く場合
        const isNewTarget = (e.button !== 0 || e.altKey || e.ctrlKey || e.shiftKey || e.metaKey);
        if (isNewTarget) return true;
        // ユーザータイムラインの追加
        dispatch(addUserTimeline(user, alert));
        e.preventDefault();
        return false;
    };

    return (
        <div className="sidebar">
            <ul className="sidebar-nav sidebar-top">
                <li>
                    <button className="tweet-btn btn btn-primary w-100" data-toggle="modal" data-target="#tweetModal">
                        <i className="fas fa-edit"></i>
                    </button>
                </li>
            </ul>
            <Menu />
            <ul className="sidebar-nav sidebar-bottom">
                <li>
                    <button className="btn btn-secondary mb-2 w-100" data-toggle="modal" data-target="#addTimelineModal" onClick={clickAddButton}>
                        <i className="fas fa-plus"></i>
                    </button>
                </li>
                <li>
                    <button className="btn btn-secondary mb-2 w-100" data-toggle="modal" data-target="#settingModal">
                        <i className="fas fa-cog"></i>
                    </button>
                </li>
                <li>
                    <a href={profileUrl} target="_blank" onClick={clickProfileIcon}>
                        <img className="rounded-circle w-100" src={profileImageUrl} />
                    </a>
                </li>
            </ul>
        </div>
    );
};

export default Sidebar;
