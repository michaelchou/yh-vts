package com.yihuacomputer.cols.service;

import java.io.File;
import java.io.UnsupportedEncodingException;
import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.Date;
import java.util.HashMap;
import java.util.Iterator;
import java.util.List;
import java.util.Map;

import net.yum.util.crypt.AgreeDesTool;

import org.apache.log4j.Logger;
import org.dom4j.DocumentException;
import org.dom4j.Element;
import org.dom4j.io.SAXReader;
import org.jdom.Document;
import org.jdom.input.SAXBuilder;

import com.yihuacomputer.cols.common.util.ColsTransMsg;
import com.yihuacomputer.cols.crypto.Base64;
import com.yihuacomputer.cols.crypto.SecurityHelper;
import com.yihuacomputer.cols.database.CDSSettleCycleLogDB;
import com.yihuacomputer.cols.database.CDSTransLogDB;
import com.yihuacomputer.cols.database.CardSettleCycleLogDB;
import com.yihuacomputer.cols.database.CardTransLogDB;
import com.yihuacomputer.cols.database.CardUnitStatusDB;
import com.yihuacomputer.cols.database.HostRetCodeDB;
import com.yihuacomputer.cols.database.MiscDB;
import com.yihuacomputer.cols.database.OtherTransLogDB;
import com.yihuacomputer.cols.database.PadCheckDB;
import com.yihuacomputer.cols.database.SettleCycleLogDB;
import com.yihuacomputer.cols.database.TerminalDB;
import com.yihuacomputer.cols.database.TransLogDepositDB;
import com.yihuacomputer.cols.database.TransLogWithdrawalDB;
import com.yihuacomputer.cols.database.UKeySettleCycleLogDB;
import com.yihuacomputer.cols.database.UKeyTransLogDB;
import com.yihuacomputer.cols.entity.CDSSettleCycleLog;
import com.yihuacomputer.cols.entity.CDSTransLog;
import com.yihuacomputer.cols.entity.CardSettleCycleLog;
import com.yihuacomputer.cols.entity.CardTransLog;
import com.yihuacomputer.cols.entity.CardUnitStatus;
import com.yihuacomputer.cols.entity.HostRetCode;
import com.yihuacomputer.cols.entity.OtherTransLog;
import com.yihuacomputer.cols.entity.PadCheck;
import com.yihuacomputer.cols.entity.SettleCycleLog;
import com.yihuacomputer.cols.entity.Terminal;
import com.yihuacomputer.cols.entity.TransLogDeposit;
import com.yihuacomputer.cols.entity.TransLogWithdrawal;
import com.yihuacomputer.cols.entity.UKeySettleCycleLog;
import com.yihuacomputer.cols.entity.UKeyTransLog;
import com.yihuacomputer.cols.monitor.LinxViewProxy;
import com.yihuacomputer.cols.util.DataConversion;
import com.yihuacomputer.cols.util.DateCtrl;
import com.yihuacomputer.cols.util.MsgXmlDom;
import com.yihuacomputer.cols.util.XmlHelper;
import com.yihuacomputer.cols.util.XmlTextConstructor;

public class Processor_Trans extends Processor{
	public Logger info = Logger.getLogger("Info");
	public Logger error = Logger.getLogger("Error");

	// int�ͱ�����ʼֵ
	public static int INT_DEFAULT = -1;
    public static int PROCESS_SUCCEED = 0; // �ɹ�
    public static int PROCESS_FAILED = 1; // ʧ��
    public static int PROCESS_UNCERTAIN = 2; // ��ȷ��
    public static int PROCESS_CANCLE = 3; // ȡ������

	// Ԥ���屨�Ľڵ�����
    public static String XMLNODENAME_TERMRETCODE = "TermRetCode";
    public static String XMLNODENAME_TERMRETDESC = "TermRetDesc";
    public static String XMLNODENAME_TERMRETDESCEN = "TermRetDescEn";
    public static String XMLNODENAME_PROCESSORNAME = "ProcessorName";
    public static String XMLNODENAME_SERVERDATETIME = "ServerDataTime";

	// �ն˷����뼰������
    public static String TERMRETCODE_SUCCEED = "0000";
    public static String TERMRETDESC_SUCCEED = "���׳ɹ�";
    public static String TERMRETDESCEN_SUCCEED = "Succeed";

    public static String TERMRETCODE_COMMERR = "0001";
    public static String TERMRETDESC_COMMERR = "ͨѶ����";
    public static String TERMRETDESCEN_COMMERR = "Comm error";

    public static String TERMRETCODE_COMMUNC = "0002";
    public static String TERMRETDESC_COMMUNC = "����ͨѶ�쳣������ʧ��";
    public static String TERMRETDESCEN_COMMUNC = "Comm uncertain";

    public static String TERMRETCODE_INVALIDTERM = "0003";
    public static String TERMRETDESC_INVALIDTERM = "�Ƿ��ն�";
    public static String TERMRETDESCEN_INVALIDTERM = "Invalid term";

    public static String TERMRETCODE_TSFRPINBLKERR = "0004";
    public static String TERMRETDESC_TSFRPINBLKERR = "��Ч���ף�ת��PinBlockʧ��";
    public static String TERMRETDESCEN_TSFRPINBLKERR = "Transfer pin failed";

    public static String TERMRETCODE_INVALIDREQUEST = "0005";
    public static String TERMRETDESC_INVALIDREQUEST = "��Ч�Ľ�������";
    public static String TERMRETDESCEN_INVALIDREQUEST = "Invalid request";

    public static String TERMRETCODE_MACERR = "0006";
    public static String TERMRETDESC_MACERR = "��Ч���ף�MACУ���";
    public static String TERMRETDESCEN_MACERR = "Mac error";

    public static String TERMRETCODE_ADDCARD = "0009";
	public static String TERMRETDESC_ADDCARD = "�ӿ�ʧ��";
	public static String TERMRETDESCEN_ADDCARD = "Add Card Error";

    public static String TERMRETDESC_INVALIDCARD = "��Ч����";
    public static String TERMRETDESCEN_INVALIDCARD = "Invalid card.";

    public static String TERMRETCODE_TOOBUSY = "9998";
    public static String TERMRETDESC_TOOBUSY = "������æ";
    public static String TERMRETDESCEN_TOOBUSY = "Server busy";

    public static String TERMRETCODE_INNERR = "9999";
    public static String TERMRETDESC_INNERR = "�ڲ�����";
    public static String TERMRETDESCEN_INNERR = "System error";

    // ��������״̬��HostTransStatus��
    public static int HTSTATUS_OK = 0;
    public static int HTSTATUS_FAILED = 1;
    public static int HTSTATUS_UNCER = 2;

    //����״̬:δ����
    public static int RESTATUS_NEEDLESS = 0;
    //����״̬:�ɹ�
    public static int RESTATUS_OK = 1;
    //����״̬:ʧ��
    public static int RESTATUS_FAILED = 2;
    //����״̬:�����ȷ��
    public static int RESTATUS_UNCER = 3;

	//�ն���ˮ��
	protected String strTerminalTsn = "";

	//��ˮ��id
	private int transLogId;

    // ��ǰ����������ʱ��
    protected DateCtrl dtCur = null;

    // �ն�ʵ�����
    protected Terminal terminal = null;

    //�Ƿ��¼������ˮ��ʶ
    protected String transLogFlag = "false";

    // ������
    protected String strCardType = "";

    //���κ�
    private int termBatchNo =0;

    // ��ȫ����ʵ��
    protected SecurityHelper theSecurityHelper = null;

    protected Document domReq = null;
    protected Document domResp = null;
    protected String strReq = null;
    protected StringBuffer SB = new StringBuffer(128);

    protected String strHostRetCode = "";
    protected String strTermRetCode = "";
    protected String strTermRetDesc = "";
    protected String strTermRetDescEn = "";
    protected Map<String, String> map = new HashMap<String, String>(100, 0.8f);
    protected ReponseMessage response =  null;

	private static int iRunningThreadCount = 0;
	private static String RUNNINGTHREADCOUNTLOCK = "RUNNINGTHREADCOUNTLOCK";
	private static int MAX_RUNNINGTHREADCOUNT = 128;

	public static int increaseRunningThreadCount()
	{
		synchronized (RUNNINGTHREADCOUNTLOCK)
		{
			return ++iRunningThreadCount;
		}
	}

	public static int decreaseRunningThreadCount()
	{
		synchronized (RUNNINGTHREADCOUNTLOCK)
		{
			return --iRunningThreadCount;
		}
	}

	public static int getRunningThreadCount()
	{
		synchronized (RUNNINGTHREADCOUNTLOCK)
		{
			if (iRunningThreadCount < 0)
				iRunningThreadCount = 0;
			return iRunningThreadCount;
		}
	}

	public String getRespText()
	{
		return XmlHelper.transformDom2Str(this.domResp, "UTF-8");
	}

	/**
	 * ����ָ���ķ���ֵ���õ��򵥻�Ӧ�������ݡ�һ�����ڷ���δ�ɹ��Ļ�Ӧ��
	 */
	public void setSimpleRespDom(String strTermRetCode, String strTermRetDesc,String strTermRetDescEn) {
		MsgXmlDom.setElementValue(this.domResp,XMLNODENAME_SERVERDATETIME, dtCur.getDateTimeStrFull());
		MsgXmlDom.setElementValue(this.domResp,XMLNODENAME_TERMRETCODE, strTermRetCode);
		MsgXmlDom.setElementValue(this.domResp,XMLNODENAME_TERMRETDESC, strTermRetDesc);
		MsgXmlDom.setElementValue(this.domResp,XMLNODENAME_TERMRETDESCEN, strTermRetDescEn);
	}

	public void setSucceedRespDom() {
		setSimpleRespDom(TERMRETCODE_SUCCEED, TERMRETDESC_SUCCEED,TERMRETDESCEN_SUCCEED);
	}

