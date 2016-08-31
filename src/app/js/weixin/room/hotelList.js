
function init(){
	initHeadTab();
	$.ajax({
		url:root + '/rest/hotel/getHotelList',
	    type: 'POST', 
	    dataType: 'json',
	    contentType:'application/json;charset=UTF-8',        
	    success: function(result) { 
	    	var length = result.length;
	    	for(var i=0;i<length;i++){
	    		var copy = $("#hotel-list .hotel-item:first").clone();
	    		copy.find('.hotelName').html(result[i].name);
	    		copy.show();
	    		copy.find('.edit').attr('href',root + '/weixin/room/roomList.jsp?hotelId='+result[i].id+'&hotelName='+result[i].name);
	    		copy.find('.switch').attr('hotelId',result[i].id).attr('hotelName',result[i].name);
	    		if(result[i].isOnline==0){
	    			copy.find('.switch').removeClass('switch-on').addClass('switch-off');
	    		}
	    		$('#hotel-list').append(copy);
	    	}
	    	$('#hotel-list').on('click', '.switch', function(){
	    		var hotelName = $(this).attr('hotelName');
	    		window.currentHotelId = $(this).attr('hotelId');
	    		if($(this).attr('class').indexOf('switch-on')==-1){
	    			_amain.Messager.confirm("是否要开放 "+hotelName+" 的预定?",function(){
	    				_Jquery.get(root+'/rest/hotel/openHotelBook?hotelId='+currentHotelId,function(result){
	    					if(result.code==100){
	    						_amain.Messager.alert(result.msg);
	    						$('[hotelId='+currentHotelId+']').removeClass('switch-off').addClass('switch-on');
	    					}else{
	    						_amain.Messager.alert(result.msg);
	    					}
	    				});
	    				console.log("TODO ：开启酒店预订服务调用，并回显。");
	    			});
	    		}else{
	    			_amain.Messager.confirm("是否要关闭 "+hotelName+" 的预定?",function(){
	    				_Jquery.get(root+'/rest/hotel/closeHotelBook?hotelId='+currentHotelId,function(result){
	    					if(result.code==100){
	    						_amain.Messager.alert(result.msg);
	    						$('[hotelId='+currentHotelId+']').removeClass('switch-on').addClass('switch-off');
	    					}else{
	    						_amain.Messager.alert(result.msg);
	    					}
	    				});
	    				console.log("TODO ：关闭酒店预订服务调用，并回显。");
	    			});
	    		}
	    	});
				$load.addClass('hidden');
	    } 
	});
}