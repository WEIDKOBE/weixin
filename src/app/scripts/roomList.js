
var roomList = [{roomType:'',bedType:'',breakfast:'',payMethod:'',prebook:'',preStartTime:'',preEndTime:'',conaccom:''}];
var _params;
function init(){
	//1. 缓存参数
	_params = getUrlParams();

	//2. 渲染酒店名称
	$('#hotelName').html(_params.hotelName);

	//3. 渲染房型列表
	renderRoomList();

	//4. 添加产品按钮
	bindAddProductButton();

     //删除产品按钮
     //bindDeleteProductEvent();
}
init();

/**
 * 渲染房型列表
 */
function renderRoomList(){
	$.ajax({
		url:root + '/rest/hotel/getRoomProductList?hotelId='+_params.hotelId,

	    type: 'GET',
	    dataType: 'json',
	    contentType:'application/json;charset=UTF-8',
	    success: function(result) {
          console.log(result);
           console.log(window.location);
	    	var length = result.length;
	    	for(var i=0;i < length;i++){
	    		var copy = $("#room-list .room-item:first").clone();
	    		copy.find('.roomType').html(productShow(result[i]));
               if(result[i].prebook || result[i].conaccommodation || (result[i].prebookStartTime.substring(0,5) != '00:00') ||  (result[i].prebookEndTime.substring(0,5)) != '23:59') {
                  copy.find('.delete').css('margin-top','28px');
               }
                //console.log(copy.find('.roomType'));
                //console.log(copy.find('.roomType')[0]);
                //console.log(copy.find('.roomType')[0].clientHeight);
               // console.log($('.roomType').offsetHeight);
	    		copy.show();
                copy.find('.edit').attr('href','./roomAdd.html?hotelId='+_params.hotelId+'&hotelName='+_params.hotelName+'&roomId='+result[i].id+'&roomType='+result[i].roomTypeName+'&bed='+result[i].bedType+'&breakfast='+result[i].breakfastQty+'&pay='+result[i].paymentMethod);
      	    	copy.find('.pricedata').attr('href','./roomCalendar.html?hotelId='+_params.hotelId+'&hotelName='+_params.hotelName+'&roomId='+result[i].id);
               var  lists =$('.room-item').attr("display","block");

                copy.find('.switch').attr('roomProductId',result[i].id).attr('roomProductName',productShow(result[i]));
	    		if(result[i].isClosed==1){
	    			copy.find('.switch').removeClass('switch-on').addClass('switch-off');
	    		}
	    		$('#room-list').append(copy);

	    	}
        function hide() {
            $('.line').hide();
        }
        //console.log(copy);
      // console.log(copy.find(".line"));
      if(length != 0) {
        copy.find(".line").hide();
      }







          var  lists =$('.room-item').attr("display","block").find('.delete');
                   for (var j= 0; j < lists.length; j++) {
                      (function () {
                            var n = j;
                            lists[j].onclick = function () {
                                console.log(n);
                                     _amain.Messager.confirm("确定要删除此产品吗？",function(){
                                _Jquery.get(root+'/rest/hotel/deleteRoomProduct?roomProductId='+result[n-1].id,function(result){
                                  console.log(result);
                                if(result.code==100){
                                _amain.tips.open("产品删除成功！");
                                setTimeout(function(){
                                location.reload();
                                },3000);
                              }else{
                               _amain.Messager.alert(result.msg);
                              }
                            })
                          });
                       }
                  })(j)
               }
	    	$load.addClass('hidden');
	    	$('#room-list').on('click','.switch', function(){
	    		var hotelName = $(this).attr('roomProductName');
	    		window.currentId = $(this).attr('roomProductId');
	    		if($(this).attr('class').indexOf('switch-on')==-1){
	    			_amain.Messager.confirm("是否要开启 "+hotelName+" 的预定?",function(){
	    				_Jquery.get(root+'/rest/hotel/openRoomProductBook?roomProductId='+currentId,function(result){
	    					if(result.code==100){
//	    						_amain.Messager.alert(result.msg);
	    						$('[roomProductId='+currentId+']').removeClass('switch-off').addClass('switch-on');
	    					}else{
	    						_amain.Messager.alert(result.msg);
	    					}
	    				});
	    				console.log("TODO ：开启酒店预订服务调用，并回显。");
	    			});
	    		}else{
	    			_amain.Messager.confirm("是否要关闭 "+hotelName+" 的预定?",function(){
	    				_Jquery.get(root+'/rest/hotel/closeRoomProductBook?roomProductId='+currentId,function(result){
	    					if(result.code==100){
//	    						_amain.Messager.alert(result.msg);
	    						$('[roomProductId='+currentId+']').removeClass('switch-on').addClass('switch-off');
	    					}else{
	    						_amain.Messager.alert(result.msg);
	    					}
	    				});
	    				console.log("TODO ：关闭酒店预订服务调用，并回显。");
	    			});
	    		}
	    	});
	    }
	});
}

/**
 * 产生房型显示名称
 */