	public void doProcess(DateCtrl dtCur, String strReq, Document domReq) {
		this.dtCur = dtCur;
		this.strReq = strReq;
		this.domReq = domReq;
		this.domResp = new Document();
		//����ʹ��
//		String strTransOffLine = new MiscDB().get("00001", "TransOffLine", "true");
//		if(strTransOffLine != null && !strTransOffLine.equals("") && strTransOffLine.equals("true")){
//		    // ���óɹ���Ϣ
//		    setSucceedRespDom();
//		    return;
//		}
		if (getRunningThreadCount() > MAX_RUNNINGTHREADCOUNT)
		{
			setSimpleRespDom(TERMRETCODE_TOOBUSY, TERMRETDESC_TOOBUSY,TERMRETDESCEN_TOOBUSY);
			return;
		}
		String strTerminalNum = MsgXmlDom.getElementValue(domReq,"strTerminalNum");
		if (strTerminalNum == null || strTerminalNum.length() == 0)
		{
			setSimpleRespDom(TERMRETCODE_INVALIDTERM, TERMRETDESC_INVALIDTERM,TERMRETDESCEN_INVALIDTERM);
			return;
		}
		this.terminal = new TerminalDB().getEntityByTerminal(strTerminalNum);
		if (this.terminal == null) {
			setSimpleRespDom(TERMRETCODE_INVALIDTERM, TERMRETDESC_INVALIDTERM,TERMRETDESCEN_INVALIDTERM);
			return;
		}
		this.theSecurityHelper = new SecurityHelper();
		if(!validateMac()){//��֤MAC
			error.error("MAC����ʧ��:"+strReq+"\r\n");
			setSimpleRespDom(TERMRETCODE_MACERR, TERMRETDESC_MACERR, TERMRETDESCEN_MACERR);
			return;
		}

		increaseRunningThreadCount();
		try {
			strTerminalTsn = getTerminalTsn();
			MsgXmlDom.setElementValue(domResp,"strOrigstrTxSerialNo",strTerminalTsn);
			process();
		} catch (ProcessorException pe) {
			setSimpleRespDom(pe.getTermRetCode(), pe.getTermRetDesc(), pe.getTermRetDescEn());
		} catch (Exception e) {
			// �����쳣�׳����򷵻ز�ȷ��
			setSimpleRespDom(TERMRETCODE_COMMUNC, TERMRETDESC_COMMUNC,TERMRETDESCEN_COMMUNC);
        	java.io.StringWriter sw = new java.io.StringWriter(1024 * 4);
        	e.printStackTrace(new java.io.PrintWriter(sw));
			error.error("���ͽ�������ʧ��:"+sw+"\r\n");
		}
		decreaseRunningThreadCount();
	}

	/**
	 * ������
	*/
	protected void process() throws ProcessorException
	{
		try
		{
	    	//��һ�� �ֽ⽻��������Ϣ
	    	analyzeRequest(domReq);
	    	//�ڶ��� ���ݽ�����ȡ�����������ļ�
	        String strPathXML = pathXML();
	        //������ ���ݽ��������ļ���װ������
	        String strRequestMsg = organizeInfo(strPathXML,"request");//��װ������
	        try
			{
				// ���Ĳ����������������н��״���
	        	SendAndGet(strRequestMsg);
		    	//����C��ǰ����:�ؼ���У��
		    	File xmlFiles = new File(strPathXML);
		    	if (xmlFiles.exists()) {
		    		Document documents = new SAXBuilder().build(xmlFiles);
		            String strTransCheckField = XmlHelper.getSingleNodeValue(documents,"/MappingRule/TransCheckField/field","");
		            if (strTransCheckField != null && !strTransCheckField.equals(""))
		            {
		            	transReturnCheck(strTransCheckField,strRequestMsg);
		            }
		    	}
			}
			catch (ProcessorException pe)
			{
	        	java.io.StringWriter sw = new java.io.StringWriter(1024 * 4);
	        	pe.printStackTrace(new java.io.PrintWriter(sw));
				error.error("���ͽ�������ʧ��:"+sw+"\r\n");
	            // ����δ������쳣�׳����򷵻ز�ȷ��
	            setSimpleRespDom(TERMRETCODE_COMMUNC, TERMRETDESC_COMMUNC,TERMRETDESCEN_COMMUNC);
			}
			finally
			{
				//��ֹ���鿨���ף���������������ѿ�����ȡ����
	        	strCardType = MsgXmlDom.getElementValue(domReq,"strCardType");//������Ų�Ϊ�յĻ�����ʾ���ͱ����а���������,Ϊ�յĻ����ȴ�F24��ȡ��ȡ�����Ļ����ͱ�ʾ�޿�����
	        	if(strCardType == null || strCardType.equals("")){
	        		strCardType = response.RepMap.get("F24");
	        		if(strCardType != null && !strCardType.equals("") && strCardType.length() > 2){
	        			strCardType = strCardType.substring(0, 2);
	        			if(strCardType.equals("00")){
	        				strCardType = "1";
	        			}
	        			else if(strCardType.equals("10")){
	        				strCardType = "3";
	        			}
	        			else{
	        				strCardType = "";
	        			}
	        		}
	        	}
				// ���Ĳ�����¼������ˮ
				append2TransLog();
			}
		}
		catch (Exception e)
		{
	        java.io.StringWriter sw = new java.io.StringWriter(1024 * 4);
	        e.printStackTrace(new java.io.PrintWriter(sw));
			error.error("���ͽ�������ʧ��:"+sw+"\r\n");
	        // ����δ������쳣�׳����򷵻ز�ȷ��
	        setSimpleRespDom(TERMRETCODE_COMMUNC, TERMRETDESC_COMMUNC,TERMRETDESCEN_COMMUNC);
		}
		finally
		{
			// �ѽ�����Ϣ�������
			notifyxViewProxy();
		}
	}

    //�ֽ⽻��������Ϣ
    public void analyzeRequest(org.jdom.Document domReq)
    {
    	map = new HashMap<String, String>();
    	org.jdom.Element root = domReq.getRootElement();
    	List<?> list=root.getChildren();//�������еĽڵ�Ԫ��
        for(int i=0;i<list.size();i++)
        {
        	org.jdom.Element element=(org.jdom.Element)list.get(i);//���˱������е�disk�ڵ�
        	String key=element.getName();
        	String value=element.getText();
        	if(key.equals("strEncrypType")){//�ж���Կ��ʽ
                if(value.equals("SM4")){//�����㷨
                	map.put(key, "04");
                }else{                  //�����㷨
                	map.put(key, "06");
                }
        	}else{
        	   map.put(key, value);
        	}
        }
        //ͳһ�����ܿ������ڵ�ʱ�� ���ܿ������ڵ��������ݡ�ϵͳ���ٺ�
        map.put("strTerminalTsn", strTerminalTsn);//ϵͳ���ٺ�
        map.put("strTransTime", dtCur.getDateTimeToView());//�ܿ������ڵ�ʱ�� hhmmss
        map.put("strTransDate", dtCur.getTransDateToView());//�ܿ������ڵ���������yyyyMMdd
        //��Ա����ǼǴ��� ���������
        if(map.get("strTransCode") != null && !map.get("strTransCode").equals("")
        		&& map.get("strTransCode").equals("910208")){
        	String strTellerPwd = map.get("strTellerPwd");
			try {
				strTellerPwd = new AgreeDesTool().desEncrypt(strTellerPwd);
			} catch (Exception e) {
				error.error("���ܹ�Ա�������:"+e);
			}
        	map.put("strTellerPwd",strTellerPwd);
        }
    }

