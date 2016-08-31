/**
 * @note:the arguments must not be null
 * @param many strings that reference a real file path
 * 	like using('a.js','b.js','c.css','d.css')
 * @param an array that evey element of it reference a real file path
 * 	like using(['a,js','b.js','c.js'])
 */
function use(){
	var args = (typeof arguments[0])=='string'?arguments : arguments[0];
    var len = args.length;
    if(!len) throw TypeError('arguments can be an object of array and the length >=1');
    for(var i=0;i<len;i++){
       var path = args[i],
       ele;
       if(/.js$/.test(path)){//根据文件后缀判断是否为 js 文件
            ele = document.createElement('script');
            ele.type = "text/javascript";
            ele.src = path;
            document.head.appendChild(ele);
        }else if(/.css$/.test(path)){//根据文件后缀判断是否为 css 文件
            ele = document.createElement('link');
            ele.type = 'text/css';
            ele.rel = 'stylesheet';
            ele.href = path;
            document.head.appendChild(ele);
        }else{//当参数不合法时抛出类型错误
            throw TypeError('argument type should be a .css or .js file path');
        }
    }
}

/*************************************************
*   Cookie Utilities                             *
**************************************************/
function readCookie(name) {
	// 因为有的浏览器不支持 中文字符集的cookie 所以 encodeURIComponent ---- start
	name = encodeURIComponent(name);
	// 因为有的浏览器不支持 中文字符集的cookie 所以 encodeURIComponent ---- end
    var nameEQ = name + "=";
    var ca = document.cookie.split(';');
    for (var i = 0; i < ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) == ' ')
            c = c.substring(1, c.length);
        if (c.indexOf(nameEQ) == 0)
        	// 因为有的浏览器不支持 中文字符集的cookie 所以 decodeURIComponent ---- start
            return decodeURIComponent(c.substring(nameEQ.length, c.length));
        	// 因为有的浏览器不支持 中文字符集的cookie 所以 decodeURIComponent ---- end
    }
    return null;
	//return localStorage.getItem(name);
}

function createCookie(name, value, days) {
	// 因为有的浏览器不支持 中文字符集的cookie 所以 encodeURIComponent ---- start
	name = encodeURIComponent(name);
	value = encodeURIComponent(value);
	// 因为有的浏览器不支持 中文字符集的cookie 所以 encodeURIComponent ---- end
    if (days) {
        var date = new Date();
        date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
        var expires = "; expires=" + date.toGMTString();
    }
    else var expires = "";
    document.cookie = name + "=" + value + expires + "; path=/";
	//localStorage.setItem(name,value);
}

function eraseCookie(name) {
    createCookie(name, "", -1);
}

function getUrlParams(){
	var paramStr = location.href.split("?")[1];
	var paramArrays = [];
	if(paramStr){
		var paramArrays = paramStr.split('#')[0].split("&");
	}
	var urlParams={};
	paramArrays.forEach(function(e){
			e=e.replace(/@@@@/g,"?").replace(/@@/g,"=").replace(/@/g,'/');
			var keyValue = e.split("=");
			urlParams[keyValue[0]]=decodeURI(keyValue[1]);
		});
	for(index in urlParams){
		if(index.indexOf('sessionStorage')==0){
			sessionStorage[index]=urlParams[index];
		}
	}
	return urlParams;
}

function onlyDigital(e){
	if(e.keyCode == 8){

	}else if(e.type == 'keypress' || e.type == 'keydown'){
		e.preventDefault();
		var keyCode = e.keyCode;
		if(keyCode>=48 && keyCode<=57){
			var value = $(this).val();
			value += String.fromCharCode(keyCode);
			$(this).val(value.replace(/[^0-9]/g,''));
		}
	}else{
		var value = $(this).val();
		var keyCode = value.charCodeAt(value.length-1);
		if(keyCode<48 || keyCode>57){
			console.log(value);
			value = value.substring(0,value.length-1);
			$(this).val(value.replace(/[^0-9]/g,''));
		}
	}
}

/**
 * 初始化 head tab 为房态加链接
 */
