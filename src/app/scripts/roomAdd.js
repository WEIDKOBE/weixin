var _params;



function init() {

	//1. 缓存URL参数
	_params = getUrlParams();
	if (!_params.roomId) {
		$("#edit-price").css("display", "none");
		$("#add-product").html("添加");
	}else{
		$("#add-product").css("display", "none");
	}
	$('#select2').attr("disabled",true);

      $('#select3').attr("disabled",true);

	//2. 渲染酒店名称
	$('#hotelName').html(_params.hotelName);
	//3. 渲染选择列表
	renderRoomType();
	//4. 绑定事件
	bindSelectEvent();
	//5. 绑定操作（增加、取消）事件
	bindOperateEvent();
	//6.绑定点击事件
	bindClickEvent();
	//7.绑定担保选择
	bindSelectVouch();
}
init();



/**
 * 渲染房间类型
 */
function renderRoomType() {
	$.ajax({
		url: root + '/rest/hotel/getRoomTypeList?hotelId=' + _params.hotelId,
		type: 'GET',
		dataType: 'json',
		contentType: 'application/json;charset=UTF-8',
		success: function(result) {

			var length = result.length;
			//$("#roomType .item:gt(1)").remove();
			for (var i = 0; i < length; i++) {
				var copy = $("#roomType .item:first").clone();
				if (result[i].status == 0) {
					copy.find('.text').html(result[i].nameChs + '/' + result[i].bedtype + '<span style="color:#f00">(未审核)</span>');
					copy.find('.iconArea').remove();
				} else {
					copy.find('.text').html(result[i].nameChs + '/' + result[i].bedtype);
				}

				copy.attr('value', result[i].id);
				copy.removeClass('item-none').addClass('item-show');
				$('#roomType').append(copy);
			}
			$load.addClass('hidden');
			for (var j = 0; j < length; j++) {
				if ((result[j].nameChs === _params.roomType) && (result[j].bedtype === _params.bed)) {
					z = j;
				}
			}
			if (_params.roomId) {
				bindSelectEvent(z);
			} else {
				bindSelectEvent();
			}

		}
	});
}

function bindSelectEvent(z) {
	var ids = ['roomType', 'breakfast', 'payMethod'];
	//绑定事件
	for (var i = 0; i < ids.length; i++) {
		$('#' + ids[i] + ' .item').click(function() {
			if ($(this).find('.iconArea').length <= 0) {
				return false;
			}
			if ($(this).find('#maximum-breakfast').length) {
				var breakfastItem = $('#item-maximum-breakfast');
				var breakfast = $('#maximum-breakfast');

				var val = breakfast.html();
				var valFormat = parseInt(val);
				/*if (Number.isFinite(valFormat) && (/^\d{1,2}$/.test(valFormat))) {
					breakfastItem.attr('value', valFormat);
				} else {
					_amain.Messager.alert("请输入一位或者二位数字");
					breakfast.html(4);
					$('#breakfast').attr('value', 4);
					breakfast.focus();
				}*/
			}
			var id = $(this).parent().attr('id');
			$('#' + id).attr('value', $(this).attr('value'));
			$('#' + id + ' .icon').removeClass('green').addClass('gray');
			$(this).find(".icon").removeClass('gray').addClass('green');
		});
	}

	$('#maximum-breakfast').click(function(event) {
		return false;
	});
	$('#maximum-breakfast').blur(function(event) {
		$(this).closest('.item').trigger('click');
	});


	//触发事件
	if (!_params.roomId) {
		$('#roomType .item:has(.iconArea)').eq(1).click();
		$('#breakfast .item').eq(1).click();
		$('#payMethod .item').eq(0).click();
		//$('#vouchSet .item').eq(0).click();
		if($('#payMethod .item').eq(0).click()){
		          $('#vouchSet').css("display", "none");
		          $('#vouchSetTitle').css("display", "none");
		          $('#vouchChoice .iconArea div').removeClass('green');
		          $('#vouchChoice .iconArea div').addClass('gray');
		          $('#vouchChoice').attr('value','0');
			}
		$('#payMethod .item').click(function() {
			$('#vouchSet').css("display", "block");
		      $('#vouchSetTitle').css("display", "block");
		       $('#vouchChoice .iconArea div').removeClass('green');
		       $('#vouchChoice .iconArea div').addClass('gray');
		       $('#select1').attr("disabled",true);
	             //$('#select2').attr("disabled",true);
	             //$('#select3').attr("disabled",true);
		       //$('#vouchChoice').attr('value','1');
		})
		  $('#all-pre').click(function() {
			$('#vouchSet').css("display", "none");
		      $('#vouchSetTitle').css("display", "none");
		      $('#vouchChoice .iconArea div').removeClass('green');
		      $('#vouchChoice .iconArea div').addClass('gray');
		       $('#vouchChoice').attr('value','0');
		})
	} else {
		$.ajax({
			url: root + '/rest/hotel/getRoomProduct?id=' + _params.roomId,
			type: 'GET',
			dataType: 'json',
			contentType: 'application/json;charset=UTF-8',
			success: function(result) {
				console.log(result);
				$('#roomType .item:has(.iconArea)').eq(z + 1).click();

				$('#payMethod .item').eq(result.paymentMethod - 1).click();
				$('#reservation-condition-display').html(result.prebook);
				$('#continuous-condition-display').html(result.conaccommodation);
				if(result.breakfastQty > 3) {
					$('#breakfast .item').eq(4).click();
					$('#maximum-breakfast').html(result.breakfastQty);
				}else{
					$('#breakfast .item').eq(result.breakfastQty).click();
				}
				if (result.prebookStartTime) {
					$("#timer1").val(result.prebookStartTime.substring(0, 5));
				} else {
					$("#timer1").val("00:00");
				}
				if (result.prebookEndTime) {
					$("#timer2").val(result.prebookEndTime.substring(0, 5));
				} else {
					$("#timer2").val("23:59");
				}
				if(result.paymentMethod == 1){
					$('#vouchSet').css("display", "none");
		                   $('#vouchSetTitle').css("display", "none");
		                   $('#vouchChoice .iconArea div').removeClass('green');
		                   $('#vouchChoice .iconArea div').addClass('gray');
				}else if(result.paymentMethod == 2){
					$('#vouchSet').css("display", "block");
		                   $('#vouchSetTitle').css("display", "block");
				}else if(result.paymentMethod == 3){
                                 $('#vouchSet').css("display", "block");
		                   $('#vouchSetTitle').css("display", "block");
				}
				if(result.isSurety == 0) {
					 $('#vouchChoice .iconArea div').addClass('gray');
				}
				else if(result.isSurety == 1) {
                                  $('#vouchChoice .iconArea div').addClass('green');
				}
				if(result.suretyLastTime){
                                 var count=$("#select1 option").length;
					      for(var i=0;i<count;i++){
					         	if($("#select1").get(0).options[i].text == result.suretyLastTime.substring(0, 2)){
					                $("#select1").get(0).options[i].selected = true;
					                break;
					            }
					        }
					//$("#select1 option[text='04']").attr("selected", true);
				}
				if(result.suretyMode == 1) {
					var count=$("#select3 option").length;
					      for(var i=0;i<count;i++){
					         	if($("#select3").get(0).options[i].text == '首晚担保'){
					                $("#select3").get(0).options[i].selected = true;
					                break;
					            }
					        }
				}else if(result.suretyMode == 2){
					var count=$("#select3 option").length;
					      for(var i=0;i<count;i++){
					         	if($("#select3").get(0).options[i].text == '全额担保'){
					                $("#select3").get(0).options[i].selected = true;
					                break;
					            }
					        }
				}
			}
		});
	}
}

