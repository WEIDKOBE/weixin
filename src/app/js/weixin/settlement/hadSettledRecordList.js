

function init(){
	//1.获取收款 列表
	getSettlementList();
	//4. 绑定左上角回退按钮事件
	$('#back').click(function(){history.back()});
}

function getSettlementList(){
	
	$.ajax({
		url:root + '/rest/settlement/getWithdrawListInfo',
	    type: 'GET', 
	    dataType: 'json',
	    contentType:'application/json;charset=UTF-8',        
	    success: function(result) { 
	    	var list = $("#record-list");
	    	var item = $("#record-list .item");
	    	for(var i=0;i<result.list.length;i++){
	    		var temp = item.clone();
	    		temp.find('.date').html(result.list[i].time.replace(/-/g,'.'));
	    		temp.find(".price").html(result.list[i].price);
	    		temp.data({id:result.list[i].id});
	    		temp.show();
	    		list.append(temp);
	    	}
	    	$('.total-price').html(result.totalPrice?result.totalPrice:0);
	    	$load.addClass('hidden');
				$wrap.addClass('show');
	    	//2.绑定事件
	    	bindClickEvent();
	    } 
	});
}
function bindClickEvent(){
	$("#record-list .item").click(function(){
		location.href=root+"/weixin/settlement/hadSettledList.jsp?id="+$(this).data("id");
	});
}