function initHeadTab(){
	var  roomHomeUrl = root + "/weixin/room/hotelList.jsp";
	var  orderHomeUrl = root + "/weixin/order/orderList.jsp";
  var  accountHomeUrl = root + '/weixin/account/accountHome.jsp';
	var  settlementUrl = root + '/weixin/settlement/settlement.jsp';
	$('#room a').attr('href',roomHomeUrl);
	$('#order a').attr('href',orderHomeUrl);
  $('#settlement a').attr('href',settlementUrl);
	$('#account a').attr('href',accountHomeUrl);

	var pageUrl = location.href;
  // var $tabs = $('#tabs');
  // var $tabItem = $tabs.find('.tab-item');
  // $tabItem.removeClass('tab-item-selected');
	if(pageUrl.indexOf('weixin/account')!=-1){
		$('#account').addClass('tab-item-selected');
		document.title="账号";
    $('#account a').attr('href','javascript:void(0)');
	}else if(pageUrl.indexOf('weixin/room')!=-1){
		$('#room').addClass('tab-item-selected');
		document.title="房态";
    $('#room a').attr('href','javascript:void(0)');
	}else if(pageUrl.indexOf('weixin/settlement')!=-1){
    $('#settlement').addClass('tab-item-selected');
    document.title="结算";
    $('#settlement a').attr('href','javascript:void(0)');
  }else if(pageUrl.indexOf('weixin/order')!=-1){
		$('#order').addClass('tab-item-selected');
		document.title="账号管理";
    $('#order a').attr('href','javascript:void(0)');
	}
}


//浏览器兼容问题
if(typeof window.console==='undefined'){
	window.console={
		log:function(){}
	};
}

function computeDays(startTime,endTime){
	if(startTime==null || startTime=='' || endTime==null || endTime==''){
		return 0;
	}else{
		var endTime = new Date(endTime);
		var startTime = new Date(startTime);
		endTime.setHours(0);
		startTime.setHours(0);
		var secondes = endTime.getTime() - startTime.getTime();
		return Math.round(secondes/(1000*60*60*24));
	}
}

//对Date的扩展，将 Date 转化为指定格式的String
//月(M)、日(d)、小时(h)、分(m)、秒(s)、季度(q) 可以用 1-2 个占位符，
//年(y)可以用 1-4 个占位符，毫秒(S)只能用 1 个占位符(是 1-3 位的数字)
//例子：
//(new Date()).Format("yyyy-MM-dd hh:mm:ss.S") ==> 2006-07-02 08:09:04.423
//(new Date()).Format("yyyy-M-d h:m:s.S")      ==> 2006-7-2 8:9:4.18
Date.prototype.Format = function(fmt) { //author: meizz
	var o = {
	 "M+" : this.getMonth()+1,                 //月份
	 "d+" : this.getDate(),                    //日
	 "h+" : this.getHours(),                   //小时
	 "m+" : this.getMinutes(),                 //分
	 "s+" : this.getSeconds(),                 //秒
	 "q+" : Math.floor((this.getMonth()+3)/3), //季度
	 "S"  : this.getMilliseconds()             //毫秒
	};
	if(/(y+)/.test(fmt))
	 fmt=fmt.replace(RegExp.$1, (this.getFullYear()+"").substr(4 - RegExp.$1.length));
	for(var k in o)
	 if(new RegExp("("+ k +")").test(fmt))
	fmt = fmt.replace(RegExp.$1, (RegExp.$1.length==1) ? (o[k]) : (("00"+ o[k]).substr((""+ o[k]).length)));
	return fmt;
}
//对Date的扩展，将Date剪切指定位置之后的时间
//

Date.prototype.CutTime = function(){
	this.setHours(0);
	this.setMinutes(0);
	this.setSeconds(0);
	return this.getTime();
}

Array.prototype.getSortedArray=function(fun){
	return typeof fun=='undefined'?this.sort(function(a,b){return a-b}):
	this.sort(function(a,b){ return fun.call(a)-fun.call(b);});
}
Array.prototype.copy=function(){
	var array=[];
	this.forEach(function(value){
		array.push(value);
	});
	return array;
}
Array.prototype.forEach=Array.prototype.forEach || function(fun /*, thisp*/)
  {
    var len = this.length;
    if (typeof fun != "function")
      throw new TypeError();

    var thisp = arguments[1];
    for (var i = 0; i < len; i++)
    {
      if (i in this)
        fun.call(thisp, this[i], i, this);
    }
  };

