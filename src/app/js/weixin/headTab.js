/**
 * 初始化 head tab 为房态加链接
 */
function initHeadTab(){
	var  roomHomeUrl = root + "/weixin/room/hotelList.jsp";
	var  orderHomeUrl = root + "/weixin/order/orderList.jsp";
	$('#room a').attr('href',roomHomeUrl);
	$('#order a').attr('href',orderHomeUrl);
}
