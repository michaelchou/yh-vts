<%@ page language="java" pageEncoding="gbk"
	import="java.util.*,com.yihuacomputer.cols.service.FlushCache"%>

<%
    String strMsgInfo = request.getParameter("strMsgInfo");
	System.out.println("flushCache Ë¢ÐÂÊý¾Ý:"+strMsgInfo);
    FlushCache cache = new FlushCache();
    int ret = cache.process(strMsgInfo);
%>
<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN">
<html>
  <head>
    <title>NotifyFlushCache.jsp</title>
	<meta http-equiv="pragma" content="no-cache">
	<meta http-equiv="cache-control" content="no-cache">
	<meta http-equiv="expires" content="0">
  </head>
  <body>
  </body>
</html>