//对 Math 对象的扩展
Math.log2=Math.log2 || function(value){
	return Math.log(value)/Math.log(2);
}
/** ---------  解决IE下 setTimeout 不能传参数的问题 start ----------**/

window.settimeout=function (vCallback, nDelay /*, argumentToPass1, argumentToPass2, etc. */) {
    var aArgs = Array.prototype.slice.call(arguments, 2);
    return setTimeout(vCallback instanceof Function ? function () {
      vCallback.apply(null, aArgs);
    } : vCallback, nDelay);
  };


/** ---------  解决IE下 setTimeout 不能传参数的问题 end ----------**/

/** ---------  解决 fireFox evetn.toElement == undefined 中的问题 start -------------- **/
  if(window.addEventListener) { FixPrototypeForGecko(); }

  function  FixPrototypeForGecko()
  {
      HTMLElement.prototype.__defineGetter__("runtimeStyle",element_prototype_get_runtimeStyle);
      window.constructor.prototype.__defineGetter__("event",window_prototype_get_event);
      Event.prototype.__defineGetter__("srcElement",event_prototype_get_srcElement);
      Event.prototype.__defineGetter__("fromElement",  element_prototype_get_fromElement);
      Event.prototype.__defineGetter__("toElement", element_prototype_get_toElement);

  }

  function  element_prototype_get_runtimeStyle() { return  this.style; }
  function  window_prototype_get_event() { return  SearchEvent(); }
  function  event_prototype_get_srcElement() { return  this.target; }

  function element_prototype_get_fromElement() {
      var node;
      if(this.type == "mouseover") node = this.relatedTarget;
      else if (this.type == "mouseout") node = this.target;
      if(!node) return;
      while (node.nodeType != 1)
          node = node.parentNode;
      return node;
  }

  function  element_prototype_get_toElement() {
          var node;
          if(this.type == "mouseout")  node = this.relatedTarget;
          else if (this.type == "mouseover") node = this.target;
          if(!node) return;
          while (node.nodeType != 1)
             node = node.parentNode;
          return node;
  }

  function  SearchEvent()
  {
      if(document.all) return  window.event;

      func = SearchEvent.caller;

      while(func!=null){
          var  arg0=func.arguments[0];

          if(arg0 instanceof Event) {
              return  arg0;
          }
         func=func.caller;
      }
      return   null;
  }
  /**
   * 提示信息
   */
