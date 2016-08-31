$(function(){
	/** 页面切换操作 **/
	var page = {
			showMainPanel:function(){//展示主面板，关闭其他面板
				$('#main-panel').show();
				$('#change-product-panel').hide();
				$('#change-date-panel').hide();
			},
			showProductPanel:function(){//展示产品切换面板，关闭其他面板
				$('#main-panel').hide();
				$('#change-product-panel').show();
				$('#change-date-panel').hide();
				if(!dataContainer.productPanel.isExistsHotelList){
					serverConnector.getHotelList();
				}
			},
			showDateSelectPanel:function(){//展示日期选择面板，关闭其他面板
				$('#main-panel').hide();
				$('#change-product-panel').hide();
				$('#change-date-panel').show();
			}
	}
	
	/**  验证操作  **/
	var validator = {
			isDateValid:function(){//改变日期时验证日期有效性
				var now = new Date().Format('yyyy-MM-dd');
				var arriveDate = $('#change-date-panel .arriveDate').val();
				var leaveDate = $('#change-date-panel .leaveDate').val();
				//1. 入住日期必须大于等于今天
				if(arriveDate < now){
					$('#arriveDateTips').show();
					return false;
				}
				$('#arriveDateTips').hide();
				//2. 入住日期必须小于离店日期
				if(leaveDate <= arriveDate){
					$('#leaveDateTips').show();
					return false;
				}
				$('#leaveDateTips').hide();
				console.log(now+','+arriveDate+','+leaveDate);
				return true;
			},
			isRefundPriceValid:function(){//退差价的值是否有效
				//1. 是否选中，未选中直接返回 true
				if($('.order-price-adjust .price-refund .mark-small-circle').size()==0){
					return true;
				}
				//2. 若选中，验证数据有效性
				if(/^[1-9]\d*/.test($('#order-adjust-refund-price').val())){
					dataContainer.mainPanel.priceAdjust={returnMoney:parseInt($('#order-adjust-refund-price').val())};
					return true;
				}
				return false;
			},
			isAppendPriceValid:function(){//补差价的值是否有效
				//1. 是否选中，未选中直接返回 true
				if($('.order-price-adjust .price-append .mark-small-circle').size()==0){
					return true;
				}
				//2. 若选中，验证数据有效性
				if(/^[1-9]\d*/.test($('#order-adjust-append-price').val())){
					dataContainer.mainPanel.priceAdjust={fillUpMoney:parseInt($('#order-adjust-append-price').val())};
					return true;
				}
				return false;
			},
			isCollectPriceValid:function(){
				if(dataContainer.mainPanel.paymentMethod=='到付'){
					return /^[1-9]\d*$/.test($('#order-adjust-collect-price').val());
				}
				return true;
			}
	}
	
	/**  事件操作  **/
	var eventHolder = {
			/**
			 * 1. 公共事件区
			 */
			bindBackEvent:function(){//绑定页面左上角的返回图标的点击事件
				//1.主面板的返回事件是返回到来时的页面
				$('#main-panel .tab').click(function(){history.back()});
				//2.其他面板的返回事件是返回到主面板
				$('#change-product-panel .tab').click(function(){page.showMainPanel();});
				$('#change-date-panel .tab').click(function(){page.showMainPanel();});
			},
			bindSaveEvent:function(){
				//1.主面板保存按钮调用修改订单接口，成功返回到订单详情页，失败则停留在该面板
				$('#main-panel-save').click(function(){
					console.log("TODO : 主面板保存按钮调用修改订单接口，成功返回到订单详情页，失败则停留在该面板");
					//1.验证差价 和 对应的相应提示
					dataContainer.mainPanel.priceAdjust={};
					if(!validator.isRefundPriceValid()){
						_amain.Messager.alert("退差价请填写大于0的正整数！");
						return;
					}
					if(!validator.isAppendPriceValid()){
						_amain.Messager.alert("补差价请填写大于0的正整数！");
						return;
					}
					if(!validator.isCollectPriceValid()){
						_amain.Messager.alert("房费到付价请填写大于0的正整数！");
						return;
					}
					//2.判断数据是否已修改
					dataContainer.mainPanel.updateHotelOrder={};
					var changed = false;
						//2.1 产品 
					if(dataContainer.productPanel.currentProduct.roomProductId != dataContainer.mainPanel.orignHotelOrder.roomProductId){
						changed = true;
						dataContainer.mainPanel.updateHotelOrder=dataContainer.productPanel.currentProduct;
					}
						//2.2 日期
					if(dataContainer.productPanel.currentDate.arrivedate!=dataContainer.mainPanel.orignHotelOrder.arrivedate ||
							dataContainer.productPanel.currentDate.leavedate!=dataContainer.mainPanel.orignHotelOrder.leavedate){
						changed = true;
						dataContainer.mainPanel.updateHotelOrder.arrivedate = dataContainer.productPanel.currentDate.arrivedate;
						dataContainer.mainPanel.updateHotelOrder.leavedate = dataContainer.productPanel.currentDate.leavedate;
					}
						//2.3 房间数
					if($('.order-modify-room-count-select').val()!=dataContainer.mainPanel.orignHotelOrder.roomCount){
						changed = true;
						dataContainer.mainPanel.updateHotelOrder.roomCount = parseInt($('.order-modify-room-count-select').val());
					}
						//2.4 差价
					if(JSON.stringify(dataContainer.mainPanel.priceAdjust).length!=2){
						changed = true;
					}
					$.extend(dataContainer.mainPanel.updateHotelOrder , dataContainer.mainPanel.priceAdjust);
						//2.5 到付价
					if($('#order-adjust-collect-price').val()!=dataContainer.mainPanel.orignHotelOrder.collectPrice){
						changed = true;
						dataContainer.mainPanel.updateHotelOrder.collectPrice=$('#order-adjust-collect-price').val();
					}
					//3.拼数据 修改订单数据
					if(changed){
						dataContainer.mainPanel.updateHotelOrder.orderId=dataContainer.mainPanel.orignHotelOrder.id;
					}else{
						_amain.Messager.alert('酒店信息没有任何内容的修改！');
						return;
					}
					
					//4.弹出确认框
					dataContainer.mainPanel.updateHotelOrder.breakfastQty=converter.getBreakfastQtyNumByStr(dataContainer.mainPanel.updateHotelOrder.breakfastQty);
					//5.修改错误与否的提示
//					$('#confirm-window #confirm-button').attr('value','modify');
//					$('#confirm-window').show().find('#info-panel div:first').html("是否要修改此订单？");
					_amain.Messager.confirm("是否要修改此订单？",function(){
						delete dataContainer.mainPanel.updateHotelOrder.paymentMethod;
						serverConnector.modifyOrder(dataContainer.mainPanel.updateHotelOrder);
					});
				});
				//2.切换产品面板保存按钮，回到主面板并修改主面板的酒店产品
				$('#change-product-panel-save').click(function(){
					console.log("TODO : 切换产品面板保存按钮，回到主面板并修改主面板的酒店产品");
					//2.1 修改主面板产品信息
					var product = $('#main-panel .order-modify-hotel');
					product.data(dataContainer.productPanel.currentProduct);
					dataContainer.productPanel.currentProduct=product.data();
					product.find('.hotel-info .value').html(product.data().hotelName);
					product.find('.bed-info .value').html(converter.getRoomDetail(product.data()));
					//2.2 返回主面板
					page.showMainPanel();
				});
				//3.修改日期面板保存按钮，回到主面板并修改主面板日期为选择日期，校验失败则停留原面板
				$('#change-date-panel-save').click(function(){
					console.log("TODO : 修改日期面板保存按钮，回到主面板并修改主面板日期为选择日期，校验失败则停留原面板");
					//1. 校验正确性
					if(!validator.isDateValid())return;
					//2. 修改主面板日期
					var date = $('#main-panel .order-modify-date');
					var arriveDate = $('#change-date-panel .arriveDate').val();
					var leaveDate = $('#change-date-panel .leaveDate').val();
					date.data({arrivedate:arriveDate,leavedate:leaveDate});
					dataContainer.productPanel.currentDate={arrivedate:arriveDate,leavedate:leaveDate};
					date.find('.date-info .value').html(arriveDate+'至'+leaveDate);
					//3. 返回主面板
					page.showMainPanel();
				});
			},
			bindCancelEvent:function(){
				//1.主面板直接返回到酒店详情页
				$('#main-panel-cancel').click(function(){
					location.href=location.href.replace('modifyOrder','orderList');
				});
				//2.其他面板返回到主面板
				$('#change-product-panel-cancel').click(page.showMainPanel);
				$('#change-date-panel-cancel').click(page.showMainPanel);
			},
			/**
			 * 2. 主面板事件区
			 */
			bindChangeProductEvent:function(){
				$('.order-modify-hotel').click(function(){page.showProductPanel()});
			},
			bindChangeDateEvent:function(){
				$('.order-modify-date').click(function(){page.showDateSelectPanel()});
			},
			bindChangePriceEvent:function(){
				$('.order-price-adjust .checkbox-mark').click(function(){
					//1. 判断是否已经选中,若已经选中则不做任何操作，否则选中该项，取消其他项
					if(!$(this).find('.mark-small-circle').size()==1){
						$('.order-price-adjust .checkbox-mark .mark-small-circle').removeClass('mark-small-circle');
						$(this).children().children().addClass('mark-small-circle');
					}
				});
			},
			bindProductPanelHotelClickEvent:function(){
				$('.product-list-panel .hotel-info').click(function(){
					var container = $(this).parent();
					var hotelId = container.data('id');
					if($(this).find('.operate-mark').attr('class').indexOf('expand')!=-1){
						if(dataContainer.productPanel.isExistsProductListMap[hotelId]){
							$(this).find('.operate-mark').removeClass('expand');
							$(this).find('.operate-mark').addClass('pull');
							$(this).next().show();
						}else{
							serverConnector.getProductList(hotelId);
						}
					}else{
						$(this).find('.operate-mark').removeClass('pull');
						$(this).find('.operate-mark').addClass('expand');
						$(this).next().hide();
					}
				});
			}//,
//			bindTipsWindowButtonClickEvent:function(){
//				//1. 绑定确定按钮事件
//				$('#confirm-window #confirm-button').off('click').click(function(){
//					//1.1 绑定操作
//					if($(this).attr('value')=='modify'){
//						serverConnector.modifyOrder(dataContainer.mainPanel.updateHotelOrder);
//					}
//					//1.2 关闭提示框
//					$('#confirm-window').hide();
//				});
//				//2. 绑定取消按钮事件
//				$('#confirm-window #cancel-button').off('click').click(function(){
//					$('#confirm-window').hide();
//				});
//			}
	}
	
	/** 渲染引擎 **/
	var renderEngine = {
			/**
			 * 主面板
			 */
			//1.渲染原单信息
			renderHotelOrder:function(data){
				dataContainer.mainPanel.paymentMethod=data.paymentMethod;
				dataContainer.mainPanel.orignHotelOrder=data;
				//1.1 渲染原订单
				var orignInfo = $('.orign-order-info .order-detail');
				orignInfo.find('.hotelName').html(data.hotelName);
				orignInfo.find('.checkInPeopleName').html(data.checkInPeopleName);
				orignInfo.find('.roomdetail').html(converter.getRoomDetail(data));
				orignInfo.find('.roomCount').html(data.roomCount);
				orignInfo.find('.arrivedate').html(data.arrivedate);
				orignInfo.find('.leavedate').html(data.leavedate);
				//渲染 价格
				if(data.paymentMethod=='预付'){
					$('#order-detail-price .total-price').html('￥'+data.totalPrice);
					$('#order-detail-price .price-desc').html('');
				}else{
					$('#order-detail-price .total-price').html('￥'+(parseFloat(data.totalPrice)+parseFloat(data.collectPrice)));
					$('#order-detail-price .price-desc').html('（房费到付¥'+data.collectPrice+'＋服务费预付¥'+data.totalPrice+'）');
				}
				orignInfo.css('visibility','visible');
				//1.2 渲染产品
				var product = $('#main-panel .order-modify-hotel');
				product.data({roomProductId:data.roomProductId});
				dataContainer.productPanel.currentProduct=product.data();
				product.find('.hotel-info .value').html(data.hotelName);
				product.find('.bed-info .value').html(converter.getRoomDetail(data));
				//1.3 渲染日期
				var date = $('#main-panel .order-modify-date');
				date.data({arrivedate:data.arrivedate,leavedate:data.leavedate});
				dataContainer.productPanel.currentDate={arrivedate:data.arrivedate,leavedate:data.leavedate};
				date.find('.date-info .value').html(data.arrivedate+'至'+data.leavedate);
				$('#change-date-panel .order-date-select .arriveDate').val(data.arrivedate);
				$('#change-date-panel .order-date-select .leaveDate').val(data.leavedate);
				//1.4 渲染房间数
				renderEngine.renderRoomCountSelect(10);
				$('#main-panel .order-modify-room-count-select').val(data.roomCount);
				//1.5 渲染价格
				if(dataContainer.mainPanel.paymentMethod=='到付'){
					$('#order-adjust-collect-price').val(data.collectPrice);
					$('#main-panel .order-collect-price-adjust').show();//展示到付价修改区域
					$('#main-panel .price-refund .label').html('退服务费差价');
					$('#main-panel .price-append .label').html('补服务费差价');
					$('#main-panel .price-nochange .label').html('无服务费差价');
				}
				//1.6 绑定修改事件
				eventHolder.bindChangeProductEvent();
				eventHolder.bindChangeDateEvent();
			},
			renderRoomCountSelect:function(count){
				//var roomProductId = $('#main-panel .order-modify-hotel').data('roomProductId');
				var select = $('#main-panel .order-modify-room-count-select');
				select.find('option').remove();
				for(var i=1;i<=count;i++){
					select.append('<option value="'+i+'">'+i+'</option>');
				}
			},
			/**
			 * 产品选择页面
			 */
			//2.渲染酒店列表
			renderHotelList:function(data){
				//2.1 渲染酒店列表
				var container = $('.product-list-panel');
				var template = container.find('.product-list-item').eq(0);
				var hotelId=null;
				for(var i=0;i<data.length;i++){
					var clone = template.clone();
					clone.show();
					clone.attr('hotelId',data[i].id);
					clone.data(data[i]);
					clone.find('.hotel-info .hotel-name').html(data[i].name);
					container.append(clone);
					if(data[i].name==dataContainer.mainPanel.orignHotelOrder.hotelName){
						hotelId=data[i].id;
					}
				}
				dataContainer.productPanel.isExistsHotelList=true;
				//2.2 添加事件绑定 酒店产品的展开
				eventHolder.bindProductPanelHotelClickEvent();
				if(hotelId)
					serverConnector.getProductList(hotelId);
			},
			//3.渲染产品列表
			renderHotelProducts:function(data){
				var temp=null;
				if(dataContainer.productPanel.currentHotelId!=0){
					//生成并渲染
					var container = $('.product-list-item[hotelId='+dataContainer.productPanel.currentHotelId+']');
					dataContainer.productPanel.currentHotelId=0;
					var hotel = container.data();
					var ul = container.find('.product-list');
					ul.find('.product-item').remove();
					var liTemplate = $('.product-list-panel .product-list-item:eq(0) .product-list .product-item:eq(0)');
					for(var i=0;i<data.length;i++){
						if(data[i].paymentMethod != dataContainer.mainPanel.paymentMethod)continue;
						var param = {
								roomProductId:data[i].id,
								cityId:hotel.cityId,
								hotelName:hotel.name,
								roomtypeName:data[i].roomTypeName,
								bedtype:data[i].bedType,
								breakfastQty:data[i].breakfastQty,
								paymentMethod:data[i].paymentMethod
						};
						var clone = liTemplate.clone();
						clone.data(param);
						if(data[i].id==dataContainer.productPanel.currentProduct.roomProductId){//选中操作
							temp=clone;
						}
						clone.find('.label').html(converter.getRoomDetail(param));
						ul.append(clone);
						clone.click(function(){
							if($(this).find('.mark-small-circle').size()==0){
								$('.product-list-panel .mark-small-circle').removeClass('mark-small-circle');
								$(this).find('.mark-big-circle').children().addClass('mark-small-circle');
								dataContainer.productPanel.currentProduct=$(this).data();
							}
						});
					}
					//展开
					dataContainer.productPanel.isExistsProductListMap[hotel.id]=true;
					ul.show();
					container.find('.operate-mark').removeClass('expand');
					container.find('.operate-mark').addClass('pull');
					
				}
				if(temp)temp.click();
			}
	}
	
	/**  数据格式转化器  **/
	var converter = {
			getRoomDetail:function(data){//data -->hotelOrder
				return data.roomtypeName+'/'+data.bedtype+'/'+data.breakfastQty+'/'+data.paymentMethod;
			},
			getBreakfastQtyNumByStr:function(num){
				switch(num){
					case "无早": {
						return 0;
					}
					case "单早": {
						return 1;
					}
					case "双早": {
						return 2;
					}
				}
			}
	}
	
	/**  接口连接器  **/
	var serverConnector = {
			//1.获取原单数据
			getHotelOrder:function(){//获取酒店详情
				_Jquery.post(root + '/rest/order/getHotelOrder', {id:getUrlParams()['id']}, renderEngine.renderHotelOrder);
			},
			getHotelList:function(){//获取酒店列表
				_Jquery.post(root + '/rest/hotel/getHotelList',{},renderEngine.renderHotelList);
			},
			getProductList:function(hotelId){//获取酒店产品
				dataContainer.productPanel.currentHotelId=hotelId;
				_Jquery.get(root + '/rest/hotel/getRoomProductList?hotelId='+hotelId, renderEngine.renderHotelProducts)
			},
			modifyOrder:function(hotelOrder){
				_Jquery.post(root + '/rest/order/modifyOrder',hotelOrder,function(data){
					if(data.code==100){
						history.back();
					}else{
						_amain.Messager.alert(data.msg);
					}
				});
			}
	}
	
	/**  前端数据存储  **/
	var dataContainer = {
			mainPanel:{
				paymentMethod:'预付',
				orignHotelOrder:null,
				priceAdjust:null,
				updateHotelOrder:null
			},
			productPanel:{
				isExistsHotelList:false,
				isExistsProductListMap:{
					
				},
				currentHotelId:0,
				currentProduct:null,
				currentDate:null
			},
			datePanel:{
				
			}
	}
	
	/**  执行入口  **/
	var init=function(){
			serverConnector.getHotelOrder();//获取酒店详情
			eventHolder.bindBackEvent();//绑定各页面返回按钮事件
			eventHolder.bindCancelEvent();//绑定各页面取消按钮事件
			eventHolder.bindSaveEvent();//绑定各个页面的保存按钮事件
//			eventHolder.bindTipsWindowButtonClickEvent();//绑定信息提示框的事件
			eventHolder.bindChangePriceEvent();//差价选择 模拟 checkbox 事件

			window.$load = $('#common-load');
			$load.addClass('hidden');
	}
	
	init();
})