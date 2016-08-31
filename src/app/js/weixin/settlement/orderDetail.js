

function init(){
	//1. 缓存URL参数
	_params = getUrlParams();
	//2. 获取并渲染数据
	getAndRenderData();
	//4. 绑定左上角回退按钮事件
	$('#back').click(function(){history.back()});
}

function getAndRenderData(){
	
	$.ajax({
		url:root + '/rest/settlement/getOrderDetailInfo?orderId='+_params.id,
	    type: 'GET', 
	    dataType: 'json',
	    contentType:'application/json;charset=UTF-8',        
	    success: function(result) { 
	    	renderOrderInfo(result);
	    } 
	});
}

function renderOrderInfo(data){
	//隐藏 orderList
	$('#order-list').hide();
	$('#order-detail').show();
	if(Constants.getOrderStatus(data.status,data.subStatus)!==undefined){
		data.status=Constants.getOrderStatus(data.status,data.subStatus);
	}
	
	var autoWiredField = ["status", "orderNo", "reservationDate", "hotelConfirmNo", 
	                      "confirmDate", "hotelName", "paymentMethod", "cancelPolicy", "arrivedate",
	                      "leavedate", "roomCount", "totalPrice", "checkInPeopleName",
	                      "checkInPeoplePhone", "orderPeopleName", "orderPeoplePhone","bedtypePrefer"];
	$('#order-detail').data(data);
	
	renderAutoWiredField(data,autoWiredField);
	
	//渲染 酒店信息 需要组装
	var roomInfo = "";
	roomInfo+=data.roomtypeName?data.roomtypeName+',':'';
	roomInfo+=data.bedtype?data.bedtype+',':'';
	roomInfo+=data.breakfastQty?data.breakfastQty+',':'';
	roomInfo+=data.paymentMethod?data.paymentMethod+',':'';
	
	$('#roomdetial').html(roomInfo.replace(/,$/,''));

	$load.addClass('hidden');
	$wrap.addClass('show');
    
	//renderNeedSwitchedField(data);
	
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
		$('#'+fields[i]).html(value);
	}
}

/**
 * 需要特殊处理的字段
 * @for orderDetail
 * @param data
 */
function renderNeedSwitchedField(data){
	var needSwitchedField = ['status','createTime','breakfastQty','totalDays'];
	
	data.status=getOrderStatus(data.status);
	
	if(!data.createTime)data.createTime=(new Date()).Format('yyyy/MM/dd');
	
	
	data.breakfastQty=getBreakfastQty(data.breakfastQty);
	
	data.totalDays=computeDays(data.arrivedate,data.leavedate);
	
	renderAutoWiredField(data,needSwitchedField);
}