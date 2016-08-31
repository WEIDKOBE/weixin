var _config={};
/**
 * 每个页面必须的一步
 */
_config.isWx = navigator.userAgent.indexOf('MicroMessenger/')!=-1 ? true : false;
var root = location.origin+ctx;
//var root = 'http://hotel-test.rsscc.com/supplier';
//_TIME_STAMP_DEFINE_PLACE
$.ajax({
	url:root + '/rest/supplier/getAccountInfo',
	type: 'GET',
	async: false,
	dataType: 'json',
	contentType:'application/json;charset=UTF-8',
	success: function(result) {
		if(result && result.type){
			createCookie('supplier_type',result.type);
		}
	}
});
_config.jsUrl = root + "/js" + pageName.substring(pageName.indexOf("WEB-INF")+7).replace(/p$/,'');
_config.cssUrl = root + "/css" + pageName.substring(pageName.indexOf("WEB-INF")+7).replace(/jsp$/,'') + "css";
_config.commCssUrl = root + "/css" + "/weixin/common.css";

/**
 * 进行缓存处理的时候会有这个
 */
if(typeof _TIME_STAMP_ != 'undefined' && _TIME_STAMP_!=null ){
	var _value_ = _config.jsUrl;
	_config.jsUrl = _value_.substring(0,_value_.lastIndexOf('.')) + _TIME_STAMP_ + _value_.substring(_value_.lastIndexOf('.'));
	_value_ = _config.cssUrl;
	_config.cssUrl = _value_.substring(0,_value_.lastIndexOf('.')) + _TIME_STAMP_ + _value_.substring(_value_.lastIndexOf('.'));
}

use(_config.cssUrl);
use(_config.commCssUrl);
use(_config.jsUrl);

function exe(){
	if(typeof init != 'undefined'){
		init();
		checkUnreadMsg();
	}else{
		settimeout(exe,100);
	}
}
$(function(){
	exe();
})
/**
* 新消息提示
* 如果有 tab且有未读消息 则渲染
*/
function checkUnreadMsg(){
	$.ajax({
		url:root + '/rest/order/getUnreadMsgCount?hotelId=0',
		type: 'GET',
		dataType: 'json',
		contentType:'application/json;charset=UTF-8',
		success: function(result) {
			if(result.allOrder){
				$('#order').addClass('tab-new-message-mark').attr({msgCount:result.allOrder});
			}
		}
	});
}