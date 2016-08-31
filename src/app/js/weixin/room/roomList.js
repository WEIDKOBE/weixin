
var roomList = [{roomType:'',bedType:'',breakfast:'',payMethod:''}];
var _params;
function init(){
	initHeadTab();
	//1. 缓存参数
	_params = getUrlParams();
	
	//2. 渲染酒店名称
	$('#hotelName').html(_params.hotelName);
	
	//3. 渲染房型列表
	renderRoomList();
	
	//4. 添加产品按钮
	bindAddProductButton();
}

/**
 * 渲染房型列表
 */
function renderRoomList(){
	$.ajax({
		url:root + '/rest/hotel/getRoomProductList?hotelId='+_params.hotelId,
	    type: 'GET', 
	    dataType: 'json',
	    contentType:'application/json;charset=UTF-8',        
	    success: function(result) { 
	    	var length = result.length;
	    	for(var i=0;i<length;i++){
	    		var copy = $("#room-list .room-item:first").clone();	
	    		copy.find('.roomType').html(productShow(result[i]));
	    		copy.show();
	    		copy.find('.edit').attr('href',root + '/weixin/room/roomCalendar.jsp?hotelId='+_params.hotelId+'&hotelName='+_params.hotelName+'&roomId='+result[i].id);
	    		copy.find('.switch').attr('roomProductId',result[i].id).attr('roomProductName',productShow(result[i]));
	    		if(result[i].isClosed==1){
	    			copy.find('.switch').removeClass('switch-on').addClass('switch-off');
	    		}
	    		$('#room-list').append(copy);
	    	}
	    	$load.addClass('hidden');
	    	$('#room-list').on('click','.switch', function(){
	    		var hotelName = $(this).attr('roomProductName');
	    		window.currentId = $(this).attr('roomProductId');
	    		if($(this).attr('class').indexOf('switch-on')==-1){
	    			_amain.Messager.confirm("是否要开启 "+hotelName+" 的预定?",function(){
	    				_Jquery.get(root+'/rest/hotel/openRoomProductBook?roomProductId='+currentId,function(result){
	    					if(result.code==100){
//	    						_amain.Messager.alert(result.msg);
	    						$('[roomProductId='+currentId+']').removeClass('switch-off').addClass('switch-on');
	    					}else{
	    						_amain.Messager.alert(result.msg);
	    					}
	    				});
	    				console.log("TODO ：开启酒店预订服务调用，并回显。");
	    			});
	    		}else{
	    			_amain.Messager.confirm("是否要关闭 "+hotelName+" 的预定?",function(){
	    				_Jquery.get(root+'/rest/hotel/closeRoomProductBook?roomProductId='+currentId,function(result){
	    					if(result.code==100){
//	    						_amain.Messager.alert(result.msg);
	    						$('[roomProductId='+currentId+']').removeClass('switch-on').addClass('switch-off');
	    					}else{
	    						_amain.Messager.alert(result.msg);
	    					}
	    				});
	    				console.log("TODO ：关闭酒店预订服务调用，并回显。");
	    			});
	    		}
	    	});
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
 * 绑定增加产品按钮
 */
function bindAddProductButton(){
	$('#addProductButton').click(function(){
		location.href = root + "/weixin/room/roomAdd.jsp?hotelId="+_params.hotelId+"&hotelName="+_params.hotelName;
	});
	$('#addRoomTypeButton').click(function(){
		location.href = root + "/weixin/room/roomTypeAdd.jsp?hotelId="+_params.hotelId+"&hotelName="+_params.hotelName;
	});
}