    //��ȡ���������ļ�
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
  	public String organizeInfo(String filePath,String transType) throws UnsupportedEncodingException
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
  					boolean strFingerValue = false;//ָ�������Ƿ����ת��
  					org.dom4j.Element element=(org.dom4j.Element)list.get(i);
  					strName=((org.dom4j.Element) element.selectSingleNode("id")).getTextTrim(); //Ψһ��ʶ
  					String strSource=((org.dom4j.Element) element.selectSingleNode("strSource")).getTextTrim(); //ȡֵ��ʽ
  	                if(strSource != null && strSource.equals("$"))//��ƽ̨��ȡ
  	                {
  	                	String strDestKey=((org.dom4j.Element) element.selectSingleNode("strDestKey")).getTextTrim(); //ƽ̨ȡֵ�ֶ�����
  	                	//ָ�������а��������ַ�
  	                	if(strDestKey !=null && !strDestKey.equals("") && strDestKey.equals("strFeatureData")){
  	                		strFingerValue = true;
  	                	}
  	                	strValue = map.get(strDestKey);
  	                }
  	                else if (strSource != null && strSource.equals("$$"))//ȡĬ��ֵ
  	                {
  	                	strValue=((org.dom4j.Element) element.selectSingleNode("strDefaultValue")).getTextTrim(); //Ĭ��ֵ
  	                }
  	                if(strName != null && strName.equals("F999")){//�жϸý����Ƿ��¼������ˮ
  	                	transLogFlag = strValue;
  	                }
					//Ӱ��ͼƬ·���а��������ַ�
  	                if((strName.equals("idPhotoUrl") || strName.equals("idPhotoBackUrl") || strName.equals("scenePhotoUrl") || strName.equals("verificationPhoteUrl") || strName.equals("content")
  	                		|| strName.equals("selfSignPhotoUrl") || strName.equals("socialSecurityPhotoUrl") || (strName.equals("F48") && strFingerValue))  && strValue!=null && !strValue.equals("")){
  	                	priMap.put(strName, new XmlTextConstructor().encodeXml(new String(new Base64().decode(strValue),"UTF-8")));
  	                }else{
  	                	priMap.put(strName, strValue);
  	                }
  				}
  		        try {
  		        	requestMessage.appendContentPrimary(priMap);
  		        	//info.info("������:"+"\r\n"+requestMessage.getRequestText());
  		        	JournalThread.getInstance().appendInfoLog((String)map.get("strTerminalNum"), "������:"+"\r\n" + requestMessage.getRequestText());
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
    * �ؼ���У��
    * @param  У��ؼ�����ˮ�š��ն˺š������롢����
    * @throws ProcessorException
    */
   private void transReturnCheck(String strCheck,String strRequestMsg) throws ProcessorException
   {
     String strTermRetCode = MsgXmlDom.getElementValue(domResp, "TermRetCode");
     //У��ؼ���
     if (TERMRETCODE_SUCCEED.equals(strTermRetCode))
     {
	      //У��������
	      String strCheckData[] = strCheck.split(",");
	      for(int i=0;i<strCheckData.length;i++){
	    	  Document reqDataDoc = XmlHelper.parseStr2Dom(strRequestMsg);
	  		  String strFieldReq = XmlHelper.getSingleNodeValue(reqDataDoc, "its/"+strCheckData[i], "");//�������ͱ�ʶ��
	    	  String  strFieldResp = MsgXmlDom.getElementValue(this.domResp, strCheckData[i]);
	    	  if(strFieldResp !=null && !strFieldResp.equals("")){
	    		  if(!strFieldReq.trim().equals(strFieldResp.trim())){
		    		  setSimpleRespDom("9999", "��Ӧ������"+strCheckData[i]+"��Ӧ��У���","Response Field check error!!");
		    		  return;
	    		  }
	    	  }else{
	    		  setSimpleRespDom("9999", "��Ӧ������"+strCheckData[i]+"�ؼ���ȱʧ","Response Field error!!");
	    		  return;
	    	  }
	      }
     }
   }

   /**
    * ����������ͨѶ
   */
   public int exchangeWithHs(String reqData,ReponseMessage response) {
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

   /**
    * ���Ͳ����ܱ���
   */
   public void SendAndGet(String strRequestMsg) throws ProcessorException
   {
	   int iRet=1;//���׽��
       response =  new ReponseMessage();
       try
       {
          iRet = exchangeWithHs(strRequestMsg,response);
       }
       catch (Exception e)
       {
       	  setSimpleRespDom(TERMRETCODE_COMMUNC, TERMRETDESC_COMMUNC, TERMRETDESCEN_COMMUNC);
   		  return;
       }
       if (iRet != PROCESS_SUCCEED)
       {
       	   if(response.retCode == null || response.retCode.equals("")){
       		   setSimpleRespDom(TERMRETCODE_COMMUNC, TERMRETDESC_COMMUNC, TERMRETDESCEN_COMMUNC);
       		   return;
       	   }else{
       		   HostRetCode hostRetCode =  new HostRetCodeDB().getEntity(response.retCode);
       		   if(hostRetCode == null ){//û�е�ʱ������
       			   HostRetCode bean = new HostRetCode();
       			   bean.setStrHostRetCode(response.retCode);
       			   bean.setStrHostRetDesc(response.retCodeMessage);
       			   new HostRetCodeDB().save(bean);
       			   //�ѷ�������Ϣ���͸����
       		       ColsTransMsg msg = new ColsTransMsg();
       		       msg.put("id", String.valueOf(bean.getId()));
       		       msg.put("strHostRetCode", response.retCode);
       		       msg.put("strHostRetDesc", response.retCodeMessage);
       		       new LinxViewProxy().sendHostRetCodeMsg(msg.toString());
       		   }
       		   else{//�е�ʱ���޸�һ�£���ֹ���߲�ͳһ
       			   hostRetCode.setStrHostRetDesc(response.retCodeMessage);
           		   new HostRetCodeDB().update(hostRetCode);
       		   }
       	       if(response.RepMap !=null && response.RepMap.size() > 0 ){
       	           Iterator<Map.Entry<String, String>> entries = response.RepMap.entrySet().iterator();
       	           while (entries.hasNext()) {
       	     	       Map.Entry<String, String> entry = entries.next();
       	     	       MsgXmlDom.setElementValue(domResp, entry.getKey(),entry.getValue());
       	     	   }
       	       }
       	       setSimpleRespDom(response.retCode, response.retCodeMessage, TERMRETDESCEN_COMMUNC);
   		       return;
       	   }
       }
       // ���óɹ���Ϣ
	   setSucceedRespDom();
		//�ѷ���ֵȫ������Dom������
		//ҳ��ȡֵ����top.exchxmlasync.msgxmldomResp.getElementValue("F7")���ַ�ʽ����
       if(response.RepMap !=null && response.RepMap.size() > 0 ){
       Iterator<Map.Entry<String, String>> entries = response.RepMap.entrySet().iterator();
       while (entries.hasNext()) {
    	       Map.Entry<String, String> entry = entries.next();
    	       MsgXmlDom.setElementValue(domResp, entry.getKey(),entry.getValue());
    	   }
       }
   }

    /**
	 * ��ȡ16λ�ն���ˮ��:8λ�ն˱�� + 8λ�ն���ˮ��
	*/
	public String getTerminalTsn()
	{
		String strtm = "" + new Date().getTime();
		String str = MsgXmlDom.getElementValue(domReq, "strTerminalNum") + strtm.substring(strtm.length() - 8, strtm.length());
		return str;
	}

	/**
	 * ��֤�����Mac
	*/
	protected boolean validateMac()
	{
        boolean bRet = false;
        theSecurityHelper = new SecurityHelper();
        try {
            int iMacStart = strReq.lastIndexOf("<Mac>");
            int iMacEnd = strReq.lastIndexOf("</Mac>");
            String strTerminalNum = MsgXmlDom.getElementValue(domReq,"strTerminalNum");
            if (iMacStart == -1 || iMacEnd == -1 || iMacStart >= iMacEnd)
            {
            	return true;
            }
            String strData2ValidateMac = strReq.substring(0, iMacStart) + strReq.substring(iMacEnd + "</Mac>".length());
            String strMacValue = MsgXmlDom.getElementValue(domReq, "Mac");
            String strEncrypType  = MsgXmlDom.getElementValue(domReq,"strEncrypType");
            if(strEncrypType != null && strEncrypType.equals("SM4")){//�߹�������
            	return theSecurityHelper.validateMacSM4(strMacValue, strData2ValidateMac,strTerminalNum);
            }else{//��������DES����
            	return theSecurityHelper.validateMacDes(strMacValue, strData2ValidateMac,strTerminalNum);
            }
        } catch (Exception e) {
            return bRet;
        }
	}

	/**
	 * ��¼������ˮ
	*/
	@SuppressWarnings({"static-access" })
	protected void append2TransLog()
	{
		if(MsgXmlDom.getElementValue(domReq, "strTransCode") == null || MsgXmlDom.getElementValue(domReq, "strTransCode").equals("")){
			return;
		}
		if(transLogFlag !=null &&  transLogFlag.equals("true")){
			if(MsgXmlDom.getElementValue(domReq, "strTransCode").equals("901104") ||
			   (MsgXmlDom.getElementValue(domReq, "strTransCode").equals("901301") && MsgXmlDom.getElementValue(domReq, "strCardProduct").equals("1"))||
			   (MsgXmlDom.getElementValue(domReq, "strTransCode").equals("901401") && MsgXmlDom.getElementValue(domReq, "strCardProduct").equals("1"))){//����,��������������
				//�Ȼ�ȡ��ǰ���׵����κ�
				CardSettleCycleLog  cardSettleCycleLog = new CardSettleCycleLogDB().getCurBatchNoEntity(MsgXmlDom.getElementValue(domReq, "strTerminalNum"),0);
				if(cardSettleCycleLog == null ){
					return;
				}
				termBatchNo = cardSettleCycleLog.getTermBatchNo();
				CardTransLog entity = new CardTransLog();
		    	String strTermRetCode = MsgXmlDom.getElementValue(domResp, "TermRetCode");
				int hostTransStatus;
				if (TERMRETCODE_SUCCEED.equals(strTermRetCode))
				{
					hostTransStatus = HTSTATUS_OK;
				}
				else if (TERMRETCODE_COMMUNC.equals(strTermRetCode))
				{
					hostTransStatus = HTSTATUS_UNCER;
				}
				else
				{
					hostTransStatus = HTSTATUS_FAILED;
				}
		    	entity.setStrTerminalNum(MsgXmlDom.getElementValue(domReq, "strTerminalNum"));
		    	entity.setTransCode(MsgXmlDom.getElementValue(domReq, "strTransCode"));
		    	entity.setDtOccur(new DateCtrl().getStrToTimestamp(dataFormat()));
		    	entity.setStrPan(MsgXmlDom.getElementValue(domReq, "strPan"));
		    	entity.setStrIDCardNum(new Base64().encode(MsgXmlDom.getElementValue(domReq, "strIDCardNum").getBytes()));
		    	entity.setStrCardType(MsgXmlDom.getElementValue(domReq, "strCardType"));
		    	entity.setTermTxStatus(0);//Ĭ��Ϊ0��δ����
		    	entity.setHostTxStatus(hostTransStatus);
		    	entity.setStrHostRetCode(response.RepMap.get("F39"));
		    	entity.setStrHostSerialNo(response.RepMap.get("F37"));
		    	entity.setDtHostOccur(new DateCtrl().getStrToTimestamp(dataFormat()));
		    	entity.setTermBatchNo(termBatchNo);
		    	entity.setSettleCycleStatus(0);//���״̬   0��δ��� 1�������
		    	entity.setStrTermSerialNo(strTerminalTsn);
		    	entity.setStrOrigstrTxSerialNo(MsgXmlDom.getElementValue(domReq, "strOrigstrTxSerialNo"));
		    	entity.setStrSingleBusinessNum(MsgXmlDom.getElementValue(domReq, "strSingleBusinessNum"));
		    	entity.setStrExInfo2(MsgXmlDom.getElementValue(domReq, "strBatchId"));//��¼��Ӧ�ϴ�Ӱ��ƽ̨��������ˮ
		    	new CardTransLogDB().save(entity);
		    	transLogId = entity.getId();
		    	MsgXmlDom.setElementValue(domResp, "transLogId", String.valueOf(transLogId));
			}
			else if(MsgXmlDom.getElementValue(domReq, "strTransCode").equals("908201")){//UKey����
				//�Ȼ�ȡ��ǰ���׵����κ�
				UKeySettleCycleLog  ukeySettleCycleLog = new UKeySettleCycleLogDB().getCurBatchNoEntity(MsgXmlDom.getElementValue(domReq, "strTerminalNum"),0);
				if(ukeySettleCycleLog == null ){
					return;
				}
				termBatchNo = ukeySettleCycleLog.getTermBatchNo();
				UKeyTransLog entity = new UKeyTransLog();
		    	String strTermRetCode = MsgXmlDom.getElementValue(domResp, "TermRetCode");
				int hostTransStatus;
				if (TERMRETCODE_SUCCEED.equals(strTermRetCode))
				{
					hostTransStatus = HTSTATUS_OK;
				}
				else if (TERMRETCODE_COMMUNC.equals(strTermRetCode))
				{
					hostTransStatus = HTSTATUS_UNCER;
				}
				else
				{
					hostTransStatus = HTSTATUS_FAILED;
				}
		    	entity.setStrTerminalNum(MsgXmlDom.getElementValue(domReq, "strTerminalNum"));
		    	entity.setTransCode(MsgXmlDom.getElementValue(domReq, "strTransCode"));
		    	entity.setDtOccur(new DateCtrl().getStrToTimestamp(dataFormat()));
		    	entity.setStrUKeyNum(MsgXmlDom.getElementValue(domReq, "strUKeyNum"));
		    	entity.setStrIDCardNum(new Base64().encode(MsgXmlDom.getElementValue(domReq, "strIDCardNum").getBytes()));
		    	entity.setStrBindCardNum(MsgXmlDom.getElementValue(domReq, "strBindCardNum"));
		    	entity.setStrUKeyType(MsgXmlDom.getElementValue(domReq, "strVoucherType"));
		    	entity.setTermTxStatus(0);//Ĭ��Ϊ0��δ����
		    	entity.setHostTxStatus(hostTransStatus);
		    	entity.setStrHostRetCode(response.RepMap.get("F39"));
		    	entity.setStrHostSerialNo(response.RepMap.get("F37"));
		    	entity.setDtHostOccur(new DateCtrl().getStrToTimestamp(dataFormat()));
		    	entity.setTermBatchNo(termBatchNo);
		    	entity.setSettleCycleStatus(0);//���״̬   0��δ��� 1�������
		    	entity.setStrTermSerialNo(strTerminalTsn);
		    	entity.setStrOrigstrTxSerialNo(MsgXmlDom.getElementValue(domReq, "strOrigstrTxSerialNo"));
		    	entity.setStrSingleBusinessNum(MsgXmlDom.getElementValue(domReq, "strSingleBusinessNum"));
		    	new UKeyTransLogDB().save(entity);
		    	transLogId = entity.getId();
		    	MsgXmlDom.setElementValue(domResp, "transLogId", String.valueOf(transLogId));
			}
			else if(MsgXmlDom.getElementValue(domReq, "strTransCode").equals("905107") ||
					MsgXmlDom.getElementValue(domReq, "strTransCode").equals("905103") ||
					MsgXmlDom.getElementValue(domReq, "strTransCode").equals("905104")){//�浥�䵥�����ᡢ��������
				//�Ȼ�ȡ��ǰ���׵����κ�
				CDSSettleCycleLog  cdsSettleCycleLog = new CDSSettleCycleLogDB().getCurBatchNoEntity(MsgXmlDom.getElementValue(domReq, "strTerminalNum"),0);
				if(MsgXmlDom.getElementValue(domReq, "strTransCode").equals("905104")){
					//�浥��������Ҫ��ȡ���κ�
					if(cdsSettleCycleLog == null){
						termBatchNo = 0;
					}else{
						termBatchNo = cdsSettleCycleLog.getTermBatchNo();
					}
				}else{
					if(cdsSettleCycleLog == null){

						System.out.println("cdsSettleCycleLog == null");
						return;
					}
					termBatchNo = cdsSettleCycleLog.getTermBatchNo();
				}

				String strTransCode = MsgXmlDom.getElementValue(domReq, "strTransCode");
				CDSTransLog entity = new CDSTransLog();
		    	String strTermRetCode = MsgXmlDom.getElementValue(domResp, "TermRetCode");
				int hostTransStatus;
				if (TERMRETCODE_SUCCEED.equals(strTermRetCode))
				{
					hostTransStatus = HTSTATUS_OK;
				}
				else if (TERMRETCODE_COMMUNC.equals(strTermRetCode))
				{
					hostTransStatus = HTSTATUS_UNCER;
				}
				else
				{
					hostTransStatus = HTSTATUS_FAILED;
				}

				entity.setStrExInfo2(MsgXmlDom.getElementValue(domReq, "strExInfo2"));//�����ֶ�2
				entity.setStrExInfo3(MsgXmlDom.getElementValue(domReq, "strExInfo3"));//�����ֶ�3
				entity.setStrInterest(MsgXmlDom.getElementValue(domReq, "strInterest")); //��Ϣ
		    	if(MsgXmlDom.getElementValue(domReq, "Amount") == null || MsgXmlDom.getElementValue(domReq, "Amount").equals("") || MsgXmlDom.getElementValue(domReq, "Amount").equals("0")){
		    		BigDecimal amt = new BigDecimal("0"); //�ѽ��׽��ת����BigDecimal��
		    		entity.setAmt(amt);
				}else{
					String strAmount = MsgXmlDom.getElementValue(domReq, "Amount");
					strAmount = new DataConversion().fromFenToYuan(strAmount);//��ת��ΪԪ
					BigDecimal amt = new BigDecimal(strAmount); //�ѽ��׽��ת����BigDecimal��
					entity.setAmt(amt);
				}
				if(strTransCode.equals("905107")){
					//�浥�䵥
					String  strIsAgent = MsgXmlDom.getElementValue(domResp, "isAgent");
					if(strIsAgent != null && !strIsAgent.equals("") && strIsAgent.equals("1")){
						//����ˡ�������
						entity.setStrIDCardNum(new Base64().encode(MsgXmlDom.getElementValue(domReq, "strAuthNum").getBytes()));
			    		entity.setStrAuthIDCardNum(new Base64().encode(MsgXmlDom.getElementValue(domReq, "strAgentNum").getBytes()));
					}else{
						entity.setStrIDCardNum(new Base64().encode(MsgXmlDom.getElementValue(domReq, "strAuthNum").getBytes()));
					}
			    	entity.setStrOCRNum(MsgXmlDom.getElementValue(domReq, "strCDCertNum"));//�浥ƾ֤��
			    	entity.setStrAccountNum(MsgXmlDom.getElementValue(domReq, "strCdsAccount"));//�浥�˺�
			    	entity.setStrTimeLimit(MsgXmlDom.getElementValue(domReq, "strProductSubType"));
			    	entity.setStrExInfo1(MsgXmlDom.getElementValue(domReq, "strExInfo1"));//�����ֶ�1
			    	entity.setStrExInfo2(MsgXmlDom.getElementValue(domReq, "strAuthName"));//����
				}else if(strTransCode.equals("905103")){
					//�浥����
					entity.setStrIDCardNum(new Base64().encode(MsgXmlDom.getElementValue(domReq, "strIDCardNum").getBytes()));
					entity.setStrOCRNum(MsgXmlDom.getElementValue(domReq, "strVoucherNo"));//�浥��ƾ֤��
			    	entity.setStrAccountNum(MsgXmlDom.getElementValue(domReq, "strAccountOut"));//�浥�˺�
			    	entity.setStrTimeLimit(MsgXmlDom.getElementValue(domReq, "strDepositTerm"));	//����

			    	entity.setStrExInfo2(MsgXmlDom.getElementValue(domReq, "strAcctBalance"));//�����ֶ�2���浥����
			    	entity.setStrExInfo3(MsgXmlDom.getElementValue(domReq, "strOldVouchNo"));//�����ֶ�3����ƾ֤��
			    	//���᱾Ϣ�� - ������
			    	String strDrawTotalAmount = response.RepMap.get("F54_XZYE");
			    	//������
			    	String strDrawAmount = "";
			    	//������Ϣ
			    	String strInterest = "";
			    	//���P���Ƿ񷵻ز�����ı�Ϣ��
			    	if(strDrawTotalAmount != null && !strDrawTotalAmount.equals("")){
			    		if(MsgXmlDom.getElementValue(domReq, "Amount") == null || MsgXmlDom.getElementValue(domReq, "Amount").equals("") || MsgXmlDom.getElementValue(domReq, "Amount").equals("0")){
				    		strDrawAmount = "0";
						}else{
							strDrawAmount = MsgXmlDom.getElementValue(domReq, "Amount");
						}
				    	//��Ϣ
				    	int intInterest = Integer.parseInt(new DataConversion().getMoneyToFen(strDrawTotalAmount))-Integer.parseInt(strDrawAmount);
				    	if(intInterest >0){
				    		strInterest = new DataConversion().fromFenToYuan(String.valueOf(intInterest));
				    	}else{
				    		strInterest = "0.00";
				    	}
			    	}else{
			    		strDrawTotalAmount = "0.00";
			    		strInterest = "0.00";
			    	}
			    	entity.setStrExInfo1(strDrawTotalAmount);//�����ֶ�2���������+��Ϣ
			    	entity.setStrInterest(strInterest); //��Ϣ
				}else if(strTransCode.equals("905104")){
					//�浥����
					entity.setStrIDCardNum(new Base64().encode(MsgXmlDom.getElementValue(domReq, "strIDCardNum").getBytes()));
					entity.setStrOCRNum(MsgXmlDom.getElementValue(domReq, "strCDCertNum"));//�浥ƾ֤��
			    	entity.setStrAccountNum(MsgXmlDom.getElementValue(domReq, "strCDSNum"));//�浥�˺�
			    	entity.setStrTimeLimit(MsgXmlDom.getElementValue(domReq, "strDepositTerm"));

			    	entity.setStrExInfo2(MsgXmlDom.getElementValue(domReq, "strCdsIDName"));//����
			    	//�浥��Ϣ��
			    	String strCanTotalAmount = response.RepMap.get("F54_XZYE");
			    	//�������
			    	String strCanAmount = "";
			    	//��Ϣ
			    	String strInterest = "";
		    		//�浥����:��Ϊ��λ
			    	if(MsgXmlDom.getElementValue(domReq, "Amount") == null || MsgXmlDom.getElementValue(domReq, "Amount").equals("") || MsgXmlDom.getElementValue(domReq, "Amount").equals("0")){
			    		strCanAmount = "0";
					}else{
						strCanAmount = MsgXmlDom.getElementValue(domReq, "Amount");
					}
			    	//P���Ƿ񷵻��������ı�Ϣ��
			    	if(strCanTotalAmount != null && !strCanTotalAmount.equals("")){
				    	//��Ϣ
				    	int intInterest = Integer.parseInt(new DataConversion().getMoneyToFen(strCanTotalAmount))-Integer.parseInt(strCanAmount);
				    	if(intInterest >0){
				    		strInterest = new DataConversion().fromFenToYuan(String.valueOf(intInterest));
				    	}else{
				    		strInterest = "0.00";
				    	}

			    	}else{
			    		strCanTotalAmount = "0";
			    	}
			    	//������Ϣ��
			    	BigDecimal amt = new BigDecimal(strCanTotalAmount); //�ѽ��׽��ת����BigDecimal��
					entity.setAmt(amt);
			    	entity.setStrInterest(strInterest); //��Ϣ
			    	entity.setStrExInfo1(new DataConversion().fromFenToYuan(strCanAmount));//����
				}
				//���๫���ֶ�
		    	entity.setStrTerminalNum(MsgXmlDom.getElementValue(domReq, "strTerminalNum"));
		    	entity.setTransCode(strTransCode);
		    	entity.setDtOccur(new DateCtrl().getStrToTimestamp(dataFormat()));
		    	entity.setTermTxStatus(0);//Ĭ��Ϊ0��δ����
		    	entity.setHostTxStatus(hostTransStatus);
		    	entity.setStrHostRetCode(response.RepMap.get("F39"));
		    	entity.setStrHostSerialNo(response.RepMap.get("F37"));
		    	entity.setStrAccMode("3504");
		    	entity.setStrCDSType(MsgXmlDom.getElementValue(domReq, "strCDSType"));
		    	entity.setStrRate(MsgXmlDom.getElementValue(domReq, "strRate"));
		    	entity.setDtHostOccur(new DateCtrl().getStrToTimestamp(dataFormat()));
		    	entity.setTermBatchNo(termBatchNo);
		    	entity.setSettleCycleStatus(0);//���״̬   0��δ��� 1�������
		    	entity.setStrTermSerialNo(getTerminalTsn());
		    	entity.setStrOrigstrTxSerialNo(response.RepMap.get("F11"));
		    	entity.setStrSingleBusinessNum(MsgXmlDom.getElementValue(domReq, "strTransRandom"));
		    	entity.setStrExInfo4(MsgXmlDom.getElementValue(domReq, "strBatchId"));//�����ֶ�4 Ӱ��ƽ̨���κ�
		    	entity.setStrExInfo5(MsgXmlDom.getElementValue(domReq, "strExInfo5"));//�����ֶ�5
		    	new CDSTransLogDB().save(entity);
		    	transLogId = entity.getId();
		    	MsgXmlDom.setElementValue(domResp, "transLogId", String.valueOf(transLogId));
			}else if(MsgXmlDom.getElementValue(domReq, "strTransCode").equals("905102") ||
					 MsgXmlDom.getElementValue(domReq, "strTransCode").equals("905105") ||
					 MsgXmlDom.getElementValue(domReq, "strTransCode").equals("905108")||
					 MsgXmlDom.getElementValue(domReq, "strTransCode").equals("905106")){//�浥�������浥�ڲ���ת�롢�浥��֤���浥���ʲ�ѯ
				//�Ȼ�ȡ��ǰ���׵����κ�
				CDSSettleCycleLog  cdsSettleCycleLog = new CDSSettleCycleLogDB().getCurBatchNoEntity(MsgXmlDom.getElementValue(domReq, "strTerminalNum"),0);
				if(cdsSettleCycleLog == null ){
					System.out.println("cdsSettleCycleLog == null");
					return;
				}
				String strTransCode = MsgXmlDom.getElementValue(domReq, "strTransCode");
				termBatchNo = cdsSettleCycleLog.getTermBatchNo();
				CDSTransLog entity = new CDSTransLog();
		    	String strTermRetCode = MsgXmlDom.getElementValue(domResp, "TermRetCode");
				int hostTransStatus;
				if (TERMRETCODE_SUCCEED.equals(strTermRetCode))
				{
					hostTransStatus = HTSTATUS_OK;
				}
				else if (TERMRETCODE_COMMUNC.equals(strTermRetCode))
				{
					hostTransStatus = HTSTATUS_UNCER;
				}
				else
				{
					hostTransStatus = HTSTATUS_FAILED;
				}

				entity.setStrIDCardNum(new Base64().encode(MsgXmlDom.getElementValue(domReq, "strIDCardNum").getBytes()));
				entity.setStrOCRNum(MsgXmlDom.getElementValue(domReq, "strCDCertNum"));//�浥ƾ֤��
		    	entity.setStrAccountNum(MsgXmlDom.getElementValue(domReq, "strCDSNum"));//�浥�˺�
		    	entity.setStrTimeLimit(MsgXmlDom.getElementValue(domReq, "strDepositTerm"));

				if(strTransCode.equals("905108")){
					entity.setStrAccountNum(MsgXmlDom.getElementValue(domReq, "strOutAcctNo"));//�˺�
				}else if(strTransCode.equals("905102")){
					if(MsgXmlDom.getElementValue(domReq, "strAuthIDCardNum") !=null && !MsgXmlDom.getElementValue(domReq, "strAuthIDCardNum").equals("")){
						entity.setStrIDCardNum(new Base64().encode(MsgXmlDom.getElementValue(domReq, "strAuthIDCardNum").getBytes()));
						entity.setStrAuthIDCardNum(new Base64().encode(MsgXmlDom.getElementValue(domReq, "strIDCardNum").getBytes()));
					}else{
						entity.setStrIDCardNum(new Base64().encode(MsgXmlDom.getElementValue(domReq, "strIDCardNum").getBytes()));
					}
					entity.setStrAccountNum(MsgXmlDom.getElementValue(domReq, "strCDSNum"));//�浥�˺�
			    	entity.setStrTimeLimit(MsgXmlDom.getElementValue(domReq, "strDepositTerm"));
				}else if(strTransCode.equals("905106")){
					entity.setStrAccountNum(MsgXmlDom.getElementValue(domReq, "strInAcctNo"));//ת���˺�
				}
				//���๫���ֶ�
		    	entity.setStrTerminalNum(MsgXmlDom.getElementValue(domReq, "strTerminalNum"));
		    	entity.setTransCode(strTransCode);
		    	if(MsgXmlDom.getElementValue(domReq, "Amount") == null || MsgXmlDom.getElementValue(domReq, "Amount").equals("") || MsgXmlDom.getElementValue(domReq, "Amount").equals("0")){
		    		BigDecimal amt = new BigDecimal("0"); //�ѽ��׽��ת����BigDecimal��
		    		entity.setAmt(amt);
				}else{
					String strAmount = MsgXmlDom.getElementValue(domReq, "Amount");
					strAmount = new DataConversion().fromFenToYuan(strAmount);//��ת��ΪԪ
					BigDecimal amt = new BigDecimal(strAmount); //�ѽ��׽��ת����BigDecimal��
					entity.setAmt(amt);
				}
		    	entity.setDtOccur(new DateCtrl().getStrToTimestamp(dataFormat()));
		    	entity.setTermTxStatus(0);//Ĭ��Ϊ0��δ����
		    	entity.setHostTxStatus(hostTransStatus);
		    	entity.setStrHostRetCode(response.RepMap.get("F39"));
		    	entity.setStrHostSerialNo(response.RepMap.get("F37"));
		    	entity.setStrAccMode("3504");
		    	entity.setStrCDSType(MsgXmlDom.getElementValue(domReq, "strCDSType"));
		    	entity.setStrRate(MsgXmlDom.getElementValue(domReq, "strRate"));
		    	entity.setStrInterest(MsgXmlDom.getElementValue(domReq, "strInterest"));
		    	entity.setDtHostOccur(new DateCtrl().getStrToTimestamp(dataFormat()));
		    	entity.setTermBatchNo(termBatchNo);
		    	entity.setSettleCycleStatus(0);//���״̬   0��δ��� 1�������
		    	entity.setStrTermSerialNo(getTerminalTsn());
		    	entity.setStrOrigstrTxSerialNo(response.RepMap.get("F11"));
		    	entity.setStrSingleBusinessNum(MsgXmlDom.getElementValue(domReq, "strTransRandom"));
		    	entity.setStrExInfo1(MsgXmlDom.getElementValue(domReq, "strExInfo1"));//�����ֶ�
		    	entity.setStrExInfo2(MsgXmlDom.getElementValue(domReq, "strExInfo2"));//�����ֶ�2
		    	entity.setStrExInfo3(MsgXmlDom.getElementValue(domReq, "strExInfo3"));//�����ֶ�3
		    	entity.setStrExInfo4(MsgXmlDom.getElementValue(domReq, "strBatchId"));//�����ֶ�4 Ӱ��ƽ̨���κ�
		    	entity.setStrExInfo5(MsgXmlDom.getElementValue(domReq, "strExInfo5"));//�����ֶ�5
		    	new CDSTransLogDB().save(entity);
		    	transLogId = entity.getId();
		    	MsgXmlDom.setElementValue(domResp, "transLogId", String.valueOf(transLogId));
			}
			//��ƾ֤����
			else if(MsgXmlDom.getElementValue(domReq, "strTransCode").equals("911101") && MsgXmlDom.getElementValue(domReq, "strAddFlag").equals("card") ){
				if (TERMRETCODE_SUCCEED.equals(MsgXmlDom.getElementValue(domResp, "TermRetCode")))//ֻ�гɹ���ʱ�򣬲�Ҫ�޸���״̬
				{
					try{
						//��COLS_CARDUNITSTATUS����в���  ˳�򣺿���������,��������,��ʼ����,��ǰ����,����״̬,������,��ʼ��bin,������bin
						int cardRefillCount = 0;//��ʼ����������
						String strTerminalNum = MsgXmlDom.getElementValue(domReq,"strTerminalNum");
						String cardBox[] = MsgXmlDom.getElementValue(domReq,"cardBoxInfoStr").split("\\|");//һ������Ԫ�ش���һ����������Ϣ
						CardUnitStatusDB cardUnitStatusDB = new CardUnitStatusDB();
						List<CardUnitStatus> cardList = new ArrayList<CardUnitStatus>();
						if(cardBox != null && cardBox.length >0){
							for(int i=0;i<cardBox.length;i++){
								String cardBoxInfo[] = cardBox[i].split(",");//һ������Ԫ�ش���ĳ�������ĳ������
								int cuNum = Integer.parseInt(cardBoxInfo[0]);//����������
								String strCuType = cardBoxInfo[1];//��������
								int initialCount = Integer.parseInt(cardBoxInfo[2]);//��ʼ����
								cardRefillCount =  cardRefillCount + initialCount;//�������������ӵ�������
								int curCount = Integer.parseInt(cardBoxInfo[3]);//��ǰ����
								String strCuStatus = cardBoxInfo[4];//����״̬
								String strCardType = cardBoxInfo[5];//������
								String strCardTrackStart = cardBoxInfo[6];//��ʼ��bin
								String strCardTrackEnd = cardBoxInfo[7];//������bin
								CardUnitStatus cardUnitStatus = new CardUnitStatus();
								cardUnitStatus.setStrTerminalNum(strTerminalNum);
								cardUnitStatus.setCuNum(cuNum);
								cardUnitStatus.setStrCuType(strCuType);
								cardUnitStatus.setInitialCount(initialCount);
								cardUnitStatus.setCurCount(curCount);
								cardUnitStatus.setStrCuStatus(strCuStatus);
								cardUnitStatus.setStrCardType(strCardType);
								cardUnitStatus.setStrCardTrackStart(strCardTrackStart);
								cardUnitStatus.setStrCardTrackEnd(strCardTrackEnd);
								cardUnitStatus.setCardSuccCount(0);
								cardUnitStatus.setCardCaptureCount(0);
								cardUnitStatus.setCardDestroyCount(0);
								cardUnitStatus.setCardUnknown(0);
								cardUnitStatus.setCardTakenCount(0);
								cardList.add(cardUnitStatus);
							}
						}
						boolean ret = cardUnitStatusDB.delete(strTerminalNum);//��ɾ����ʷ����
						if(ret){
							ret = cardUnitStatusDB.insert(cardList);
							if(ret){
								//�Ѽӿ���Ϣ���͸����
				       			new LinxViewProxy().sendCardUnitStatusMsg(cardList);
								//�޸����α�
								int termBatchNo = 1;//���κ�,Ĭ�ϴ�1��ʼ
								CardSettleCycleLogDB cardSettleCycleLogDB = new CardSettleCycleLogDB();
								CardSettleCycleLog entity = cardSettleCycleLogDB.getEntity(strTerminalNum);
								if(entity != null ){
									termBatchNo = entity.getTermBatchNo() + 1;
								}
								CardSettleCycleLog  cardSettleCycleLog = new  CardSettleCycleLog();
								String dtDate = new DateCtrl().getDateTimeStrSimpleFull();
								cardSettleCycleLog.setStrTerminalNum(strTerminalNum);
								cardSettleCycleLog.setTermBatchNo(termBatchNo);
								cardSettleCycleLog.setDtStart(new DateCtrl().getStrToTimestamp(dtDate));
								cardSettleCycleLog.setStatus(0);
								cardSettleCycleLog.setCardRefillCount(cardRefillCount);
								cardSettleCycleLog.setCardSurplusCount(cardRefillCount);
								ret = cardSettleCycleLogDB.save(cardSettleCycleLog);
								if(!ret){
									setSimpleRespDom(TERMRETCODE_ADDCARD,TERMRETDESC_ADDCARD, TERMRETDESCEN_ADDCARD);
								}
								//�Ѽӿ�������Ϣ���͸����
				       		    ColsTransMsg msg = new ColsTransMsg();
				       		    msg.put("strTerminalNum", strTerminalNum);
				       		    msg.put("iTermBatchNo", String.valueOf(termBatchNo));
				       		    msg.put("dtStart", dtDate);
				       		    msg.put("iStatus", String.valueOf(0));
				       		    msg.put("iCardSurplusCount", String.valueOf(cardRefillCount));
				       		    msg.put("iCardRefillCount", String.valueOf(cardRefillCount));
				       		    new LinxViewProxy().sendCardSettleCycleLogMsg(msg.toString());
							}else{
								setSimpleRespDom(TERMRETCODE_ADDCARD,TERMRETDESC_ADDCARD, TERMRETDESCEN_ADDCARD);
							}
						}else{
							setSimpleRespDom(TERMRETCODE_ADDCARD,TERMRETDESC_ADDCARD, TERMRETDESCEN_ADDCARD);
						}
					}catch(Exception e){
						setSimpleRespDom(TERMRETCODE_INNERR,TERMRETDESC_INNERR, TERMRETDESCEN_INNERR);
					}
				}
	    	}
			//����Ǵ浥�ڲ��˴�ȡ���
			else if(MsgXmlDom.getElementValue(domReq, "strTransCode").equals("909008")
					||MsgXmlDom.getElementValue(domReq, "strTransCode").equals("909005")
					||MsgXmlDom.getElementValue(domReq, "strTransCode").equals("909020")//�Թ����
					||MsgXmlDom.getElementValue(domReq, "strTransCode").equals("909120")){//��Ա���
				TransLogDeposit entity = new TransLogDeposit();
				String terminalId = MsgXmlDom.getElementValue(domReq, "strTerminalNum");
				//�Ȼ�ȡ��ǰ���׵����κ�
				termBatchNo = new SettleCycleLogDB().getSettleCycle(terminalId);
				String strTermRetCode = MsgXmlDom.getElementValue(domResp, "TermRetCode");
				int hostTransStatus;
				if (TERMRETCODE_SUCCEED.equals(strTermRetCode))
				{
					hostTransStatus = HTSTATUS_OK;
				}
				else if (TERMRETCODE_COMMUNC.equals(strTermRetCode))
				{
					hostTransStatus = HTSTATUS_UNCER;
				}
				else
				{
					hostTransStatus = HTSTATUS_FAILED;
				}
				//�����
		    	if(MsgXmlDom.getElementValue(domReq, "Amount") == null || MsgXmlDom.getElementValue(domReq, "Amount").equals("") || MsgXmlDom.getElementValue(domReq, "Amount").equals("0")){
		    		BigDecimal amt = new BigDecimal("0"); //�ѽ��׽��ת����BigDecimal��
		    		entity.setDamount(amt);
				}else{
					String strAmount = MsgXmlDom.getElementValue(domReq, "Amount");
					strAmount = new DataConversion().fromFenToYuan(strAmount);//��ת��ΪԪ
					BigDecimal amt = new BigDecimal(strAmount); //�ѽ��׽��ת����BigDecimal��
					entity.setDamount(amt);
				}
		    	if(MsgXmlDom.getElementValue(domReq, "fee") == null || MsgXmlDom.getElementValue(domReq, "fee").equals("") || MsgXmlDom.getElementValue(domReq, "fee").equals("0") ){
		    		BigDecimal amt = new BigDecimal("0"); //�ѽ��׽��ת����BigDecimal��
		    		entity.setDfee(amt);
				}else{
					String strFee = MsgXmlDom.getElementValue(domReq, "fee");
					strFee = new DataConversion().fromFenToYuan(strFee);//��ת��ΪԪ
					BigDecimal amt = new BigDecimal(strFee); //�ѽ��׽��ת����BigDecimal��
					entity.setDfee(amt);
				}
		    	String strTransCode = MsgXmlDom.getElementValue(domReq, "strTransCode");
		    	entity.setTransCode(strTransCode);
		    	//����
		    	entity.setItermTransStatus(5);
		    	entity.setStrSingleBusinessNum(MsgXmlDom.getElementValue(domReq, "strTransRandom"));
				entity.setIsettleCycle(termBatchNo);
				entity.setIhostTransStatus(hostTransStatus);
				entity.setIsettleCycleStatus(0);
		    	entity.setStrHostRetCode(response.RepMap.get("F39"));
		    	entity.setStrHostTsn(response.RepMap.get("F37"));
		    	entity.setStrTerminalNum(terminalId);
		    	entity.setDtOccur(new DateCtrl().getStrToTimestamp(dataFormat()));
		    	if(MsgXmlDom.getElementValue(domReq, "strTransCode").equals("909008")){
		    		entity.setStrPan("�浥�ֽ��ֵ");
		    	}else if(MsgXmlDom.getElementValue(domReq, "strTransCode").equals("909020")){
		    		entity.setStrPan(MsgXmlDom.getElementValue(domReq, "strAccount"));
		    	}else if(MsgXmlDom.getElementValue(domReq, "strTransCode").equals("909120")){
		    		entity.setStrPan("��Ա�ֽ���");
		    	}else if(MsgXmlDom.getElementValue(domReq, "strTransCode").equals("909005")){
		    		if(MsgXmlDom.getElementValue(domReq, "strPan")!=null && !MsgXmlDom.getElementValue(domReq, "strPan").equals("")){
		    			entity.setStrPan(MsgXmlDom.getElementValue(domReq, "strPan"));	
		    		}else{
		    			entity.setStrPan(MsgXmlDom.getElementValue(domReq, "strAccount"));
		    		}
		    	}else{
		    		entity.setStrPan(MsgXmlDom.getElementValue(domReq, "strPan"));
		    	}
		    	entity.setStrTermSerialNo(strTerminalTsn);
		    	//�����ֶ�
		    	entity.setStrExInfo1(MsgXmlDom.getElementValue(domReq, "strExInfo1"));
		    	entity.setStrExInfo2(MsgXmlDom.getElementValue(domReq, "strBatchId"));//��¼��Ӧ�ϴ�Ӱ��ƽ̨��������ˮ
		    	entity.setStrExInfo3(MsgXmlDom.getElementValue(domReq, "strExInfo3"));
		    	entity.setStrExInfo4(MsgXmlDom.getElementValue(domReq, "strExInfo4"));
		    	entity.setStrExInfo5(MsgXmlDom.getElementValue(domReq, "strExInfo5"));
		    	new TransLogDepositDB().sava(entity);
			}else if(MsgXmlDom.getElementValue(domReq, "strTransCode").equals("909009")
					||MsgXmlDom.getElementValue(domReq, "strTransCode").equals("909006")
					||MsgXmlDom.getElementValue(domReq, "strTransCode").equals("909015")){//���ȷ��
				TransLogDeposit entity = new TransLogDeposit();
				TransLogDepositDB strTransLogDepositDB = new TransLogDepositDB();
				String terminalId = MsgXmlDom.getElementValue(domReq, "strTerminalNum");
				//�Ȼ�ȡ��ǰ���׵����κ�
				termBatchNo = new SettleCycleLogDB().getSettleCycle(terminalId);
				String strTermRetCode = MsgXmlDom.getElementValue(domResp, "TermRetCode");
				int hostTransStatus;
				if (TERMRETCODE_SUCCEED.equals(strTermRetCode))
				{
					hostTransStatus = HTSTATUS_OK;
				}
				else if (TERMRETCODE_COMMUNC.equals(strTermRetCode))
				{
					hostTransStatus = HTSTATUS_UNCER;
				}
				else
				{
					hostTransStatus = HTSTATUS_FAILED;
				}
				//�����
		    	if(MsgXmlDom.getElementValue(domReq, "Amount") == null || MsgXmlDom.getElementValue(domReq, "Amount").equals("") || MsgXmlDom.getElementValue(domReq, "Amount").equals("0")){
		    		BigDecimal amt = new BigDecimal("0"); //�ѽ��׽��ת����BigDecimal��
		    		entity.setDamount(amt);
				}else{
					String strAmount = MsgXmlDom.getElementValue(domReq, "Amount");
					strAmount = new DataConversion().fromFenToYuan(strAmount);//��ת��ΪԪ
					BigDecimal amt = new BigDecimal(strAmount); //�ѽ��׽��ת����BigDecimal��
					entity.setDamount(amt);
				}
		    	if(MsgXmlDom.getElementValue(domReq, "fee") == null || MsgXmlDom.getElementValue(domReq, "fee").equals("") || MsgXmlDom.getElementValue(domReq, "fee").equals("0") ){
		    		BigDecimal amt = new BigDecimal("0"); //�ѽ��׽��ת����BigDecimal��
		    		entity.setDfee(amt);
				}else{
					String strFee = MsgXmlDom.getElementValue(domReq, "fee");
					strFee = new DataConversion().fromFenToYuan(strFee);//��ת��ΪԪ
					BigDecimal amt = new BigDecimal(strFee); //�ѽ��׽��ת����BigDecimal��
					entity.setDfee(amt);
				}
		    	String strTransCode = MsgXmlDom.getElementValue(domReq, "strTransCode");
		    	entity.setTransCode(strTransCode);
		    	//����
		    	entity.setItermTransStatus(5);
		    	entity.setStrSingleBusinessNum(MsgXmlDom.getElementValue(domReq, "strTransRandom"));
				entity.setIsettleCycle(termBatchNo);
				entity.setIhostTransStatus(hostTransStatus);
				entity.setIsettleCycleStatus(0);
		    	entity.setStrHostRetCode(response.RepMap.get("F39"));
		    	//ԭ������ˮ��
		    	String strOldOrgTsns = "";
				if(MsgXmlDom.getElementValue(domReq, "strTransCode").equals("909006")
				   ||MsgXmlDom.getElementValue(domReq, "strTransCode").equals("909015")){
					strOldOrgTsns = MsgXmlDom.getElementValue(domReq, "strOrgTsn");
				}else{
					strOldOrgTsns = MsgXmlDom.getElementValue(domReq, "strOldOrgTsns");
				}
				String strOldTransCode ="";
				if(MsgXmlDom.getElementValue(domReq, "strTransCode").equals("909009")){
					strOldTransCode ="909008";
				}else if(MsgXmlDom.getElementValue(domReq, "strTransCode").equals("909015")){
					strOldTransCode ="909020";
				}else{
					strOldTransCode ="909005";
				}
		    	//�жϴ��ȷ�Ͻ����Ƿ���37�򷵻�
		    	if(response.RepMap.get("F37") !=null && !response.RepMap.get("F37").equals(""))
		    	{
		    		entity.setStrHostTsn(response.RepMap.get("F37"));
		    	}else{
		    		//���׳ɹ�ʱ���ʹ��ȷ�ϣ�P�˲��᷵��F37
		    		TransLogDeposit strOldTransLog = strTransLogDepositDB.getOldTransLog(strOldOrgTsns,strOldTransCode);
		    		if(strOldTransLog !=null && !strOldTransLog.equals("")){
		    			entity.setStrHostTsn(strOldTransLog.getStrHostTsn());
		    		}else{
		    			entity.setStrHostTsn("");
		    		}
		    	}
		    	entity.setStrTerminalNum(terminalId);
		    	entity.setDtOccur(new DateCtrl().getStrToTimestamp(dataFormat()));
		    	if(MsgXmlDom.getElementValue(domReq, "strTransCode").equals("909009")){
		    		entity.setStrPan("�浥�ֽ��ֵȷ��");
		    	}else if(MsgXmlDom.getElementValue(domReq, "strTransCode").equals("909015")){
		    		entity.setStrPan(MsgXmlDom.getElementValue(domReq, "strAccount"));
		    	}else if(MsgXmlDom.getElementValue(domReq, "strTransCode").equals("909005")){
		    		if(MsgXmlDom.getElementValue(domReq, "strPan")!=null && !MsgXmlDom.getElementValue(domReq, "strPan").equals("")){
		    			entity.setStrPan(MsgXmlDom.getElementValue(domReq, "strPan"));	
		    		}else{
		    			entity.setStrPan(MsgXmlDom.getElementValue(domReq, "strAccount"));
		    		}
		    	}
		    	else{
		    		entity.setStrPan(MsgXmlDom.getElementValue(domReq, "strPan"));
		    	}
		    	entity.setStrTermSerialNo(strTerminalTsn);
		    	//�����ֶ�
		    	entity.setStrExInfo1(MsgXmlDom.getElementValue(domReq, "strExInfo1"));
		    	entity.setStrExInfo2(MsgXmlDom.getElementValue(domReq, "strExInfo2"));
		    	entity.setStrExInfo3(MsgXmlDom.getElementValue(domReq, "strExInfo3"));
		    	entity.setStrExInfo4(MsgXmlDom.getElementValue(domReq, "strExInfo4"));
		    	entity.setStrExInfo5(MsgXmlDom.getElementValue(domReq, "strExInfo5"));
		    	strTransLogDepositDB.sava(entity);
				//����P�˷��ص�ȷ�Ͻ�����������ݿ��д���
				if (TERMRETCODE_SUCCEED.equals(strTermRetCode))
				{
					TransLogDeposit strOldTransLog = strTransLogDepositDB.getOldTransLog(strOldOrgTsns,strOldTransCode);
					if(strOldTransLog != null && !strOldTransLog.equals("")){
						if(!strOldTransLog.getStrHostRetCode().equals("0000")){
							//����ԭ������Ϣ
							strOldTransLog.setIhostTransStatus(HTSTATUS_OK);
							strTransLogDepositDB.updateOldDepositTrans(strOldTransLog);
						}
					}
				}
			}else if(MsgXmlDom.getElementValue(domReq, "strTransCode").equals("909010")//�ڲ���ȡ��
					|| MsgXmlDom.getElementValue(domReq, "strTransCode").equals("909002")//����ȡ��
					|| MsgXmlDom.getElementValue(domReq, "strTransCode").equals("909119")//��Ա�ֽ�ȡ��
					|| MsgXmlDom.getElementValue(domReq, "strTransCode").equals("909017")){//�Թ�ȡ��
				TransLogWithdrawal entity = new TransLogWithdrawal();
				String terminalId = MsgXmlDom.getElementValue(domReq, "strTerminalNum");
				//�Ȼ�ȡ��ǰ���׵����κ�
				termBatchNo = new SettleCycleLogDB().getSettleCycle(terminalId);
				String strTermRetCode = MsgXmlDom.getElementValue(domResp, "TermRetCode");
				int hostTransStatus;
				if (TERMRETCODE_SUCCEED.equals(strTermRetCode))
				{
					hostTransStatus = HTSTATUS_OK;
				}
				else if (TERMRETCODE_COMMUNC.equals(strTermRetCode))
				{
					hostTransStatus = HTSTATUS_UNCER;
				}
				else
				{
					hostTransStatus = HTSTATUS_FAILED;
				}
				//ȡ����
		    	if(MsgXmlDom.getElementValue(domReq, "Amount") == null || MsgXmlDom.getElementValue(domReq, "Amount").equals("") || MsgXmlDom.getElementValue(domReq, "Amount").equals("0")){
		    		BigDecimal amt = new BigDecimal("0"); //�ѽ��׽��ת����BigDecimal��
		    		entity.setDamount(amt);
				}else{
					String strAmount = MsgXmlDom.getElementValue(domReq, "Amount");
					strAmount = new DataConversion().fromFenToYuan(strAmount);//��ת��ΪԪ
					BigDecimal amt = new BigDecimal(strAmount); //�ѽ��׽��ת����BigDecimal��
					entity.setDamount(amt);
				}
		    	if(MsgXmlDom.getElementValue(domReq, "fee") == null || MsgXmlDom.getElementValue(domReq, "fee").equals("") || MsgXmlDom.getElementValue(domReq, "fee").equals("0") ){
		    		BigDecimal amt = new BigDecimal("0"); //�ѽ��׽��ת����BigDecimal��
		    		entity.setDfee(amt);
				}else{
					String strFee = MsgXmlDom.getElementValue(domReq, "fee");
					strFee = new DataConversion().fromFenToYuan(strFee);//��ת��ΪԪ
					BigDecimal amt = new BigDecimal(strFee); //�ѽ��׽��ת����BigDecimal��
					entity.setDfee(amt);
				}
		    	String strTransCode = MsgXmlDom.getElementValue(domReq, "strTransCode");
		    	entity.setTransCode(strTransCode);
		    	if(strTransCode.equals("909002"))
		    	{
		    		if(MsgXmlDom.getElementValue(domReq, "strPan")!=null && !MsgXmlDom.getElementValue(domReq, "strPan").equals("")){
		    			entity.setStrPan(MsgXmlDom.getElementValue(domReq, "strPan"));	
		    		}else{
		    			entity.setStrPan(MsgXmlDom.getElementValue(domReq, "strDestPan"));
		    		}
		    	}else if(strTransCode.equals("909119")){
		    		entity.setStrPan("��Ա�ֽ�ȡ��");
		    	}else if(strTransCode.equals("909017")){
		    		entity.setStrPan(MsgXmlDom.getElementValue(domReq, "strDestPan"));
		    	}else{
		    		entity.setStrPan("�浥�ֽ�֧ȡ");
		    	}
		    	entity.setItermTransStatus(0);
		    	entity.setStrSingleBusinessNum(MsgXmlDom.getElementValue(domReq, "strTransRandom"));
				entity.setIsettleCycle(termBatchNo);
				entity.setIhostTransStatus(hostTransStatus);
				entity.setIsettleCycleStatus(0);
		    	entity.setStrHostRetCode(response.RepMap.get("F39"));
		    	entity.setStrHostTsn(response.RepMap.get("F37"));
		    	entity.setStrTerminalNum(terminalId);
		    	entity.setDtOccur(new DateCtrl().getStrToTimestamp(dataFormat()));
		    	entity.setStrTermSerialNo(strTerminalTsn);
		    	entity.setiReverSeenTryStatus(0);
		    	//�����ֶ�
		    	entity.setStrExInfo1(MsgXmlDom.getElementValue(domReq, "strExInfo1"));
		    	entity.setStrExInfo2(MsgXmlDom.getElementValue(domReq, "strBatchId"));//��¼��Ӧ�ϴ�Ӱ��ƽ̨��������ˮ
		    	if(strTransCode.equals("909017"))
		    	{
		    		entity.setStrExInfo3(MsgXmlDom.getElementValue(domReq, "strDrawId"));
		    	}else{
		    		entity.setStrExInfo3(MsgXmlDom.getElementValue(domReq, "strExInfo3"));
		    	}
		    	entity.setStrExInfo4(MsgXmlDom.getElementValue(domReq, "strExInfo4"));
		    	entity.setStrExInfo5(MsgXmlDom.getElementValue(domReq, "strExInfo5"));
		    	new TransLogWithdrawalDB().sava(entity);
			}
			else{//��������
				termBatchNo = 1;
				OtherTransLog entity = new OtherTransLog();
		    	String strTermRetCode = MsgXmlDom.getElementValue(domResp, "TermRetCode");
				int hostTransStatus;
				if (TERMRETCODE_SUCCEED.equals(strTermRetCode))
				{
					hostTransStatus = HTSTATUS_OK;
				}
				else if (TERMRETCODE_COMMUNC.equals(strTermRetCode))
				{
					hostTransStatus = HTSTATUS_UNCER;
				}
				else
				{
					hostTransStatus = HTSTATUS_FAILED;
				}
		    	entity.setStrTerminalNum(MsgXmlDom.getElementValue(domReq, "strTerminalNum"));
		    	entity.setTransCode(MsgXmlDom.getElementValue(domReq, "strTransCode"));
		    	entity.setDtOccur(new DateCtrl().getStrToTimestamp(dataFormat()));
		    	entity.setStrPan(MsgXmlDom.getElementValue(domReq, "strPan"));
		    	entity.setStrDestPan(MsgXmlDom.getElementValue(domReq, "strDestPan"));
		    	if(MsgXmlDom.getElementValue(domReq, "Amount") == null || MsgXmlDom.getElementValue(domReq, "Amount").equals("") || MsgXmlDom.getElementValue(domReq, "Amount").equals("0")){
		    		BigDecimal amt = new BigDecimal("0"); //�ѽ��׽��ת����BigDecimal��
		    		entity.setAmt(amt);
				}else{
					String strAmount = MsgXmlDom.getElementValue(domReq, "Amount");
					//���ҵ��(906301/906302/906406)����ԪΪ��λ�ģ������и�ʽת��:
					if( MsgXmlDom.getElementValue(domReq, "strTransCode").equals("906301") ||
					    MsgXmlDom.getElementValue(domReq, "strTransCode").equals("906302") ||
						MsgXmlDom.getElementValue(domReq, "strTransCode").equals("906406")){
						BigDecimal amt = new BigDecimal(strAmount); //�ѽ��׽��ת����BigDecimal��
						entity.setAmt(amt);
					}else{
						strAmount = new DataConversion().fromFenToYuan(strAmount);//��ת��ΪԪ
						BigDecimal amt = new BigDecimal(strAmount); //�ѽ��׽��ת����BigDecimal��
						entity.setAmt(amt);
					}
				}
		    	if(MsgXmlDom.getElementValue(domReq, "fee") == null || MsgXmlDom.getElementValue(domReq, "fee").equals("") || MsgXmlDom.getElementValue(domReq, "fee").equals("0") ){
		    		BigDecimal amt = new BigDecimal("0"); //�ѽ��׽��ת����BigDecimal��
		    		entity.setFee(amt);
				}else{
					String strFee = MsgXmlDom.getElementValue(domReq, "fee");
					strFee = new DataConversion().fromFenToYuan(strFee);//��ת��ΪԪ
					BigDecimal amt = new BigDecimal(strFee); //�ѽ��׽��ת����BigDecimal��
					entity.setFee(amt);
				}
		    	if(MsgXmlDom.getElementValue(domReq, "currency") == null || MsgXmlDom.getElementValue(domReq, "currency").equals("")){
		    		entity.setCurrency("CNY");
				}else{
					entity.setCurrency(MsgXmlDom.getElementValue(domReq, "currency") );
				}
		    	entity.setStrIDCardNum(new Base64().encode(MsgXmlDom.getElementValue(domReq, "strIDCardNum").getBytes()));
		    	entity.setStrCardType(strCardType);
		    	entity.setHostTxStatus(hostTransStatus);
		    	entity.setStrHostRetCode(response.RepMap.get("F39"));
		    	entity.setStrHostSerialNo(response.RepMap.get("F37"));
		    	entity.setDtHostOccur(new DateCtrl().getStrToTimestamp(dataFormat()));
		    	entity.setTermBatchNo(1);//Ĭ��Ϊ1
		    	entity.setReverseStatus(RESTATUS_NEEDLESS);//����״̬
		    	entity.setStrTermSerialNo(strTerminalTsn);
		    	entity.setCheckFlag(0);//0��Ҫ���ˣ�1����Ҫ����
		    	entity.setStrOrigstrTxSerialNo(MsgXmlDom.getElementValue(domReq, "strOrigstrTxSerialNo"));
		    	entity.setStrSingleBusinessNum(MsgXmlDom.getElementValue(domReq, "strSingleBusinessNum"));
		    	entity.setStrExInfo2(MsgXmlDom.getElementValue(domReq, "strBatchId"));//��¼��Ӧ�ϴ�Ӱ��ƽ̨��������ˮ
		    	new OtherTransLogDB().save(entity);
		    	transLogId = entity.getId();
			}
		}
	}

	/**
	 * �ѽ�����Ϣ������ط�����
	*/
	protected void notifyxViewProxy()
	{
		String strTermRetCode = MsgXmlDom.getElementValue(domResp, "TermRetCode");
		String strHostTransStatus,strLocalRet;
		if (TERMRETCODE_SUCCEED.equals(strTermRetCode))
		{
			strHostTransStatus = String.valueOf(HTSTATUS_OK);
			strLocalRet ="OK";
		}
		else if (TERMRETCODE_COMMUNC.equals(strTermRetCode))
		{
			strHostTransStatus = String.valueOf(HTSTATUS_UNCER);
			strLocalRet ="FAILED";
		}
		else
		{
			strHostTransStatus = String.valueOf(HTSTATUS_FAILED);
			strLocalRet ="FAILED";
		}
		ColsTransMsg msg = new ColsTransMsg();
		msg.put("strTransCode", MsgXmlDom.getElementValue(domReq, "strTransCode"));
		msg.put("strTerminalNum", MsgXmlDom.getElementValue(domReq, "strTerminalNum"));
		msg.put("strTerminalTsn", strTerminalTsn);
		if(MsgXmlDom.getElementValue(domReq, "strPan") != null && !MsgXmlDom.getElementValue(domReq, "strPan").equals("")){
			msg.put("CardType", strCardType);
		}
		else{
			msg.put("CardType", "");
		}
		
		//�Թ����
		if(MsgXmlDom.getElementValue(domReq, "strTransCode").equals("909020")){
			msg.put("strPan", MsgXmlDom.getElementValue(domReq, "strAccount"));	
		}else if(MsgXmlDom.getElementValue(domReq, "strTransCode").equals("909005")){
			//���˴��
			if(MsgXmlDom.getElementValue(domReq, "strPan")!=null && !MsgXmlDom.getElementValue(domReq, "strPan").equals("")){
				msg.put("strPan", MsgXmlDom.getElementValue(domReq, "strPan"));
			}else{
				msg.put("strPan", MsgXmlDom.getElementValue(domReq, "strAccount"));
			}
		}else if(MsgXmlDom.getElementValue(domReq, "strTransCode").equals("909002")){
			//����ȡ��
			if(MsgXmlDom.getElementValue(domReq, "strPan")!=null && !MsgXmlDom.getElementValue(domReq, "strPan").equals("")){
				msg.put("strPan", MsgXmlDom.getElementValue(domReq, "strPan"));
			 }else{
				msg.put("strPan", MsgXmlDom.getElementValue(domReq, "strDestPan"));
		    }
		}else if(MsgXmlDom.getElementValue(domReq, "strTransCode").equals("909017")){
			   //�Թ�ȡ��
			    msg.put("strPan", MsgXmlDom.getElementValue(domReq, "strDestPan"));
		}else{
			 msg.put("strPan", MsgXmlDom.getElementValue(domReq, "strPan"));
		}
		msg.put("strDestPan", MsgXmlDom.getElementValue(domReq, "strDestPan"));
		if(MsgXmlDom.getElementValue(domReq, "Amount") == null || MsgXmlDom.getElementValue(domReq, "Amount").equals("") || MsgXmlDom.getElementValue(domReq, "Amount").equals("0")){
			msg.put("Amount", "0.00");
		}else{
			String strAmount = MsgXmlDom.getElementValue(domReq, "Amount");
			//���ҵ��(906301/906302/906406)����ԪΪ��λ�ģ������и�ʽת��:
			if( MsgXmlDom.getElementValue(domReq, "strTransCode").equals("906301") ||
				MsgXmlDom.getElementValue(domReq, "strTransCode").equals("906302") ||
				MsgXmlDom.getElementValue(domReq, "strTransCode").equals("906406"))
			{
				msg.put("Amount",strAmount);
			}else{
				try{
					strAmount = new DataConversion().fromFenToYuan(strAmount);//��ת��ΪԪ
				}catch(Exception e) {
					strAmount = "0.00";
				}
				msg.put("Amount",strAmount);
			}
		}
		msg.put("DateTime", String.valueOf(System.currentTimeMillis()));
		msg.put("TransDate", dtCur.getTransDateToView());
		msg.put("strHostRet", MsgXmlDom.getElementValue(domResp, "TermRetCode"));
		msg.put("strLocalRet", strLocalRet);
		msg.put("strHostTransStatus", strHostTransStatus);
		if(MsgXmlDom.getElementValue(domReq, "fee") == null || MsgXmlDom.getElementValue(domReq, "fee").equals("") || MsgXmlDom.getElementValue(domReq, "fee").equals("0")){
			msg.put("fee", "0.00");
		}else{
			String strFee = MsgXmlDom.getElementValue(domReq, "fee");
			strFee = new DataConversion().fromFenToYuan(strFee);//��ת��ΪԪ
			msg.put("fee", strFee);
		}
		msg.put("CostTime", "0");
		msg.put("iHostTxStatus", strHostTransStatus);
		msg.put("strHostSerialNo", response.RepMap.get("F37"));
		msg.put("iTermBatchNo", String.valueOf(termBatchNo));
		msg.put("iTermTxStatus", strHostTransStatus);
		msg.put("strOrigstrTxSerialNo", MsgXmlDom.getElementValue(domResp, "orgTsn"));
		if(MsgXmlDom.getElementValue(domReq, "dtHostOccur") == null || MsgXmlDom.getElementValue(domReq, "dtHostOccur").equals("")){
			msg.put("dtHostOccur", dtCur.getDateTimeStrSimpleFull());
		}else{
			msg.put("dtHostOccur", MsgXmlDom.getElementValue(domReq, "dtHostOccur"));
		}
		//����ط��������ͽ�����ˮ
		if(MsgXmlDom.getElementValue(domReq, "strTransCode") != null && !MsgXmlDom.getElementValue(domReq, "strTransCode").equals("")){
			//PAD��˽����ѯ��PAD���������ѯ�����ͼ��
			//���� ��Աǩ��״̬��ѯ�����ͼ��
			if(!MsgXmlDom.getElementValue(domReq, "strTransCode").equals("910305")
				&& !MsgXmlDom.getElementValue(domReq, "strTransCode").equals("910303")
				&& !MsgXmlDom.getElementValue(domReq, "strTransCode").equals("911205")
				&& !MsgXmlDom.getElementValue(domReq, "strTransCode").equals("912104")//�кŲ�ѯ
				&& !MsgXmlDom.getElementValue(domReq, "strTransCode").equals("912107")//�к��غ�
				){
				if(MsgXmlDom.getElementValue(domReq, "strTransCode").equals("909014")){
					//������Ϣ����
					String sendMessage = MsgXmlDom.getElementValue(domReq, "strCashBoxData");
					String strTerminalNum = MsgXmlDom.getElementValue(domReq, "strTerminalNum");
					new LinxViewProxy().sendCashBoxUnitStatus("<F60>"+sendMessage+"</F60>",strTerminalNum);
				}else{
					new LinxViewProxy().sendTransMsg(msg.toString());
				}
			}
		}
	}

	/**
	 * ʱ��ת��
	 * @return
	 */
	public String dataFormat(){
		if(map.get("strTransDate") != null && map.get("strTransDate").length() >=8 && map.get("strTransTime") != null && map.get("strTransTime").length() >=6 ){
			return map.get("strTransDate").substring(0, 4)+"-"+map.get("strTransDate").substring(4, 6)+"-"+map.get("strTransDate").substring(6, 8)+" "+map.get("strTransTime").substring(0, 2)+":"+map.get("strTransTime").substring(2, 4)+":"+map.get("strTransTime").substring(4, 6);
		}
		else{
			return new DateCtrl().getDateTimeStrSimpleFull();
		}
	}
}
