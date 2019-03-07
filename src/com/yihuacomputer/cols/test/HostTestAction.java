package com.yihuacomputer.cols.test;

import java.io.File;
import java.io.PrintWriter;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import net.sf.json.JSONObject;

import org.apache.log4j.Logger;
import org.apache.struts.action.Action;
import org.apache.struts.action.ActionForm;
import org.apache.struts.action.ActionForward;
import org.apache.struts.action.ActionMapping;
import org.dom4j.DocumentException;
import org.dom4j.Element;
import org.dom4j.io.SAXReader;

import com.yihuacomputer.cols.database.MiscDB;
import com.yihuacomputer.cols.service.ISOCommException;
import com.yihuacomputer.cols.service.ProcessorException;
import com.yihuacomputer.cols.service.ReponseMessage;
import com.yihuacomputer.cols.service.RequestMessage;
import com.yihuacomputer.cols.util.DateCtrl;
import com.yihuacomputer.cols.util.XmlTextConstructor;


/**
 * 报文测试处理类
 * 深圳怡化电脑股份有限公司
 * 2017-06-03
 */
public class HostTestAction extends Action
{
  private Map<String, String> map = new HashMap<String, String>(100, 0.8f);
  public Logger info = Logger.getLogger("Info");
  public Logger error = Logger.getLogger("Error");
  private String strRequestMsg ="";//发送的报文
  private Host host = null;
  private boolean isPinBlock = false;//是否要上送PinBlock字段

  public ActionForward execute(ActionMapping mapping, ActionForm form,
                               HttpServletRequest request,
                               HttpServletResponse response) throws Exception
  {
	  String commandID = request.getParameter("commandID");
	  if(commandID != null && commandID.equals("request")){
		  JSONObject member = new JSONObject();
		  String strReqMsg =  request.getParameter("strReqMsg");
		  //第一步：分解交易请求
		  analyzeRequest(strReqMsg);
		  //第二步：获取交易配置文件
		  String strPathXML = pathXML();
		  //第三步 根据交易配置文件组装请求报文
		  String strRequestMsg = organizeInfo(strPathXML,"request");//组装请求报文
		  member.put("messageText", strRequestMsg);
		  response.setCharacterEncoding("utf-8");
		  response.setContentType("texthtml;charset=utf-8");
		  response.setHeader("Cache-Control", "no-cache");
		  PrintWriter pw = response.getWriter();
		  pw.print(member.toString());
		  pw.close();
	  }
	  else if(commandID != null && commandID.equals("reponse")){
		  JSONObject member = new JSONObject();
		  SendAndGet(strRequestMsg);
		  String strResponseMsg = new String(host.getRecDate());
		  member.put("messageText", strResponseMsg);
		  response.setCharacterEncoding("utf-8");
		  response.setContentType("texthtml;charset=utf-8");
		  response.setHeader("Cache-Control", "no-cache");
		  PrintWriter pw = response.getWriter();
		  pw.print(member.toString());
		  pw.close();
	  }
	  return null;
  }

  /**
   * 分解交易数据
 * @throws Exception
  */
  public void analyzeRequest(String strReqMsg) throws Exception
  {
	    isPinBlock = false;
		DateCtrl dtCur = new DateCtrl();
		map = new HashMap<String, String>();
		String strReq[] = strReqMsg.split(",");
		boolean bufferPinKey = false;
		if(strReq != null && strReq.length >0){
			for(int i=0;i<strReq.length;i++){
			   String str = strReq[i].trim();
			   if(str != null && !str.equals("")){
				   String key = str.substring(0, str.indexOf("="));
				   String value = str.substring(str.indexOf("=")+1, str.length());
		           if(key.equals("strEncrypType")){//判断密钥方式
		             if(value.equals("SM4")){//国密算法
		                map.put(key, "04");
		             }else{                  //国际算法
		                map.put(key, "06");
		             }
		           }
		           else if(key.equals("strPinBlock")){//pinblock
		        	   isPinBlock = true;
		        	   map.put(key, value);
			       }else if(key.equals("strBufferPinKey")){
			    	   //使用客户号加密
			    		   bufferPinKey=true;
			       }
		           else{
		        	   map.put(key, value);
		           }
			   }
			}
			if(isPinBlock){//把pinblock字段补上
                 KeyBox KeyBox = new KeyBox();
                 String strPinBlock = null;
                 if(bufferPinKey)
                	 strPinBlock = KeyBox.generatePasswd("123456" + map.get("strCustomerId") + "0",map.get("strPinBlock"));
                 else
                	 strPinBlock = KeyBox.generatePasswd(map.get("strPan"),map.get("strPinBlock"));
                 map.put("strPinBlock", strPinBlock);
			}
			//统一增加受卡方所在地时间 、受卡方所在地日期数据、系统跟踪号
	        map.put("strTerminalTsn", getTerminalTsn(map.get("strTerminalNum")));//系统跟踪号
	        map.put("strTransTime", dtCur.getDateTimeToView());//受卡方所在地时间 hhmmss
	        map.put("strTransDate", dtCur.getTransDateToView());//受卡方所在地日期数据yyyyMMdd
		}
  }

  /**
   * 获取交易配置文件
   * @return
  */
  public String pathXML()
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
      path = path+map.get("strTransCode")+".xml";
      return path;
  }

  //组装请求报文
  @SuppressWarnings({ "unchecked", "static-access" })
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
					//影像图片路径中包含特殊字符
	                if(strName.equals("idPhotoUrl") || strName.equals("idPhotoBackUrl") || strName.equals("scenePhotoUrl") || strName.equals("verificationPhoteUrl")){
	                	priMap.put(strName, new XmlTextConstructor().encodeXml(strValue));
	                }else{
	                	priMap.put(strName, strValue);
	                }
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
		strRequestMsg = requestMessage.getRequestText();
		return requestMessage.getRequestText();
  }


  /**
   * 发送并接受报文
  */
  public void SendAndGet(String strRequestMsg) throws ProcessorException
  {
	    int iRet=1;//交易结果
	    ReponseMessage response =  new ReponseMessage();
        try
        {
          iRet = exchangeWithHs(strRequestMsg,response);
        }
        catch (Exception e)
        {
  		  return;
        }
        if (iRet != 0)
        {

        }
  }

  /**
	 * 与主机进行通讯
	*/
  public int exchangeWithHs(String reqData,ReponseMessage response)
  {
		boolean bDialogueWithHost = false;
		String strHostUrl = new MiscDB().get("00001", "ATMPHostUrl", "");
		host = new Host(strHostUrl);
		try {
			bDialogueWithHost = host.dialogueWithHost("00001",reqData,response);
		}
		catch (ISOCommException e) {
			if (e.iType == ISOCommException.TYPE_CONNECT_FAILED) {
				return 1;
			} else {
				return 1;
			}
		}
		if (!bDialogueWithHost)
		{
		   return 1;
		}
		return 0;
	}

  /**
   * 获取16位终端流水号:8位终端编号 + 8位终端流水号
  */
  public String getTerminalTsn(String strTerminalNum)
  {
	 String strtm = "" + new Date().getTime();
	 String str = strTerminalNum + strtm.substring(strtm.length() - 8, strtm.length());
	 return str;
  }
}
