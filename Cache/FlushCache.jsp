<%@ page language="java" pageEncoding="gbk" 
	import="com.yihuacomputer.cols.service.FlushCache"%>
<%
    //第一步：定义变量
    String strMsgInfo = request.getParameter("MsgInfo");
    FlushCache cache = new FlushCache();
    //第二步：
    cache.onFlushCache(strMsgInfo);
%>

<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN">
<html>
  <head>
    <title>FlushCache.jsp</title>
	<meta http-equiv="pragma" content="no-cache">
	<meta http-equiv="cache-control" content="no-cache">
	<meta http-equiv="expires" content="0">    
  </head>
  
  <body>
    
  </body>
</html>
