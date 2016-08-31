<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%> 

<%
  String ctx = request.getContextPath();
  String pageName = request.getRequestURI().toString();
%>
<script>
  var ctx = "<%=ctx%>";
  var pageName = "<%=pageName%>";
</script>   

<script src="<%=ctx%>/js/lib/jquery.js"></script> 
<script src="<%=ctx%>/js/common_new.js"></script>   
