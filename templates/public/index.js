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

// 矢印キー
const keyList = new Array(37, 38, 39, 40);

// 矢印スクロール無効化
$(document).keydown(function(e) {
    if($.inArray(e.keyCode, keyList) > -1 && !$("textarea:focus").length) {
        e.preventDefault();
        if(!$(".tweet-item:focus").length) {
            $(`.tweet-item[timelineIndex='0'][tweetIndex='0']`).focus();
        }
    }
});
