import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useAlert } from 'react-alert';
import { ReactSortable } from 'react-sortablejs';
import { status, checkAuth } from '../modules/user';
import { initTimelines, updateTimelines } from '../modules/timelines';
import { initSetting } from '../modules/setting';
import { loadListDictionary } from '../modules/dictionary';
import Sidebar from './Sidebar';
import Timeline from './Timeline';
import TweetModal from './modal/TweetModal';
import RetweetModal from './modal/RetweetModal';
import ImageModal from './modal/ImageModal';
import AddTimelineModal from './modal/AddTimelineModal';
import SettingModal from './modal/SettingModal';
import AuthModal from './modal/AuthModal';

const App = () => {
    const dispatch = useDispatch();
    const alert = useAlert();
    const user = useSelector(state => state.user);
    const timelines = useSelector(state => state.timelines);
    const setting = useSelector(state => state.setting);

    // 初期化 (ログアウト時)
    useEffect(() => {
        // 認証チェック
        dispatch(checkAuth(() => {
            // タイムラインの初期化
            dispatch(initTimelines(alert));
            // 設定の初期化
            dispatch(initSetting());
            // リスト一覧のロード
            dispatch(loadListDictionary());
        }));
    }, [user.logout]);

    // ステータス変更時 -> ゲストユーザーの場合 -> 認証モーダル表示
    useEffect(() => {
        if (user.status !== status.GUEST) return;
        $('.modal').modal('hide');
        $('#authModal').modal('show');
    }, [user.status]);

    // キーイベント
    useEffect(() => { $(window).keydown(handleKeyDown) }, []);

    // 画面外のクリックイベント
    const clickOuter = (e) => {
        if (e.target !== e.currentTarget) return;
        // スクロールのリセット
        if (setting.resetScrollByClickOuter.enabled && $(':focus').length === 0) resetScroll();
        // ゲストユーザーの場合 -> 認証モーダル表示
        if (user.status === status.GUEST) {
            $('.modal').modal('hide');
            $('#authModal').modal('show');
        }
    };

    // タイムラインリストが空でない場合のみ更新する
    const setList = (timelines) => (timelines.length > 0) && dispatch(updateTimelines(timelines));

    const options = {
        handle: '.handle',
        dragClass: 'drag',
        animation: 300
    };

    const containerStyle = { width: 280 * timelines.length };
    const timelineItems = timelines.map((timeline) => <Timeline key={timeline.id} timeline={timeline} />);

    return (
        <div className="main" onClick={clickOuter} onClick={clickOuter}>
            <Sidebar />
            <ReactSortable className="timeline-container" style={containerStyle} list={timelines} setList={setList} {...options}>
                {timelineItems}
            </ReactSortable>
            <TweetModal />
            <RetweetModal />
            <ImageModal />
            <AddTimelineModal />
            <SettingModal />
            <AuthModal />
        </div>
    );
};

export default App;

// スクロールのリセット
const resetScroll = () => $('.tweet-container').animate({ scrollTop: 0 }, 200);

// キーハンドル
const handleKeyDown = (e) => {
    const tagName = $(':focus').prop('tagName');
    if (tagName === 'INPUT' || tagName === 'TEXTAREA') return;
    const [LEFT, DOWN, ZERO, ONE, NINE, N, ESC] = [37, 40, 48, 49, 57, 78, 27];
    const [timelineClass, tweetClass] = ['.timeline', '.tweet-item'];
    // 矢印キー (ツイートへフォーカス)
    if (LEFT <= e.keyCode && e.keyCode <= DOWN) {
        e.preventDefault();
        const tweetItems = $(tweetClass);
        if ($(tweetItems).length === 0) return;
        if ($(tweetItems).siblings(':focus').length === 0) $(tweetItems)[0].focus();
    }
    // 数字キー (タイムラインへフォーカス)
    else if (ZERO <= e.keyCode && e.keyCode <= NINE) {
        const timelineItems = $(timelineClass);
        const index = (e.keyCode === ZERO) ? $(timelineItems).length - 1 : e.keyCode - ONE;
        const timelineItem = $(timelineItems)[index];
        const tweetItems = $(timelineItem).find(tweetClass);
        if ($(tweetItems).length > 0) $(tweetItems)[0].focus();
    }
    // Nキー (ツイートモーダル表示)
    else if (e.keyCode === N) {
        $('.modal').modal('hide');
        $('#tweetModal').modal('show');
    }
    // Escキー (フォーカス解除)
    else if (e.keyCode === ESC) {
        // フォーカスが存在しない場合 -> スクロールのリセット
        if ($(':focus').length === 0) resetScroll();
        $(':focus').blur();
    }
};
