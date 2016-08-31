;(function(win){
	var hadAppliedList = {
		getPreInit: function(){
		  util.showSaleFeat();
		},
		tabSwitch: function(){
			var self = this;
      // 标签切换
      var $tabs = $('#ptabs');
      var $tab = $('#ptabs').find('.ptab');
      self.$list = $('#app').find('.porderList');
      $tabs.on('click','.ptab',function(){
        $(this).addClass('pselect').siblings('.ptab').removeClass('pselect');
        var idx = $tab.index($(this));
        self.$list.addClass('hidden');
        util.storage.setItem('__pappliedCash', idx);

        if(idx == 0){
          self.loadFeatData(idx);
        } else {
          self.loadOrderData(idx);
        }
      });
      var ptabIndx = util.storage.getItem('__pappliedCash') || 0;
      $tab.eq(ptabIndx).trigger('click');
		},
		loadFeatData: function(idx){
			var self = this;
      self.$load.show();
			$.ajax({
				url:root + '/rest/settlement/getHasApplyedWithdrawSalesPerformance',
		    type: 'GET', 
		    dataType: 'json',
		    contentType:'application/json;charset=UTF-8',        
		    success: function(result) { 
		    	// console.log(result);
		    	var price = result.totalPrice?result.totalPrice:0;
		    	price =('￥'+price);
		    	self.$price.html(price);
		    	var data = self.processData(result);
		    	self.render(data);
		    	$load.addClass('hidden');
		    	$wrap.addClass('show');
		    	self.$list.eq(idx).removeClass('hidden');
		    	self.$load.hide();
		    } 
			});
		},
		loadOrderData: function(idx){
			var self = this;
      self.$load.show();
			$.ajax({
				url:root + '/rest/settlement/getHasApplyedWithdrawHotelInfo',
		    type: 'GET', 
		    dataType: 'json',
		    contentType:'application/json;charset=UTF-8',        
		    success: function(result) { 
		    	var price = result.totalPrice?result.totalPrice:0;
		    	price =('￥'+price);
		    	self.$price.html(price);

		    	// console.log(result);
		    	var data = self.processData1(result);
		    	self.render1(data);
		    	$load.addClass('hidden');
		    	$wrap.addClass('show');
		    	$('#saleOrderList').removeClass('hidden');
          self.$load.hide();
		    } 
			});
		},
		processData: function(result){
			var data = result.salespPerformanceInfos;
			if(data && data.length > 0){
				
			} else {
				data = [];
			}
      return data;
    },
    processData1: function(result){
    	var data = result.list;
			if(data && data.length > 0){
				for(var i=0,len=data.length; i<len; i++){
					var hotel = data[i];
					hotel.finalStatus = Constants.getOrderStatus(result.list[i].status,result.list[i].subStatus);
					hotel.dateCount = util.dateCount(new Date(hotel.arrivedate.replace(/-/g,"/")),new Date(hotel.leavedate.replace(/-/g,"/")));
					hotel.arrivedate = hotel.arrivedate.replace(/-/g,".");
					hotel.leavedate = hotel.leavedate.replace(/-/g,".");
				}
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
    render1: function(data){
      var tmpl = $('#orderTmpl').html();
      var render = doT.template(tmpl);
      var html = render(data);
      $('#saleOrderList').html(html);
    },
    bindEvent: function(){
    	// $('#pHeadArrow').click(function(){history.back()});
    	//查看详情
			$('#app').on("click",".pol",function(){
				util.goByUrl("./orderDetail.html?id="+$(this).data('id'));
			});
    },
		init: function(){
			var self = this;
			self.$price = $("#pAccountPrice");
      self.$load = $('#ptableLoading');
			self.getPreInit();
			if(util.hasFeat){
				self.tabSwitch();
			} else {
				self.loadOrderData();
			}
			self.bindEvent();
		}
	}
	hadAppliedList.init();
})(window);