function productShow(product){
	var roomType = product.roomTypeName ? product.roomTypeName : "未知";
	var bedType = product.bedType ? product.bedType : "未知";
	var breakfast = product.breakfastQty ? product.breakfastQty : "未知";
     var payMethod = product.paymentMethod ? product.paymentMethod : "未知";
     var issurety = product.isSurety ? product.isSurety : "未知";
     var conaccom = product.conaccommodation ? product.conaccommodation : "未知";
     var prebook = product.prebook ? product.prebook : "未知";
     var preStartTime = product.prebookStartTime.substring(0,5) ? product.prebookStartTime.substring(0,5) : "未知";
     var preEndTime = product.prebookEndTime.substring(0,5) ? product.prebookEndTime.substring(0,5) : "未知";
     var suretylasttime = product.suretyLastTime ? product.suretyLastTime : "未知";

     if(prebook != 0 && prebook != "未知") {
          if(issurety == 1 && issurety != "未知" ){
            return roomType+'/'+bedType+'/'+breakfast+'/'+payMethod+'/'+'担保'+'('+product.suretyLastTime.substring(0,5) +')'+'<br/>'+'<div style="font-size:14px;padding-top:10px;">'+'('+'提前'+prebook+'天预订'+')'+'</div>';
          }else{
            return roomType+'/'+bedType+'/'+breakfast+'/'+payMethod+'<br/>'+'<div style="font-size:14px;padding-top:10px;">'+'('+'提前'+prebook+'天预订'+')'+'</div>';
          }
     }
      else if(conaccom != 0 && conaccom != "未知") {
        if(issurety == 1 && issurety != "未知") {
            return roomType+'/'+bedType+'/'+breakfast+'/'+payMethod+'/'+'担保'+'('+product.suretyLastTime.substring(0,5)+')'+'<br/>'+'<div style="font-size:14px;padding-top:10px;">'+'('+'连住'+conaccom+'晚起预订'+')'+'</div>';
        }else{
            return roomType+'/'+bedType+'/'+breakfast+'/'+payMethod+'<br/>'+'<div style="font-size:14px;padding-top:10px;">'+'('+'连住'+conaccom+'晚起预订'+')'+'</div>';
        }
     }
     else if(preStartTime != '00:00' || preEndTime != '23:59' ) {
        if(issurety == 1 && issurety != "未知"){
         return roomType+'/'+bedType+'/'+breakfast+'/'+payMethod+'/'+'担保'+'('+product.suretyLastTime.substring(0,5)+')'+'<br/>'+'<div style="font-size:14px;padding-top:10px;">'+'('+'房型预订时间:'+preStartTime+'-'+preEndTime+'可以正常预订'+')'+'</div>';
        }else{
         return roomType+'/'+bedType+'/'+breakfast+'/'+payMethod+'<br/>'+'<div style="font-size:14px;padding-top:10px;">'+'('+'房型预订时间:'+preStartTime+'-'+preEndTime+'可以正常预订'+')'+'</div>';
        }
     }
     else{
         if(issurety == 1 && issurety != "未知") {
         return roomType+'/'+bedType+'/'+breakfast+'/'+payMethod+'/'+'担保'+'('+product.suretyLastTime.substring(0,5)+')';
         }else{
          return roomType+'/'+bedType+'/'+breakfast+'/'+payMethod;
         }
     }


	//return roomType+'/'+bedType+'/'+breakfast+'/'+payMethod+'<br/>'+'('+'连住'+conaccom+'晚起预订'+'/'+'提前'+prebook+'天起预订'+'/'+'房型预订时间:'+preStartTime+'-'+preEndTime+'可以正常预订'+')';
    /* else if(issurety == 1 && payMethod != '部分预付'){
       return roomType+'/'+bedType+'/'+breakfast+'/'+payMethod+'/'+'担保'+'('+suretylasttime+')';
     }else if(issurety == 0 && payMethod != '部分预付'){
      return roomType+'/'+bedType+'/'+breakfast+'/'+payMethod+'('+suretylasttime+')';
     }else if(issurety == 0 && payMethod != '到付'){
      return roomType+'/'+bedType+'/'+breakfast+'/'+payMethod+'('+suretylasttime+')';
     }else if(issurety == 1 && payMethod != '到付'){
      return roomType+'/'+bedType+'/'+breakfast+'/'+payMethod+'/'+'担保'+'('+suretylasttime+')';
     }*/
    //return roomType+'/'+bedType+'/'+breakfast+'/'+payMethod+'('+suretylasttime+')';
}

/**
 * 绑定增加产品按钮
 */
function bindAddProductButton(){
	$('#addProductButton').click(function(){
		var url = "./roomAdd.html?hotelId="+_params.hotelId+"&hotelName="+_params.hotelName;
		util.goByUrl(url);
	});
	$('#addRoomTypeButton').click(function(){
		var url = "./roomTypeAdd.html?hotelId="+_params.hotelId+"&hotelName="+_params.hotelName;
		util.goByUrl(url);
	});
	/*$('#edit_one').click(function(){
		var url = "./roomTypeAdd.html?hotelId="+_params.hotelId+"&hotelName="+_params.hotelName;
		util.goByUrl(url);
	});*/
}

function next() {
  //var url = './roomCalendar.html?hotelId='+_params.hotelId+'&hotelName='+_params.hotelName+'&roomProductId='+_params.roomId+';
  var url = './roomCalendar.html?hotelId=' + _params.hotelId + '&hotelName=' + _params.hotelName + '&roomId=' + _params.roomId;
  util.goByUrl(url);
}



