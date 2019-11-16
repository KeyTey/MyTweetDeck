// 高さ調整(ロード時)
$(document).ready(function() {
    hsize = $(window).height() - 40;
    $(".timeline-container").css("height", hsize + "px");
});

// 高さ調整(リサイズ時)
$(window).resize(function() {
    hsize = $(window).height() - 40;
    $(".timeline-container").css("height", hsize + "px");
});

// キーイベント
$(document).keydown(function(e) {
    if($("textarea:focus").length) return;
    // 矢印キー
    if([37, 38, 39, 40].includes(e.keyCode)) {
        e.preventDefault();
        if(!$(".tweet-item:focus").length) {
            $(".tweet-item[timelineIndex='0'][tweetIndex='0']").focus();
        }
    }
    // 数字キー
    if(48 <= e.keyCode && e.keyCode <= 57) {
        const num = e.keyCode === 48 ? $(".timeline").length - 1 : e.keyCode - 49;
        $(`.tweet-item[timelineIndex='${num}'][tweetIndex='0']`).focus();
    }
    // Nキー
    if(e.keyCode === 78) {
        $(".tweet-btn").click();
    }
});
