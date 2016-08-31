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
				if(window.paymentMethod=='到付'){
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