var _amain={
	Messager:{
		alert : function(msg,fun){
			//1. 提供一个确认框，显示文字，点击确定按钮则隐藏按钮
			var alertHtml='<div id="amain-messager-alert">'+
					'<div class="amain-messager-alert-container">'+
						'<div class="amain-messager-alert-text"></div>'+
						'<div class="amian-messager-alert-button">确定</div>'+
					'</div>'+
				'</div>';
			$('#amain-messager-alert').remove();
			$('body').append(alertHtml);
			$('#amain-messager-alert .amain-messager-alert-text').html(msg);
			$('#amain-messager-alert .amian-messager-alert-button').off('click').click(fun).click(function(){
				$('#amain-messager-alert').remove();
			});
		},
		confirm : function(msg,fun){
			var confirmHtml='<div id="amain-messager-confirm">'+
					'<div class="amain-messager-confirm-container">'+
						'<div class="amain-messager-confirm-text">要怎么怎么样吗？</div>'+
						'<div class="amain-messager-confirm-operator">'+
							'<div class="amain-messager-confirm-confirm amain-messager-confirm-button">是</div>'+
							'<div class="amain-messager-confirm-cancel amain-messager-confirm-button">否</div>'+
						'</div>'+
					'</div>'+
				'</div>';
			$('#amain-messager-confirm').remove();
			$('body').append(confirmHtml);
			$('#amain-messager-confirm .amain-messager-confirm-text').html(msg);
			$('#amain-messager-confirm .amain-messager-confirm-confirm').off('click').click(fun).click(function(){
				$('#amain-messager-confirm').remove();
			});
			$('#amain-messager-confirm .amain-messager-confirm-cancel').off('click').click(function(){
				$('#amain-messager-confirm').remove();
			});
		}
	},
	tips:{
		config:{

		},
		open:function(msg){
			clearInterval(_amain.tips.temp.interval);
			var tips_div=document.getElementById('_amain_tips_container');
			if(!tips_div){
				tips_div = document.createElement('div');
				tips_div.setAttribute("id","_amain_tips_container");
				tips_div.setAttribute('style','position: fixed;top: 0px;width: 100%;');
				var html =
					"<div class='_amain_tips' style='border-radius: 2px;text-align: center; max-width: 200px; margin:auto; padding:10px; background-color:#f8f8f8; color:#1fbcd2'>"+
						"<div class='_amain_tips_msg'></div>"+
						"<div class='_amain_tips_progress_bar' style='margin-top:10px; width:100%; height:4px; background-color:#38DACE;'></div>"+
					"</div>";
				tips_div.innerHTML=html;
				document.body.appendChild(tips_div);
			}
			tips_div.children[0].children[0].innerHTML=msg;
			tips_div.children[0].children[1].style.width='100%';
			tips_div.style.top=-tips_div.clientHeight+'px';
			this.slideDown(tips_div);
			_amain.tips.temp.ele=tips_div;
		},
		slide:function(ele,direction,seconds){
			if(ele!=null){
				_amain.tips.temp.ele=ele;
			}else{
				ele=_amain.tips.temp.ele;
			}
			var height = ele.clientHeight;
			var millseconds=1000*seconds;
			var interval=millseconds/height;
			if((ele.style.top=='0px' | ele.style.top=='-1px') && direction=='up'){
				clearInterval(_amain.tips.temp.interval);
				_amain.tips.temp.interval = setInterval(function(){
					var top = parseInt(_amain.tips.temp.ele.style.top.replace('px',''));
					if((top+_amain.tips.temp.ele.clientHeight)==0){
						clearInterval(_amain.tips.temp.interval);
					}else{
						_amain.tips.temp.ele.style.top=(top-1)+'px';
					}
				},interval);
			}else if(ele.style.top==('-'+height+'px') && direction=='down'){
				clearInterval(_amain.tips.temp.interval);
				_amain.tips.temp.interval = setInterval(function(){
					var top = parseInt(_amain.tips.temp.ele.style.top.replace('px',''));
					if(top==0){
						clearInterval(_amain.tips.temp.interval);
						_amain.tips.progress(2);
					}else{
						_amain.tips.temp.ele.style.top=(top+1)+'px';
					}
				},interval);
			}
		},
		slideDown:function(ele){
			this.slide(ele,'down',0.5);
		},
		slideUp:function(ele){
			this.slide(ele,'up',0.5);
		},
		progress:function(seconds){
			var interval = seconds*10;
			clearInterval(_amain.tips.temp.interval);
			_amain.tips.temp.interval = setInterval(function(){
					var tips_div=_amain.tips.temp.ele;
					var progress = tips_div.children[0].children[1];
					if(progress.style.width=='0%'){
						clearInterval(_amain.tips.temp.interval);
						_amain.tips.slideUp(null);
					}else{
						var persent = parseInt(progress.style.width.replace('%',''));
						progress.style.width=(persent-1)+'%';
					}
				},interval);
		},
		temp:{},

	}
}
var _Jquery = {
	  post:function(url,data,fun){
		  $.ajax({
				url:url,
		        type: 'POST',
		        data: JSON.stringify(data),
		        dataType: 'json',
		        contentType:'application/json;charset=UTF-8',
		        success: fun===undefined ? _Jquery.defaultProcessResult : fun
		    });
	  },
	  get:function(url,fun){
		  $.ajax({
				url:url,
		        type: 'GET',
		        dataType: 'json',
		        contentType:'application/json;charset=UTF-8',
		        success: fun===undefined ? _Jquery.defaultProcessResult : fun
		    });
	  },
	  defaultProcessResult:function(result){
		  if(result.code==100){
			  _amain.tips.open(result.msg);
		  }else{
			  _amain.Messager.alert(result.msg);
		  }
	  }
  }

// constansts.js

