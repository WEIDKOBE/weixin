
var _params;

function init(){
	initHeadTab();
	//1. 缓存URL参数
	_params = getUrlParams();
	//2. 渲染酒店名称
	$('#hotelName').html(_params.hotelName);
	//3. 渲染选择列表
	renderRoomType();
	//4. 绑定事件
	//bindSelectEvent();
	//5. 绑定操作（增加、取消）事件
	bindOperateEvent();
}

/**
 * 渲染房间类型
 */
function renderRoomType(){
	$.ajax({
		url:root + '/rest/hotel/getRoomTypeList?hotelId='+_params.hotelId,
	    type: 'GET', 
	    dataType: 'json',
	    contentType:'application/json;charset=UTF-8',        
	    success: function(result) { 
	    	var length = result.length;
	    	//$("#roomType .item:gt(1)").remove();
	    	for(var i=0;i<length;i++){
	    		var copy = $("#roomType .item:first").clone();
	    		if(result[i].status == 0){
	    			copy.find('.text').html(result[i].nameChs+'/'+result[i].bedtype+'<span style="color:#f00">(未审核)</span>');
	    			copy.find('.iconArea').remove();
	    		} else {
	    			copy.find('.text').html(result[i].nameChs+'/'+result[i].bedtype);
	    		}
	    		
	    		copy.attr('value',result[i].id);
	    		copy.removeClass('item-none').addClass('item-show');
	    		$('#roomType').append(copy);
	    	}
	    	$load.addClass('hidden');
	    	bindSelectEvent();
	    } 
	});
}


function bindSelectEvent(){
	var ids = ['roomType','breakfast','payMethod'];
	//绑定事件
	for(var i=0;i<ids.length;i++){
		$('#'+ids[i]+' .item').click(function(){
			if($(this).find('.iconArea').length <= 0){
				return false;
			}
			if($(this).find('#maximum-breakfast').length){
				var breakfastItem = $('#item-maximum-breakfast');
				var breakfast = $('#maximum-breakfast');

				var val = breakfast.val();
				var valFormat = parseInt(val);
				if(Number.isFinite(valFormat) && (/^\d{1,2}$/.test(valFormat)) ){
					breakfastItem.attr('value',valFormat);
				} else {
					alert('请输入一位或者二位数字');
					breakfast.val(4);
					$('#breakfast').attr('value',4);
					breakfast.focus();
				}
			}
			var id=$(this).parent().attr('id');
			$('#'+id).attr('value',$(this).attr('value'));
			$('#'+id+' .icon').removeClass('green').addClass('gray');
			$(this).find(".icon").removeClass('gray').addClass('green');
		});
	}

	$('#maximum-breakfast').click(function(event) {
		return false;
	});
	$('#maximum-breakfast').blur(function(event) {
		$(this).closest('.item').trigger('click');
	});
	
	//触发事件
	$('#roomType .item:has(.iconArea)').eq(1).click();
	$('#breakfast .item').eq(1).click();
	$('#payMethod .item').eq(0).click();
}


function bindOperateEvent(){
	//增加按钮事件
	$("#add-product").click(function(){
		//1. 验证数据
		var breakfastVal = $('#breakfast').attr('value');
		var valFormat = parseInt(breakfastVal);
		if(/^\d{1,2}$/.test(valFormat)){
		} else {
			alert('请输入一位或者二位数字');
			$('#maximum-breakfast').val(4);
			$('#maximum-breakfast').focus();
			$('#breakfast').attr('value',4);
			return false;
		}


		var ids = ['roomType','breakfast'];
		for(var i=0;i<ids.length;i++){
			if($('#'+ids[i]).attr('value')==""){
				_amain.Messager.alert("请等待页面初始化完毕！");
				return;
			}
		}
		var roomTypeId = $('#roomType').attr('value');
		var roomTypeName = $('#roomType').find("[value="+roomTypeId+"] .text").html();
		$load.removeClass('hidden');
		//2. 提交
		$.ajax({
			url:root + '/rest/hotel/addRoomProduct',
	        type: 'POST', 
	        data: JSON.stringify({
		        	hotelId:_params.hotelId,
		        	roomTypeId:roomTypeId,
		        	//roomTypeName:roomTypeName,
		        	breakfastQty:$('#breakfast').attr('value'),
		        	paymentMethod:$('#payMethod').attr('value')
	        	}), 
	        dataType: 'json',
	        contentType:'application/json;charset=UTF-8',        
	        success: function(result) { 
	        		$load.addClass('hidden');
	            if(result.code==100){
	            	_amain.Messager.alert("添加成功！",goBack);
	            }else if(result.code==200){
	            	_amain.Messager.alert(result.msg);
	            }else{
	            	_amain.Messager.alert('未知错误！');
	            }
	        } 
	    });
		
	});
	//取消按钮事件 -- 跳转回父页面
	$('#cancel').click(function(){
		goBack();
	});
}

function goBack(){
	var url = root + '/weixin/room/roomList.jsp?hotelId='+_params.hotelId+'&hotelName='+_params.hotelName;
	location.href = url;
}