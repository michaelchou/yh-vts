<%@ page contentType="text/xml; charset=UTF-8" %>
<%@ page language="java" import="java.io.*,javax.servlet.ServletInputStream,java.util.*"%>
<%@ page import="com.yihuacomputer.cols.service.FlushCache" %>
<%@ page import="com.yihuacomputer.cols.common.util.ColsTransMsg" %>
<%
   response.setBufferSize(1024*32);
   //第一步：获取管控台发送的数据
   response.setContentType("text/xml");
   response.setCharacterEncoding("UTF-8");
   BufferedReader bre = null;
   PrintWriter outp = null;
   String line = null;
   try{
	   //接受管控台发送的数据
	   bre = new BufferedReader(new InputStreamReader((ServletInputStream)request.getInputStream(), "UTF-8"));
	   outp = response.getWriter();
	   StringBuilder sb = new StringBuilder();
       while((line = bre.readLine())!=null){
           sb.append(line);
       }
	   System.out.println("接受数据:"+sb.toString());
	   FlushCache cache = new FlushCache();
	   //第二步：响应管控台，告诉管控台数据同步是否成功
       cache.onFlushCache(sb.toString());
       String strMsgInfo = cache.getDataSynchTransMsg().toString();
       ColsTransMsg msg = new ColsTransMsg(strMsgInfo);
       String success = msg.get("success").trim();
       String errors = msg.get("errors").trim();
       strMsgInfo = "{'success':"+success+",'errors':'"+errors+"'}";
       System.out.println("22222222222:"+strMsgInfo);
	   outp.write(strMsgInfo);
   }
   catch (Exception e){
		System.out.println("处理监控数据失败："+e.getMessage());
   }
   finally{
	   try {
	      if (null != bre) {
	         bre.close();
	      }
	      if (null != outp) {
	         outp.close();
	      }
	   }
	   catch (Exception e) {
	       System.out.println("关闭监控数据流失败："+e.getMessage());
	   }
  }
%>
