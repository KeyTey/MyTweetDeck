import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { status, login, logout } from '../../modules/user';
import { toggleSetting } from '../../modules/setting';
import classNames from 'classnames';

const SettingModal = () => {
    const dispatch = useDispatch();
    const user = useSelector(state => state.user);

    // ログインボタン
    const loginButton = <button className="btn btn-primary" data-dismiss="modal" onClick={login}>ログイン</button>;
    // ログアウトボタン
    const clickLogout = () => dispatch(logout());
    const logoutButton = <button className="btn btn-danger" data-dismiss="modal" onClick={clickLogout}>ログアウト</button>;

    return (
        <div className="modal" id="settingModal" tabIndex="-1" role="dialog">
            <div className="modal-dialog" role="document">
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title">設定</h5>
                        <button className="close" data-dismiss="modal" aria-label="Close">
                            <span aria-hidden="true">&times;</span>
                        </button>
                    </div>
                    <div className="modal-body">
                        <SettingList />
                        <KeyShortcuts />
                    </div>
                    <div className="modal-footer">
                        {(user.status === status.GUEST) ? loginButton : (user.status === status.AUTHORIZED) ? logoutButton : null}
                        <button className="btn btn-secondary" data-dismiss="modal">閉じる</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SettingModal;

// 設定リスト
const SettingList = () => {
    const dispatch = useDispatch();
    const setting = useSelector(state => state.setting);

    // 切り替えボタンの取得
    const getSwitchButton = (key) => {
        const enabled = setting[key].enabled;
        const buttonClass = classNames(enabled ? 'btn-on' : 'btn-off', 'btn-sm');
        const buttonText = enabled ? 'ON' : 'OFF';
        const clickButton = () => dispatch(toggleSetting(key));
        return <button className={buttonClass} onClick={clickButton}>{buttonText}</button>;
    };

    return (
        <ul className="list-group">
            {Object.entries(setting).map(([key, settingItem]) => (
                <li className="list-group-item text-truncate" key={key}>
                    {getSwitchButton(key)}
                    {settingItem.description}
                </li>
            ))}
        </ul>
    );
};

// キーボードショートカット
const KeyShortcuts = () => {
    return (
        <ul className="list-group mt-3">
            <li className="list-group-item">
                <kbd className="keyboard mr-2">N</kbd>ツイート
            </li>
            <li className="list-group-item">
                <kbd className="keyboard mr-2">F</kbd>いいね
            </li>
            <li className="list-group-item">
                <kbd className="keyboard mr-2">T</kbd>リツイート
            </li>
            <li className="list-group-item">
                <kbd className="keyboard mr-1">←</kbd>
                <kbd className="keyboard mr-1">→</kbd>
                <kbd className="keyboard mr-1">↑</kbd>
                <kbd className="keyboard mr-2">↓</kbd>
                ツイートへのフォーカスを操作する
            </li>
            <li className="list-group-item">
                <kbd className="keyboard mr-1">1</kbd>
                ...
                <kbd className="keyboard ml-1 mr-2">9</kbd>
                １〜９列目のタイムラインへフォーカスする
            </li>
            <li className="list-group-item">
                <kbd className="keyboard mr-2">0</kbd>最終列のタイムラインへフォーカスする
            </li>
            <li className="list-group-item">
                <kbd className="keyboard mr-2">Esc</kbd>フォーカスを解除する
            </li>
        </ul>
    );
};
