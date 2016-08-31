<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>
<meta http-equiv="pragma" content="no-cache"/>
<meta http-equiv="Cache-Control" content="no-cache, must-revalidate"/>
<meta http-equiv="expires" content="0"/>
<%
	String ctx = request.getContextPath();
	String pageName = request.getRequestURI().toString();
%>
<script>
	var ctx = "<%=ctx%>";
	var pageName = "<%=pageName%>";
</script>   
<!-- <link rel="stylesheet" href="http://code.jquery.com/mobile/1.3.2/jquery.mobile-1.3.2.min.css"> -->
<script src="<%=ctx%>/js/lib/jquery.js"></script> 
<!--  <script src="http://code.jquery.com/mobile/1.3.2/jquery.mobile-1.3.2.min.js"></script>--> 
<script src="<%=ctx%>/js/common.js"></script>   
<script src="<%=ctx%>/js/config.js"></script>
<script src="<%=ctx%>/js/constants.js"></script>
