<%
 /**
  * Ӧ�ü���ҳ��,�����豸id���жϸ��豸������ʽ�汾�����л������ð汾������
 */
%>
<%@ page contentType="text/html; charset=GBK" %>
<%@ page language="java" import="com.yihuacomputer.cols.entity.*,com.yihuacomputer.cols.database.*"%>
<%
   // ��ȡ�ն˿ͻ���IP��ַ
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
   //���ݵ�ǰ�ն�IP��ַ��ѯ����ϸ��Ϣ
   TerminalDB terminaldb = new TerminalDB();
   Terminal terminal = terminaldb.getTerminalByNetAddr(strClientIP,strClientMAC);
   if (terminal != null)
   {
	   //�����豸�����������ܹ�Ա�����ƶ����ܹ�Ա��
	   String terminalUrl = "/System/Terminal.jsp";
	   int devType = terminal.getDevType();
	   System.out.println("devType:" + devType);
	   if(12!= terminal.getDevType()){
		   terminalUrl = "/System/TerminalMV.jsp?strClientMAC='" + strClientMAC + "'";
	   }

      //���ݵ�ǰ�ն�id��ѯ����صİ汾
      TrialDB trialDB = new TrialDB();
      Trial trial = trialDB.getTrial(terminal.getStrTerminalNum());
      if (trial != null)
      {
	      //��ת�����ð汾
          //��װ���ð汾��URL
          String strUrl=request.getScheme()+"://"+request.getServerName()+":"+request.getServerPort()+"/trial";   
          response.setContentType("text/html;charset=gb2312");
          response.sendRedirect(strUrl+terminalUrl);
      }
      else
      {
	      //��ת����ʽ�汾
          //��װ��ʽ�汾��URL
          String strUrl=request.getScheme()+"://"+request.getServerName()+":"+request.getServerPort()+"/formal";   
          response.setContentType("text/html;charset=gb2312");
          response.sendRedirect(strUrl+terminalUrl);
     }	
   }
   else
   {
	  	  //��ת����ʽ�汾
          //��װ��ʽ�汾��URL
          String strUrl=request.getScheme()+"://"+request.getServerName()+":"+request.getServerPort()+"/formal";   
          response.setContentType("text/html;charset=gb2312");
          response.sendRedirect(strUrl+"/System/Terminal.jsp");
   }
%>