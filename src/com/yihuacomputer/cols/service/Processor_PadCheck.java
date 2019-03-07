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
		return "Pad���״̬��ѯ";
	}

	/**
	 * ������
	*/
	public void process() throws ProcessorException {
		 //��һ�� ���ݽ�����ȡ�����������ļ�
	     String strPathXML = pathXML(MsgXmlDom.getElementValue(domReq, "strTransCode"));
	     //�ڶ��� ���ݽ��������ļ���װ������
	     String strRequestMsg = organizeInfo(strPathXML,"request");//��װ������
	     System.out.println("������:"+strRequestMsg);
	     int iRet=1;//���׽��
	     ReponseMessage response =  new ReponseMessage();
	     try
	     {
	         iRet = exchangeWithHs(strRequestMsg,response);
	     }
	     catch (Exception e)
	     {
	    	 setSimpleRespDom(TERMRETCODE_COMMUNC, TERMRETDESC_COMMUNC, TERMRETDESCEN_COMMUNC);
	         error.error("����������ͨѶʧ��:"+e.getMessage());
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
	     // ���óɹ���Ϣ
		 setSucceedRespDom();
	}

	//��ȡ���������ļ�
    public String pathXML(String strTransCode)
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
        path = path + strTransCode + ".xml";
        return path;
    }

    //��װ������
  	@SuppressWarnings({ "unchecked"})
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
  	                priMap.put(strName, strValue);
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
  		return requestMessage.getRequestText();
  	}
  	/**
	 * ����������ͨѶ
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