var Constants = {
  orderStatus:{
    waitPay:{code:10,desc:'待支付'},
    payTimeOut:{code:11,desc:'支付超时'},
    userCancel:{code:12,desc:'用户取消'},
    waitConfirm:{code:20,desc:'待处理'},
    haveRecieved:{code:29,desc:'处理中'},
    toProcessLive:{code:17,desc:'待办入住'},
    confirmFail:{code:22,desc:'已拒单'},//确认失败等待退款
    confirmFailRefunding:{code:31,desc:'已拒单'},//31：确认失败，退款中
    refundFail:{code:23,desc:'已拒单'},//确认失败退款失败
    refunded:{code:30,desc:'已拒单'},//确认失败，已退款
    confirmed:{code:21,desc:'可入住'},
    complete:{code:40,desc:'交易完成'},
    changedWaitPay:{code:13,desc:'待支付差价'},//已修改，待支付差价
    changedPaying:{code:27,desc:'支付中'},//已修改，差价支付中
    changedPayed:{code:14,desc:'已修改，待处理'},//修改已确认（已支付）
    changedConfirmed:{code:35,desc:'已修改，待处理'},//35：修改已确认（无差价）
    changedWaitRefund:{code:32,desc:'已修改，待处理'},//32：修改已确认，待退款
    changedRefunding:{code:33,desc:'已修改，待处理'},//33：修改已确认，退款中
    changedRefunded:{code:34,desc:'已修改，待处理'},//34：修改已确认，已退款
    changedRefundFailed:{code:24,desc:'已修改，待处理'},//24,退款失败
    cancelRefunding:{code:15,desc:'已取消'},//已取消，退款中
    paying:{code:16,desc:'修改中'},//16:支付中等待确认
    cancelWaitRefunding:{code:36,desc:'已取消'},//36：已取消，待退款
    cancelrefunded:{code:37,desc:'已取消'},//37：已取消，已退款
    cancelrefundFailed:{code:25,desc:'已取消'},
    userApplyCancel:{code:18,desc:'买家申请取消订单'},
    urgent:{code:119,desc:'紧急'}
  },
  orderStatusMap:{//同步自 订单状态文字_20150916.numbers
    '^10-\\d$':'',
    '^11-\\d$':'',
    '^12-\\d$':'',
    '^13-\\d$':'待支付差价',//已修改，待支付差价
    '^14-\\d$':'已修改，待处理',//修改已确认（已支付）
    '^15-\\d$':'已取消',//已取消，退款中
    '^16-\\d$':'修改中',//16:支付中等待确认
    '^27-\\d$':'支付中',////已修改，差价支付中
    '^31-\\d$':'已拒单',//31：确认失败，退款中  ---- TODO
    '^32-\\d$':'已修改，待处理',//32：修改已确认，待退款
    '^33-\\d$':'已修改，待处理',//33：修改已确认，退款中
    '^34-\\d$':'已修改，待处理',//34：修改已确认，已退款
    '^35-\\d$':'已修改，待处理',//35：修改已确认（无差价）
    '^24-\\d$':'已修改，待处理',//24：修改退款失败
    '^36-\\d$':'已取消',//36：已取消，待退款
    '^37-\\d$':'已取消',//37：已取消，已退款  ---- TODO
    '^25-\\d$':'已取消', // ---- TODO
    '^20-0$':'待处理',
    '^20-[1256]$':'修改待确认',
    '^20-[34]$':'待退差价', //
    '^29-\\d$':'处理中',
    '^21-\\d$':'可入住',
    '^17-\\d$':'待办入住',
    '^22-\\d$':'已拒单',//确认失败等待退款
    '^30-\\d$':'已拒单',//确认失败，已退款  --- TODO
    '^23-\\d$':'已拒单',//确认失败退款失败  --- TODO
    '^40-\\d$':'交易完成',
    '^18-\\d$':'买家申请取消订单'
  },
  //订单详情页渲染操作按钮使用
  orderOperateMap:{//0.开始处理 1.办理入住 2.立即确认 3.保存 4.修改订单 5.取消修改 6.提醒支付 7.拒单 8.同意取消 9.拒绝取消
    '^10-\\d$':{operateItem:'',confirmNo:false,liveCondition:false},
    '^11-\\d$':{operateItem:'',confirmNo:false,liveCondition:false},
    '^12-\\d$':{operateItem:'',confirmNo:false,liveCondition:false},
    '^13-\\d$':{operateItem:'5',confirmNo:false,liveCondition:false},//已修改，待支付差价
    '^14-\\d$':{operateItem:'0247',confirmNo:true,liveCondition:false},//修改已确认（已支付）
    '^15-\\d$':{operateItem:'',confirmNo:false,liveCondition:false},//已取消，退款中
    '^16-\\d$':{operateItem:'',confirmNo:false,liveCondition:false},//16:支付中等待确认
    '^31-\\d$':{operateItem:'',confirmNo:false,liveCondition:false},//31：确认失败，退款中
    '^32-\\d$':{operateItem:'0247',confirmNo:true,liveCondition:false},//32：修改已确认，待退款
    '^33-\\d$':{operateItem:'',confirmNo:false,liveCondition:false},//33：修改已确认，退款中
    '^34-\\d$':{operateItem:'',confirmNo:false,liveCondition:false},//34：修改已确认，已退款
    '^35-\\d$':{operateItem:'0247',confirmNo:true,liveCondition:false},//35：修改已确认（无差价）
    '^24-\\d$':{operateItem:'',confirmNo:false,liveCondition:false},//24：修改退款失败
    '^36-\\d$':{operateItem:'',confirmNo:false,liveCondition:false},//36：已取消，待退款
    '^37-\\d$':{operateItem:'',confirmNo:false,liveCondition:false},//37：已取消，已退款
    '^25-\\d$':{operateItem:'',confirmNo:false,liveCondition:false},
    '^20-0$':{operateItem:'027',confirmNo:true,liveCondition:false},
    '^20-[1256]$':{operateItem:'27',confirmNo:true,liveCondition:false},
    '^20-[34]$':{operateItem:'',confirmNo:true,liveCondition:false},
    '^29-\\d$':{operateItem:'247',confirmNo:true,liveCondition:false},//处理中
    '^21-\\d$':{operateItem:'3',confirmNo:true,liveCondition:true},
    '^17-\\d$':{operateItem:'1',confirmNo:false,liveCondition:true},
    '^27-\\d$':{operateItem:'',confirmNo:false,liveCondition:false},
    '^22-\\d$':{operateItem:'',confirmNo:false,liveCondition:false},//确认失败等待退款
    '^30-\\d$':{operateItem:'',confirmNo:false,liveCondition:false},//确认失败，已退款
    '^23-\\d$':{operateItem:'',confirmNo:false,liveCondition:false},//确认失败退款失败
    '^40-\\d$':{operateItem:'',confirmNo:false,liveCondition:false},
    '^18-\\d$':{operateItem:'89',confirmNo:false,liveCondition:false},//18. 用户申请取消订单
    '^119-\\d$':{operateItem:'',confirmNo:false,liveCondition:false}
  },
  getOrderStatus:function (status,subStatus){
    for(var index in Constants.orderStatusMap){
      var regExp = new RegExp(index);
      if(regExp.test(status+'-'+subStatus)){
        return Constants.orderStatusMap[index];
      }
    }
  },
  getOperateConfig:function(status,subStatus){
    for(var index in Constants.orderOperateMap){
      var regExp = new RegExp(index);
      if(regExp.test(status+'-'+subStatus)){
        return Constants.orderOperateMap[index];
      }
    }
  }
}


