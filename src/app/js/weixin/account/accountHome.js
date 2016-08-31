
function init(){
	initHeadTab();
	//1. 缓存参数
	_params = getUrlParams();
	//2. 获取账号信息
	getAccountInfo();
	//3. 退出登录
	$('#logout').click(logout);
	//4. 跳转结算页面
	$('#settlement').click(gotoSettlement);
	//5. 绑定上下班操作
	bindWorkSwitch();
}

function getAccountInfo(){
	$.ajax({	
		url:root + '/rest/supplier/getAccountInfo',
	    type: 'GET', 
	    dataType: 'json',
	    contentType:'application/json;charset=UTF-8',        
	    success: function(result) { 
	    	$('#name').html(result.name);
	    	$('#phone').html(result.phone);
	    	$('#cityManagerName').html(result.cityManagerName);
	    	$('#cityManagerPhone').html(result.cityManagerPhone);
	    	if(result.isworking==1){
	    		$('#isworking .switch').removeClass('switch-off').addClass('switch-on');
	    	}else{
	    		$('#isworking .switch').removeClass('switch-on').addClass('switch-off');
	    	}
	    	$load.addClass('hidden');
	    	$wrap.addClass('show');
	    } 
	});
}

function logout(){
	$load.removeClass('hidden');
	$.ajax({	
		url:root + '/rest/supplier/logout',
	    type: 'GET', 
	    dataType: 'json',
	    contentType:'application/json;charset=UTF-8',        
	    success: function(result) { 
	    	$load.addClass('hidden');
	    	if(result){
	    		location.href = root + '/weixin/login.jsp';
	    	}else{
	    		alert('退出失败');
	    	}
	    } 
	});
}


function bindWorkSwitch(){
	$('#isworking').on('click', '.switch', function(){
		if($(this).attr('class').indexOf('switch-on')!=-1){
			_Jquery.get(root+'/rest/supplier/stopWork',function(result){
				if(result.code==100){
					$('#isworking .switch').removeClass('switch-on').addClass('switch-off');
					_amain.tips.open(result.msg);
				}else{
					_amain.Messager.alert(result.msg);
				}
			});
		}else{
			_Jquery.get(root+'/rest/supplier/startWork',function(result){
				if(result.code==100){
					$('#isworking .switch').removeClass('switch-off').addClass('switch-on');
					_amain.tips.open(result.msg);
				}else{
					_amain.Messager.alert(result.msg);
				}
			});
		}
	});
}
