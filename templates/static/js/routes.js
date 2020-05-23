import React from 'react';
import { HashRouter, Route, hashHistory } from 'react-router-dom';
import App from './components/App';

export default (
    <HashRouter history={hashHistory}>
        <Route path='/' component={App} />
    </HashRouter>
);

// 高さ調整(ロード時)
$(document).ready(function() {
    const height = $(window).height();
    $(".timeline-container").css("height", height + "px");
});

// 高さ調整(リサイズ時)
$(window).resize(function() {
    const height = $(window).height();
    $(".timeline-container").css("height", height + "px");
});

// キーイベント
$(document).keydown(function(e) {
    if($("textarea:focus").length) return;
    // 矢印キー (ツイートへのフォーカス)
    if([37, 38, 39, 40].includes(e.keyCode)) {
        e.preventDefault();
        if(!$(".tweet-item:focus").length) {
            $(".tweet-item[timelineIndex='0'][tweetIndex='0']").focus();
        }
    }
    // 数字キー (タイムラインへのフォーカス)
    if(48 <= e.keyCode && e.keyCode <= 57) {
        const num = e.keyCode === 48 ? $(".timeline").length - 1 : e.keyCode - 49;
        $(`.tweet-item[timelineIndex='${num}'][tweetIndex='0']`).focus();
    }
    // Nキー (ツイート画面)
    if(e.keyCode === 78) {
        $(".tweet-btn").click();
    }
    // Escキー (フォーカス解除)
    if(e.keyCode === 27) {
        document.activeElement.blur();
    }
});

// スリープ防止
// setInterval(() => $.ajax("/api/interval"), 1000 * 60 * 10);
