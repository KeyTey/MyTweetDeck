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
var keyList = new Array(37, 38, 39, 40);

// 矢印スクロール無効化
$(document).keydown(function(e) {
     var key = e.which;
      if($.inArray(key, keyList) > -1) {
          e.preventDefault();
          return false;
      }
      return true;
});
