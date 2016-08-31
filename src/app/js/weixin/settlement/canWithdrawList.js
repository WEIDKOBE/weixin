

function init(){
	//1.获取数据并渲染
	getCanNotWithdraw();
	//4. 绑定左上角回退按钮事件
	$('#back').click(function(){history.back()});
}

function getCanNotWithdraw(){
	$.ajax({
		url:root + '/rest/settlement/getCanWithdrawHotelInfo',
	    type: 'GET', 
	    dataType: 'json',
	    contentType:'application/json;charset=UTF-8',        
	    success: function(result) { 
	    	var orderList = $("#order-list");
	    	var item = orderList.find(".item");
	    	
	    	for(var i=0;i<result.list.length;i++){
	    		var temp = item.clone();
	    		temp.find(".hotel-name").html(result.list[i].hotelName);
	    		temp.find(".room-type").html(getRoomType(result.list[i]));
	    		temp.find(".date").html(getDate(result.list[i]));
	    		temp.find(".cause").html("");
	    		temp.find(".price span").html(result.list[i].supplierPrice);
	    		temp.show();
	    		temp.data({id:result.list[i].id});
	    		orderList.append(temp);
	    	}
	    	
	    	$('.total-price').html(result.totalPrice?result.totalPrice:0);
	    	$('#alert-money').html(result.totalPrice?result.totalPrice:0);
	    	$load.addClass('hidden');
	    	$wrap.addClass('show');
	    	//2.绑定点击事件
	    	bindClickEvent();
	    } 
	});
}

function bindClickEvent(){
	$('#order-list .item').click(function(){
		location.href=root + "/weixin/settlement/orderDetail.jsp?id="+$(this).data('id');
	});
	//2.
	$('#confirm-button').click(function(){
		$('#confirm-window').hide();
		$.ajax({
			url:root + '/rest/settlement/applyWithdrawAllOrder',
		    type: 'GET', 
		    dataType: 'json',
		    contentType:'application/json;charset=UTF-8',        
		    success: function(result) { 
		    	if(result){
		    		alert("提现成功！");
		    		location.reload();
		    	}else{
		    		alert("申请失败，请稍后重试！");
		    	}
		    } 
		});
	});
	$("#cancel-button").click(function(){
		$('#confirm-window').hide();
	});
	//3.
	$("#total-price").click(function(){
		if(parseFloat($('.total-price').text())>0){
			$('#confirm-window').show();
		}
	});
	if(parseFloat($('.total-price').text())<=0){
		$('.button').css({backgroundColor:'gray'});
	}
}

function getRoomType(item){
	return "("+item.roomtypeName+"/"+item.bedtype+"/"+item.breakfastQty+"/"+item.paymentMethod+")";
}

function getDate(item){
	return item.roomCount+"间/"+item.arrivedate.replace(/-/g,".")+" - "
		+item.leavedate.replace(/-/g,".")+"("+computeDays(item.arrivedate,item.leavedate)+"晚)";
	
}