
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
				}else{
					parent.find('.price').css({padding:'4px 0px'});
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
								$(this).css({backgroundColor:'',color:''}).find('.price').removeClass('s_roomStatusId').css({color:"black"});
								$(this).find('.zero-room').css({color:'red'});
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
	initHeadTab();
	//1. 缓存参数
	_params = getUrlParams();
	//console.log(1);
	//2. 渲染酒店名称
	$('#hotelName').html(_params.hotelName);
	//3. 渲染下拉框
	renderSelect();
	//4. 渲染日期
	renderDate();
	//5. 更新当前房态计划
	getRoomStatus();
	//6. 为input 增加限制
	addConstraint();
	//7. 绑定点击事件
	bindClickEvent();
	//
	bindChooseRevervationConditionEvent();
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
	    	console.log(result);
	    	_params.roomProductList = result;
	    	var select = document.getElementById('product');
	    	for(var i=0; i<result.length;i++){
	    		var option = document.createElement('option');
	    		option.setAttribute('value',result[i].id);
	    		if(_params.roomId == result[i].id){
	    			option.setAttribute('selected',true);
	    			window.paymentMethod=result[i].paymentMethod;
	    			if(window.paymentMethod=='部分预付'){
	    				$('#arrive-price-container').show().find('.edit-field').html("房费(到付)");
	    				$('#settlement-price-container').show().find('.edit-field').html("服务费(预付)");
	    			}else if(window.paymentMethod=='到付'){
	    				$('#settlement-price-container').show().find('.edit-field').html("房费(到付)");
	    				//$('#settlement-price-container').hide();
                                console.log(1);
	    			}
	    		}
	    		option.innerText=productShow(result[i]);
	    		select.appendChild(option);

	    		$load.addClass('hidden');
					$wrap.addClass('show');
	    	}
	    	select.onchange=function(){
	    		_params.roomId = $('#product').val();
	    		//getRoomStatus();
	    	}
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
 * 渲染日期
 */
function renderDate(){
	var dateHtml = new Date(_params.startDate).Format("yyyy年MM月dd日");
	if(_params.endDate){
		dateHtml += '&nbsp;-&nbsp;' + new Date(_params.endDate).Format("yyyy年MM月dd日");
	}
	if(_params._reg){
		var reg=_params._reg;
		var replace=[['0','日'],['1','一'],['2','二'],['3','三'],['4','四'],['5','五'],['6','六']];
		for(var i=0;i<replace.length;i++){
			reg=reg.replace(replace[i][0],replace[i][1]);
		}
		dateHtml+="（"+reg+"）";
	}
	$('#date').html(dateHtml);
}

/**
 * 获取当前编辑的房态
 */
function getRoomStatus(){
	if(_params.endDate){
		$("#settlementPrice").val('￥');
		$("#arrive-price").val('￥');
		return;
	}
	$.ajax({
		url:root + '/rest/hotel/getRoomStatus?roomProductId='+_params.roomId+'&date='+_params.startDate,
		type: 'GET',
	    //dataType: 'json',
	    contentType:'application/json;charset=UTF-8',
	    success: function(result) {
	    	console.log(result);
	    	if(result){
	    		_params.roomStatus = result;
	    		if(result.paymentMethod == 3) {
	    			$("#settlementPrice").val('￥'+result.collectPrice);
	    		}else{
	    			$("#settlementPrice").val('￥'+result.settlementPrice);
	    		}
	    		$("#arrive-price").val('￥'+result.collectPrice);
	    		$("#room-count").val(result.qtyable);
	    		$('#reservation-condition .icon').removeClass('green').addClass('gray');
	    		$('#reservation-condition-display').html(result.advanceBooking);
	    	}else{
	    		$("#settlementPrice").val('￥');
	    		$("#arrive-price").val('￥');
	    		$("#room-count").val("");
	    		// console.log("meiyou !");
	    	}

	    	$load.addClass('hidden');
				$wrap.addClass('show');
	    }
	});
}
/**
 * 输入约束
 */
function addConstraint(){
	$('#settlementPrice').focus(function(){
		$(this).val($(this).val().replace(/￥/g,''));
	}).blur(function(){
		if(/^[1-9]\d*$/.test($(this).val())){
			$(this).val('￥'+$(this).val());
			$('#price-warn').html('');
		}else{
			$('#price-warn').html('请输入正确的价格（大于0的整数）！')
		}
	});
	$('#arrive-price').focus(function(){
		$(this).val($(this).val().replace(/￥/g,''));
	}).blur(function(){
		if(/^[1-9]\d*$/.test($(this).val())){
			$(this).val('￥'+$(this).val());
			$('#arrive-price-warn').html('');
		}else{
			$('#arrive-price-warn').html('请输入正确的价格（大于0的整数）！')
		}
	});
	$('#room-count').change(function(){
		//$(this).val($(this).val().replace(/[^0-9]/g,''));
	});
}

/**
 * 绑定点击事件
 */
function bindClickEvent(){
	/**
	 * 增加房态
	 */
	$('#add-product').click(function(){
		if(validate()){
			console.log(1);
			saveRoomStatus();
		}
	});

	/**
	 * 取消编辑
	 */
	$('#cancel').click(function(){
		cancel();
	});

	$('#reservation-condition-red').click(function(){
		var val = parseInt($('#reservation-condition-display').html());
		if(val>0){
			$('#reservation-condition-display').html(val-1);
		}
	});

	$('#reservation-condition-add').click(function(){
		var val = parseInt($('#reservation-condition-display').html());
		$('#reservation-condition-display').html(val+1);
	});
}

function validate(){
	var regPrice = /^￥[1-9]\d*$/;
	var regNum = /[0-9]+/;
	var flag = true;
	if(new RegExp('部分预付$').test($('#product [value='+_params.roomId+']').text())){
		if(!regPrice.test($('#arrive-price').val())){
			flag=false;
			console.log(1);
			$('#arrive-price-warn').html('请输入正确的价格（大于0的整数）！')
		}else{
			$('#arrive-price-warn').html('')
			console.log(2);
		}
	}


	if(!regPrice.test($('#settlementPrice').val())){
		flag = false;
		console.log(3)
		$('#price-warn').html('请输入正确的价格（大于0的整数）！')
	}else{
		$('#price-warn').html('');
	}

	if(!regNum.test($('#room-count').val())){
		flag = false;
		$('#count-warn').html('请输入房间数量！')
	}else{
		$('#count-warn').html('')
	}
	return flag;
}

//保存最新设置的价格 和 房间数量
function saveRoomStatus(){
	var roomInfo = getRoomInfo(_params.roomId);
	var roomProductId = roomInfo.id;
	var hotelId = _params.hotelId;
	var roomtypeId = roomInfo.roomTypeId;
	var qtyable =  $('#room-count').val();
	var date = _params.startDate;
	var settlementPrice = $('#settlementPrice').val();
	if(settlementPrice.indexOf('￥')==0){
		settlementPrice = settlementPrice.substring(1);
		if(settlementPrice.trim()==''){
			$('#settlementPrice').focus();
			$('#settlementPrice').blur();
			return;
		}
	}
	var collectPrice = $('#arrive-price').val();
	if(window.paymentMethod!='部分预付'){
		collectPrice = 0;
	}else if(collectPrice.indexOf('￥')==0){
		collectPrice = collectPrice.substring(1);
		if(collectPrice.trim()==''){
			$('#arrive-price').focus();
			$('#arrive-price').blur();
			return;
		}
	}
	//{"hotelId":1,"roomtypeId":2,"roomProductId":2,"qtyable":20,"settlementPrice":330,"dateList":['2015-07-02','2015-07-03']}
	if(window.paymentMethod == '到付') {
		var queryParam = {
			"hotelId":hotelId,
        	"roomtypeId":roomtypeId,
        	"roomProductId":roomProductId,
        	"qtyable":qtyable,
        	"settlementPrice":collectPrice,
        	"advanceBooking":$('#reservation-condition-display').html(),
        	"collectPrice": settlementPrice
	   };
	}else{
		var queryParam = {
			"hotelId":hotelId,
        	"roomtypeId":roomtypeId,
        	"roomProductId":roomProductId,
        	"qtyable":qtyable,
        	"settlementPrice":settlementPrice,
        	"advanceBooking":$('#reservation-condition-display').html(),
        	"collectPrice":collectPrice
	     };
	}

	queryParam.dateList = getDateList();
	$load.removeClass('hidden');
	$.ajax({
		url:root + '/rest/hotel/addOrModifyRoomStatus',
        type: 'POST',
        data: JSON.stringify(queryParam),
        dataType: 'json',
        contentType:'application/json;charset=UTF-8',
        success: function(result) {
            if(result){
            	cancel();
            }else{
            	$load.addClass('hidden');
            	alert('修改错误！');
            }

        }
	});

}
/**
 * 获取操作的日期数组
 * @returns {Array}
 */
function getDateList(){
	var dateList = [];
	var day = 1000*60*60*24;
	if(_params.endDate===undefined && _params.startDate){//选择一天进行操作
		dateList.push(_params.startDate);
	}else if( _params.startDate && _params.endDate){//连续选择多天
		var start = new Date(_params.startDate).getTime();
		var end = new Date(_params.endDate).getTime();
		for(;start<=end;start+=day){
			var temp = new Date(start);
			var dateStr = temp.Format('yyyy-MM-dd');
			if(new RegExp('^['+_params._reg+']$').test(temp.getDay())){//某个月的周末
				dateList.push(dateStr);
			}
		}
	}
	return dateList;
}

function cancel(){
	var url = './roomCalendar.html?hotelId='+_params.hotelId
				+'&hotelName='+_params.hotelName+'&roomId='+_params.roomId;
	util.goByUrl(url);
}

function getRoomInfo(id){
	var roomInfo=null;
	for(var i=0;i<_params.roomProductList.length;i++){
		if(_params.roomProductList[i].id==id){
			roomInfo = _params.roomProductList[i];
		}
	}
	return roomInfo;
}

function bindChooseRevervationConditionEvent(){
	$('#reservation-condition .item').click(function(){
		$('#reservation-condition .item .icon').removeClass('green').addClass('gray');
		$(this).find('.icon').removeClass('gray').addClass('green');
	});
}