
use(root+"/js/weixin/room/calendar.js");


function init(){
	initHeadTab();
	//1. 缓存参数
	_params = getUrlParams();
	//2. 渲染酒店名称
	$('#hotelName').html(_params.hotelName);
	//3. 渲染下拉框
	renderSelect();
	//4. 渲染日期
	renderDate();
	//5. 更新当前房态计划
	getRoomStatus();
	//6. 为input 增加限制
	addConstraint();
	//7. 绑定点击事件
	bindClickEvent();
	//
	bindChooseRevervationConditionEvent();
}

/**
 * 渲染下拉框
 */
function renderSelect(){
	$.ajax({
		url:root + '/rest/hotel/getRoomProductList?hotelId='+_params.hotelId,
	    type: 'GET', 
	    dataType: 'json',
	    contentType:'application/json;charset=UTF-8',        
	    success: function(result) { 
	    	_params.roomProductList = result;
	    	var select = document.getElementById('product');
	    	for(var i=0; i<result.length;i++){
	    		var option = document.createElement('option');
	    		option.setAttribute('value',result[i].id);
	    		if(_params.roomId == result[i].id){
	    			option.setAttribute('selected',true);
	    			window.paymentMethod=result[i].paymentMethod;
	    			if(window.paymentMethod=='到付'){
	    				$('#arrive-price-container').show().find('.edit-field').html("房费(到付)");
	    				$('#settlement-price-container').show().find('.edit-field').html("服务费(预付)");
	    			}
	    		}
	    		option.innerText=productShow(result[i]);
	    		select.appendChild(option);

	    		$load.addClass('hidden');
					$wrap.addClass('show');
	    	}
	    	select.onchange=function(){
	    		_params.roomId = $('#product').val();
	    		//getRoomStatus();
	    	}
	    } 
	});
}

/**
 * 产生房型现实名称
 */
function productShow(product){
	var roomType = product.roomTypeName ? product.roomTypeName : "未知";
	var bedType = product.bedType ? product.bedType : "未知";
	var breakfast = product.breakfastQty ? product.breakfastQty : "未知";
	var payMethod = product.paymentMethod ? product.paymentMethod : "未知";

	return roomType+'/'+bedType+'/'+breakfast+'/'+payMethod;
}

/**
 * 渲染日期
 */
function renderDate(){
	var dateHtml = new Date(_params.startDate).Format("yyyy年MM月dd日");
	if(_params.endDate){
		dateHtml += '&nbsp;-&nbsp;' + new Date(_params.endDate).Format("yyyy年MM月dd日");
	}
	if(_params._reg){
		var reg=_params._reg;
		var replace=[['0','日'],['1','一'],['2','二'],['3','三'],['4','四'],['5','五'],['6','六']];
		for(var i=0;i<replace.length;i++){
			reg=reg.replace(replace[i][0],replace[i][1]);
		}		
		dateHtml+="（"+reg+"）";
	}
	$('#date').html(dateHtml);
}

/**
 * 获取当前编辑的房态
 */
function getRoomStatus(){
	if(_params.endDate){
		$("#settlementPrice").val('￥');
		$("#arrive-price").val('￥');
		return;
	}
	$.ajax({
		url:root + '/rest/hotel/getRoomStatus?roomProductId='+_params.roomId+'&date='+_params.startDate,
		type: 'GET', 
	    //dataType: 'json',
	    contentType:'application/json;charset=UTF-8',        
	    success: function(result) { 
	    	if(result){
	    		_params.roomStatus = result;
	    		$("#settlementPrice").val('￥'+result.settlementPrice);
	    		$("#arrive-price").val('￥'+result.collectPrice);
	    		$("#room-count").val(result.qtyable);
	    		$('#reservation-condition .icon').removeClass('green').addClass('gray');
	    		$('#reservation-condition-display').html(result.advanceBooking);
	    	}else{
	    		$("#settlementPrice").val('￥');
	    		$("#arrive-price").val('￥');
	    		$("#room-count").val("");
	    		// console.log("meiyou !");
	    	}

	    	$load.addClass('hidden');
				$wrap.addClass('show');
	    } 
	});
}
/**
 * 输入约束
 */
function addConstraint(){
	$('#settlementPrice').focus(function(){
		$(this).val($(this).val().replace(/￥/g,''));
	}).blur(function(){
		if(/^[1-9]\d*$/.test($(this).val())){
			$(this).val('￥'+$(this).val());
			$('#price-warn').html('');
		}else{
			$('#price-warn').html('请输入正确的价格（大于0的整数）！')
		}
	});
	$('#arrive-price').focus(function(){
		$(this).val($(this).val().replace(/￥/g,''));
	}).blur(function(){
		if(/^[1-9]\d*$/.test($(this).val())){
			$(this).val('￥'+$(this).val());
			$('#arrive-price-warn').html('');
		}else{
			$('#arrive-price-warn').html('请输入正确的价格（大于0的整数）！')
		}
	});
	$('#room-count').change(function(){
		//$(this).val($(this).val().replace(/[^0-9]/g,''));
	});
}

