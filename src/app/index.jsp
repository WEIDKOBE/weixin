<%@page import="com.xyz.weixin.utils.WeixinUtil"%>
<%@page import="com.xyz.weixin.service.WeixinMpAccountHelper"%>
<%@page import="java.net.URLEncoder"%>
<%@page import="java.util.Date"%>
<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
<head>
	<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
	<title>Insert title here</title>
	<script type="text/javascript" src="<%=request.getContextPath() %>/js/common.js"></script>
	<script type="text/javascript">
		<%
			WeixinUtil weixinUtil = WeixinMpAccountHelper.getSupplierWeixinUtil();
			String url = weixinUtil.getUrl(weixinUtil.URL_TYPE_WEIXIN_AUTH2_BASE);
		%>
		var url = '<%=url%>';
		var directUrl = getUrlParams()["directUrl"];
		url = url.replace("REDIRECT_URI",encodeURI('<%=weixinUtil.getWxConfig().getProjectName()%>'+directUrl));
		location.replace(url);
	</script>
</head>
<body>
</body>
</html>