function bindSelectVouch() {
	$('#vouchChoice').click(function() {
            if($('#vouchChoice .iconArea div').hasClass('green')){
            	//console.log(1);
	       $('#vouchChoice .iconArea div').removeClass('green');
	       $('#vouchChoice .iconArea div').addClass('gray');
	       $('#vouchChoice').attr('value','0');
	       $('#select1').attr("disabled",true);
	       //$('#select2').attr("disabled",true);
	       //$('#select3').attr("disabled",true);
	      }else{
		   	//console.log(2);
		       $('#vouchChoice .iconArea div').addClass('green');
		       $('#vouchChoice .iconArea div').removeClass('gray');
		       $('#vouchChoice').attr('value','1');
		       $('#select1').attr("disabled",false);
		       //$('#select2').attr("disabled",false);
		      // $('#select3').attr("disabled",false);
		   }
	})

}


function bindOperateEvent() {
	//增加按钮事件

	$("#add-product").click(function() {
		//1. 验证数据
		console.log($("#select3").find("option:selected").text());
		var breakfastVal = $('#breakfast').attr('value');
		var valFormat = parseInt(breakfastVal);
		var val1 = parseInt($('#reservation-condition-display').html());
		var val2 = parseInt($('#continuous-condition-display').html());
		/*if (/^\d{1,2}$/.test(valFormat)) {} else {
			_amain.Messager.alert("请输入一位或者二位数字");
			$('#maximum-breakfast').val(4);
			$('#maximum-breakfast').focus();
			$('#breakfast').attr('value', 4);
			return false;
		}
*/

		var ids = ['roomType', 'breakfast'];
		for (var i = 0; i < ids.length; i++) {
			if ($('#' + ids[i]).attr('value') == "") {
				_amain.Messager.alert("请等待页面初始化完毕！");
				return;
			}
		}
		var roomTypeId = $('#roomType').attr('value');
		var roomTypeName = $('#roomType').find("[value=" + roomTypeId + "] .text").html();
		$load.removeClass('hidden');

		var res = parseInt($('#reservation-condition-display').html());
		var con = parseInt($('#continuous-condition-display').html());
		var preStartTime;
		var preEndTime;
		arr1 = $("#timer1").val().split(":");
		arr2 = $("#timer2").val().split(":");
		value1 = parseInt(arr1[0]) * 60 + parseInt(arr1[1]);
		value2 = parseInt(arr2[0]) * 60 + parseInt(arr2[1]);
		if (value2 > value1) {
			arr1[2] = "00";
			arr2[2] = "00";
			preStartTime = arr1.join(":");
			preEndTime = arr2.join(":");
		} else {
			_amain.Messager.alert('结束时间必须大于开始时间');
			//$load.addClass('hidden');
			return false;
		}
		if (($("#timer1").val() !== "00:00" && res != 0) || ($("#timer1").val() !== "00:00" && con != 0) || ($("#timer2").val() !== "23:59" && res != 0) || ($("#timer2").val() !== "23:59" && con != 0) || (res != 0 && con != 0)) {
			_amain.Messager.alert('不能同时选择两个以上的特殊规则');
			//$load.addClass('hidden');
			return false;
		}
		var vouchmethod;
		if($("#select3").find("option:selected").text() == '首晚担保'){
			vouchmethod = 1;
		}
		if($("#select3").find("option:selected").text() == '全额担保'){
			vouchmethod = 2;
		}
             //console.log($('#vouchChoice').attr('value'));
            // if($('#vouchChoice').attr('value') == 1) {
             	//console.log(100);
                   //$('#select1').css('disabled','disabled');
                   //$('#select1').attr("disabled",true);
             //}
		//2. 提交
		//console.log($('#vouchChoice').attr('value'));
		//console.log($("#select1").find("option:selected").text() +':'+$("#select2").find("option:selected").text());
		//console.log(vouchmethod);
		$.ajax({
			url: root + '/rest/hotel/addRoomProduct',
			type: 'POST',
			data: JSON.stringify({
				hotelId: _params.hotelId,
				roomTypeId: roomTypeId,
				//roomTypeName:roomTypeName,
				breakfastQty: $('#breakfast').attr('value'),
				paymentMethod: $('#payMethod').attr('value'),
				id: (_params.roomId || ""),
				//isSurety: 0,
				isSurety: $('#vouchChoice').attr('value'),
				suretyLastTime:$("#select1").find("option:selected").text() +':'+$("#select2").find("option:selected").text(),
				suretyMode:vouchmethod,
				//suretyStartTime:
				//suretyEndTime:
				prebook: parseInt($('#reservation-condition-display').html()),
				conaccommodation: parseInt($('#continuous-condition-display').html()),
				prebookStartTime: preStartTime,
				prebookEndTime: preEndTime
			}),
			dataType: 'json',
			contentType: 'application/json;charset=UTF-8',
			success: function(result) {
				console.log(result);
				$load.addClass('hidden');
				if (result.code == 100) {
					_amain.Messager.alert("操作成功！", goBack);
				} else if (result.code == 200) {
					_amain.Messager.alert(result.msg);
				} else {
					_amain.Messager.alert('未知错误！');
				}
			}
		});

	});
	//取消按钮事件 -- 跳转回父页面
	$('#cancel').click(function() {
		goBack();
	});
	$("#edit-price").click(function() {
		next();
	});
}

