<%
 /**
  * 应用加载页面,根据设备id号判断该设备是在正式版本下运行还是试用版本下运行
 */
%>
<%@ page contentType="text/html; charset=GBK" %>
<%@ page language="java" import="com.yihuacomputer.cols.entity.*,com.yihuacomputer.cols.database.*"%>
<%
   // 获取终端客户端IP地址
   String strClientIP = request.getParameter("Client-IP");
   if(strClientIP == null || strClientIP.length() == 0 || "unknown".equalsIgnoreCase(strClientIP))
      strClientIP = request.getHeader("Proxy-Client-IP");
   if(strClientIP == null || strClientIP.length() == 0 || "unknown".equalsIgnoreCase(strClientIP))
      strClientIP = request.getHeader("WL-Proxy-Client-IP");
   if(strClientIP == null || strClientIP.length() == 0 || "unknown".equalsIgnoreCase(strClientIP))
      strClientIP = request.getHeader("x-forwarded-for");
   if(strClientIP == null || strClientIP.length() == 0 || "unknown".equalsIgnoreCase(strClientIP))
      strClientIP = request.getRemoteAddr();
  String strClientMAC = request.getParameter("strClientMAC");
  System.out.println("strClientMAC000000000000000000:" + strClientMAC + "     " + "start.jsp");
   //根据当前终端IP地址查询其详细信息
   TerminalDB terminaldb = new TerminalDB();
   Terminal terminal = terminaldb.getTerminalByNetAddr(strClientIP,strClientMAC);
   if (terminal != null)
   {
	   //根据设备类型区分智能柜员机与移动智能柜员机
	   String terminalUrl = "/System/Terminal.jsp";
	   int devType = terminal.getDevType();
	   System.out.println("devType:" + devType);
	   if(12!= terminal.getDevType()){
		   terminalUrl = "/System/TerminalMV.jsp?strClientMAC='" + strClientMAC + "'";
	   }

      //根据当前终端id查询其加载的版本
      TrialDB trialDB = new TrialDB();
      Trial trial = trialDB.getTrial(terminal.getStrTerminalNum());
      if (trial != null)
      {
	      //跳转至试用版本
          //组装试用版本的URL
          String strUrl=request.getScheme()+"://"+request.getServerName()+":"+request.getServerPort()+"/trial";   
          response.setContentType("text/html;charset=gb2312");
          response.sendRedirect(strUrl+terminalUrl);
      }
      else
      {
	      //跳转至正式版本
          //组装正式版本的URL
          String strUrl=request.getScheme()+"://"+request.getServerName()+":"+request.getServerPort()+"/formal";   
          response.setContentType("text/html;charset=gb2312");
          response.sendRedirect(strUrl+terminalUrl);
     }	
   }
   else
   {
	  	  //跳转至正式版本
          //组装正式版本的URL
          String strUrl=request.getScheme()+"://"+request.getServerName()+":"+request.getServerPort()+"/formal";   
          response.setContentType("text/html;charset=gb2312");
          response.sendRedirect(strUrl+"/System/Terminal.jsp");
   }
%>