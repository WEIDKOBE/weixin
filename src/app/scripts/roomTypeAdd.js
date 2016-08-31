
var _params;

function init(){
	//1. 缓存URL参数
	_params = getUrlParams();
	//2. 渲染酒店名称
	$('#hotelName').html(_params.hotelName);
	//4. 绑定事件
	bindSelectEvent();
	//5. 绑定操作（增加、取消）事件
	bindOperateEvent();

	$load.addClass('hidden');
}
init();


function bindSelectEvent(){
	var $bedType = $("#bedType");
	var $icon = $bedType.find('.icon');
	$bedType.on('click','.item',function(){
		$icon.removeClass('green').addClass('gray');
		$(this).find(".icon").removeClass('gray').addClass('green');
		var value = $(this).attr('value');
		$bedType.attr('value',value);
	});
}


function bindOperateEvent(){
	//增加按钮事件
	var bedTypeName = ['大床','双床','大床或双床'];
	$("#add-roomType").click(function(){
		//1. 验证数据
		var roomTypeName = $('#new-roomType-input').val();
		if(!roomTypeName){
			alert('房态名称不能为空');
			$('#new-roomType-input').focus();
			return false;
		}
		var bedType = bedTypeName[$('#bedType').attr('value')];
		$load.removeClass('hidden');
		//2. 提交
		$.ajax({
			url:root + '/rest/hotel/saveRoomType',
	        type: 'POST', 
	        data: JSON.stringify({
		        	hotelId:_params.hotelId,
		        	nameChs:roomTypeName,
		        	bedtype:bedType
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
	var url = './roomList.html?hotelId='+_params.hotelId+'&hotelName='+_params.hotelName;
	util.goByUrl(url);
}