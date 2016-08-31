(function(win){

if(!window.util){
  window.util = {};
}
util.scrollEnd = (function() {
  var timeout = null;
  var _onScrollEnd = null;

  var viewData = function(){
    var e = 0, l = 0, i = 0, g = 0, f = 0, m = 0;
    var j = window, h = document, k = h.documentElement;
    e = k.clientWidth || h.body.clientWidth || 0;
    l = j.innerHeight || k.clientHeight || h.body.clientHeight || 0;
    g = h.body.scrollTop || k.scrollTop || j.pageYOffset || 0;
    i = h.body.scrollLeft || k.scrollLeft || j.pageXOffset || 0;
    f = Math.max(h.body.scrollWidth, k.scrollWidth || 0);
    m = Math.max(h.body.scrollHeight, k.scrollHeight || 0, l);
    return {scrollTop: g,scrollLeft: i,documentWidth: f,documentHeight: m,viewWidth: e,viewHeight: l};
  };

  function _onScroll() {
    if (timeout) {
      window.clearTimeout(timeout);
    }
    timeout = setTimeout(function() {
      checkScrollEnd();
    }, 200);
  }

  function checkScrollEnd() {
    var vd = viewData();
    if (vd.viewHeight + vd.scrollTop + 20 >= vd.documentHeight) {
      _onScrollEnd();
    }
  }



  return function(onScrollEnd, enable) {
    _onScrollEnd = onScrollEnd;
    if (enable) {
      window.removeEventListener('scroll', _onScroll, false);
      window.addEventListener('scroll', _onScroll, false);
    } else {
      window.removeEventListener('scroll', _onScroll, false);
    }

  };

})();



var _orderList={};
function init(){
  //_TIME_STAMP_DEFINE_PLACE
  $.ajax({
    url:root + '/rest/supplier/getAccountInfo',
    type: 'GET',
    async: false,
    dataType: 'json',
    contentType:'application/json;charset=UTF-8',
    success: function(result) {
    console.log(result);
      if(result && result.type){
        util.cookie.setItem('supplier_type',result.type);
        util.cookie.setItem('_supplierId',result.id);
      }
    }
  });

  window.$more = $('#myorder-more');
  window.$moreNo = $('#myorder-moreNo');

  //1.初始化 head tab 为房态加链接

  _params = getUrlParams();
  //console.log(_params);
  //2.初始化 下拉框 并绑定 change 事件
  // initSelect();
  //3.初始化订单列表
  if(_params.id && (parseInt(_params.id)+'')!='NaN'){
    getHotel(parseInt(_params.id));
  }else if(sessionStorage.sessionStorage_view_orderList_id){
    getHotel(parseInt(sessionStorage.sessionStorage_view_orderList_id));
    delete sessionStorage.sessionStorage_view_orderList_id;
  }else{
    _orderList.orderType = 20;
    _orderList.id = 0;
    getOrderList();
  }
  if(util.cookie.getItem('supplier_type')==1){
    _orderList.supplierType=1;
    _orderList.orderDetailSelector="#order-detail-type1";
  }else{
    _orderList.supplierType=2;
    _orderList.orderDetailSelector="#order-detail-type1";
  }
  //4.初始化 order-tab 并绑定对应的点击事件
  initOrderTab();
  //5.获取拒绝原因列表
  initRejectReason();
  //6.添加聊天入口
  initChatGate();


  // 7.绑定分页
  initPageData();

  clickCheck();
}
init();

/**************  tab start ****************/

// 筛选功能
var $filterWrap = $("#order_filter_wrap");
var orderFiler = {
  resize: function(){
    var self = this;
    var resizing = null,clientHeight=null,ele=null;
    window.onresize = function() {
      if (resizing) {
        clearTimeout(resizing);
      }
      resizing = setTimeout(self.adjustBase, 100);
    };
  },

  adjustBase: function() {
    var clientHeight = window.innerHeight;
    if( ele = document.querySelectorAll('.citySelector-main')[0]){
      ele.style.height = (clientHeight-70)+'px';
    }
    if( ele = document.querySelectorAll('.citySelector-sub')[0]){
      ele.style.height = (clientHeight-70)+'px';
    }
  },
  renderHotel: function(data){
    var htmlStr = '';
    if(_orderList.id){
      htmlStr = '<div class="citySelector-area"><div class="citySelector-area-name">全部</div><div class="citySelector-checkbox"><div class="aohIcon" data-id="0" data-name="全部酒店"></div></div><div class="common-border"></div></div>';
    } else {
      htmlStr = '<div class="citySelector-area"><div class="citySelector-area-name">全部</div><div class="citySelector-checkbox"><div class="aohIcon aohIconSelect" data-id="0" data-name="全部酒店"></div></div><div class="common-border"></div></div>';
    }

    for(var i=0; i<data.length; i++){
      var hotel = data[i];
      if(_orderList.id == hotel.id){
        htmlStr += '<div class="citySelector-area"><div class="citySelector-area-name">'+hotel.name+'</div><div class="citySelector-checkbox"><div class="aohIcon aohIconSelect" data-id="'+hotel.id+'" data-name="'+hotel.name+'"></div></div><div class="common-border"></div></div>';
      } else {
        htmlStr += '<div class="citySelector-area"><div class="citySelector-area-name">'+hotel.name+'</div><div class="citySelector-checkbox"><div class="aohIcon" data-id="'+hotel.id+'" data-name="'+hotel.name+'"></div></div><div class="common-border"></div></div>';
      }
    }
    $("#order_hotel_area").html(htmlStr);
  },
  renderSeller: function(data){
    var htmlStr = '';
    if(_orderList.id){
      var htmlStr = '<div class="citySelector-area"><div class="citySelector-area-name">全部</div><div class="citySelector-checkbox"><div class="aohIcon" data-id="0" data-name="全部销售"></div></div><div class="common-border"></div></div>';
    } else {
      var htmlStr = '<div class="citySelector-area"><div class="citySelector-area-name">全部</div><div class="citySelector-checkbox"><div class="aohIcon aohIconSelect" data-id="0" data-name="全部销售"></div></div><div class="common-border"></div></div>';
    }
    for(var i=0; i<data.accounts.length; i++){
      var account = data.accounts[i];
      if(_orderList.id == account.id){
        htmlStr += '<div class="citySelector-area"><div class="citySelector-area-name">'+account.name+'</div><div class="citySelector-checkbox"><div class="aohIcon aohIconSelect" data-id="'+account.id+'" data-name="'+account.name+'"></div></div><div class="common-border"></div></div>';
      } else {
        htmlStr += '<div class="citySelector-area"><div class="citySelector-area-name">'+account.name+'</div><div class="citySelector-checkbox"><div class="aohIcon" data-id="'+account.id+'" data-name="'+account.name+'"></div></div><div class="common-border"></div></div>';
      }
    }
    $("#order_seller_area").html(htmlStr);
  },
  getData: function(){
    var self = this;
    $load.removeClass('hidden');
    $.ajax({
      url:root + '/rest/hotel/getHotelList',
      type: 'POST',
      dataType: 'json',
      contentType:'application/json;charset=UTF-8',
      success: function(result) {
        // if(result.returnCode == 100){
          console.log(result);
          self.renderHotel(result);
          $filterWrap.show();
          $load.addClass('hidden');
          setTimeout(function(){
            orderFiler.adjustBase();
          },100);
        // } else {
        //   alert(result.comment || '获取数据失败');
        // }
      }
    });

    $.ajax({
      url:root + '/rest/supplier/getALLEmployeeByRoleId',
      type: 'get',
      dataType: 'json',
      data:{
        roleId:9
      },
      contentType:'application/json;charset=UTF-8',
      success: function(result) {
        if(result.returnCode == 100){
          console.log(result);
          self.renderSeller(result);
        } else{
          alert(result.comment || '获取数据失败');
        }
      }
    });
  },
  getHotelData: function(){
    var self = this;
    $load.removeClass('hidden');
    $.ajax({
      url:root + '/rest/hotel/getHotelList',
      type: 'POST',
      dataType: 'json',
      contentType:'application/json;charset=UTF-8',
      success: function(result) {
        console.log(result);
        $("#order_seller").hide();
        self.renderHotel(result);
        $filterWrap.show();
        $load.addClass('hidden');
        setTimeout(function(){
          orderFiler.adjustBase();
        },100);
      }
    });
  },
  bindEvent: function(){
    var self = this;
    $("#order_filter").on("click",function(){
      var roleId = util.cookie.getItem('__roleId');
      if( roleId == 8 ){
        self.getData();
      } else {
        self.getHotelData();
      }
    });

    var contents = $(".citySelector-areas");
    $(".citySelector-city").on("click",function(){
      $(this).addClass('citySelector-city-selected').siblings('.citySelector-city').removeClass('citySelector-city-selected');
      var content = $(this).data("content");
      contents.hide();
      $("#"+content).show();
    });

     $("#order_btn").on("click",function(){
      var area = $(".citySelector-city-selected").data("content");
      var type = $(".citySelector-city-selected").data("type");
      var id = $("#"+area).find(".aohIconSelect").data("id");
      var name = $("#"+area).find(".aohIconSelect").data("name");
      _orderList.filterName=name;
      _orderList.id=id;

      if(type == "hotel"){
        // https://hotel-test.rsscc.com/supplier/rest/order/getSupplierHotels?id=200000136&roleId=9
        // https://hotel-test.rsscc.com/supplier/rest/order/getSupplierHotels?hotelId=0&pageNum=1&status=20
        // getOrderList(_orderList.orderType,id);
        _orderList.filterType = 0;
        getOrderList();
      } else {
        _orderList.filterType = 1;
        getOrderList();
      }
    });

    $("#order_hotel_area").on("click",".citySelector-area",function(){
      $("#order_hotel_area").find(".aohIcon").removeClass("aohIconSelect");
      $(this).find(".aohIcon").addClass("aohIconSelect");
    });

    $("#order_seller_area").on("click",".citySelector-area",function(){
      $("#order_seller_area").find(".aohIcon").removeClass("aohIconSelect");
      $(this).find(".aohIcon").addClass("aohIconSelect");
    });

  },
  init: function(){
    var self = this;
    self.resize();
    self.bindEvent();
  }
};
orderFiler.init();



// 滚动分页
function initPageData(){
  //绑定事件
  $('#order-list').on('click','.order-item', getHotel);

  window.isLoadingMore = false;
  window.isLoadingMoreNo = false;

  util.scrollEnd(function() {
    window.$moreNo.hide();
    if (isLoadingData) {
      return;
    }
    if (isLoadingMore) {
      return;
    }
    if (isLoadingMoreNo) {
      window.$more.hide();
      //window.$moreNo.show();
      return;
    }

    window.$more.show();
    window.$moreNo.hide();
    var hotelId = $('#my-hotels').val();
    currentPage++;
    loadMorePage();
  }, true);
}

function getOrderList(){
  // https://hotel-test.rsscc.com/supplier/rest/hotel/getSupplierHotels?id=200000136&roleId=9
  // https://hotel-test.rsscc.com/supplier/rest/hotel/getSupplierHotels?hotelId=0&pageNum=1&status=0
  // 0: 酒店  1:销售
  var filterType = _orderList.filterType || 0;
  var orderType = _orderList.orderType || 20;
  var oid = _orderList.id || 0;

  if(window.isLoadingData)return;
  window.hasOrderIds = [];
  window.$moreNo.hide();
  window.$more.hide();
  $load.removeClass('hidden');
  window.isLoadingData == true;
  window.currentPage = 1;
  console.log(orderType);
      $("#order-tab div[value="+orderType+"]").addClass('norder-select').siblings(".norder-item").removeClass('norder-select');

  $('#my-hotels').show();
  //隐藏 orderInfo
  $(_orderList.orderDetailSelector).hide();
  $('#order-list .order-item:gt(0)').remove();
  $('#order-list').show();
  var data = {
    "status":orderType,
    "pageNum": 1
  }
  if(filterType == 1){
    data.supplierId = oid;
    data.hotelId = 0;
  } else{
    data.hotelId = oid;
  }

  $.ajax({
    // url:root + '/rest/order/getOrderList',
    url:root + '/rest/order/getEmployeeOrders',
    type: 'POST',
    data: JSON.stringify(data),
    dataType: 'json',
    contentType:'application/json;charset=UTF-8',
    success: function(result) {
      console.log(result);

      if(JSON.parse(this.data).status!=_orderList.orderType){
        return false;
      };
      result = result || [];
      if(result.length < 20){
        isLoadingMoreNo = true;
      } else {
        isLoadingMoreNo = false;
      }
      var orderListData = getOrderListData(result);
      console.log(orderListData);

         renderOrderList(orderListData);

      if(_orderList.filterName && _orderList.id != 0){
        var finalTxt = '';
        finalTxt+=(_orderList.filterName+'的');
        if(_orderList.orderType == 20){
          finalTxt+='未确认';
        } else if(_orderList.orderType == 17){
          finalTxt+='待办入住';
        } else if(_orderList.orderType == 0){
          finalTxt+='';
        }
        finalTxt+='订单';

        $("#order_filter_tips").html(finalTxt).show();
      } else {
        $("#order_filter_tips").hide();
      }
      $filterWrap.hide();
    }
  });
}


function loadMorePage(){
  var filterType = _orderList.filterType || 0;
  var orderType = _orderList.orderType || 20;
  var oid = _orderList.id || 0;
  var data = {
    "status":orderType,
    "pageNum": currentPage
  }
  if(filterType == 1){
    data.supplierId = oid;
    data.hotelId = 0;
  } else{
    data.hotelId = oid;
  }

  //console.log(orderType);
   if(orderType == 20){
     window.$more.hide();
  }


  isLoadingMore = true;
  $.ajax({
    // url:root + '/rest/order/getOrderList',
    url:root + '/rest/order/getEmployeeOrders',
    type: 'POST',
    data: JSON.stringify(data),
    dataType: 'json',
    contentType:'application/json;charset=UTF-8',
    success: function(result) {
      console.log(result);
      isLoadingMore = false;
      if(JSON.parse(this.data).status!=_orderList.orderType){
        return false;
      }
      result = result || [];
      if(result.length < 20){
        isLoadingMoreNo = true;
      } else {
        isLoadingMoreNo = false;
      }
      var orderListData = getOrderListData(result);
      console.log(orderListData);
      if(orderListData){
      renderOrderList(orderListData);
      }else{
        isLoadingMoreNo = true;
      }

    }
  });
}

/**
* 查看是否有未读消息
*/
function checkUnreadMsgForOrderList(){
  $.ajax({
    url:root + '/rest/order/getUnreadMsgCount?hotelId='+$('#my-hotels').val(),
    type: 'GET',
    dataType: 'json',
    contentType:'application/json;charset=UTF-8',
    success: function(result) {
      console.log(result);
      if(result.allOrder){
        $('#order').addClass('tab-new-message-mark').attr({msgCount:result.allOrder});
      }else{
        $('#order').removeClass('tab-new-message-mark');
      }
      if(result.allByHotelList){  //全部订单
        $('#order-tab [value=0]').addClass('tab-new-message-mark').attr({msgCount:result.allByHotelList});
      }else{
        $('#order-tab [value=0]').removeClass('tab-new-message-mark');
      }
      if(result.waitConfirmList){ //待确认订单
        $('#order-tab [value=20]').addClass('tab-new-message-mark').attr({msgCount:result.waitConfirmList});
      }else{
        $('#order-tab [value=20]').removeClass('tab-new-message-mark');
      }
      if(result.todoList){ //代办入住订单
        $('#order-tab [value=17]').addClass('tab-new-message-mark').attr({msgCount:result.todoList});
      }else{
        $('#order-tab [value=17]').removeClass('tab-new-message-mark');
      }
    },
    error: function(xhr,status,error){
    },
    complete : function(xhr,status){
    }
  });
}


/**
 * 初始化 下拉框 并绑定 change 事件
 */
function initSelect(){
  $.ajax({
    url:root + '/rest/hotel/getHotelList',
      type: 'POST',
      dataType: 'json',
      contentType:'application/json;charset=UTF-8',
      success: function(result) {
        console.log(result);
        var select = document.getElementById('my-hotels');
        var selectData = result;
        ////
        var option = document.createElement('option');
        option.setAttribute('value',0);
        option.innerText="全部酒店";
        select.appendChild(option);
        ////
        for(var i=0; i<selectData.length;i++){
          var option = document.createElement('option');
          option.setAttribute('value',selectData[i].id);
          option.innerText=selectData[i].name;
          select.appendChild(option);
        }
        select.onchange=function(){
          var hotelId = $('#my-hotels').val();
          getOrderList(_orderList.orderType,hotelId);
          //7.查看是否有未读消息
          checkUnreadMsgForOrderList();
        }
        //7.查看是否有未读消息
        checkUnreadMsgForOrderList();

        $load.addClass('hidden');
      }
  });
}
/**************  tab end ****************/

/**************  order list start ****************/


/**
 * 获取OrderListData
 * @param result
 * @returns {Array}
 */
function getOrderListData(result){
  var orderListData=[];
  for(var i=0;i<result.length;i++){
    //或修正或组装或计算属性值，使之可以正常显示
    var orderDataOrign = result[i];
    var id = orderDataOrign.id;
    if(hasOrderIds.indexOf(id) > -1){
      continue;
    }
    hasOrderIds.push(orderDataOrign.id);
    if(!orderDataOrign.roomCount){//room count
      orderDataOrign.roomCount=1;
    }
    if(!orderDataOrign.paymentMethod){
      orderDataOrign.paymentMethod = 1;
    }
    var roomCondition = orderDataOrign.roomtypeName+"/"
        +orderDataOrign.bedtype+"/"
        +getBreakfastQty(orderDataOrign.breakfastQty);
    var orderDate = new Date(orderDataOrign.arrivedate).Format('yyyy.MM.dd')+'-'+new Date(orderDataOrign.leavedate).Format('yyyy.MM.dd');
    var roomCount = orderDataOrign.roomCount+"间";
    var totalDays = computeDays(orderDataOrign.arrivedate,orderDataOrign.leavedate)+'晚';
    var totalPrice = orderDataOrign.totalPrice || 0;
    //放入数组
   // console.log(orderDataOrign.arrivetimelate);
    var orderDataDest = {
        hotelName:orderDataOrign.hotelName,
        orderId:orderDataOrign.id,
        roomCondition:roomCondition,
        orderStatus:getOrderStatus(orderDataOrign.status,orderDataOrign.subStatus),
        orderDate:roomCount+'/'+orderDate+'('+totalDays+')',
        unreadMsgCount:orderDataOrign.unreadMsgCount,
        guestName:orderDataOrign.guestName,
        isToday:new Date(orderDataOrign.arrivedate).Format('yyyy.MM.dd')==new Date().Format('yyyy.MM.dd'),
        totalPrice: '￥' + totalPrice,
        arrivetimelate:orderDataOrign.arrivetimelate,
        auditStatus:orderDataOrign.auditStatus,
        status:orderDataOrign.status

      }
    orderListData.push(orderDataDest);
  }

  return orderListData;
}


/**
 * 渲染订单列表
 */
function renderOrderList(orderListData){
  //渲染列表
  var length = orderListData.length;
  var items = [];
  for(var i=0;i<length;i++){
    var orderItem = $('#order-list .order-item').eq(0).clone();
    orderItem.show();
    orderItem.find('.hotelName').html(orderListData[i].hotelName);
    orderItem.find('.roomCondition').html(orderListData[i].roomCondition);
    orderItem.find('.orderStatus').html(orderListData[i].orderStatus);
    orderItem.find('.guestName').html(orderListData[i].guestName);
    if(orderListData[i].auditStatus){
       orderItem.find('.orderStatus').addClass('auditStatus wait-check-style');
    }
    if(orderListData[i].auditStatus == 1){
      orderItem.find('.auditStatus').html(orderListData[i].orderStatus+'-'+'待审核');
    }else if(orderListData[i].auditStatus == 2){
        if(orderListData[i].status == 21){
          orderItem.find('.auditStatus').html('已入住');
        }else if(orderListData[i].status == 41){
          orderItem.find('.auditStatus').html('可入住');
        }else{
          orderItem.find('.auditStatus').html(orderListData[i].orderStatus+'-'+'供应商审核成功');
        }
    }else if(orderListData[i].auditStatus == 3){
      orderItem.find('.auditStatus').html(orderListData[i].orderStatus+'-'+'供应商审核失败');
    }else if(orderListData[i].auditStatus == 4){
       //orderItem.find('.auditStatus').html(orderListData[i].orderStatus+'-'+'客服审核成功');
       orderItem.find('.auditStatus').html('已入住');
    }else if(orderListData[i].auditStatus == 5){
      //orderItem.find('.auditStatus').html(orderListData[i].orderStatus+'-'+'客服审核失败');
      orderItem.find('.auditStatus').html('客服已审核');
    }

    if(orderListData[i].unreadMsgCount){//是否有未读消息
      orderItem.find('.orderStatus').addClass('list-new-message-mark').attr({msgCount:orderListData[i].unreadMsgCount});
    }else{
      orderItem.find('.orderStatus').removeClass('list-new-message-mark');
    }
    orderItem.find('.orderDate').html(orderListData[i].orderDate);
    orderItem.find('.myorderPrice').html(orderListData[i].totalPrice);
    if(orderListData[i].isToday){  //今天入住的显示红色
      orderItem.find('.orderDate').css({color:'red'});
    }
    orderItem.attr('orderId',orderListData[i].orderId);
    items.push(orderItem);
     //orderItem.find('.lastArriveTime').html(orderListData[i].arrivetimelate);
  }
  window.$more.hide();
  $('#order-list').append(items);
  window.isLoadingData = false;
  $load.addClass('hidden');
}
/**************  order list start ****************/


/**************  order tab start ****************/
/**
 * 初始化 order-tab 并绑定对应的点击事件
 */
function initOrderTab(id){
  //1.高亮显示当前 tab
  var urlParams = getUrlParams();
  console.log(urlParams);
  var orderType = urlParams['orderType'];
  _orderList.orderType = orderType == null ? 20 : orderType;

 getOrderList(); //新加的用来直接打开待审核页面，?orderType=20

  if(util.cookie.getItem('supplier_type')==1){
    $('#order-tab div:eq(1)').remove();
  }
  $('#order-tab').show();
  $('#change_handler_btn').click(function(){
    changeOrderHandler();
  });




  var tabItems = $('#order-tab').find('.norder-item');
  //2.点击 orderTab 刷新订单 列表事件绑定
  $("#order-tab").on('click','.norder-item', function(){
    //1.修改Tab颜色
    tabItems.removeClass('norder-select');
    $(this).addClass('norder-select');

    //2.渲染列表
    _orderList.orderType = $(this).attr('value');
    // var hotelId = $('#my-hotels').val();
    // _orderList.id = hotelId;

    getOrderList();
  });
}
function changeOrderHandler(){
  var info = {
    orderId: $(_orderList.orderDetailSelector).data('id'),
    hotelId:$(_orderList.orderDetailSelector).data("hotelId")
  }
  util.goByUrl('./changeOrderhanler.html?info='+JSON.stringify(info));
}
/**************  order tab start ****************/


/**************  order detail start ****************/
function getHotel(){
  window.$more.hide();
  window.$moreNo.hide();
  $load.removeClass('hidden');
  if(typeof id!=="number"){
    var id = $(this).attr('orderId');
  }
  $('#my-hotels').hide();

  $('#set_product_btn').click(function(){
   var hotelId=$(_orderList.orderDetailSelector).data("hotelId")
    var hotelName=$(_orderList.orderDetailSelector).data("hotelName")
    var productId = $(_orderList.orderDetailSelector).data("roomProductId");
    util.goByUrl('./roomCalendar.html?hotelId='+hotelId+'&hotelName='+hotelName+'&roomId='+productId);
  });
//var lived;
/*$('#check_live_btn').click(function() {
   var kao = document.getElementById("check-live-content").style.display;
   //console.log(_orderList.orderType);
  if(kao == 'none') {
      document.getElementById("check-live-content").style.display = 'block';
      document.getElementById("check_live_btn").style.background = '#00BCD4';
      document.getElementById("check_live_btn").style.color = '#FFFFFF';
      $('#checkone').removeClass('choiceIconSelect');
      $('#checktwo').addClass('choiceIconSelect');
   }else{
     document.getElementById("check-live-content").style.display = 'none';
     document.getElementById("check_live_btn").style.background = '#FFFFFF';
     document.getElementById("check_live_btn").style.color = '#02b3cf';
     document.getElementById("check-text").value = ' ';
     $('#checkone').removeClass('choiceIconSelect');
     $('#checktwo').addClass('choiceIconSelect');
   }
})*/
$('#cancel').click(function() {
   document.getElementById("check-live-content").style.display = 'none';
   document.getElementById("check-text").value = ' ';
   document.getElementById("check_live_btn").style.background = '#FFFFFF';
   document.getElementById("check_live_btn").style.color = '#02b3cf';
   $('#checkone').removeClass('choiceIconSelect');
   $('#checktwo').addClass('choiceIconSelect');
})


/*$('#checkone').click(function() {
   if($(this).hasClass('choiceIconSelect')){
       $(this).removeClass('choiceIconSelect');
       $('#checktwo').addClass('choiceIconSelect');
       lived = 0;
   }else{
       $(this).addClass('choiceIconSelect');
       $('#checktwo').removeClass('choiceIconSelect');
       lived =1;
   }
})
$('#checktwo').click(function() {
   if($(this).hasClass('choiceIconSelect')){
       $(this).removeClass('choiceIconSelect');
       $('#checkone').addClass('choiceIconSelect');
       lived =1;
   }else{
       $(this).addClass('choiceIconSelect');
       $('#checkone').removeClass('choiceIconSelect');
       lived =0;
   }
})*/


 console.log(id);
 //console.log(lived);
 $("#certain").click(function() {
    if($('#checkone').hasClass('choiceIconSelect')){
      lived =1;
    }
    if($('#checktwo').hasClass('choiceIconSelect')){
      lived =0;
    }
    console.log(lived);
    console.log(document.getElementById('check-text').value);
    //console.log(document.getElementById('orderNo').innerHTML);
    console.log(id);
    //2. 提交
    $.ajax({
     url:root + '/rest/order/checkin/audit',
     type: 'POST',
     data: JSON.stringify({
     "orderId": id,
     "isCheckin": lived,
     "remark": document.getElementById('check-text').value,
      }),
      dataType: 'json',
      contentType: 'application/json;charset=UTF-8',
      success: function(result) {
        console.log(result);
        $load.addClass('hidden');
        if (result.code == 100) {
          _amain.Messager.alert("操作成功!");
          location.assign('orderList.html?orderType=118');
        } else if (result.code == 200) {
          _amain.Messager.alert(result.msg);
        } else {
          _amain.Messager.alert('未知错误！');
        }
      }
    });
  });
  $.ajax({
    url:root + '/rest/order/getHotelOrder',
    type: 'POST',
    data: JSON.stringify({"id":id}),
    dataType: 'json',
    contentType:'application/json;charset=UTF-8',
    success: function(result) {
      console.log(result);
      /*  if(result.arrivetimelate) {
         $('#arrivelate').show();
      }else{
        $('#arrivelate').hide();
      }*/
      if(result.isSurety == 1&& result.suretyMode==1){
        $('#suretyMode').html('首晚担保');
      }else if(result.isSurety == 1&& result.suretyMode==2){
         $('#suretyMode').html("全额担保");
      }else{
        $('#suretyMode').html('无');
      }
      if(result.suretyPrice){
        $('#suretyPrice').html('￥'+ result.suretyPrice);
      }else{
        $('#suretyPrice').html('￥' + 0);
      }
      if(result.supplierPrice){
        $('#supplierPrice').html('￥' + result.supplierPrice);
      }else{
        $('#supplierPrice').html('￥' + 0);
      }
      if(result.totalPrice){
         $('#totalPrice').html('￥' + result.totalPrice);
      }else{
        $('#totalPrice').html('￥' + 0);
      }
      if(result.collectPrice){
         $('#collectPrice').html('￥' + result.collectPrice);
      }else{
        $('#collectPrice').html('￥' + 0);
      }


      renderOrderInfo(result);
    }
  });
}
/**
 * @for orderDetail
 * 渲染 orderdetail
 * @param data
 */
function renderOrderInfo(data){
  console.log(data);
  if(!data){
    alert('订单信息获取失败');
    $load.addClass('hidden');
    return;
  }
  //确定render区域
  if(_orderList.supplierType==2 && (data.status==17 || getOrderStatus(data.status,data.subStatus)=='可入住' || data.status==40)){
    _orderList.orderDetailSelector="#order-detail-type1";
    renderLiveCondition(data);
  }else{
    _orderList.orderDetailSelector="#order-detail-type1";
  }
  //隐藏 orderList
  $('#order-list').hide();
  var type=util.cookie.getItem('supplier_type');
  $(_orderList.orderDetailSelector).show();
  data.statusCode=data.status;
  data.status=getOrderStatus(data.status);


  var autoWiredField = ["status", "orderNo", "reservation", "hotelConfirmNo",
                        "hotelName", "paymentMethod", "cancelPolicy", "arrivedate",
                        "leavedate", "roomCount", "checkInPeopleName",
                        "checkInPeoplePhone", "orderPeopleName", "orderPeoplePhone","bedtypePrefer","handleSupplierName","arrivetimelate",];
  $(_orderList.orderDetailSelector).data(data);
  if(data.unreadMsgCount){//是否有未读消息
    $('.contactCustomer').addClass('button-new-message-mark').attr({msgCount:data.unreadMsgCount});
  }else{
    $('.contactCustomer').removeClass('button-new-message-mark');
  }
  renderOperation(data);

  renderAutoWiredField(data,autoWiredField);


  //渲染 价格
  if(data.paymentMethod=='预付'){
    $('#order-detail-price .total-price').html('￥'+data.totalPrice);
    $('#order-detail-price .price-desc').html('');
  }else if(data.paymentMethod=='到付'){
    $('#order-detail-price .total-price').html('￥'+data.totalPrice);
    $('#order-detail-price .price-desc').html('');
  }else{
    $('#order-detail-price .total-price').html('￥'+(parseFloat(data.totalPrice)+parseFloat(data.collectPrice)));
    $('#order-detail-price .price-desc').html('（房费到付¥'+data.collectPrice+'＋服务费预付¥'+data.totalPrice+'）');
  }


//  $('#reservationDate').html(data.reservationDate?data.reservationDate.replace(/\.\d*/,''):"");
//  $('#confirmDate').html(data.confirmDate?data.confirmDate.replace(/\.\d*/,''):'');

  //渲染 酒店信息 需要组装
  var roomInfo = "";
  roomInfo+=data.roomtypeName?data.roomtypeName+'/':'';
  roomInfo+=data.bedtype?data.bedtype+'/':'';
  roomInfo+=data.breakfastQty?data.breakfastQty+'/':'';
  $('.roomdetial').html(roomInfo.replace(/\/$/,''));

 /*if(data.arrivetimelate) {
    $("#arrivelate").css("display","none");
  }*/
 console.log(data);
    if(data.orderInfos){
      $('#order-operate-history').show();
      renderOperateHistory(data);
    }else{
      $('#order-operate-history').hide();
    }


  //renderNeedSwitchedField(data);

  $load.addClass('hidden');

}
/**
 * 渲染操作历史
 * @param data
 */
function renderOperateHistory(data){
  //1.保证只剩余一个 copy 模板
  $('#order-operate-history .order-operate-item:gt(0)').remove();
  var container = $('#order-operate-history .order-operate-list');
  var operateItem = $('#order-operate-history .order-operate-item').eq(0);
  //2.
  console.log(data);
  for(var i=0;i<data.orderInfos.length;i++){
    var clone = operateItem.clone();
    clone.find('.order-operate-status').html(data.orderInfos[i].statusDesc);
    clone.find('.order-operate-description').html(data.orderInfos[i].description);
    clone.find('.order-operate-time').html(data.orderInfos[i].time);
    clone.show();
    container.append(clone);
  }
  var current = $('#order-operate-history .order-operate-item').eq(1);
  current.find('.order-operate-info').addClass('current');
  current.find('.order-operate-passed-mark').addClass('order-operate-current-big-mark').removeClass('order-operate-passed-mark');
}

function renderLiveCondition(data){
  $('#live-condition input:checkbox').removeAttr('checked');
//  if(data.status!=17 && Constants.orderStatusMap[data.status]!='可入住'){
//    $('#live-condition input').attr('disabled','disabled');
//  }else{
//    $('#live-condition input').removeAttr('disabled');
//  }
  $('#live-condition .addition').hide();
  $('#live-condition input:checkbox:lt(3)').click(function(){
    var index = parseInt($(this).attr('value'));
    if($(this).attr('checked')){
      console.log('checked');
      $('#live-condition .addition').eq(index).show();
    }else{
      console.log('unchecked');
      $('#live-condition .addition').eq(index).hide();
    }
  });
  $.ajax({
    url:root + '/rest/order/getOrderTodoInfo?orderId='+data.id,
        type: 'GET',
        dataType: 'json',
        contentType:'application/json;charset=UTF-8',
        success: function(result) {
          //orderId: 2861, confirmCode: "156400", roomNumber: "", bookingPeople: "", oneRoomcard: false
          $('#live-condition .condition-confirm-no').val('');
          if(result.confirmCode!=''){
            $('#live-condition input:checkbox').eq(0).attr('checked','checked');
            $('#live-condition .condition-confirm-no').val(result.confirmCode);
            $('#live-condition .addition').eq(0).show();
          }
          $('#live-condition .condition-room-no').val('');
          if(result.roomNumber!=''){
            $('#live-condition input:checkbox').eq(1).attr('checked','checked');
            $('#live-condition .condition-room-no').val(result.roomNumber);
            $('#live-condition .addition').eq(1).show();
          }
          $('#live-condition .condition-person-name').val('');
          if(result.bookingPeople!=''){
            $('#live-condition input:checkbox').eq(2).attr('checked','checked');
            $('#live-condition .condition-person-name').val(result.bookingPeople);
            $('#live-condition .addition').eq(2).show();
          }
          if(result.isOneRoomcard=='1'){
            $('#live-condition input:checkbox').eq(3).attr('checked','checked');
          }
        }
  });

}

/**
 * 渲染不需要变换和处理计算的字段
 * @for OrderDetail
 * @param data
 * @param fields
 */
function renderAutoWiredField(data,fields){
  for(var i=0;i<fields.length;i++){
    var value = data[fields[i]];
    value = value ? value : "";
    $('.'+fields[i]).html(value);

  }
}

/**
 *
 * @param data
 */
function renderOperation(data){
  console.log(data);

  var supplierId=util.cookie.getItem("_supplierId");
  //if(supplierId==null||supplierId==""){
  //  $.ajax({
  //    url: root + '/rest/supplier/getSupplier',
  //    type: 'GET',
  //    dataType: 'json',
  //    contentType: 'application/json;charset=UTF-8',
  //    success: function (result) {
  //      supplierId=result.supplierId;
  //    }
  //  });
  //  }

  //0. 是否修改入住人信息
  if(data.modifyGuest){
    $('#operateA').show().click(confirmGuestModify);
    $('#operateB').show().click(refuseGuestModify);
    $('#order-detail-type1 .modifyGuest').html('(申请修改为：'+data.modifyGuest+')').css({color:'red'});
  }else{
    $('#operateA').hide();
    $('#operateB').hide();
    $('#order-detail-type1 .modifyGuest').html('')
  }
  //1. 处理显示
  var config = Constants.getOperateConfig(data.statusCode,data.subStatus);
  console.log(config);
  console.log(_orderList);
  $('#live-condition').hide();
  for(var i=0;i<10;i++){//1.1 根据配置，显示操作按钮
    if(config.operateItem.indexOf(i)==-1 || data.modifyGuest){
      $('#operate'+i).hide();
    }else{
      $('#operate'+i).show();
    }
  }
  if(config.confirmNo && !data.modifyGuest){//1.2 显示确认号输入框
    $('#operate-confirm-no').show();
    $('.hotelConfirmNoInput').val(data.hotelConfirmNo);
  }else{
    $('#operate-confirm-no').hide();
  }
  if(_orderList.supplierType==2 && config.liveCondition){//1.3 非销售供应商，显示入入驻条件
    $('#operate-confirm-no').hide();
    $('#live-condition').show();
  }
  $('#lianxis').closest(".operate-item").show();
  $('#change_handler_btn').closest(".operate-item").show();
  $('#phone_client').closest(".operate-item").show();

  if(_orderList.orderType == '118'){
    $('#check_live_btn_p').show();
    //$('#check-add').show();
    //$('#order-detail-price').hide();
    $('.orderOperation').hide();
    $('#live-condition').hide();
  }else{
    $('#check_live_btn_p').hide();
    $('.orderOperation').show();
    //$('#check-add').hide();
    //$('#order-detail-price').show();

  }
  document.getElementById("check-live-content").style.display = 'none';
    document.getElementById("check_live_btn").style.background = '#FFFFFF';
    document.getElementById("check_live_btn").style.color = '#02b3cf';
    document.getElementById("check-text").value = ' ';
  //var kao = document.getElementById("check-live-content").style.display;
/*  if(_orderList.orderType == '30') {
     document.getElementById("check-live-content").style.display = 'none';
     document.getElementById("check_live_btn").style.background = '#FFFFFF';
     document.getElementById("check_live_btn").style.color = '#02b3cf';
     document.getElementById("check-text").value = ' ';
   }else{
      document.getElementById("check-live-content").style.display = 'block';
      document.getElementById("check_live_btn").style.background = '#00BCD4';
      document.getElementById("check_live_btn").style.color = '#FFFFFF';
   }*/
  if(data.handleSupplierId!=null&&supplierId!=data.handleSupplierId){
    $('#operate-confirm-no').hide();
    $('#lianxis').closest(".operate-item").hide();
    $('#phone_client').closest(".operate-item").hide();
    $('#operate0').hide();
    $('#operate1').hide();
    $('#operate2').hide();
    $('#operate3').hide();
    $('#operate4').hide();
    $('#operate7').hide();
    if(supplierId!=data.supplierId){
      $('#change_handler_btn').closest(".operate-item").hide();
    }
  }else if(data.handleSupplierId==null) {
      $('#change_handler_btn').closest(".operate-item").hide();
  }

  if(data.orderSource=="新版酒店"){
    console.log(data.orderSource);
    $('#lianxis').closest(".operate-item").hide();
    $('#operate4').hide();
  }

  //2. 处理事件  0.开始处理(又名接单 recieve) 1.办理入住 2.立即确认 3.保存 4.修改订单 5.取消修改 6.提醒支付 7.拒单
  $(".orderOperation button").off('click').click(function(){
    var id = $(this).parent().attr('id');
    switch(id){
      case 'operate0' :
        recieve();
        break;
      case 'operate1' :
        toProcess(false);
        break;
      case 'operate2' :
        toConfirm(false , false);
        break;
      case 'operate3' :
        if(_orderList.supplierType==2){
          toProcess(true);
        }else{
          toConfirm(false , true);
        }
        break;
      case 'operate4' :
        util.goByUrl("./modifyOrder.html?id="+$(_orderList.orderDetailSelector).data('id'));
        break;
      case 'operate5' :
        _Jquery.get(root + '/rest/order/cancelModify?orderId='+$(_orderList.orderDetailSelector).data('id'), function(data){
          if(data.code==100){
            location.href=location.href;
          }else{
            alert(data.msg);
          }
        })
        break;
      case 'operate6' :
        //TODO
        break;
      case 'operate7' :
        toReject();
        break;
    }
  });
  $('#operate8').click(confirmCancelOrder);
  $('#operate9').click(refuseCancelOrder);

  $('#confirm-button').off('click').click(function(){
    $('#confirm-window').hide();
    if($('#confirm-window').attr('type')=="confirm"){
      if($('#confirm-window').attr('isUpdate')=='true'){
        confirm(true);
      }else{
        confirm(false);
      }
    }else if($('#confirm-window').attr('type')=="reject"){
      reject();
    }else if($('#confirm-window').attr('type')=="process"){
      if($('#confirm-window').attr('isUpdate')=='true'){
        process(true);
      }else{
        process(false);
      }
    }
  });

  $("#cancel-button").off('click').click(function(){
    $('#confirm-window').hide();
  });

}

/**
 *  toConfirm
 *  供应商确认之前对用户进行提醒
 *  @param isSkipedRecive 是否跳过了接单步骤
 *  @param isUpdate 是否为更新操作
 */
function toConfirm(isSkipedRecive , isUpdate){
  var confirmMessage="您是否要立即确认此订单？";
  if(!isSkipedRecive){
    var confirmNo = $(_orderList.orderDetailSelector +' .hotelConfirmNoInput').val();
    if(confirmNo==""){
      confirmMessage="您没有填写确认号，是否继续确认？";
    }else{
      if(isUpdate){
        confirmMessage="您是否要修改确认码为： "+confirmNo +" 吗？";
      }else{
        confirmMessage="确认码为： "+confirmNo +" ,是否要确认此订单？";
      }
    }
  }
  $('#confirm-window').attr({type:'confirm',isUpdate:isUpdate}).show().find('#info-panel div:first').html(confirmMessage);
}
/**
 * 供应商确认订单
 */
function confirm(isUpdate){
  $load.removeClass('hidden');
  var hotelConfirmNoInput = $(_orderList.orderDetailSelector +' .hotelConfirmNoInput').val().trim();
  var url=root + '/rest/order/confirmOrder';
  if(isUpdate){
    url = root + '/rest/order/modifyConfirmCode';
  }
  var orderId= $(_orderList.orderDetailSelector).data('id');
  $.ajax({
    url:url,
        type: 'POST',
        data: JSON.stringify({
          "id":orderId,
          "hotelConfirmNo":hotelConfirmNoInput
        }),
        dataType: 'json',
        contentType:'application/json;charset=UTF-8',
        success: function(result) {
          $load.addClass('hidden');
          if(result.code==100){
            //_amain.tips.open(result.msg);
          }else{
            alert(result.msg);
          }
          $("#order-tab [value="+_orderList.orderType+"]").click();
        }
    });
}

/**
 * 拒单确认
 */
function toReject(){
  $('#confirm-window').attr('type','reject').show().find('#info-panel div:first').html('您是否要拒绝该订单？');
}
/**
 * 拒绝
 */
function reject(){
  $load.removeClass('hidden');
  $.ajax({
    url:root + '/rest/order/rejectOrder',
        type: 'POST',
        data: JSON.stringify({"id":$(_orderList.orderDetailSelector).data('id'),"refuseMsg":$('.green').parent().next().text()}),
        dataType: 'json',
        contentType:'application/json;charset=UTF-8',
        success: function(result) {
          $load.addClass('hidden');
          if(result){
            _amain.tips.open("订单拒绝成功！");
          }else{
            alert("订单拒绝失败！");
          }
          $("#order-tab [value="+_orderList.orderType+"]").click();
        }
    });
}

function recieve(){
  $load.removeClass('hidden');
  $.ajax({
    url:root + '/rest/order/orderReceive?orderId='+$(_orderList.orderDetailSelector).data('id'),
        type: 'GET',
        dataType: 'json',
        contentType:'application/json;charset=UTF-8',
        success: function(result) {
          $load.addClass('hidden');
          if(result){
            _amain.tips.open("订单接收成功！");
          }else{
            alert("订单接收失败！");
          }
          $("#order-tab [value="+_orderList.orderType+"]").click();
        }
    });
}

/**
 *
 */
function toProcess(isUpdate){
  if(isInvalidProcess())return;
  $('#confirm-window').attr({type:'process',isUpdate:isUpdate}).show().find('#info-panel div:first').html('您是否要提交该操作？');
}
/**
 * 处理入住条件
 */
function process(isUpdate){
  $load.removeClass('hidden');
  var id=$(_orderList.orderDetailSelector).data('id');
  var confirmCode = $('#live-condition input:checkbox').eq(0).attr('checked')?$('#live-condition .condition-confirm-no').val():'';
  var roomNumber = $('#live-condition input:checkbox').eq(1).attr('checked')?$('#live-condition .condition-room-no').val():'';
  var bookingPeople = $('#live-condition input:checkbox').eq(2).attr('checked')?$('#live-condition .condition-person-name').val():'';
  var isOneRoomcard = $('#live-condition input:checkbox').eq(3).attr('checked')?1:0;
  if(isInvalidProcess())return;
  var url=root + '/rest/order/orderCanCheckin';
  if(isUpdate){
    url=root + '/rest/order/updateOrderTodoInfo';
  }
  $.ajax({
    url:url,
        type: 'POST',
        data: JSON.stringify({
            orderId:id,
            confirmCode:confirmCode,
            roomNumber:roomNumber,
            bookingPeople:bookingPeople,
            isOneRoomcard:isOneRoomcard
          }),
        dataType: 'json',
        contentType:'application/json;charset=UTF-8',
        success: function(result) {
          $load.addClass('hidden');
          if(result.code!=100){
            alert('操作失败！');
          }else{
            _amain.tips.open('操作成功！');
            $("#order-tab [value="+_orderList.orderType+"]").click();
          }
        }
    });

}
/**
 * 是否为无效处理
 * @returns {Boolean}
 *   true  : 是无效处理
 *   false : 不是无效处理
 */
function isInvalidProcess(){
  if($('#live-condition input:checkbox').eq(0).attr('checked') && $('#live-condition .condition-confirm-no').val().trim()==''){
    alert("请填写确认号！");
    return true;
  }
  if($('#live-condition input:checkbox').eq(1).attr('checked') && $('#live-condition .condition-room-no').val().trim()==''){
    alert("请填写房间号！");
    return true;
  }
  if($('#live-condition input:checkbox').eq(2).attr('checked') && $('#live-condition .condition-person-name').val().trim()==''){
    alert("请填写入住人姓名！");
    return true;
  }
  return false;
}


/**
 * 初始化拒绝信息
 */
function initRejectReason(){
  $.ajax({
    url:root + '/rest/order/getRejectReasons',
        type: 'GET',
        dataType: 'json',
        contentType:'application/json;charset=UTF-8',
        success: function(result) {
            //1.渲染页面
          result.forEach(function(value){
              var item = $('#orderReject .selectBlock .item:eq(0)').clone();
              item.show();
              item.find('.text').html(value);
              $('#orderReject .selectBlock').append(item);
            });
            //2.绑定事件
          $('#orderReject .selectBlock .item').click(function(){
            $('#orderReject .selectBlock .item .icon').removeClass('green').addClass('gray');
            $(this).find('.icon').removeClass('gray').addClass('green');
          }).eq(1).click();
        }
  });
}


/**************  order detail end ****************/


/**
 * 数字和文字转换
 * @param num
 * @returns {String}
 */
function getBreakfastQty(num){
  switch(num){
    case 0: {
      return "无早";
    }
    case 1: {
      return "单早";
    }
    case 2: {
      return "双早";
    }
    case 3: {
      return "三早";
    }
    default: {
      return "多早";
    }
  }
}

/**
 * 数字文字转换
 * @param status
 * @returns {String}
 * 10:待支付 11:超时未支付 12:用户取消 20:待确认 21:已确认 22:确认失败，等待退款 30:已退款 40:完成
 */
function getOrderStatus(status,subStatus){
  for(var index in Constants.orderStatusMap){
    var regExp = new RegExp(index);
    if(regExp.test(status+'-'+subStatus)){
      return Constants.orderStatusMap[index];
    }
  }
}

/**
 * 数字文字转换
 * @param paymentMethod
 */
function getOrderPaymentMethod(paymentMethod){
  var status;
  switch(paymentMethod){
    case 1:{
      status = "预付";break;
    }case 2:{
      status = "到付";break;
    }default:
      status = "无效状态";break;
  }
  return status;
}
/**
 * 初始化聊天入口
 */
function initChatGate(){
  $('.contactCustomer').click(function(){
    $load.removeClass('hidden');
    $('.contactCustomer').off('click');
    $.ajax({
      url:root + '/rest/order/getChatUrl?orderId='+$(_orderList.orderDetailSelector).data('id'),
          type: 'GET',
          dataType: 'json',
          contentType:'application/json;charset=UTF-8',
          success: function(result) {
            if(result){
              if(result.code==200){
                location.href=result.msg;
              }else{
                $load.addClass('hidden');
                alert(result.msg);
                initChatGate();
              }
            }else{
              $load.addClass('hidden');
              initChatGate();
            }
          },
      error: function(){
        $load.addClass('hidden');
        initChatGate();
      }
    });
  });
}


/**
 * 同意修改
 */
function confirmGuestModify(){
  _amain.Messager.confirm("是否要确定修改入住人信息",function(){
    _Jquery.get(root+'/rest/order/confirmGuestModify?orderId='+$(_orderList.orderDetailSelector).data('id'),function(data){
      if(data.code=='100'){
        _amain.tips.open('确定修改入住人信息成功！');
        $('#order-tab [value='+_orderList.orderType+']').click();
      }else{
        _amain.Messager.alert(data.msg);
      }
    });
  });
}
/**
 * 决绝修改
 */
function refuseGuestModify(){
  _amain.Messager.confirm("是否要拒绝修改入住人信息",function(){
    _Jquery.get(root+'/rest/order/refuseGuestModify?orderId='+$(_orderList.orderDetailSelector).data('id'),function(data){
      if(data.code=='100'){
        _amain.tips.open('拒绝修改入住人信息成功！');
        $('#order-tab [value='+_orderList.orderType+']').click();
      }else{
        _amain.Messager.alert(data.msg);
      }
    });
  });
}
/**
 * 确定取消
 */
function confirmCancelOrder(){
  _amain.Messager.confirm("是否同意用户取消订单",function(){
    _Jquery.get(root+'/rest/order/confirmCancelOrder?orderId='+$(_orderList.orderDetailSelector).data('id'),function(data){
      if(data.code=='100'){
        _amain.tips.open('已同意用户取消订单成功！');
        $('#order-tab [value='+_orderList.orderType+']').click();
      }else{
        _amain.Messager.alert(data.msg);
      }
    });
  });
}
/**
 * 拒绝取消
 */
function refuseCancelOrder(){
  _amain.Messager.confirm("是否拒绝用户取消订单",function(){
    _Jquery.get(root+'/rest/order/refuseCancelOrder?orderId='+$(_orderList.orderDetailSelector).data('id'),function(data){
      if(data.code=='100'){
        _amain.tips.open('已拒绝用户取消订单成功！');
        $('#order-tab [value='+_orderList.orderType+']').click();
      }else{
        _amain.Messager.alert(data.msg);
      }
    });
  });
}

function clickCheck() {
  $('#check_live_btn').click(function() {
   var kao = document.getElementById("check-live-content").style.display;
   //console.log(_orderList.orderType);
  if(kao == 'none') {
      document.getElementById("check-live-content").style.display = 'block';
      document.getElementById("check_live_btn").style.background = '#00BCD4';
      document.getElementById("check_live_btn").style.color = '#FFFFFF';
      $('#checkone').removeClass('choiceIconSelect');
      $('#checktwo').addClass('choiceIconSelect');
   }else{
     document.getElementById("check-live-content").style.display = 'none';
     document.getElementById("check_live_btn").style.background = '#FFFFFF';
     document.getElementById("check_live_btn").style.color = '#02b3cf';
     document.getElementById("check-text").value = ' ';
     $('#checkone').removeClass('choiceIconSelect');
     $('#checktwo').addClass('choiceIconSelect');
   }
})
  var lived;
  $('#checkone').click(function() {
   if($(this).hasClass('choiceIconSelect')){
       $(this).removeClass('choiceIconSelect');
       $('#checktwo').addClass('choiceIconSelect');
       lived = 0;
   }else{
       $(this).addClass('choiceIconSelect');
       $('#checktwo').removeClass('choiceIconSelect');
       lived =1;
   }
})
$('#checktwo').click(function() {
   if($(this).hasClass('choiceIconSelect')){
       $(this).removeClass('choiceIconSelect');
       $('#checkone').addClass('choiceIconSelect');
       lived =1;
   }else{
       $(this).addClass('choiceIconSelect');
       $('#checkone').removeClass('choiceIconSelect');
       lived =0;
   }
})
if($('#checkone').hasClass('choiceIconSelect')){
  lived =1;
}
if($('#checktwo').hasClass('choiceIconSelect')){
  lived =0;
}
console.log(lived);
}
})(window);