/**
 * 绑定点击事件
 */
function bindClickEvent(){
	/**
	 * 增加房态
	 */
	$('#add-product').click(function(){
		if(validate()){
			saveRoomStatus();
		}
	});
	
	/**
	 * 取消编辑
	 */
	$('#cancel').click(function(){
		cancel();
	});
	
	$('#reservation-condition-red').click(function(){
		var val = parseInt($('#reservation-condition-display').html());
		if(val>0){
			$('#reservation-condition-display').html(val-1);
		}
	});
	
	$('#reservation-condition-add').click(function(){
		var val = parseInt($('#reservation-condition-display').html());
		$('#reservation-condition-display').html(val+1);
	});
}

function validate(){
	var regPrice = /^￥[1-9]\d*$/;
	var regNum = /[0-9]+/;
	var flag = true;
	if(new RegExp('到付$').test($('#product [value='+_params.roomId+']').text())){
		if(!regPrice.test($('#arrive-price').val())){
			flag=false;
			$('#arrive-price-warn').html('请输入正确的价格（大于0的整数）！')
		}else{
			$('#arrive-price-warn').html('')
		}
	}
	if(!regPrice.test($('#settlementPrice').val())){
		flag = false;
		$('#price-warn').html('请输入正确的价格（大于0的整数）！')
	}else{
		$('#price-warn').html('');
	}
	
	if(!regNum.test($('#room-count').val())){
		flag = false;
		$('#count-warn').html('请输入房间数量！')
	}else{
		$('#count-warn').html('')
	}
	return flag;
}

//保存最新设置的价格 和 房间数量
function saveRoomStatus(){
	var roomInfo = getRoomInfo(_params.roomId);
	var roomProductId = roomInfo.id;
	var hotelId = _params.hotelId;
	var roomtypeId = roomInfo.roomTypeId;
	var qtyable =  $('#room-count').val();
	var date = _params.startDate;
	var settlementPrice = $('#settlementPrice').val();
	if(settlementPrice.indexOf('￥')==0){
		settlementPrice = settlementPrice.substring(1);
		if(settlementPrice.trim()==''){
			$('#settlementPrice').focus();
			$('#settlementPrice').blur();
			return;
		}
	}
	var collectPrice = $('#arrive-price').val();
	if(window.paymentMethod!='到付'){
		collectPrice = 0;
	}else if(collectPrice.indexOf('￥')==0){
		collectPrice = collectPrice.substring(1);
		if(collectPrice.trim()==''){
			$('#arrive-price').focus();
			$('#arrive-price').blur();
			return;
		}
	}
	//{"hotelId":1,"roomtypeId":2,"roomProductId":2,"qtyable":20,"settlementPrice":330,"dateList":['2015-07-02','2015-07-03']}
	var queryParam = {
			"hotelId":hotelId,
        	"roomtypeId":roomtypeId,
        	"roomProductId":roomProductId,
        	"qtyable":qtyable,
        	"settlementPrice":settlementPrice,
        	"advanceBooking":$('#reservation-condition-display').html(),
        	"collectPrice":collectPrice
	};
	queryParam.dateList = getDateList();
	$load.removeClass('hidden');
	$.ajax({
		url:root + '/rest/hotel/addOrModifyRoomStatus',
        type: 'POST', 
        data: JSON.stringify(queryParam), 
        dataType: 'json',
        contentType:'application/json;charset=UTF-8',        
        success: function(result) { 
            if(result){
            	cancel();
            }else{
            	$load.addClass('hidden');
            	alert('修改错误！');
            }
            
        }
	});
	
}
/**
 * 获取操作的日期数组
 * @returns {Array}
 */
function getDateList(){
	var dateList = [];
	var day = 1000*60*60*24;
	if(_params.endDate===undefined && _params.startDate){//选择一天进行操作
		dateList.push(_params.startDate);
	}else if( _params.startDate && _params.endDate){//连续选择多天
		var start = new Date(_params.startDate).getTime();
		var end = new Date(_params.endDate).getTime();
		for(;start<=end;start+=day){
			var temp = new Date(start);
			var dateStr = temp.Format('yyyy-MM-dd');
			if(new RegExp('^['+_params._reg+']$').test(temp.getDay())){//某个月的周末
				dateList.push(dateStr);
			}
		}
	}
	return dateList;
}

function cancel(){
	var url = root + '/weixin/room/roomCalendar.jsp?hotelId='+_params.hotelId
				+'&hotelName='+_params.hotelName+'&roomId='+_params.roomId;
	location.href = url;
}

function getRoomInfo(id){
	var roomInfo=null;
	for(var i=0;i<_params.roomProductList.length;i++){
		if(_params.roomProductList[i].id==id){
			roomInfo = _params.roomProductList[i];
		}
	}
	return roomInfo;
}

function bindChooseRevervationConditionEvent(){
	$('#reservation-condition .item').click(function(){
		$('#reservation-condition .item .icon').removeClass('green').addClass('gray');
		$(this).find('.icon').removeClass('gray').addClass('green');
	});
}