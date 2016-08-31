
function init(){
	initHeadTab();
	//1. 缓存URL参数
	_params = getUrlParams();
	//2. 获取首页数据并显示
	getAndRenderData();
	//3. 绑定跳转页面
	bindClickEvent();
	//4. 绑定左上角回退按钮事件
	// $('#back').click(function(){history.back()});
}

function getAndRenderData(){
	$.ajax({
		url:root + '/rest/settlement/getHomeInfo',
	    type: 'GET', 
	    dataType: 'json',
	    contentType:'application/json;charset=UTF-8',        
	    success: function(result) { 
	    	$('#can-not-get-cash span').html(result.canNotWithdrawOrderNumber?result.canNotWithdrawOrderNumber:0);
	    	$('#can-get-cash span').html(result.canWithdrawTotalPrice?result.canWithdrawTotalPrice:0);
	    	$('#have-applied-cash span').html(result.haveApplyedWithdrawOrderNumber?result.haveApplyedWithdrawOrderNumber:0);
	    	$('#get-cash-record span').html(result.haveWithdrawCount?result.haveWithdrawCount:0);
	    	$load.addClass('hidden');
				$wrap.addClass('show');
	    } 
	});
}

function bindClickEvent(){
	$('#goto-can-not-get-cash-list').click(function(){
		location.href=root + "/weixin/settlement/canNotWithdrawList.jsp";
	});
	$('#goto-can-get-cash-list').click(function(){
		location.href=root + "/weixin/settlement/canWithdrawList.jsp";
	});
	$('#goto-have-applied-cash-list').click(function(){
		location.href=root + "/weixin/settlement/hadAppliedList.jsp";
	});
	$('#goto-get-cash-record-list').click(function(){
		location.href=root + "/weixin/settlement/hadSettledRecordList.jsp";
	});
}