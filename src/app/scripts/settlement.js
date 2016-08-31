(function(win){
	var settlement = {
		getData: function(){
			$.ajax({
				url:root + '/rest/settlement/getHomeInfo',
		    type: 'GET',
		    dataType: 'json',
		    contentType:'application/json;charset=UTF-8',
		    success: function(result) {
		    	console.log(result);
		    	$('#notGetCashNum').html(result.canNotWithdrawOrderNumber?result.canNotWithdrawOrderNumber:0);
		    	$('#getCashNum').html(result.canWithdrawTotalPrice?result.canWithdrawTotalPrice:0);
		    	$('#appliedCashNum').html(result.haveApplyedWithdrawOrderNumber?result.haveApplyedWithdrawOrderNumber:0);
		    	$('#getCashRecordNum').html(result.haveWithdrawCount?result.haveWithdrawCount:0);
		    	$load.addClass('hidden');
					$wrap.addClass('show');
		    }
			});
		},
		bindEvent: function(){
			$('#notGetCash').click(function(){
				util.goByUrl("./canNotWithdrawList.html");
			});
			$('#getCash').click(function(){
				util.goByUrl("./canWithdrawList.html");
			});
			$('#appliedCash').click(function(){
				util.goByUrl("./hadAppliedList.html");
			});
			$('#getCashRecord').click(function(){
				util.goByUrl("./hadSettledRecordList.html");
			});
		},
		init: function(){
			var self = this;
			self.getData();
			self.bindEvent();
		}
	}
	settlement.init();
})(window);