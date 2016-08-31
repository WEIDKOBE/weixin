;
(function(win) {
  function GetRequest() {
    var url = window.location.search; //获取url中"?"符后的字串
    var theRequest = new Object();
    if (url.indexOf("?") != -1) {
      var str = url.substr(1);
      strs = str.split("&");
      for (var i = 0; i < strs.length; i++) {
        //就是这句的问题
        theRequest[strs[i].split("=")[0]] = decodeURI(strs[i].split("=")[1]);
        //之前用了unescape()
        //才会出现乱码
      }
    }
    return theRequest;
  }
  var Request = new Object();
  Request = GetRequest();
  //console.log( Request['a'] );


  if (Request['nope'] == undefined) {
    addr = root + '/rest/hotel/getHotelList';
    //console.log(addr);

  } else {
    addr = root + '/rest/hotel/list/query?hotelname=' + Request['nope'];
  }
  var hotelList = {
    getData: function() {
      // console.log(addr);
      var self = this;
      $.ajax({
        url: addr,
        type: 'POST',
        dataType: 'json',
        contentType: 'application/json;charset=UTF-8',
        success: function(result) {
          if (result.hotelList) {
            result = result.hotelList;
          } else {
            result = result;
          }
          var length = result.length;
           console.log(result);

          var data = self.processData(result);
          self.render(data);
          self.bindEvent();
          $load.addClass('hidden');
        }
      });
    },
    processData: function(result) {
      var data = result;
      //console.log(data);

      if (data && data.length > 0) {

      } else {
        data = [];
      }
      return data;
    },
    render: function(data) {
      var tmpl = $('#listTmpl').html();
      var render = doT.template(tmpl);
      var html = render(data);
      $('#hotel-list').html(html);
    },
    bindEvent: function() {
      var self = this;
      $('#hotel-list').on('click', '.switcha', function() {
        var $selfSwitchBtn = $(this);
        var hotelName = $(this).data('name');
        var currentHotelId = $(this).data('id');
        if (!$(this).hasClass('switcha-on')) {
          _amain.Messager.confirm("是否要开放 " + hotelName + " 的预定?", function() {
            _Jquery.get(root + '/rest/hotel/openHotelBook?hotelId=' + currentHotelId, function(result) {
              if (result.code == 100) {
                _amain.Messager.alert(result.msg);
                $selfSwitchBtn.addClass('switcha-on');
              } else {
                _amain.Messager.alert(result.msg);
              }
            });
            // console.log("TODO ：开启酒店预订服务调用，并回显。");
          });
        } else {
          _amain.Messager.confirm("是否要关闭 " + hotelName + " 的预定?", function() {
            _Jquery.get(root + '/rest/hotel/closeHotelBook?hotelId=' + currentHotelId, function(result) {
              if (result.code == 100) {
                _amain.Messager.alert(result.msg);
                $selfSwitchBtn.removeClass('switcha-on');
              } else {
                _amain.Messager.alert(result.msg);
              }
            });
            // console.log("TODO ：关闭酒店预订服务调用，并回显。");
          });
        }
      });


      //编辑酒店
      $('#hotel-list').on("click", ".photel-li-name", function() {
        util.goByUrl("./roomList.html?hotelId=" + $(this).data('id') + '&hotelName=' + $(this).data('name'));
      });
    },
    init: function() {
      var self = this;
      self.getData();
    }
  }
  hotelList.init();
})(window)