// config_new.js

var _config={};
/**
 * 每个页面必须的一步
 */
_config.isWx = navigator.userAgent.indexOf('MicroMessenger/')!=-1 ? true : false;
var root = location.origin+ctx;
//var root = 'http://hotel-test.rsscc.com/supplier';

_config.cssUrl = root + "/css" + pageName.substring(pageName.indexOf("WEB-INF")+7).replace(/jsp$/,'') + "css";
_config.jsUrl = root + "/js" + pageName.substring(pageName.indexOf("WEB-INF")+7).replace(/p$/,'');

var noPageUrl = root+'/404.html';
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
use(_config.jsUrl);

function exe(){
  if(typeof init != 'undefined'){
    window.$load = $('#common-load');
    window.$wrap = $('#wrapper');
    if($wrap.length <=0){
      $wrap = $('body');
    }
    jQuery.ajaxSetup({
      timeout: 30000, //超时时间设置，单位毫秒
      error: function(xhr,status,error){
        if(status=='timeout'){//超时,status还有success,error等值的情况
          location.replace(noPageUrl);
          return;
        }
      },
      complete : function(xhr,status){ //请求完成后最终执行参数
    	if(status=='timeout'){//超时,status还有success,error等值的情况
          location.replace(noPageUrl);
          return;
        }
      }
    });

    init();
    // $load.addClass('hidden');
    // $load.removeClass('hidden');
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
    },
    error: function(xhr,status,error){
    },
    complete : function(xhr,status){
    }
  });
}