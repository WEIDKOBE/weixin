
_calendar={
		/**
		 * 计算当前日期月份的天数
		 * @param Date 对象 或者代表月份的正整数【1,2..,11,12】
		 */
		getDaysInOneMonth:function(date){
			var month,days=31;
			//参数数据校验
			if(date instanceof Date){
				month = date.getMonth()+1;
			}else if(typeof date == 'number'){
				if(date>12 || date <1){
					throw new TypeError("月份应该在[1,2...,12]集合中");
				}
				month = date;
			}else{
				throw new TypeError("需要一个日期类型或者数值类型的参数！");
			}
			//天数计算
			if(/([469])|(11)/.test(month)){
					days=30;
			}else if(month==2){
					days=_calendar.getDaysOfSecondMonthByDate(date);
			}
			return days;
		},
		/**
		 * 计算当前日期对应的年的二月天数
		 * 规则：四年一润，百年不润，四百年润
		 * @param Date 对象 或者代表年的正整数
		 */
		getDaysOfSecondMonthByDate:function(date){
			var year,days=28;
			//参数数据校验
			if(date instanceof Date){
				year = date.getYear()+1900;
			}else{
				throw new TypeError("需要一个日期类型的参数！");
			}
			//天数计算
			if(year%400==0 || year%100!=0 && year%4==0){
				days=29;
			}
			return days;
		},
		/**
		 * 获取月初一是星期几
		 * 【0-6】-->【日-六】
		 * @param date
		 */
		getFirstDays:function(date){
			if(!(date instanceof Date)){
				throw new TypeError("需要一个日期类型的参数！");
			}
			date.setDate(1);
			return date.getDay();
		},
		/**
		 * 获取月底最后一天是星期几
		 * 【0-6】-->【日-六】
		 * @param date
		 */
		getLastDays:function(date){
			if(!(date instanceof Date)){
				throw new TypeError("需要一个日期类型的参数！");
			}
			var day = this.getDaysInOneMonth(date);
			date.setDate(day);
			return date.getDay();
		},
		/**
		 * 获取 date 所代表的月份
		 * 渲染行数
		 * @param date
		 * @return 渲染函数【用来生成日期table】
		 */
		getRows:function(date){
			if(!(date instanceof Date)){
				throw new TypeError("需要一个日期类型的参数！");
			}
			var day = this.getFirstDays(date);
			var totalDays = this.getDaysInOneMonth(date);
			var leftDays = totalDays - (7-day);
			var leftRows = Math.ceil(leftDays / 7);
			return 1+leftRows;
		},
		getCurrentMonth:function(){

		},
		/**
		 * 生成table骨架
		 * @param 行数
		 */
		getTableStructure:function(date){
			//必要数据获取
			var structure = $('.month-item:first').clone();
			var rowNum = this.getRows(date);
			var allDays = this.getDaysInOneMonth(date);
			var firstDay = this.getFirstDays(date);
			var lastDay = this.getLastDays(date);
			// 展示
			structure.show();
			structure.find('.name').html(date.Format('yyyy年MM月')).attr('value',date.Format('vyyyyMM'));
			for(var i=1;i<rowNum;i++){
				var copyRow = structure.find('tr:first').clone();
				structure.find('table').append(copyRow);
			}
			// 隐藏多余的 td
			structure.find('tr:first td:lt('+firstDay+')').css({backgroundColor: 'transparent',	border: 'none'});
			structure.find('tr:last td:gt('+lastDay+')').css({backgroundColor: 'transparent',	border: 'none'});
			//为每个日期渲染值
			var tds = structure.find('td');
			for(var i=0;i<allDays;i++){
				var tdHtml = "<div style='text-align:right;'>"+(i+1)+"</div><div class='collect-price' style='padding:0px;'></div><div class='price' style='padding:0px;'>&nbsp;</div><div class='room-count'>&nbsp;</div>";
				var _date = i+1;
				var value = date.Format('yyyy-MM-')+ (_date>=10? _date : ('0'+_date));
				tds.eq(firstDay+i).html(tdHtml).attr('value',value);
			}
			$('.month-item:first').parent().append(structure);
			return structure;
		},
		/**
		 * 渲染房态信息，并绑定点击事件
		 * @param data
		 */
		renderDataAndBindEvent:function(data){
			var calendar = {};
			var months = $('.month-item:gt(0)');
			for(var index=0;index<months.length;index++){
				calendar[months.eq(index).find('.name').attr('value')]=months.eq(index);
			}
			// 渲染显示部分
			for(var i=0;i<data.length;i++){
				var date = new Date(data[i].date);
				//if(date < new Date())continue;//如果小于今天的日期，则不显示
				var monthItem = calendar[date.Format('vyyyyMM')];
				var tdIndex = date.getDate()+this.getFirstDays(date)-1;
				var parent = monthItem.find('td').eq(tdIndex);
				var collectPrice = data[i].collectPrice;
				if(window.paymentMethod=='部分预付'){
					parent.find('.collect-price').html('￥'+collectPrice);
				}else if(window.paymentMethod=='到付'){

				}else{
					parent.find('.price').css({padding:'4px 0px'});
				}
				if(window.paymentMethod=='到付'){
					parent.find('.price').css('display','none');
					parent.find('.collect-price').html('￥'+data[i].collectPrice).data("roomStatusId", data[i].id);
				}
				parent.find('.price').html('￥'+data[i].settlementPrice).data("roomStatusId", data[i].id);

				if(data[i].qtyable==0){
					parent.find('.room-count').html("<span class='zero-room' style='color:red'>满房</span>")
				}else{
					parent.find('.room-count').html(data[i].qtyable+'间');
				}
			}
			$load.addClass('hidden');
			$wrap.addClass('show');
			// 价格计划事件
			this.bindRangeSelectEvent();
		},
		bindRangeSelectEvent:function(){
			$('.month-item td').click(function(){
				/**
				 * 检测事件源的有效性
				 * 	1. 必须是有 有效 value 值的 td 元素
				 *  2. 必须是在今天或者今天之后的日期才算做有效日期
				 */
				var value = $(this).attr('value');
				//不存在value值，或者value值无效
				if(typeof value == 'undefined' || ! value || value == null) return;
				var thisDate = new Date(value);
				var now = new Date();
				thisDate.setHours(12);
				now.setHours(0);
				if(!(thisDate instanceof Date) || thisDate<now)return;

				//第一次点击有效日期时出现
				$('#confirm').show();
				$('#fullRoom').show();
				/**
				 * 操作起始日期和终止日期
				 */
				thisDate.setHours(6);
				$("#calendar-head td div").removeClass("bg-theme");
				if(_params._startDate && _params._endDate){
					_params._startDate = thisDate;
					_params._endDate = null;
				}else if(_params._startDate){
					if(thisDate<_params._startDate){
						_params._startDate = thisDate;
					}else{
						_params._endDate = thisDate;
					}
				}else{
					_params._startDate = thisDate;
				}
				if(_params._startDate && _params._endDate){
					$("#calendar-head td div").addClass("bg-theme");
				}
				/**
				 * 改变选择日期的样式
				 */
				$('#calendar-area td').each(function(value){
					var _date = $(this).attr('value');
					if(_date){
						_date = new Date(_date);
						if(_date>now){
							if(_params._startDate && _params._endDate && _date > _params._startDate && _params._endDate > _date){
                                               $(this).css({backgroundColor:'rgb(2,179,207)',color:'white'}).find('.price').addClass('s_roomStatusId').css({color:"white"});
								    $(this).find('.zero-room').css({color:'yellow'});

							}else{
								if(!$(this).hasClass("one") && !$(this).hasClass("two")) {
								$(this).css({backgroundColor:'',color:''}).find('.price').removeClass('s_roomStatusId').css({color:"black"});
								$(this).find('.zero-room').css({color:'red'});
							    }else{
                                            $(this).css("background-color","#8f93a2");
							    }
							}
						}
					}
				});
				$(this).css({backgroundColor:'rgb(2,179,207)',color:'white'}).find('.price').addClass('s_roomStatusId').css({color:"white"});
				$(this).find('.zero-room').css({color:'yellow'});
			});
		}

}
;

