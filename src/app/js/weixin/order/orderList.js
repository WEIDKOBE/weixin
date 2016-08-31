
var _orderList={};
function init(){
	var root = location.origin+ctx;
	//_TIME_STAMP_DEFINE_PLACE
	$.ajax({  
	  url:root + '/rest/supplier/getAccountInfo',
	  type: 'GET', 
	  async: false,
	  dataType: 'json',
	  contentType:'application/json;charset=UTF-8',        
	  success: function(result) { 
	    if(result && result.type){
	      createCookie('supplier_type',result.type);
	    }
	  } 
	});

	window.$more = $('#myorder-more');
	window.$moreNo = $('#myorder-moreNo');

	//1.初始化 head tab 为房态加链接
	initHeadTab();
	_params = getUrlParams();
	//2.初始化 下拉框 并绑定 change 事件
	initSelect();
	//3.初始化订单列表
	if(_params.id && (parseInt(_params.id)+'')!='NaN'){
		getHotel(parseInt(_params.id));
	}else if(sessionStorage.sessionStorage_view_orderList_id){
		getHotel(parseInt(sessionStorage.sessionStorage_view_orderList_id));
		delete sessionStorage.sessionStorage_view_orderList_id;
	}else{
		getOrderList(20,0);
	}
	if(readCookie('supplier_type')==1){
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
	
}


/**************  tab start ****************/


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

	    	// $load.addClass('hidden');
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
		//放入数组
		var orderDataDest = {
				hotelName:orderDataOrign.hotelName,
				orderId:orderDataOrign.id,
				roomCondition:roomCondition,
				orderStatus:getOrderStatus(orderDataOrign.status,orderDataOrign.subStatus),
				orderDate:roomCount+'/'+orderDate+'('+totalDays+')',
				unreadMsgCount:orderDataOrign.unreadMsgCount,
				guestName:orderDataOrign.guestName,
				isToday:new Date(orderDataOrign.arrivedate).Format('yyyy.MM.dd')==new Date().Format('yyyy.MM.dd')
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
		if(orderListData[i].unreadMsgCount){//是否有未读消息
			orderItem.find('.orderStatus').addClass('list-new-message-mark').attr({msgCount:orderListData[i].unreadMsgCount});
		}else{
			orderItem.find('.orderStatus').removeClass('list-new-message-mark');
		}
		orderItem.find('.orderDate').html(orderListData[i].orderDate);
		if(orderListData[i].isToday){
			orderItem.find('.orderDate').css({color:'red'});
		}
		orderItem.attr('orderId',orderListData[i].orderId);
		items.push(orderItem);
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
function initOrderTab(){
	//1.高亮显示当前 tab
	var urlParams = getUrlParams();
	var orderType = urlParams['orderType'];
	_orderList.orderType = orderType == null ? 20 : orderType;
	if(readCookie('supplier_type')==1){
		$('#order-tab div:eq(1)').remove();
		$('#order-tab div').css({width:'50%'});
	}
	$('#order-tab').show();
	//2.点击 orderTab 刷新订单 列表事件绑定
	$("#order-tab").on('click','div', function(){
		//1.修改Tab颜色
		$("#order-tab div").css({backgroundColor:'rgb(246,246,246)',color:''});
		$(this).css({backgroundColor:"rgb(2,179,207)",color:'white'});
		//2.渲染列表
		var hotelId = $('#my-hotels').val();
		_orderList.orderType = $(this).attr('value');
		getOrderList(_orderList.orderType,hotelId);
	});
}
/**************  order tab start ****************/


/**************  order detail start ****************/
function getHotel(id){
	window.$more.hide();
  window.$moreNo.hide();
  
	$load.removeClass('hidden');
	if(typeof id!=="number"){
		var id = $(this).attr('orderId');
	}
	$('#my-hotels').hide();
	$.ajax({
		url:root + '/rest/order/getHotelOrder',
        type: 'POST', 
        data: JSON.stringify({"id":id}), 
        dataType: 'json',
        contentType:'application/json;charset=UTF-8',        
        success: function(result) { 
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
	//确定render区域
	if(_orderList.supplierType==2 && (data.status==17 || getOrderStatus(data.status,data.subStatus)=='可入住' || data.status==40)){
		_orderList.orderDetailSelector="#order-detail-type1";
		renderLiveCondition(data);
	}else{
		_orderList.orderDetailSelector="#order-detail-type1";
	}
	//隐藏 orderList
	$('#order-list').hide();
	var type=readCookie('supplier_type');
	$(_orderList.orderDetailSelector).show();
	data.statusCode=data.status;
	data.status=getOrderStatus(data.status);
	
	
	var autoWiredField = ["status", "orderNo", "reservation", "hotelConfirmNo", 
	                      "hotelName", "paymentMethod", "cancelPolicy", "arrivedate",
	                      "leavedate", "roomCount", "totalPrice", "checkInPeopleName",
	                      "checkInPeoplePhone", "orderPeopleName", "orderPeoplePhone","bedtypePrefer"];
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
	}else{
		$('#order-detail-price .total-price').html('￥'+(parseFloat(data.totalPrice)+parseFloat(data.collectPrice)));
		$('#order-detail-price .price-desc').html('（房费到付¥'+data.collectPrice+'＋服务费预付¥'+data.totalPrice+'）');
	}
//	$('#reservationDate').html(data.reservationDate?data.reservationDate.replace(/\.\d*/,''):"");
//	$('#confirmDate').html(data.confirmDate?data.confirmDate.replace(/\.\d*/,''):'');
	
	//渲染 酒店信息 需要组装
	var roomInfo = "";
	roomInfo+=data.roomtypeName?data.roomtypeName+'/':'';
	roomInfo+=data.bedtype?data.bedtype+'/':'';
	roomInfo+=data.breakfastQty?data.breakfastQty+'/':'';
	$('.roomdetial').html(roomInfo.replace(/\/$/,''));
	
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
//	if(data.status!=17 && Constants.orderStatusMap[data.status]!='可入住'){
//		$('#live-condition input').attr('disabled','disabled');
//	}else{
//		$('#live-condition input').removeAttr('disabled');
//	}
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
				location.href = root+"/weixin/order/modifyOrder.jsp?id="+$(_orderList.orderDetailSelector).data('id');
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
	
	$.ajax({
		url:url,
        type: 'POST', 
        data: JSON.stringify({"id":$(_orderList.orderDetailSelector).data('id'),"hotelConfirmNo":hotelConfirmNoInput}), 
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
* 查看是否有未读消息
*/
function checkUnreadMsgForOrderList(){
	$.ajax({	
		url:root + '/rest/order/getUnreadMsgCount?hotelId='+$('#my-hotels').val(),
		type: 'GET', 
		dataType: 'json',
		contentType:'application/json;charset=UTF-8',        
		success: function(result) { 
			if(result.allOrder){
				$('#order').addClass('tab-new-message-mark').attr({msgCount:result.allOrder});
			}else{
				$('#order').removeClass('tab-new-message-mark')
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
    	window.$moreNo.show();
      return;
    }

    window.$more.show();
    window.$moreNo.hide();
    var hotelId = $('#my-hotels').val();
    currentPage++;
    loadMorePage(_orderList.orderType,hotelId);
  }, true);
}

function getOrderList(orderType,hotelId){
	if(window.isLoadingData)return;
	window.hasOrderIds = [];
	window.$moreNo.hide();
	window.$more.hide();
	$load.removeClass('hidden');
	window.isLoadingData == true;
	window.currentPage = 1;
	$("#order-tab div[value="+orderType+"]").css({backgroundColor:"rgb(2,179,207)",color:'white'});
	$('#my-hotels').show();
	//隐藏 orderInfo
	$(_orderList.orderDetailSelector).hide();
	$('#order-list .order-item:gt(0)').remove();
	$('#order-list').show();
	
	$.ajax({
		url:root + '/rest/order/getOrderList',
    type: 'POST', 
    data: JSON.stringify({"hotelId":hotelId,"status":orderType,"pageNum": 1}), 
    dataType: 'json',
    contentType:'application/json;charset=UTF-8',        
    success: function(result) { 
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
    	renderOrderList(orderListData);
    } 
	});
}


function loadMorePage(orderType,hotelId){
  isLoadingMore = true;
  $.ajax({
		url:root + '/rest/order/getOrderList',
    type: 'POST', 
    data: JSON.stringify({"hotelId":hotelId,"status":orderType,"pageNum": currentPage}), 
    dataType: 'json',
    contentType:'application/json;charset=UTF-8',        
    success: function(result) { 
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
    	renderOrderList(orderListData);
    }
	});
}


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