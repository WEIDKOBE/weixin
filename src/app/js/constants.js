	
var Constants = {
	orderStatus:{
		waitPay:{code:10,desc:'待支付'},
		payTimeOut:{code:11,desc:'支付超时'},
		userCancel:{code:12,desc:'用户取消'},
		waitConfirm:{code:20,desc:'待处理'},
		haveRecieved:{code:29,desc:'处理中'},
		toProcessLive:{code:17,desc:'待办入住'},
		confirmFail:{code:22,desc:'已拒单'},//确认失败等待退款
		confirmFailRefunding:{code:31,desc:'已拒单'},//31：确认失败，退款中
		refundFail:{code:23,desc:'已拒单'},//确认失败退款失败
		refunded:{code:30,desc:'已拒单'},//确认失败，已退款
		confirmed:{code:21,desc:'可入住'},
		complete:{code:40,desc:'交易完成'},
		changedWaitPay:{code:13,desc:'待支付差价'},//已修改，待支付差价
		changedPaying:{code:27,desc:'支付中'},//已修改，差价支付中
		changedPayed:{code:14,desc:'已修改，待处理'},//修改已确认（已支付）
		changedConfirmed:{code:35,desc:'已修改，待处理'},//35：修改已确认（无差价）
		changedWaitRefund:{code:32,desc:'已修改，待处理'},//32：修改已确认，待退款
		changedRefunding:{code:33,desc:'已修改，待处理'},//33：修改已确认，退款中
		changedRefunded:{code:34,desc:'已修改，待处理'},//34：修改已确认，已退款
		changedRefundFailed:{code:24,desc:'已修改，待处理'},//24,退款失败
		cancelRefunding:{code:15,desc:'已取消'},//已取消，退款中
		paying:{code:16,desc:'修改中'},//16:支付中等待确认
		cancelWaitRefunding:{code:36,desc:'已取消'},//36：已取消，待退款
		cancelrefunded:{code:37,desc:'已取消'},//37：已取消，已退款
		cancelrefundFailed:{code:25,desc:'已取消'},
		userApplyCancel:{code:18,desc:'买家申请取消订单'},
		urgent:{code:119,desc:'紧急'}
	},
	orderStatusMap:{//同步自 订单状态文字_20150916.numbers
		'^10-\\d$':'',
		'^11-\\d$':'',
		'^12-\\d$':'',
		'^13-\\d$':'待支付差价',//已修改，待支付差价
		'^14-\\d$':'已修改，待处理',//修改已确认（已支付）
		'^15-\\d$':'已取消',//已取消，退款中
		'^16-\\d$':'修改中',//16:支付中等待确认
		'^27-\\d$':'支付中',////已修改，差价支付中
		'^31-\\d$':'已拒单',//31：确认失败，退款中  ---- TODO
		'^32-\\d$':'已修改，待处理',//32：修改已确认，待退款
		'^33-\\d$':'已修改，待处理',//33：修改已确认，退款中
		'^34-\\d$':'已修改，待处理',//34：修改已确认，已退款
		'^35-\\d$':'已修改，待处理',//35：修改已确认（无差价）
		'^24-\\d$':'已修改，待处理',//24：修改退款失败
		'^36-\\d$':'已取消',//36：已取消，待退款
		'^37-\\d$':'已取消',//37：已取消，已退款  ---- TODO
		'^25-\\d$':'已取消', // ---- TODO
		'^20-0$':'待处理',
		'^20-[1256]$':'修改待确认',
		'^20-[34]$':'待退差价', //
		'^29-\\d$':'处理中',
		'^21-\\d$':'可入住',
		'^17-\\d$':'待办入住',
		'^22-\\d$':'已拒单',//确认失败等待退款
		'^30-\\d$':'已拒单',//确认失败，已退款  --- TODO
		'^23-\\d$':'已拒单',//确认失败退款失败  --- TODO
		'^40-\\d$':'交易完成',
		'^18-\\d$':'买家申请取消订单'
	},
	//订单详情页渲染操作按钮使用
	orderOperateMap:{//0.开始处理 1.办理入住 2.立即确认 3.保存 4.修改订单 5.取消修改 6.提醒支付 7.拒单 8.同意取消 9.拒绝取消
		'^10-\\d$':{operateItem:'',confirmNo:false,liveCondition:false},
		'^11-\\d$':{operateItem:'',confirmNo:false,liveCondition:false},
		'^12-\\d$':{operateItem:'',confirmNo:false,liveCondition:false},
		'^13-\\d$':{operateItem:'5',confirmNo:false,liveCondition:false},//已修改，待支付差价
		'^14-\\d$':{operateItem:'0247',confirmNo:true,liveCondition:false},//修改已确认（已支付）
		'^15-\\d$':{operateItem:'',confirmNo:false,liveCondition:false},//已取消，退款中
		'^16-\\d$':{operateItem:'',confirmNo:false,liveCondition:false},//16:支付中等待确认
		'^31-\\d$':{operateItem:'',confirmNo:false,liveCondition:false},//31：确认失败，退款中
		'^32-\\d$':{operateItem:'0247',confirmNo:true,liveCondition:false},//32：修改已确认，待退款
		'^33-\\d$':{operateItem:'',confirmNo:false,liveCondition:false},//33：修改已确认，退款中
		'^34-\\d$':{operateItem:'',confirmNo:false,liveCondition:false},//34：修改已确认，已退款
		'^35-\\d$':{operateItem:'0247',confirmNo:true,liveCondition:false},//35：修改已确认（无差价）
		'^24-\\d$':{operateItem:'',confirmNo:false,liveCondition:false},//24：修改退款失败
		'^36-\\d$':{operateItem:'',confirmNo:false,liveCondition:false},//36：已取消，待退款
		'^37-\\d$':{operateItem:'',confirmNo:false,liveCondition:false},//37：已取消，已退款
		'^25-\\d$':{operateItem:'',confirmNo:false,liveCondition:false},
		'^20-0$':{operateItem:'027',confirmNo:true,liveCondition:false},
		'^20-[1256]$':{operateItem:'27',confirmNo:true,liveCondition:false},
		'^20-[34]$':{operateItem:'',confirmNo:true,liveCondition:false},
		'^29-\\d$':{operateItem:'247',confirmNo:true,liveCondition:false},//处理中
		'^21-\\d$':{operateItem:'3',confirmNo:true,liveCondition:true},
		'^17-\\d$':{operateItem:'1',confirmNo:false,liveCondition:true},
		'^27-\\d$':{operateItem:'',confirmNo:false,liveCondition:false},
		'^22-\\d$':{operateItem:'',confirmNo:false,liveCondition:false},//确认失败等待退款
		'^30-\\d$':{operateItem:'',confirmNo:false,liveCondition:false},//确认失败，已退款
		'^23-\\d$':{operateItem:'',confirmNo:false,liveCondition:false},//确认失败退款失败
		'^40-\\d$':{operateItem:'',confirmNo:false,liveCondition:false},
		'^18-\\d$':{operateItem:'89',confirmNo:false,liveCondition:false},//18. 用户申请取消订单
		'^119-\\d$':{operateItem:'',confirmNo:false,liveCondition:false}
	},
	getOrderStatus:function (status,subStatus){
		for(var index in Constants.orderStatusMap){
			var regExp = new RegExp(index);
			if(regExp.test(status+'-'+subStatus)){
				return Constants.orderStatusMap[index];
			}
		}
	},
	getOperateConfig:function(status,subStatus){
		for(var index in Constants.orderOperateMap){
			var regExp = new RegExp(index);
			if(regExp.test(status+'-'+subStatus)){
				return Constants.orderOperateMap[index];
			}
		}
	}
}