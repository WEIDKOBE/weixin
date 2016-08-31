
use(root+"/js/weixin/room/calendar.js");

function init(){
	initHeadTab();
	//1. 缓存参数
	_params = getUrlParams();
	//2. 渲染酒店名称
	$('#hotelName').html(_params.hotelName);
	//3. 渲染下拉框
	renderSelect();
	//4. 获取近 3 个月的房态信息
//	getRecentRoomStatus();
	//5. 绑定快速选择事件
	specialEventBind();
	//6. 绑定下一步事件
	confirmBind();
	// 满房
	fullRoomBind();
	//7. 绑定星期条响应body的滚动事件
	bindScroll();
	//8. 删除产品事件
	bindDeleteProductEvent();
}

/**
 * 渲染下拉框
 */
function renderSelect(){
	$.ajax({
		url:root + '/rest/hotel/getRoomProductList?hotelId='+_params.hotelId,
	    type: 'GET', 
	    dataType: 'json',
	    contentType:'application/json;charset=UTF-8',        
	    success: function(result) { 
	    	var select = document.getElementById('product');
	    	for(var i=0; i<result.length;i++){
	    		var option = document.createElement('option');
	    		option.setAttribute('value',result[i].id);
	    		if(_params.roomId == result[i].id){
	    			option.setAttribute('selected',true);
	    			window.paymentMethod=result[i].paymentMethod;
	    		}
	    		option.innerText=productShow(result[i]);
	    		select.appendChild(option);
	    		$(option).data(result[i]);
	    	}
	    	select.onchange=function(){
	    		_params.roomId = $('#product').val();
	    		window.paymentMethod = $(this).find('[value='+$(this).val()+']').data('paymentMethod');
	    		getRecentRoomStatus();
	    	}
	    	getRecentRoomStatus();
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
 * 获取一个房型的近12个月的状态
 */
function getRecentRoomStatus(){
	if(typeof _calendar == 'undefined'){
		console.log('settimeout');
		settimeout(getRecentRoomStatus,50);
		$load.addClass('hidden');
		$wrap.addClass('show');
		return;
	}

	var nowDate = new Date();
	// 录入两年
	var curMonths = ( 23 - nowDate.getMonth() );
	var months = getMonthsFromNow(curMonths);

	$.ajax({
		url:root + '/rest/hotel/getRoomStatusList?roomProductId='+_params.roomId + '&months='+months,
	    type: 'GET', 
	    dataType: 'json',
	    contentType:'application/json;charset=UTF-8',        
	    success: function(result) { 
	    	paintCalendar(curMonths);
	    	_calendar.renderDataAndBindEvent(result);
	    } 
	});
}

function getMonthsFromNow(num){
	var months = [];
	var now = new Date();
	var day = 1000*60*60*24;
	for(var i=0;i<num;i++){
		months.push(now.Format('yyyy-MM'));
		now.setDate(15);//保证下一个月是正确的
		now = new Date(now.getTime() + 30*day);
	}
	return months.join(',');
}
/**
 * 绘制日历
 */
function paintCalendar(num){
	$('.month-item:gt(0)').remove();
	var date = new Date();
	var month = 1000*60*60*24*30;
	_calendar.getTableStructure(date);
	for(var i=0;i<num;i++){
		date.setDate(15);
		date = new Date(date.getTime()+month);
		_calendar.getTableStructure(date);
	}
	//把过去的日期*黑*掉
	var firstDay = _calendar.getFirstDays(new Date());
	var nowDate = new Date().getDate();
	var length = firstDay+nowDate-1;
	var tds = $('.calendar-month').eq(1).find('td');
	for(var i=firstDay;i<length;i++){
		tds.eq(i).css({
			backgroundColor:'rgb(240,240,240)'
		});
	}
}
/**
 * 选完日期后跳转
 */
function confirmBind(){
	$('#confirm').click(function(){	
		_params._startDate = _params._startDate.Format('yyyy-MM-dd');
		
		var url = root + '/weixin/room/priceConfig.jsp?hotelId='
				+_params.hotelId+'&hotelName='+_params.hotelName
				+'&roomId='+_params.roomId
				+'&startDate='+_params._startDate;
		if(_params._endDate){
			_params._endDate = _params._endDate.Format('yyyy-MM-dd');
			url+='&endDate='+_params._endDate;
			url+="&_reg="+getDateReg().toString().split(/[\[\]]/)[1];
		}
		location.href = url;
	});
}

/**
 * 选完日期后满房跳转
 */
function fullRoomBind(){
	$('#fullRoom').click(function(){

		// _params._startDate = _params._startDate.Format('yyyy-MM-dd');
		
		// var url = root + '/weixin/room/priceConfig.jsp?hotelId='
		// 		+_params.hotelId+'&hotelName='+_params.hotelName
		// 		+'&roomId='+_params.roomId
		// 		+'&startDate='+_params._startDate;
		// if(_params._endDate){
		// 	_params._endDate = _params._endDate.Format('yyyy-MM-dd');
		// 	url+='&endDate='+_params._endDate;
		// 	url+="&_reg="+getDateReg().toString().split(/[\[\]]/)[1];
		// }
		// alert('点击满房按钮');

		var s_roomStatusId = $(".s_roomStatusId");
		var roomStatusIds = "";
		for(var i=0,len=s_roomStatusId.length; i<len; i++ ){
			if($(s_roomStatusId[i]).data("roomStatusId")){
				roomStatusIds +=  "," + $(s_roomStatusId[i]).data("roomStatusId");
			}
		};
		var finallyIds = roomStatusIds.slice(1);
		if(finallyIds && Number.isFinite(parseInt(finallyIds)) ){

		} else {
			// alert('没有可选房可以设置成满房');
			$('#fullRoom').hide();
			return false;
		}
		// alert('开始ajax请求:'+ finallyIds);
		$load.removeClass('hidden');
		var url = root + '/rest/hotel/fullRoom?roomStatusIds='
				+finallyIds;
		$.ajax({
      type : "GET",
      url: url,
      success: function (result) {
      	// alert('请求成功:'+ JSON.stringify(result));
      	// console.log(result);
      	if(result.code == 100 ){
      		window.location.reload(true);
      		// location.replace(location.href) 
      	} else {
      		$load.addClass('hidden');
      		$wrap.addClass('show');
      		_amain.Messager.alert(result.msg);
      	}
      }
    });

	});
}



//点击
function specialEventBind(){
	$("#calendar-head td").click(specialSelect);
}

/**
 * 选择当前界面内 日历的 周一到周四
 * 或者周五到周天
 */
function specialSelect(){
	//3.如果没有选中任何地区，则不做任何响应
	if((!_params._startDate || !_params._endDate)){
		return;
	}
	clearInvalidStyle();//清除所有
	//1.改变选择按钮的样式
	var class_ = $(this).find('div').attr('class');
	if(typeof class_=="undefined" || class_==''){
		$(this).find('div').addClass('bg-theme');
	}else{
		$(this).find('div').removeClass('bg-theme');
	}
	
	//4.日期匹配正则生成
	regExp = getDateReg();
	
	//5.已经选中的日期区域字符串生成
	var dateStringList = getDateListString();
	var tds = $('#calendar-area td');
	tds.each(function(){
		var _date = $(this).attr('value');
		if(_date){
			_date = new Date(_date);
			var _dateFormat = _date.Format('yyyy-MM-dd');
			if(dateStringList.indexOf(_dateFormat)!=-1 && (regExp.test(_date.getDay()))){
				// $(this).css({backgroundColor:'rgb(2,179,207)',color:'white'}).find('.price').css({color:'white'});
				$(this).css({backgroundColor:'rgb(2,179,207)',color:'white'}).find('.price').addClass('s_roomStatusId').css({color:"white"});
				$(this).find('.zero-room').css({color:'yellow'});
			} else {
				$(this).css({backgroundColor:'',color:''}).find('.price').removeClass('s_roomStatusId').css({color:"black"});
			}
		}
	});
}

//生成正则表达式
function getDateReg(){
	var value = '';
	var eles = $('.bg-theme');
	for(var i=0;i<eles.length;i++){
		value+=eles.eq(i).parent().attr("value");
	}
	return new RegExp('^['+value+']$');
}

function getDateListString(){
	if(!_params._startDate && !_params._endDate){
		return '';
	}else if(!_params._endDate){
		return _params._startDate.Format("yyyy-MM-dd");
	}else{
		var start = _params._startDate.Format("yyyy-MM-dd");
		var end = _params._endDate.Format('yyyy-MM-dd');
		var str='';
		var day=1000*60*60*24;
		while(start<=end){
			str+=start;
			start = new Date(new Date(start).getTime()+day).Format('yyyy-MM-dd');
		}
		return str;
	}
}

/**
 * 获取当前页面的显示月份
 * @returns
 */
function getCurrentMonth(){
	var months = $('#calendar-area .month-item');
	var scrollTop = document.body.scrollTop;
	for(var i=1;i<months.length;i++){
		var item = months.eq(i);
		var top = item.offset().top;
		var height = item.height();
		var bottom = top+height;
		if(bottom>scrollTop+height/2){
			return item;
		}
	}
}

/**
 * 返回界面内显示最多的日历
 * @returns
 */
function getPerfectDisplay(){
	var months = $('#calendar-area .month-item');
	var scrollTop = document.body.scrollTop;
	
	for(var i=1;i<months.length;i++){
		var item = months.eq(i);
		var top = item.offset().top;
		var height = item.height();
		var bottom = top+height;
		if(bottom>scrollTop+height/2){
			return item;
		}
	}
}

/**
 * 清除日期大于等于今天的单元格高亮样式
 */
function clearInvalidStyle(){
	$('#calendar-area td').each(function(value){
		var _date = $(this).attr('value');
		var now = new Date();
		now.setHours(0);
		if(_date){
			_date = new Date(_date);
			_date.setHours(12);
			if(_date>now){
				$(this).css({backgroundColor:'',color:''}).find('.price').css({color:'black'});
			}
		}
	});
}

/**
 * 当页面想上滚动的时候
 * 如果星期条被滚动到head条上面，则修正其为固定在head 下
 */
function bindScroll(){
	document.onscroll=function(){
		if(document.body.scrollTop>=72){
			//alert('haha');
			$('#calendar-head').css({
				position:'fixed',
				top:'42px',
				width:'100%'
			});
		}else{
			$('#calendar-head').css({
				position:'',
				top:'',
				width:''
			});
		}
	}
}

function bindDeleteProductEvent(){
	var productId = $('#product').val();
	$('#delete-product').click(function(){
		_amain.Messager.confirm("确定要删除此产品吗？",function(){
			_Jquery.get(root+'/rest/hotel/deleteRoomProduct?roomProductId='+$('#product').val(),function(result){
				if(result.code==100){
					_amain.tips.open("产品删除成功！");
					settimeout(function(){
						history.back();
					},3000);
				}else{
					_amain.Messager.alert(result.msg);
				}
			})
		});
	});
}