<%@ page contentType="text/xml; charset=UTF-8"%>
<%@page language="java"
	import="com.yihuacomputer.cols.util.*,com.yihuacomputer.cols.service.*,org.apache.log4j.Logger,org.jdom.Document"%>
<%@page import="java.io.*"%>
<%
	request.setCharacterEncoding("UTF-8");
	response.setBufferSize(1024 * 32);
	// 服务处理名前缀
	String PROCESSORNAME_PREFIX = "Processor_";
	// 服务处理类的名字空间
	String PROCESSORCLASS_NAMESPACE = "com.yihuacomputer.cols.service.";
	DateCtrl dtCur = new DateCtrl();
	// 针对无效请求的回应报文内容
	XmlTextConstructor xmltext = new XmlTextConstructor();
	xmltext.startNode("TransMsg");
	xmltext.appendNode("ServerDataTime",dtCur.getDateTimeStrFull());
	xmltext.appendNode("TermRetCode",Processor.TERMRETCODE_INVALIDREQUEST);
	xmltext.appendNode("TermRetDesc", Processor.TERMRETDESC_INVALIDREQUEST);
    xmltext.appendNode("TermRetDescEn", Processor.TERMRETDESCEN_INVALIDREQUEST);
	xmltext.endNode("TransMsg");
	String RESPMSG_INVALIDREQUEST = xmltext.toString();

	String strReq = null;
	Document domReq = null;
	Processor processor = null;
	Processor_Trans processor_trans = null;
	String strProcessorName = null;
	String strTransName = null;
	Class classProcessor = null;
	Logger error = Logger.getLogger("Error");

	response.setContentType("text/xml");
	response.setCharacterEncoding("UTF-8");
	PrintWriter outP = response.getWriter();
	
	StringBuffer strJrn = new StringBuffer(50); 
	
	// 读取请求报文内容
    int MAX_REQ_CONTENTLEN = 1024*1024*10;
    int iLen = request.getContentLength();
    if (iLen <= 0 || iLen > MAX_REQ_CONTENTLEN)
    {
    	strJrn.delete(0,strJrn.length());
		strJrn.append("读取请求数据失败:").append("\r\n");
		strJrn.append("[").append(new DateCtrl().getDateTimeStrFull()).append("]").append(strJrn).append(strReq).append("\r\n");
		error.error(strJrn.toString()+"\r\n");
		outP.print(RESPMSG_INVALIDREQUEST);
		outP.flush();
		outP.close();
      return;
    }
    byte[] buf = new byte[iLen];
	// 读取请求报文内容
	try {
		int iCurRead = 0;
        iLen = 0;
        while(iLen < buf.length){
        	iCurRead = request.getInputStream().read(buf, iLen, buf.length-iLen);
            if (iCurRead > 0)
              iLen += iCurRead;
            else
              break;
        }
		if (iLen>0)
			strReq = new String(buf,0,iLen,"UTF-8");
	} catch (Exception e) {
        StringWriter sw = new StringWriter(1024 * 4);
        e.printStackTrace(new PrintWriter(sw));
        strJrn.delete(0,strJrn.length());
		strJrn.append("读取请求数据失败:").append("\r\n");
		strJrn.append("[").append(new DateCtrl().getDateTimeStrFull()).append("]").append(sw).append("\r\n");
		error.error(strJrn.toString()+"\r\n");	
	}
	// 解析请求报文内容为DOM对象
	if (strReq == null || strReq.length() == 0 || (domReq = XmlHelper.parseStr2Dom(strReq)) == null) {
		strJrn.delete(0,strJrn.length());
		strJrn.append("读取请求报文失败:").append("\r\n");
		strJrn.append("[").append(new DateCtrl().getDateTimeStrFull()).append("]").append(strJrn).append(strReq).append("\r\n");
		error.error(strJrn.toString()+"\r\n");
		outP.print(RESPMSG_INVALIDREQUEST);
		outP.flush();
		outP.close();
		return;
	}
	// 获取服务的处理类
	strProcessorName = MsgXmlDom.getElementValue(domReq,Processor.XMLNODENAME_PROCESSORNAME);
	strTransName = strProcessorName;
	if (strProcessorName==null||strProcessorName.length() == 0)
	{
		strJrn.delete(0,strJrn.length());
		strJrn.append("获取服务的处理类失败:").append(new DateCtrl().getDateTimeStrFull()).append("\r\n");
		error.error(strJrn.toString()+"\r\n");
	    outP.print(RESPMSG_INVALIDREQUEST);
	    outP.flush();
	    outP.close();
	    return;
	}
	if (strProcessorName.indexOf(PROCESSORNAME_PREFIX) != 0)
		strProcessorName = PROCESSORNAME_PREFIX + strProcessorName;
	try {
		if(strTransName != null && strTransName != "" && strTransName.equals("Trans")){
			processor_trans = new Processor_Trans();
		}else{
			classProcessor = Class.forName(PROCESSORCLASS_NAMESPACE+ strProcessorName);	
		    processor = (Processor) classProcessor.newInstance();
		}
	} catch (Exception e) {
		strJrn.delete(0,strJrn.length());
		strJrn.append("读取响应报文失败:").append(new DateCtrl().getDateTimeStrFull()).append("\r\n");
		error.error(strJrn.toString()+"\r\n");	
		outP.print(RESPMSG_INVALIDREQUEST);
		outP.flush();
		outP.close();
		return;
	}
	// 服务处理，返回处理的回应报文
	try {
		if(strTransName != null && strTransName != "" && strTransName.equals("Trans")){
			processor_trans.doProcess(dtCur, strReq, domReq);
		    strJrn.delete(0,strJrn.length());
		    outP.print(processor_trans.getRespText());
		    outP.flush();
		    outP.close();
		}else{
			processor.doProcess(dtCur, strReq, domReq);
		    strJrn.delete(0,strJrn.length());
		    outP.print(processor.getRespText());
		    outP.flush();
		    outP.close();
		}	
	}catch (Exception e) {
		strJrn.delete(0,strJrn.length());
		strJrn.append("处理响应报文失败:").append(new DateCtrl().getDateTimeStrFull()).append("\r\n");
		error.error(strJrn.toString()+"\r\n");
		strJrn.delete(0,strJrn.length());
		// 通讯异常，结果不确定的回应报文内容
		processor.setSimpleRespDom(Processor.TERMRETCODE_COMMUNC,Processor.TERMRETDESC_COMMUNC,Processor.TERMRETDESCEN_COMMUNC);
		outP.print(processor.getRespText());
		outP.flush();
		outP.close();
	}
%>
