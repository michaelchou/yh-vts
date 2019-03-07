package com.yihuacomputer.cols.service;


import java.io.File;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.apache.log4j.Logger;
import org.dom4j.DocumentException;
import org.dom4j.Element;
import org.dom4j.io.SAXReader;

import com.yihuacomputer.cols.database.MiscDB;
import com.yihuacomputer.cols.util.MsgXmlDom;

public class Processor_PadCheck extends Processor {

    protected Logger error = Logger.getLogger("Error");
    protected Logger info = Logger.getLogger("Info");

    protected String strHostRetCode = "";
    protected String strTermRetCode = "";
    protected String strTermRetDesc = "";
    protected String strTermRetDescEn = "";

    protected Map<String, String> map = new HashMap<String, String>(100, 0.8f);

	public Processor_PadCheck() {
		super();
	}

    protected String getTransName()
	{
		return "Pad审核状态查询";
	}

	/**
	 * 服务处理
	*/
	public void process() throws ProcessorException {
		 //第一步 根据交易码取出交易配置文件
	     String strPathXML = pathXML(MsgXmlDom.getElementValue(domReq, "strTransCode"));
	     //第二步 根据交易配置文件组装请求报文
	     String strRequestMsg = organizeInfo(strPathXML,"request");//组装请求报文
	     System.out.println("请求报文:"+strRequestMsg);
	     int iRet=1;//交易结果
	     ReponseMessage response =  new ReponseMessage();
	     try
	     {
	         iRet = exchangeWithHs(strRequestMsg,response);
	     }
	     catch (Exception e)
	     {
	    	 setSimpleRespDom(TERMRETCODE_COMMUNC, TERMRETDESC_COMMUNC, TERMRETDESCEN_COMMUNC);
	         error.error("与主机进行通讯失败:"+e.getMessage());
	         return;
	     }
	     if (iRet != PROCESS_SUCCEED)
	     {
	    	 if(response.retCode == null || response.retCode.equals("")){
	       		   setSimpleRespDom(TERMRETCODE_COMMUNC, TERMRETDESC_COMMUNC, TERMRETDESCEN_COMMUNC);
	       		   return;
	       	   }else{
	       	       setSimpleRespDom(response.retCode, response.retCodeMessage, TERMRETDESCEN_COMMUNC);
	   		       return;
	       	   }
		 }
	     // 设置成功信息
		 setSucceedRespDom();
	}

	//获取交易配置文件
    public String pathXML(String strTransCode)
    {
    	String path = (getClass().getProtectionDomain().getCodeSource().getLocation().getPath()).substring(1, (getClass().getProtectionDomain().getCodeSource().getLocation().getPath()).indexOf("WEB-INF"));//获取工程路径
    	String classpath= File.separator + path+"xml";
		StringBuffer filePath = new StringBuffer(64);
        filePath.append(classpath);
        filePath.append(File.separator);
        filePath.append("TransXml");
        filePath.append(File.separator);
        filePath.append("Platform");
        filePath.append(File.separator);
        path = filePath.toString();
        path = path + strTransCode + ".xml";
        return path;
    }

    //组装请求报文
  	@SuppressWarnings({ "unchecked"})
  	public String organizeInfo(String filePath,String transType)
  	{
      	info.info("===========组装请求报文开始===========");
      	RequestMessage requestMessage =  new RequestMessage();
      	Map<String, String> priMap = new HashMap<String, String>();
  		SAXReader saxread = new SAXReader();
  		File xmlFile = new File(filePath);
  		if (xmlFile.exists()) {
  			try {
  				org.dom4j.Document document = saxread.read(xmlFile);
  				List<Element> list = document.selectNodes("/MappingRule/"+transType+"/field"); //找到位于RouteRule下的role节点
  				for (int i = 0; i < list.size(); i++) {
  					String strName="";//唯一标识
  					String strValue="";//值
  					org.dom4j.Element element=(org.dom4j.Element)list.get(i);
  					strName=((org.dom4j.Element) element.selectSingleNode("id")).getTextTrim(); //唯一标识
  					String strSource=((org.dom4j.Element) element.selectSingleNode("strSource")).getTextTrim(); //取值方式
  	                if(strSource != null && strSource.equals("$"))//从平台中取
  	                {
  	                	String strDestKey=((org.dom4j.Element) element.selectSingleNode("strDestKey")).getTextTrim(); //平台取值字段名称
  	                	strValue = map.get(strDestKey);
  	                }
  	                else if (strSource != null && strSource.equals("$$"))//取默认值
  	                {
  	                	strValue=((org.dom4j.Element) element.selectSingleNode("strDefaultValue")).getTextTrim(); //默认值
  	                }
  	                priMap.put(strName, strValue);
  				}
  		        try {
  		        	requestMessage.appendContentPrimary(priMap);
  		        	info.info("请求报文:"+"\r\n"+requestMessage.getRequestText());
  		        } catch (Exception e) {
  		        	error.error("组装请求报文出错:"+e);
  		        }
  			} catch (DocumentException e1) {
  				error.error("解析交易配置文件出错:"+e1);
  			}
  		}
  		info.info("===========组装请求报文结束==========="+"\r\n");
  		return requestMessage.getRequestText();
  	}
  	/**
	 * 与主机进行通讯
	*/
    public int exchangeWithHs(String reqData,ReponseMessage response)
    {
		boolean bDialogueWithHost = false;
		String strHostUrl = new MiscDB().get("00001", "ATMPHostUrl", "");
		Host host = new Host(strHostUrl);
		try {
			bDialogueWithHost = host.dialogueWithHost(this.terminal.getStrOrgNum(),reqData,response);
		}
		catch (ISOCommException e) {
			if (e.iType == ISOCommException.TYPE_CONNECT_FAILED) {
				strTermRetCode = Processor.TERMRETCODE_COMMERR;
				strTermRetDesc = Processor.TERMRETDESC_COMMERR;
				strTermRetDescEn = Processor.TERMRETDESCEN_COMMERR;
				return PROCESS_FAILED;
			} else {
				strTermRetCode = Processor.TERMRETCODE_COMMUNC;
				strTermRetDesc = Processor.TERMRETDESC_COMMUNC;
				strTermRetDescEn = Processor.TERMRETDESCEN_COMMUNC;
				return PROCESS_FAILED;
			}
		}
	    if (!bDialogueWithHost)
	    {
	      strTermRetCode = Processor.TERMRETCODE_COMMUNC;
	      strTermRetDesc = Processor.TERMRETDESC_COMMUNC;
	      strTermRetDescEn = Processor.TERMRETDESCEN_COMMUNC;
	      return PROCESS_FAILED;
	    }
		return PROCESS_SUCCEED;
	}
}
