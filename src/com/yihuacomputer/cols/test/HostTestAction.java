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
 * ���Ĳ��Դ�����
 * �����������Թɷ����޹�˾
 * 2017-06-03
 */
public class HostTestAction extends Action
{
  private Map<String, String> map = new HashMap<String, String>(100, 0.8f);
  public Logger info = Logger.getLogger("Info");
  public Logger error = Logger.getLogger("Error");
  private String strRequestMsg ="";//���͵ı���
  private Host host = null;
  private boolean isPinBlock = false;//�Ƿ�Ҫ����PinBlock�ֶ�

  public ActionForward execute(ActionMapping mapping, ActionForm form,
                               HttpServletRequest request,
                               HttpServletResponse response) throws Exception
  {
	  String commandID = request.getParameter("commandID");
	  if(commandID != null && commandID.equals("request")){
		  JSONObject member = new JSONObject();
		  String strReqMsg =  request.getParameter("strReqMsg");
		  //��һ�����ֽ⽻������
		  analyzeRequest(strReqMsg);
		  //�ڶ�������ȡ���������ļ�
		  String strPathXML = pathXML();
		  //������ ���ݽ��������ļ���װ������
		  String strRequestMsg = organizeInfo(strPathXML,"request");//��װ������
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
   * �ֽ⽻������
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
		           if(key.equals("strEncrypType")){//�ж���Կ��ʽ
		             if(value.equals("SM4")){//�����㷨
		                map.put(key, "04");
		             }else{                  //�����㷨
		                map.put(key, "06");
		             }
		           }
		           else if(key.equals("strPinBlock")){//pinblock
		        	   isPinBlock = true;
		        	   map.put(key, value);
			       }else if(key.equals("strBufferPinKey")){
			    	   //ʹ�ÿͻ��ż���
			    		   bufferPinKey=true;
			       }
		           else{
		        	   map.put(key, value);
		           }
			   }
			}
			if(isPinBlock){//��pinblock�ֶβ���
                 KeyBox KeyBox = new KeyBox();
                 String strPinBlock = null;
                 if(bufferPinKey)
                	 strPinBlock = KeyBox.generatePasswd("123456" + map.get("strCustomerId") + "0",map.get("strPinBlock"));
                 else
                	 strPinBlock = KeyBox.generatePasswd(map.get("strPan"),map.get("strPinBlock"));
                 map.put("strPinBlock", strPinBlock);
			}
			//ͳһ�����ܿ������ڵ�ʱ�� ���ܿ������ڵ��������ݡ�ϵͳ���ٺ�
	        map.put("strTerminalTsn", getTerminalTsn(map.get("strTerminalNum")));//ϵͳ���ٺ�
	        map.put("strTransTime", dtCur.getDateTimeToView());//�ܿ������ڵ�ʱ�� hhmmss
	        map.put("strTransDate", dtCur.getTransDateToView());//�ܿ������ڵ���������yyyyMMdd
		}
  }

  /**
   * ��ȡ���������ļ�
   * @return
  */
  public String pathXML()
  {
  	  String path = (getClass().getProtectionDomain().getCodeSource().getLocation().getPath()).substring(1, (getClass().getProtectionDomain().getCodeSource().getLocation().getPath()).indexOf("WEB-INF"));//��ȡ����·��
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

  //��װ������
  @SuppressWarnings({ "unchecked", "static-access" })
  public String organizeInfo(String filePath,String transType)
  {
    	info.info("===========��װ�����Ŀ�ʼ===========");
    	RequestMessage requestMessage =  new RequestMessage();
    	Map<String, String> priMap = new HashMap<String, String>();
		SAXReader saxread = new SAXReader();
		File xmlFile = new File(filePath);
		if (xmlFile.exists()) {
			try {
				org.dom4j.Document document = saxread.read(xmlFile);
				List<Element> list = document.selectNodes("/MappingRule/"+transType+"/field"); //�ҵ�λ��RouteRule�µ�role�ڵ�
				for (int i = 0; i < list.size(); i++) {
					String strName="";//Ψһ��ʶ
					String strValue="";//ֵ
					org.dom4j.Element element=(org.dom4j.Element)list.get(i);
					strName=((org.dom4j.Element) element.selectSingleNode("id")).getTextTrim(); //Ψһ��ʶ
					String strSource=((org.dom4j.Element) element.selectSingleNode("strSource")).getTextTrim(); //ȡֵ��ʽ
	                if(strSource != null && strSource.equals("$"))//��ƽ̨��ȡ
	                {
	                	String strDestKey=((org.dom4j.Element) element.selectSingleNode("strDestKey")).getTextTrim(); //ƽ̨ȡֵ�ֶ�����
	                	strValue = map.get(strDestKey);
	                }
	                else if (strSource != null && strSource.equals("$$"))//ȡĬ��ֵ
	                {
	                	strValue=((org.dom4j.Element) element.selectSingleNode("strDefaultValue")).getTextTrim(); //Ĭ��ֵ
	                }
					//Ӱ��ͼƬ·���а��������ַ�
	                if(strName.equals("idPhotoUrl") || strName.equals("idPhotoBackUrl") || strName.equals("scenePhotoUrl") || strName.equals("verificationPhoteUrl")){
	                	priMap.put(strName, new XmlTextConstructor().encodeXml(strValue));
	                }else{
	                	priMap.put(strName, strValue);
	                }
				}
		        try {
		        	requestMessage.appendContentPrimary(priMap);
		        	info.info("������:"+"\r\n"+requestMessage.getRequestText());
		        } catch (Exception e) {
		        	error.error("��װ�����ĳ���:"+e);
		        }
			} catch (DocumentException e1) {
				error.error("�������������ļ�����:"+e1);
			}
		}
		info.info("===========��װ�����Ľ���==========="+"\r\n");
		strRequestMsg = requestMessage.getRequestText();
		return requestMessage.getRequestText();
  }


  /**
   * ���Ͳ����ܱ���
  */
  public void SendAndGet(String strRequestMsg) throws ProcessorException
  {
	    int iRet=1;//���׽��
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
	 * ����������ͨѶ
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
   * ��ȡ16λ�ն���ˮ��:8λ�ն˱�� + 8λ�ն���ˮ��
  */
  public String getTerminalTsn(String strTerminalNum)
  {
	 String strtm = "" + new Date().getTime();
	 String str = strTerminalNum + strtm.substring(strtm.length() - 8, strtm.length());
	 return str;
  }
}