function goBack() {
	var url = './roomList.html?hotelId=' + _params.hotelId + '&hotelName=' + _params.hotelName;
	util.goByUrl(url);
}

function next() {
	//var url = './roomCalendar.html?hotelId='+_params.hotelId+'&hotelName='+_params.hotelName+'&roomProductId='+_params.roomId+';
	var url = './roomCalendar.html?hotelId=' + _params.hotelId + '&hotelName=' + _params.hotelName + '&roomId=' + _params.roomId;
	util.goByUrl(url);
}

function bindClickEvent() {

	$('#reservation-condition-red,').click(function() {
		var val1 = parseInt($('#reservation-condition-display').html());
		if (val1 > 0) {
			$('#reservation-condition-display').html(val1 - 1);
		}
	});

	$('#reservation-condition-add').click(function() {
		var val1 = parseInt($('#reservation-condition-display').html());
		$('#reservation-condition-display').html(val1 + 1);

	});

	$('#continuous-condition-red,').click(function() {
		var val2 = parseInt($('#continuous-condition-display').html());
		if (val2 > 2) {
			$('#continuous-condition-display').html(val2 - 1);
		} else if (val2 > 0) {
			$('#continuous-condition-display').html(val2 - 2);
		}
	});

	$('#continuous-condition-add').click(function() {
		var val2 = parseInt($('#continuous-condition-display').html());
		if (val2 == 0) {
			$('#continuous-condition-display').html(val2 + 2);
		} else {
			$('#continuous-condition-display').html(val2 + 1);
		}
	});

	$('#breakfast-condition-red').click(function() {
		var val3 = parseInt($('#maximum-breakfast').html());
		if (val3 > 4) {
			$('#maximum-breakfast').html(val3 - 1);
		}
	});

	$('#breakfast-condition-add').click(function() {
		var val3 = parseInt($('#maximum-breakfast').html());
		$('#maximum-breakfast').html(val3 + 1);

	});
}