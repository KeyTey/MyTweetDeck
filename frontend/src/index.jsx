import ReactDOM from 'react-dom';
import routes from './routes';

ReactDOM.render(routes, document.getElementById('container'));

// 高さ調整(ロード時)
$(document).ready(() => {
    const height = $(window).height();
    $('.timeline-container').css('height', height + 'px');
});

// 高さ調整(リサイズ時)
$(window).resize(() => {
    const height = $(window).height();
    $('.timeline-container').css('height', height + 'px');
});

// キーイベント
$(document).keydown((e) => {
    if($('textarea:focus').length) return;
    // 矢印キー (ツイートへのフォーカス)
    if([37, 38, 39, 40].includes(e.keyCode)) {
        e.preventDefault();
        if($('.tweet-item:focus').length === 0) {
            $('.tweet-item[timeline-index="0"][tweet-index="0"]').focus();
        }
    }
    // 数字キー (タイムラインへのフォーカス)
    if(48 <= e.keyCode && e.keyCode <= 57) {
        const num = e.keyCode === 48 ? $('.timeline').length - 1 : e.keyCode - 49;
        $(`.tweet-item[timeline-index="${num}"][tweet-index="0"]`).focus();
    }
    // Nキー (ツイート画面)
    if(e.keyCode === 78) {
        $('.tweet-btn').click();
    }
    // Escキー (フォーカス解除)
    if(e.keyCode === 27) {
        // フォーカスが存在しない場合 -> スクロール位置リセット
        if ($(':focus').length === 0) {
            $('.tweet-container').each((_, container) => {
                $(container).scrollTop(0);
            });
        }
        $(':focus').blur();
    }
});
