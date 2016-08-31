;(function(win){
	var orderDetail = {
		loadOrderData: function(idx){
			var self = this;
			$.ajax({
		    url:root + '/rest/settlement/getOrderDetailInfo',
		    type: 'GET',
		    dataType: 'json',
		    contentType:'application/json;charset=UTF-8',
		    data:{
		    	orderId: self.id
		    },
		    success: function(result) {
                   //console.log(1);
		    	console.log(result);
		    	var price = result.totalPrice?result.totalPrice:0;
		    	price =('￥'+price);
		    	self.$price.html(price);

		    	var data = self.processData(result);
		    	self.render(data);
		    	$load.addClass('hidden');
		    	$wrap.addClass('show');
		    	$('#saleFeatList').removeClass('hidden');
		    }
			});
		},
		processData: function(result){
			var data = result;
                   //console.log(data);
			if(Constants.getOrderStatus(data.status,data.subStatus)!==undefined){
				data.status=Constants.getOrderStatus(data.status,data.subStatus);
			}

      return data;
    },
    render: function(data){
      var tmpl = $('#featTmpl').html();
      var render = doT.template(tmpl);
      var html = render(data);
      $('#saleFeatList').html(html);
         if(data.isSurety){
                  console.log(2);
                $('#issurety').css('display','inline-block');
                $('#issurety').html('/担保');
                if(data.suretyLastTime){
                  $('#suretylasttime').css('display','inline-block');
                  $('#suretylasttime').html('/' + data.suretyLastTime.substring(0,5));
                }else{
                   $('#suretylasttime').css('display','none');
                }
          }else{
               $('#issurety').css('display','none');
               $('#suretylasttime').css('display','none');
          }
    },
    bindEvent: function(){
    	// $('#pHeadArrow').click(function(){history.back()});
    },
		init: function(){
			var self = this;
			self.$price = $("#pAccountPrice");
			self.id = util.getQueryString('id');
			self.loadOrderData();
			self.bindEvent();
		}
	}
	orderDetail.init();
})(window);