function init(){
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
	//bindDeleteProductEvent();
	//9.处理下班状态房间日历颜色
	//bindWorkStatus();
	//10.处理全部关闭当日房日历颜色
	bindTodayHotelStatus();
}
init();

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
				location.href=location.href.replace("roomId="+_params.roomId,"roomId="+$('#product').val());
	    		//_params.roomId = $('#product').val();
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
	    	console.log(result);
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
		tds.eq(i).addClass("kk");
	}

	bindWorkStatus();
	bindTodayHotelStatus();
}
/**
 * 选完日期后跳转
 */
function confirmBind(){
	$('#confirm').click(function(){
		_params._startDate = _params._startDate.Format('yyyy-MM-dd');

		var url = './priceConfig.html?hotelId='
				+_params.hotelId+'&hotelName='+_params.hotelName
				+'&roomId='+_params.roomId
				+'&startDate='+_params._startDate;
		if(_params._endDate){
			_params._endDate = _params._endDate.Format('yyyy-MM-dd');
			url+='&endDate='+_params._endDate;
			url+="&_reg="+getDateReg().toString().split(/[\[\]]/)[1];
		}
		util.goByUrl(url);
	});
}

/**
 * 选完日期后满房跳转
 */
function fullRoomBind(){
	$('#fullRoom').click(function(){

		// _params._startDate = _params._startDate.Format('yyyy-MM-dd');

		// var url = './priceConfig.html?hotelId='
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
		if(finallyIds){
			 //alert(6);
		} else {
			// alert('没有可选房可以设置成满房');
			 //alert(7);
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
      		 alert(12);
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
		/*if($(this).hasClass("one")) {
			console.log(1);
           $(this).css("background-color","#8f93a2");
	     }*/
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

/*function bindDeleteProductEvent(){
	var productId = $('#product').val();
	//console.log(#product);
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
}*/

//处理下班状态房间日历颜色
function bindWorkStatus(){
	$.get(root + '/rest/supplier/getAccountInfo', {}, function(data){
		if (data && data.isworking == 2) {
			var tds = $('.calendar-month');
			$('.price').each(function(i){
				if ('&nbsp;' != $(this).html()) {
					console.log($(this).html());
					$(this).parent().css("background-color","#8f93a2");
					$(this).parent().addClass("two");
				}
			});
		}
	});
}

//处理全部关闭当日房日历颜色
function bindTodayHotelStatus() {
    $.get(root + '/rest/hotel/list/query',{},function(data){
    	if (data && data.closeTodayHotel == 1) {
			//console.log($('.calendar-month'));
			$('.price').each(function(i){
				//console.log($(this).parent().css("background-color"));
				if (!$(this).parent().hasClass("kk")) {
					$(this).parent().css("background-color","#8f93a2");
					$(this).parent().addClass("one");
					$(this).parent().nextsibling().removeClass("one");
					$(this).parent().nextsibling().css("background-color","white");
				}
			});
		}
    })
}
