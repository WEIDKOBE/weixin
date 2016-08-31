'use strict';;
(function(win) {

  $(".hotel-info-search-icon").on("click", function() {
    // window.location.href = 'hotel-search.html';
    location.assign('hotel-search.html');
  });

  var allHotel = {
    getData: function() {
      var self = this;
      $.ajax({
        url: root + '/rest/hotel/list/query',
        type: 'POST',
        dataType: 'json',
        contentType: 'application/json;charset=UTF-8',
        success: function(result) {
          if (result.closeTodayHotel == 1) {
            $('.all').addClass("switcha-on");
            self.bindEvent();
          } else {
            $('.all').removeClass("switcha-on");
            self.bindEvent();
          }
          $load.addClass('hidden');
        }
      });
    },
    bindEvent: function() {
      var self = this;
      $('#close-room').on('click', '.all', function() {
        var $selfSwitchBtn = $(this);
        if ($(this).hasClass('switcha-on')) {
          _amain.Messager.confirm("全部开放当日房?", function() {
            _Jquery.get(root + '/rest/supplier/closeTodayHotel/close', function(result) {
              console.log(result);
              if (result.code == 100) {
                _amain.Messager.alert(result.msg);
                $selfSwitchBtn.removeClass('switcha-on');
              } else {
                _amain.Messager.alert(result.msg);
              }
            });
            // console.log("TODO ：关闭全部关闭当日房，并回显。");
          });
        } else {
          _amain.Messager.confirm("全部关闭当日房?", function() {
            _Jquery.get(root + '/rest/supplier/closeTodayHotel/open', function(result) {
              console.log(result);
              if (result.code == 100) {
                _amain.Messager.alert(result.msg);
                $selfSwitchBtn.addClass('switcha-on');
              } else {
                _amain.Messager.alert(result.msg);
              }
            });
            // console.log("TODO ：开启全部关闭当日房，并回显。");
          });
        }
      });
    },

    init: function() {
      var self = this;
      self.getData();
    }
  }
  allHotel.init();
})(window)