;(function(win){
	var hadSettledRecordList = {
		loadOrderData: function(idx){
			var self = this;
			$.ajax({
				url:root + '/rest/settlement/getWithdrawListInfo',
		    type: 'GET', 
		    dataType: 'json',
		    contentType:'application/json;charset=UTF-8',        
		    success: function(result) { 
		    	var price = result.totalPrice?result.totalPrice:0;
		    	price =('￥'+price);
		    	self.$price.html(price);

		    	// console.log(result);
		    	var data = self.processData(result);
		    	self.render(data);
		    	$load.addClass('hidden');
		    	$wrap.addClass('show');
		    	$('#saleFeatList').removeClass('hidden');
		    } 
			});
		},
		processData: function(result){
			var data = result.list;
			if(data && data.length > 0){
				
			} else {
				data = [];
			}
      return data;
    },
    render: function(data){
      var tmpl = $('#featTmpl').html();
      var render = doT.template(tmpl);
      var html = render(data);
      $('#saleFeatList').html(html);
    },
    bindEvent: function(){
    	// $('#pHeadArrow').click(function(){history.back()});
    	//查看详情
			$('#app').on("click",".psettlement-li",function(){
				util.goByUrl("./hadSettledList.html?id="+$(this).data('id'));
			});
    },
		init: function(){
			var self = this;
			self.$price = $("#pAccountPrice");
			self.loadOrderData();
			self.bindEvent();
		}
	}
	hadSettledRecordList.init();
})(window);