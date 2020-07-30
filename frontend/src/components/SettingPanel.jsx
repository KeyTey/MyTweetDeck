import React from 'react';
import { useDispatch } from 'react-redux';
import { setTimelineSetting, removeTimeline } from '../modules/timelines';
import classNames from 'classnames';

const TweetItem = (props) => {
    const dispatch = useDispatch();
    const { timeline, style } = props;

    // 切り替えボタンの取得
    const getSwitchButton = (key) => {
        const enabled = timeline.setting[key].enabled;
        const buttonClass = classNames(enabled ? 'btn-on' : 'btn-off', 'btn-sm');
        const buttonText = enabled ? 'ON' : 'OFF';
        const setting = { [key]: !enabled };
        // 設定の反映 + スクロールの初期化
        const clickButton = (e) => {
            dispatch(setTimelineSetting(timeline, setting));
            $(e.target).closest('.timeline').find('.tweet-container').scrollTop(0);
        };
        return <button className={buttonClass} onClick={clickButton}>{buttonText}</button>;
    };

    // タイムラインの削除
    const clickRemoveButton = () => dispatch(removeTimeline(timeline));

    return (
        <div className="setting-panel rounded-lg" style={style}>
            {Object.entries(timeline.setting).map(([key, settingItem]) => (
                <div key={key}>
                    <label className="setting-label">{settingItem.description}</label>
                    {getSwitchButton(key)}
                </div>
            ))}
            <div className="text-center">
                <button className="btn-remove btn-sm btn-outline-danger" onClick={clickRemoveButton}>Remove</button>
            </div>
        </div>
    );
};

export default TweetItem;
