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

	// int型变量初始值
	public static int INT_DEFAULT = -1;
    public static int PROCESS_SUCCEED = 0; // 成功
    public static int PROCESS_FAILED = 1; // 失败
    public static int PROCESS_UNCERTAIN = 2; // 不确定
    public static int PROCESS_CANCLE = 3; // 取消交易

	// 预定义报文节点名称
    public static String XMLNODENAME_TERMRETCODE = "TermRetCode";
    public static String XMLNODENAME_TERMRETDESC = "TermRetDesc";
    public static String XMLNODENAME_TERMRETDESCEN = "TermRetDescEn";
    public static String XMLNODENAME_PROCESSORNAME = "ProcessorName";
    public static String XMLNODENAME_SERVERDATETIME = "ServerDataTime";

	// 终端返回码及其描述
    public static String TERMRETCODE_SUCCEED = "0000";
    public static String TERMRETDESC_SUCCEED = "交易成功";
    public static String TERMRETDESCEN_SUCCEED = "Succeed";

    public static String TERMRETCODE_COMMERR = "0001";
    public static String TERMRETDESC_COMMERR = "通讯故障";
    public static String TERMRETDESCEN_COMMERR = "Comm error";

    public static String TERMRETCODE_COMMUNC = "0002";
    public static String TERMRETDESC_COMMUNC = "主机通讯异常，交易失败";
    public static String TERMRETDESCEN_COMMUNC = "Comm uncertain";

    public static String TERMRETCODE_INVALIDTERM = "0003";
    public static String TERMRETDESC_INVALIDTERM = "非法终端";
    public static String TERMRETDESCEN_INVALIDTERM = "Invalid term";

    public static String TERMRETCODE_TSFRPINBLKERR = "0004";
    public static String TERMRETDESC_TSFRPINBLKERR = "无效交易，转换PinBlock失败";
    public static String TERMRETDESCEN_TSFRPINBLKERR = "Transfer pin failed";

    public static String TERMRETCODE_INVALIDREQUEST = "0005";
    public static String TERMRETDESC_INVALIDREQUEST = "无效的交易请求";
    public static String TERMRETDESCEN_INVALIDREQUEST = "Invalid request";

    public static String TERMRETCODE_MACERR = "0006";
    public static String TERMRETDESC_MACERR = "无效交易，MAC校验错";
    public static String TERMRETDESCEN_MACERR = "Mac error";

    public static String TERMRETCODE_ADDCARD = "0009";
	public static String TERMRETDESC_ADDCARD = "加卡失败";
	public static String TERMRETDESCEN_ADDCARD = "Add Card Error";

    public static String TERMRETDESC_INVALIDCARD = "无效卡。";
    public static String TERMRETDESCEN_INVALIDCARD = "Invalid card.";

    public static String TERMRETCODE_TOOBUSY = "9998";
    public static String TERMRETDESC_TOOBUSY = "服务器忙";
    public static String TERMRETDESCEN_TOOBUSY = "Server busy";

    public static String TERMRETCODE_INNERR = "9999";
    public static String TERMRETDESC_INNERR = "内部错误";
    public static String TERMRETDESCEN_INNERR = "System error";

    // 主机交易状态（HostTransStatus）
    public static int HTSTATUS_OK = 0;
    public static int HTSTATUS_FAILED = 1;
    public static int HTSTATUS_UNCER = 2;

    //冲正状态:未冲正
    public static int RESTATUS_NEEDLESS = 0;
    //冲正状态:成功
    public static int RESTATUS_OK = 1;
    //冲正状态:失败
    public static int RESTATUS_FAILED = 2;
    //冲正状态:结果不确定
    public static int RESTATUS_UNCER = 3;

	//终端流水号
	protected String strTerminalTsn = "";

	//流水表id
	private int transLogId;

    // 当前服务处理日期时间
    protected DateCtrl dtCur = null;

    // 终端实体对象
    protected Terminal terminal = null;

    //是否记录交易流水标识
    protected String transLogFlag = "false";

    // 卡类型
    protected String strCardType = "";

    //批次号
    private int termBatchNo =0;

    // 安全工具实例
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
	 * 根据指定的返回值，得到简单回应报文内容。一般用于服务未成功的回应。
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
		//测试使用
//		String strTransOffLine = new MiscDB().get("00001", "TransOffLine", "true");
//		if(strTransOffLine != null && !strTransOffLine.equals("") && strTransOffLine.equals("true")){
//		    // 设置成功信息
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
		if(!validateMac()){//验证MAC
			error.error("MAC交易失败:"+strReq+"\r\n");
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
			// 若有异常抛出，则返回不确定
			setSimpleRespDom(TERMRETCODE_COMMUNC, TERMRETDESC_COMMUNC,TERMRETDESCEN_COMMUNC);
        	java.io.StringWriter sw = new java.io.StringWriter(1024 * 4);
        	e.printStackTrace(new java.io.PrintWriter(sw));
			error.error("发送交易请求失败:"+sw+"\r\n");
		}
		decreaseRunningThreadCount();
	}

	/**
	 * 服务处理
	*/
	protected void process() throws ProcessorException
	{
		try
		{
	    	//第一步 分解交易请求信息
	    	analyzeRequest(domReq);
	    	//第二步 根据交易码取出交易配置文件
	        String strPathXML = pathXML();
	        //第三步 根据交易配置文件组装请求报文
	        String strRequestMsg = organizeInfo(strPathXML,"request");//组装请求报文
	        try
			{
				// 第四步：与主机交互进行交易处理
	        	SendAndGet(strRequestMsg);
		    	//返回C端前处理:关键域校验
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
				error.error("发送交易请求失败:"+sw+"\r\n");
	            // 若有未处理的异常抛出，则返回不确定
	            setSimpleRespDom(TERMRETCODE_COMMUNC, TERMRETDESC_COMMUNC,TERMRETDESCEN_COMMUNC);
			}
			finally
			{
				//防止是验卡交易，所以在这边立即把卡类型取出来
	        	strCardType = MsgXmlDom.getElementValue(domReq,"strCardType");//如果卡号不为空的话，表示发送报文中包含卡类型,为空的话，先从F24中取，取不到的话，就表示无卡类型
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
				// 第四步：记录交易流水
				append2TransLog();
			}
		}
		catch (Exception e)
		{
	        java.io.StringWriter sw = new java.io.StringWriter(1024 * 4);
	        e.printStackTrace(new java.io.PrintWriter(sw));
			error.error("发送交易请求失败:"+sw+"\r\n");
	        // 若有未处理的异常抛出，则返回不确定
	        setSimpleRespDom(TERMRETCODE_COMMUNC, TERMRETDESC_COMMUNC,TERMRETDESCEN_COMMUNC);
		}
		finally
		{
			// 把交易信息发往监控
			notifyxViewProxy();
		}
	}

    //分解交易请求信息
    public void analyzeRequest(org.jdom.Document domReq)
    {
    	map = new HashMap<String, String>();
    	org.jdom.Element root = domReq.getRootElement();
    	List<?> list=root.getChildren();//解析所有的节点元素
        for(int i=0;i<list.size();i++)
        {
        	org.jdom.Element element=(org.jdom.Element)list.get(i);//依此遍历所有的disk节点
        	String key=element.getName();
        	String value=element.getText();
        	if(key.equals("strEncrypType")){//判断密钥方式
                if(value.equals("SM4")){//国密算法
                	map.put(key, "04");
                }else{                  //国际算法
                	map.put(key, "06");
                }
        	}else{
        	   map.put(key, value);
        	}
        }
        //统一增加受卡方所在地时间 、受卡方所在地日期数据、系统跟踪号
        map.put("strTerminalTsn", strTerminalTsn);//系统跟踪号
        map.put("strTransTime", dtCur.getDateTimeToView());//受卡方所在地时间 hhmmss
        map.put("strTransDate", dtCur.getTransDateToView());//受卡方所在地日期数据yyyyMMdd
        //柜员密码登记处理 软加密密码
        if(map.get("strTransCode") != null && !map.get("strTransCode").equals("")
        		&& map.get("strTransCode").equals("910208")){
        	String strTellerPwd = map.get("strTellerPwd");
			try {
				strTellerPwd = new AgreeDesTool().desEncrypt(strTellerPwd);
			} catch (Exception e) {
				error.error("加密柜员密码出错:"+e);
			}
        	map.put("strTellerPwd",strTellerPwd);
        }
    }

    //获取交易配置文件
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
  	public String organizeInfo(String filePath,String transType) throws UnsupportedEncodingException
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
  					boolean strFingerValue = false;//指纹数据是否进行转义
  					org.dom4j.Element element=(org.dom4j.Element)list.get(i);
  					strName=((org.dom4j.Element) element.selectSingleNode("id")).getTextTrim(); //唯一标识
  					String strSource=((org.dom4j.Element) element.selectSingleNode("strSource")).getTextTrim(); //取值方式
  	                if(strSource != null && strSource.equals("$"))//从平台中取
  	                {
  	                	String strDestKey=((org.dom4j.Element) element.selectSingleNode("strDestKey")).getTextTrim(); //平台取值字段名称
  	                	//指纹数据中包含特殊字符
  	                	if(strDestKey !=null && !strDestKey.equals("") && strDestKey.equals("strFeatureData")){
  	                		strFingerValue = true;
  	                	}
  	                	strValue = map.get(strDestKey);
  	                }
  	                else if (strSource != null && strSource.equals("$$"))//取默认值
  	                {
  	                	strValue=((org.dom4j.Element) element.selectSingleNode("strDefaultValue")).getTextTrim(); //默认值
  	                }
  	                if(strName != null && strName.equals("F999")){//判断该交易是否记录交易流水
  	                	transLogFlag = strValue;
  	                }
					//影像图片路径中包含特殊字符
  	                if((strName.equals("idPhotoUrl") || strName.equals("idPhotoBackUrl") || strName.equals("scenePhotoUrl") || strName.equals("verificationPhoteUrl") || strName.equals("content")
  	                		|| strName.equals("selfSignPhotoUrl") || strName.equals("socialSecurityPhotoUrl") || (strName.equals("F48") && strFingerValue))  && strValue!=null && !strValue.equals("")){
  	                	priMap.put(strName, new XmlTextConstructor().encodeXml(new String(new Base64().decode(strValue),"UTF-8")));
  	                }else{
  	                	priMap.put(strName, strValue);
  	                }
  				}
  		        try {
  		        	requestMessage.appendContentPrimary(priMap);
  		        	//info.info("请求报文:"+"\r\n"+requestMessage.getRequestText());
  		        	JournalThread.getInstance().appendInfoLog((String)map.get("strTerminalNum"), "请求报文:"+"\r\n" + requestMessage.getRequestText());
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
    * 关键域校验
    * @param  校验关键域：流水号、终端号、交易码、卡号
    * @throws ProcessorException
    */
   private void transReturnCheck(String strCheck,String strRequestMsg) throws ProcessorException
   {
     String strTermRetCode = MsgXmlDom.getElementValue(domResp, "TermRetCode");
     //校验关键域
     if (TERMRETCODE_SUCCEED.equals(strTermRetCode))
     {
	      //校验域数据
	      String strCheckData[] = strCheck.split(",");
	      for(int i=0;i<strCheckData.length;i++){
	    	  Document reqDataDoc = XmlHelper.parseStr2Dom(strRequestMsg);
	  		  String strFieldReq = XmlHelper.getSingleNodeValue(reqDataDoc, "its/"+strCheckData[i], "");//报文类型标识符
	    	  String  strFieldResp = MsgXmlDom.getElementValue(this.domResp, strCheckData[i]);
	    	  if(strFieldResp !=null && !strFieldResp.equals("")){
	    		  if(!strFieldReq.trim().equals(strFieldResp.trim())){
		    		  setSimpleRespDom("9999", "响应报文域"+strCheckData[i]+"对应性校验错","Response Field check error!!");
		    		  return;
	    		  }
	    	  }else{
	    		  setSimpleRespDom("9999", "响应报文域"+strCheckData[i]+"关键域缺失","Response Field error!!");
	    		  return;
	    	  }
	      }
     }
   }

   /**
    * 与主机进行通讯
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
    * 发送并接受报文
   */
   public void SendAndGet(String strRequestMsg) throws ProcessorException
   {
	   int iRet=1;//交易结果
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
       		   if(hostRetCode == null ){//没有的时候。新增
       			   HostRetCode bean = new HostRetCode();
       			   bean.setStrHostRetCode(response.retCode);
       			   bean.setStrHostRetDesc(response.retCodeMessage);
       			   new HostRetCodeDB().save(bean);
       			   //把返回码信息发送给监控
       		       ColsTransMsg msg = new ColsTransMsg();
       		       msg.put("id", String.valueOf(bean.getId()));
       		       msg.put("strHostRetCode", response.retCode);
       		       msg.put("strHostRetDesc", response.retCodeMessage);
       		       new LinxViewProxy().sendHostRetCodeMsg(msg.toString());
       		   }
       		   else{//有的时候。修改一下，防止两边不统一
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
       // 设置成功信息
	   setSucceedRespDom();
		//把返回值全部存在Dom对象中
		//页面取值采用top.exchxmlasync.msgxmldomResp.getElementValue("F7")这种方式即可
       if(response.RepMap !=null && response.RepMap.size() > 0 ){
       Iterator<Map.Entry<String, String>> entries = response.RepMap.entrySet().iterator();
       while (entries.hasNext()) {
    	       Map.Entry<String, String> entry = entries.next();
    	       MsgXmlDom.setElementValue(domResp, entry.getKey(),entry.getValue());
    	   }
       }
   }

    /**
	 * 获取16位终端流水号:8位终端编号 + 8位终端流水号
	*/
	public String getTerminalTsn()
	{
		String strtm = "" + new Date().getTime();
		String str = MsgXmlDom.getElementValue(domReq, "strTerminalNum") + strtm.substring(strtm.length() - 8, strtm.length());
		return str;
	}

	/**
	 * 验证请求的Mac
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
            if(strEncrypType != null && strEncrypType.equals("SM4")){//走国密流程
            	return theSecurityHelper.validateMacSM4(strMacValue, strData2ValidateMac,strTerminalNum);
            }else{//其他都走DES流程
            	return theSecurityHelper.validateMacDes(strMacValue, strData2ValidateMac,strTerminalNum);
            }
        } catch (Exception e) {
            return bRet;
        }
	}

	/**
	 * 记录交易流水
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
			   (MsgXmlDom.getElementValue(domReq, "strTransCode").equals("901401") && MsgXmlDom.getElementValue(domReq, "strCardProduct").equals("1"))){//开卡,补卡，换卡交易
				//先获取当前交易的批次号
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
		    	entity.setTermTxStatus(0);//默认为0，未动作
		    	entity.setHostTxStatus(hostTransStatus);
		    	entity.setStrHostRetCode(response.RepMap.get("F39"));
		    	entity.setStrHostSerialNo(response.RepMap.get("F37"));
		    	entity.setDtHostOccur(new DateCtrl().getStrToTimestamp(dataFormat()));
		    	entity.setTermBatchNo(termBatchNo);
		    	entity.setSettleCycleStatus(0);//清机状态   0：未清机 1：已清机
		    	entity.setStrTermSerialNo(strTerminalTsn);
		    	entity.setStrOrigstrTxSerialNo(MsgXmlDom.getElementValue(domReq, "strOrigstrTxSerialNo"));
		    	entity.setStrSingleBusinessNum(MsgXmlDom.getElementValue(domReq, "strSingleBusinessNum"));
		    	entity.setStrExInfo2(MsgXmlDom.getElementValue(domReq, "strBatchId"));//记录对应上传影像平台的批次流水
		    	new CardTransLogDB().save(entity);
		    	transLogId = entity.getId();
		    	MsgXmlDom.setElementValue(domResp, "transLogId", String.valueOf(transLogId));
			}
			else if(MsgXmlDom.getElementValue(domReq, "strTransCode").equals("908201")){//UKey交易
				//先获取当前交易的批次号
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
		    	entity.setTermTxStatus(0);//默认为0，未动作
		    	entity.setHostTxStatus(hostTransStatus);
		    	entity.setStrHostRetCode(response.RepMap.get("F39"));
		    	entity.setStrHostSerialNo(response.RepMap.get("F37"));
		    	entity.setDtHostOccur(new DateCtrl().getStrToTimestamp(dataFormat()));
		    	entity.setTermBatchNo(termBatchNo);
		    	entity.setSettleCycleStatus(0);//清机状态   0：未清机 1：已清机
		    	entity.setStrTermSerialNo(strTerminalTsn);
		    	entity.setStrOrigstrTxSerialNo(MsgXmlDom.getElementValue(domReq, "strOrigstrTxSerialNo"));
		    	entity.setStrSingleBusinessNum(MsgXmlDom.getElementValue(domReq, "strSingleBusinessNum"));
		    	new UKeyTransLogDB().save(entity);
		    	transLogId = entity.getId();
		    	MsgXmlDom.setElementValue(domResp, "transLogId", String.valueOf(transLogId));
			}
			else if(MsgXmlDom.getElementValue(domReq, "strTransCode").equals("905107") ||
					MsgXmlDom.getElementValue(domReq, "strTransCode").equals("905103") ||
					MsgXmlDom.getElementValue(domReq, "strTransCode").equals("905104")){//存单配单、部提、销户交易
				//先获取当前交易的批次号
				CDSSettleCycleLog  cdsSettleCycleLog = new CDSSettleCycleLogDB().getCurBatchNoEntity(MsgXmlDom.getElementValue(domReq, "strTerminalNum"),0);
				if(MsgXmlDom.getElementValue(domReq, "strTransCode").equals("905104")){
					//存单销户不需要获取批次号
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

				entity.setStrExInfo2(MsgXmlDom.getElementValue(domReq, "strExInfo2"));//备用字段2
				entity.setStrExInfo3(MsgXmlDom.getElementValue(domReq, "strExInfo3"));//备用字段3
				entity.setStrInterest(MsgXmlDom.getElementValue(domReq, "strInterest")); //利息
		    	if(MsgXmlDom.getElementValue(domReq, "Amount") == null || MsgXmlDom.getElementValue(domReq, "Amount").equals("") || MsgXmlDom.getElementValue(domReq, "Amount").equals("0")){
		    		BigDecimal amt = new BigDecimal("0"); //把交易金额转化成BigDecimal型
		    		entity.setAmt(amt);
				}else{
					String strAmount = MsgXmlDom.getElementValue(domReq, "Amount");
					strAmount = new DataConversion().fromFenToYuan(strAmount);//分转换为元
					BigDecimal amt = new BigDecimal(strAmount); //把交易金额转化成BigDecimal型
					entity.setAmt(amt);
				}
				if(strTransCode.equals("905107")){
					//存单配单
					String  strIsAgent = MsgXmlDom.getElementValue(domResp, "isAgent");
					if(strIsAgent != null && !strIsAgent.equals("") && strIsAgent.equals("1")){
						//存款人、代理人
						entity.setStrIDCardNum(new Base64().encode(MsgXmlDom.getElementValue(domReq, "strAuthNum").getBytes()));
			    		entity.setStrAuthIDCardNum(new Base64().encode(MsgXmlDom.getElementValue(domReq, "strAgentNum").getBytes()));
					}else{
						entity.setStrIDCardNum(new Base64().encode(MsgXmlDom.getElementValue(domReq, "strAuthNum").getBytes()));
					}
			    	entity.setStrOCRNum(MsgXmlDom.getElementValue(domReq, "strCDCertNum"));//存单凭证号
			    	entity.setStrAccountNum(MsgXmlDom.getElementValue(domReq, "strCdsAccount"));//存单账号
			    	entity.setStrTimeLimit(MsgXmlDom.getElementValue(domReq, "strProductSubType"));
			    	entity.setStrExInfo1(MsgXmlDom.getElementValue(domReq, "strExInfo1"));//备用字段1
			    	entity.setStrExInfo2(MsgXmlDom.getElementValue(domReq, "strAuthName"));//户名
				}else if(strTransCode.equals("905103")){
					//存单部提
					entity.setStrIDCardNum(new Base64().encode(MsgXmlDom.getElementValue(domReq, "strIDCardNum").getBytes()));
					entity.setStrOCRNum(MsgXmlDom.getElementValue(domReq, "strVoucherNo"));//存单新凭证号
			    	entity.setStrAccountNum(MsgXmlDom.getElementValue(domReq, "strAccountOut"));//存单账号
			    	entity.setStrTimeLimit(MsgXmlDom.getElementValue(domReq, "strDepositTerm"));	//存期

			    	entity.setStrExInfo2(MsgXmlDom.getElementValue(domReq, "strAcctBalance"));//备用字段2：存单本金
			    	entity.setStrExInfo3(MsgXmlDom.getElementValue(domReq, "strOldVouchNo"));//备用字段3：老凭证号
			    	//部提本息和 - 部提金额
			    	String strDrawTotalAmount = response.RepMap.get("F54_XZYE");
			    	//部提金额
			    	String strDrawAmount = "";
			    	//部提利息
			    	String strInterest = "";
			    	//如果P端是否返回部提金额的本息和
			    	if(strDrawTotalAmount != null && !strDrawTotalAmount.equals("")){
			    		if(MsgXmlDom.getElementValue(domReq, "Amount") == null || MsgXmlDom.getElementValue(domReq, "Amount").equals("") || MsgXmlDom.getElementValue(domReq, "Amount").equals("0")){
				    		strDrawAmount = "0";
						}else{
							strDrawAmount = MsgXmlDom.getElementValue(domReq, "Amount");
						}
				    	//利息
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
			    	entity.setStrExInfo1(strDrawTotalAmount);//备用字段2：销户金额+利息
			    	entity.setStrInterest(strInterest); //利息
				}else if(strTransCode.equals("905104")){
					//存单销户
					entity.setStrIDCardNum(new Base64().encode(MsgXmlDom.getElementValue(domReq, "strIDCardNum").getBytes()));
					entity.setStrOCRNum(MsgXmlDom.getElementValue(domReq, "strCDCertNum"));//存单凭证号
			    	entity.setStrAccountNum(MsgXmlDom.getElementValue(domReq, "strCDSNum"));//存单账号
			    	entity.setStrTimeLimit(MsgXmlDom.getElementValue(domReq, "strDepositTerm"));

			    	entity.setStrExInfo2(MsgXmlDom.getElementValue(domReq, "strCdsIDName"));//户名
			    	//存单本息和
			    	String strCanTotalAmount = response.RepMap.get("F54_XZYE");
			    	//销户金额
			    	String strCanAmount = "";
			    	//利息
			    	String strInterest = "";
		    		//存单本金:分为单位
			    	if(MsgXmlDom.getElementValue(domReq, "Amount") == null || MsgXmlDom.getElementValue(domReq, "Amount").equals("") || MsgXmlDom.getElementValue(domReq, "Amount").equals("0")){
			    		strCanAmount = "0";
					}else{
						strCanAmount = MsgXmlDom.getElementValue(domReq, "Amount");
					}
			    	//P端是否返回销户金额的本息和
			    	if(strCanTotalAmount != null && !strCanTotalAmount.equals("")){
				    	//利息
				    	int intInterest = Integer.parseInt(new DataConversion().getMoneyToFen(strCanTotalAmount))-Integer.parseInt(strCanAmount);
				    	if(intInterest >0){
				    		strInterest = new DataConversion().fromFenToYuan(String.valueOf(intInterest));
				    	}else{
				    		strInterest = "0.00";
				    	}

			    	}else{
			    		strCanTotalAmount = "0";
			    	}
			    	//销户金额本息和
			    	BigDecimal amt = new BigDecimal(strCanTotalAmount); //把交易金额转化成BigDecimal型
					entity.setAmt(amt);
			    	entity.setStrInterest(strInterest); //利息
			    	entity.setStrExInfo1(new DataConversion().fromFenToYuan(strCanAmount));//本金
				}
				//其余公共字段
		    	entity.setStrTerminalNum(MsgXmlDom.getElementValue(domReq, "strTerminalNum"));
		    	entity.setTransCode(strTransCode);
		    	entity.setDtOccur(new DateCtrl().getStrToTimestamp(dataFormat()));
		    	entity.setTermTxStatus(0);//默认为0，未动作
		    	entity.setHostTxStatus(hostTransStatus);
		    	entity.setStrHostRetCode(response.RepMap.get("F39"));
		    	entity.setStrHostSerialNo(response.RepMap.get("F37"));
		    	entity.setStrAccMode("3504");
		    	entity.setStrCDSType(MsgXmlDom.getElementValue(domReq, "strCDSType"));
		    	entity.setStrRate(MsgXmlDom.getElementValue(domReq, "strRate"));
		    	entity.setDtHostOccur(new DateCtrl().getStrToTimestamp(dataFormat()));
		    	entity.setTermBatchNo(termBatchNo);
		    	entity.setSettleCycleStatus(0);//清机状态   0：未清机 1：已清机
		    	entity.setStrTermSerialNo(getTerminalTsn());
		    	entity.setStrOrigstrTxSerialNo(response.RepMap.get("F11"));
		    	entity.setStrSingleBusinessNum(MsgXmlDom.getElementValue(domReq, "strTransRandom"));
		    	entity.setStrExInfo4(MsgXmlDom.getElementValue(domReq, "strBatchId"));//备用字段4 影像平台批次号
		    	entity.setStrExInfo5(MsgXmlDom.getElementValue(domReq, "strExInfo5"));//备用字段5
		    	new CDSTransLogDB().save(entity);
		    	transLogId = entity.getId();
		    	MsgXmlDom.setElementValue(domResp, "transLogId", String.valueOf(transLogId));
			}else if(MsgXmlDom.getElementValue(domReq, "strTransCode").equals("905102") ||
					 MsgXmlDom.getElementValue(domReq, "strTransCode").equals("905105") ||
					 MsgXmlDom.getElementValue(domReq, "strTransCode").equals("905108")||
					 MsgXmlDom.getElementValue(domReq, "strTransCode").equals("905106")){//存单开户、存单内部账转入、存单验证、存单利率查询
				//先获取当前交易的批次号
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
				entity.setStrOCRNum(MsgXmlDom.getElementValue(domReq, "strCDCertNum"));//存单凭证号
		    	entity.setStrAccountNum(MsgXmlDom.getElementValue(domReq, "strCDSNum"));//存单账号
		    	entity.setStrTimeLimit(MsgXmlDom.getElementValue(domReq, "strDepositTerm"));

				if(strTransCode.equals("905108")){
					entity.setStrAccountNum(MsgXmlDom.getElementValue(domReq, "strOutAcctNo"));//账号
				}else if(strTransCode.equals("905102")){
					if(MsgXmlDom.getElementValue(domReq, "strAuthIDCardNum") !=null && !MsgXmlDom.getElementValue(domReq, "strAuthIDCardNum").equals("")){
						entity.setStrIDCardNum(new Base64().encode(MsgXmlDom.getElementValue(domReq, "strAuthIDCardNum").getBytes()));
						entity.setStrAuthIDCardNum(new Base64().encode(MsgXmlDom.getElementValue(domReq, "strIDCardNum").getBytes()));
					}else{
						entity.setStrIDCardNum(new Base64().encode(MsgXmlDom.getElementValue(domReq, "strIDCardNum").getBytes()));
					}
					entity.setStrAccountNum(MsgXmlDom.getElementValue(domReq, "strCDSNum"));//存单账号
			    	entity.setStrTimeLimit(MsgXmlDom.getElementValue(domReq, "strDepositTerm"));
				}else if(strTransCode.equals("905106")){
					entity.setStrAccountNum(MsgXmlDom.getElementValue(domReq, "strInAcctNo"));//转入账号
				}
				//其余公共字段
		    	entity.setStrTerminalNum(MsgXmlDom.getElementValue(domReq, "strTerminalNum"));
		    	entity.setTransCode(strTransCode);
		    	if(MsgXmlDom.getElementValue(domReq, "Amount") == null || MsgXmlDom.getElementValue(domReq, "Amount").equals("") || MsgXmlDom.getElementValue(domReq, "Amount").equals("0")){
		    		BigDecimal amt = new BigDecimal("0"); //把交易金额转化成BigDecimal型
		    		entity.setAmt(amt);
				}else{
					String strAmount = MsgXmlDom.getElementValue(domReq, "Amount");
					strAmount = new DataConversion().fromFenToYuan(strAmount);//分转换为元
					BigDecimal amt = new BigDecimal(strAmount); //把交易金额转化成BigDecimal型
					entity.setAmt(amt);
				}
		    	entity.setDtOccur(new DateCtrl().getStrToTimestamp(dataFormat()));
		    	entity.setTermTxStatus(0);//默认为0，未动作
		    	entity.setHostTxStatus(hostTransStatus);
		    	entity.setStrHostRetCode(response.RepMap.get("F39"));
		    	entity.setStrHostSerialNo(response.RepMap.get("F37"));
		    	entity.setStrAccMode("3504");
		    	entity.setStrCDSType(MsgXmlDom.getElementValue(domReq, "strCDSType"));
		    	entity.setStrRate(MsgXmlDom.getElementValue(domReq, "strRate"));
		    	entity.setStrInterest(MsgXmlDom.getElementValue(domReq, "strInterest"));
		    	entity.setDtHostOccur(new DateCtrl().getStrToTimestamp(dataFormat()));
		    	entity.setTermBatchNo(termBatchNo);
		    	entity.setSettleCycleStatus(0);//清机状态   0：未清机 1：已清机
		    	entity.setStrTermSerialNo(getTerminalTsn());
		    	entity.setStrOrigstrTxSerialNo(response.RepMap.get("F11"));
		    	entity.setStrSingleBusinessNum(MsgXmlDom.getElementValue(domReq, "strTransRandom"));
		    	entity.setStrExInfo1(MsgXmlDom.getElementValue(domReq, "strExInfo1"));//备用字段
		    	entity.setStrExInfo2(MsgXmlDom.getElementValue(domReq, "strExInfo2"));//备用字段2
		    	entity.setStrExInfo3(MsgXmlDom.getElementValue(domReq, "strExInfo3"));//备用字段3
		    	entity.setStrExInfo4(MsgXmlDom.getElementValue(domReq, "strBatchId"));//备用字段4 影像平台批次号
		    	entity.setStrExInfo5(MsgXmlDom.getElementValue(domReq, "strExInfo5"));//备用字段5
		    	new CDSTransLogDB().save(entity);
		    	transLogId = entity.getId();
		    	MsgXmlDom.setElementValue(domResp, "transLogId", String.valueOf(transLogId));
			}
			//加凭证交易
			else if(MsgXmlDom.getElementValue(domReq, "strTransCode").equals("911101") && MsgXmlDom.getElementValue(domReq, "strAddFlag").equals("card") ){
				if (TERMRETCODE_SUCCEED.equals(MsgXmlDom.getElementValue(domResp, "TermRetCode")))//只有成功的时候，才要修改其状态
				{
					try{
						//对COLS_CARDUNITSTATUS表进行操作  顺序：卡箱索引号,卡箱类型,初始张数,当前张数,卡箱状态,卡类型,开始卡bin,结束卡bin
						int cardRefillCount = 0;//初始卡数总张数
						String strTerminalNum = MsgXmlDom.getElementValue(domReq,"strTerminalNum");
						String cardBox[] = MsgXmlDom.getElementValue(domReq,"cardBoxInfoStr").split("\\|");//一个数组元素代表一个发卡箱信息
						CardUnitStatusDB cardUnitStatusDB = new CardUnitStatusDB();
						List<CardUnitStatus> cardList = new ArrayList<CardUnitStatus>();
						if(cardBox != null && cardBox.length >0){
							for(int i=0;i<cardBox.length;i++){
								String cardBoxInfo[] = cardBox[i].split(",");//一个数组元素代表某个卡箱的某个属性
								int cuNum = Integer.parseInt(cardBoxInfo[0]);//卡箱索引号
								String strCuType = cardBoxInfo[1];//卡箱类型
								int initialCount = Integer.parseInt(cardBoxInfo[2]);//初始张数
								cardRefillCount =  cardRefillCount + initialCount;//计算整个机器加的总张数
								int curCount = Integer.parseInt(cardBoxInfo[3]);//当前张数
								String strCuStatus = cardBoxInfo[4];//卡箱状态
								String strCardType = cardBoxInfo[5];//卡类型
								String strCardTrackStart = cardBoxInfo[6];//开始卡bin
								String strCardTrackEnd = cardBoxInfo[7];//结束卡bin
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
						boolean ret = cardUnitStatusDB.delete(strTerminalNum);//先删除历史数据
						if(ret){
							ret = cardUnitStatusDB.insert(cardList);
							if(ret){
								//把加卡信息发送给监控
				       			new LinxViewProxy().sendCardUnitStatusMsg(cardList);
								//修改批次表
								int termBatchNo = 1;//批次号,默认从1开始
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
								//把加卡批次信息发送给监控
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
			//如果是存单内部账存取款交易
			else if(MsgXmlDom.getElementValue(domReq, "strTransCode").equals("909008")
					||MsgXmlDom.getElementValue(domReq, "strTransCode").equals("909005")
					||MsgXmlDom.getElementValue(domReq, "strTransCode").equals("909020")//对公存款
					||MsgXmlDom.getElementValue(domReq, "strTransCode").equals("909120")){//柜员存款
				TransLogDeposit entity = new TransLogDeposit();
				String terminalId = MsgXmlDom.getElementValue(domReq, "strTerminalNum");
				//先获取当前交易的批次号
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
				//存款金额
		    	if(MsgXmlDom.getElementValue(domReq, "Amount") == null || MsgXmlDom.getElementValue(domReq, "Amount").equals("") || MsgXmlDom.getElementValue(domReq, "Amount").equals("0")){
		    		BigDecimal amt = new BigDecimal("0"); //把交易金额转化成BigDecimal型
		    		entity.setDamount(amt);
				}else{
					String strAmount = MsgXmlDom.getElementValue(domReq, "Amount");
					strAmount = new DataConversion().fromFenToYuan(strAmount);//分转换为元
					BigDecimal amt = new BigDecimal(strAmount); //把交易金额转化成BigDecimal型
					entity.setDamount(amt);
				}
		    	if(MsgXmlDom.getElementValue(domReq, "fee") == null || MsgXmlDom.getElementValue(domReq, "fee").equals("") || MsgXmlDom.getElementValue(domReq, "fee").equals("0") ){
		    		BigDecimal amt = new BigDecimal("0"); //把交易金额转化成BigDecimal型
		    		entity.setDfee(amt);
				}else{
					String strFee = MsgXmlDom.getElementValue(domReq, "fee");
					strFee = new DataConversion().fromFenToYuan(strFee);//分转换为元
					BigDecimal amt = new BigDecimal(strFee); //把交易金额转化成BigDecimal型
					entity.setDfee(amt);
				}
		    	String strTransCode = MsgXmlDom.getElementValue(domReq, "strTransCode");
		    	entity.setTransCode(strTransCode);
		    	//存款交易
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
		    		entity.setStrPan("存单现金充值");
		    	}else if(MsgXmlDom.getElementValue(domReq, "strTransCode").equals("909020")){
		    		entity.setStrPan(MsgXmlDom.getElementValue(domReq, "strAccount"));
		    	}else if(MsgXmlDom.getElementValue(domReq, "strTransCode").equals("909120")){
		    		entity.setStrPan("柜员现金存款");
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
		    	//备用字段
		    	entity.setStrExInfo1(MsgXmlDom.getElementValue(domReq, "strExInfo1"));
		    	entity.setStrExInfo2(MsgXmlDom.getElementValue(domReq, "strBatchId"));//记录对应上传影像平台的批次流水
		    	entity.setStrExInfo3(MsgXmlDom.getElementValue(domReq, "strExInfo3"));
		    	entity.setStrExInfo4(MsgXmlDom.getElementValue(domReq, "strExInfo4"));
		    	entity.setStrExInfo5(MsgXmlDom.getElementValue(domReq, "strExInfo5"));
		    	new TransLogDepositDB().sava(entity);
			}else if(MsgXmlDom.getElementValue(domReq, "strTransCode").equals("909009")
					||MsgXmlDom.getElementValue(domReq, "strTransCode").equals("909006")
					||MsgXmlDom.getElementValue(domReq, "strTransCode").equals("909015")){//存款确认
				TransLogDeposit entity = new TransLogDeposit();
				TransLogDepositDB strTransLogDepositDB = new TransLogDepositDB();
				String terminalId = MsgXmlDom.getElementValue(domReq, "strTerminalNum");
				//先获取当前交易的批次号
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
				//存款金额
		    	if(MsgXmlDom.getElementValue(domReq, "Amount") == null || MsgXmlDom.getElementValue(domReq, "Amount").equals("") || MsgXmlDom.getElementValue(domReq, "Amount").equals("0")){
		    		BigDecimal amt = new BigDecimal("0"); //把交易金额转化成BigDecimal型
		    		entity.setDamount(amt);
				}else{
					String strAmount = MsgXmlDom.getElementValue(domReq, "Amount");
					strAmount = new DataConversion().fromFenToYuan(strAmount);//分转换为元
					BigDecimal amt = new BigDecimal(strAmount); //把交易金额转化成BigDecimal型
					entity.setDamount(amt);
				}
		    	if(MsgXmlDom.getElementValue(domReq, "fee") == null || MsgXmlDom.getElementValue(domReq, "fee").equals("") || MsgXmlDom.getElementValue(domReq, "fee").equals("0") ){
		    		BigDecimal amt = new BigDecimal("0"); //把交易金额转化成BigDecimal型
		    		entity.setDfee(amt);
				}else{
					String strFee = MsgXmlDom.getElementValue(domReq, "fee");
					strFee = new DataConversion().fromFenToYuan(strFee);//分转换为元
					BigDecimal amt = new BigDecimal(strFee); //把交易金额转化成BigDecimal型
					entity.setDfee(amt);
				}
		    	String strTransCode = MsgXmlDom.getElementValue(domReq, "strTransCode");
		    	entity.setTransCode(strTransCode);
		    	//存款交易
		    	entity.setItermTransStatus(5);
		    	entity.setStrSingleBusinessNum(MsgXmlDom.getElementValue(domReq, "strTransRandom"));
				entity.setIsettleCycle(termBatchNo);
				entity.setIhostTransStatus(hostTransStatus);
				entity.setIsettleCycleStatus(0);
		    	entity.setStrHostRetCode(response.RepMap.get("F39"));
		    	//原存款交易流水号
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
		    	//判断存款确认交易是否有37域返回
		    	if(response.RepMap.get("F37") !=null && !response.RepMap.get("F37").equals(""))
		    	{
		    		entity.setStrHostTsn(response.RepMap.get("F37"));
		    	}else{
		    		//存款交易成功时发送存款确认，P端不会返回F37
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
		    		entity.setStrPan("存单现金充值确认");
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
		    	//备用字段
		    	entity.setStrExInfo1(MsgXmlDom.getElementValue(domReq, "strExInfo1"));
		    	entity.setStrExInfo2(MsgXmlDom.getElementValue(domReq, "strExInfo2"));
		    	entity.setStrExInfo3(MsgXmlDom.getElementValue(domReq, "strExInfo3"));
		    	entity.setStrExInfo4(MsgXmlDom.getElementValue(domReq, "strExInfo4"));
		    	entity.setStrExInfo5(MsgXmlDom.getElementValue(domReq, "strExInfo5"));
		    	strTransLogDepositDB.sava(entity);
				//根据P端返回的确认结果来更新数据库中存款交易
				if (TERMRETCODE_SUCCEED.equals(strTermRetCode))
				{
					TransLogDeposit strOldTransLog = strTransLogDepositDB.getOldTransLog(strOldOrgTsns,strOldTransCode);
					if(strOldTransLog != null && !strOldTransLog.equals("")){
						if(!strOldTransLog.getStrHostRetCode().equals("0000")){
							//更新原交易信息
							strOldTransLog.setIhostTransStatus(HTSTATUS_OK);
							strTransLogDepositDB.updateOldDepositTrans(strOldTransLog);
						}
					}
				}
			}else if(MsgXmlDom.getElementValue(domReq, "strTransCode").equals("909010")//内部账取现
					|| MsgXmlDom.getElementValue(domReq, "strTransCode").equals("909002")//活期取款
					|| MsgXmlDom.getElementValue(domReq, "strTransCode").equals("909119")//柜员现金取款
					|| MsgXmlDom.getElementValue(domReq, "strTransCode").equals("909017")){//对公取款
				TransLogWithdrawal entity = new TransLogWithdrawal();
				String terminalId = MsgXmlDom.getElementValue(domReq, "strTerminalNum");
				//先获取当前交易的批次号
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
				//取款金额
		    	if(MsgXmlDom.getElementValue(domReq, "Amount") == null || MsgXmlDom.getElementValue(domReq, "Amount").equals("") || MsgXmlDom.getElementValue(domReq, "Amount").equals("0")){
		    		BigDecimal amt = new BigDecimal("0"); //把交易金额转化成BigDecimal型
		    		entity.setDamount(amt);
				}else{
					String strAmount = MsgXmlDom.getElementValue(domReq, "Amount");
					strAmount = new DataConversion().fromFenToYuan(strAmount);//分转换为元
					BigDecimal amt = new BigDecimal(strAmount); //把交易金额转化成BigDecimal型
					entity.setDamount(amt);
				}
		    	if(MsgXmlDom.getElementValue(domReq, "fee") == null || MsgXmlDom.getElementValue(domReq, "fee").equals("") || MsgXmlDom.getElementValue(domReq, "fee").equals("0") ){
		    		BigDecimal amt = new BigDecimal("0"); //把交易金额转化成BigDecimal型
		    		entity.setDfee(amt);
				}else{
					String strFee = MsgXmlDom.getElementValue(domReq, "fee");
					strFee = new DataConversion().fromFenToYuan(strFee);//分转换为元
					BigDecimal amt = new BigDecimal(strFee); //把交易金额转化成BigDecimal型
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
		    		entity.setStrPan("柜员现金取款");
		    	}else if(strTransCode.equals("909017")){
		    		entity.setStrPan(MsgXmlDom.getElementValue(domReq, "strDestPan"));
		    	}else{
		    		entity.setStrPan("存单现金支取");
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
		    	//备用字段
		    	entity.setStrExInfo1(MsgXmlDom.getElementValue(domReq, "strExInfo1"));
		    	entity.setStrExInfo2(MsgXmlDom.getElementValue(domReq, "strBatchId"));//记录对应上传影像平台的批次流水
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
			else{//其他交易
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
		    		BigDecimal amt = new BigDecimal("0"); //把交易金额转化成BigDecimal型
		    		entity.setAmt(amt);
				}else{
					String strAmount = MsgXmlDom.getElementValue(domReq, "Amount");
					//外汇业务(906301/906302/906406)是以元为单位的，不进行格式转化:
					if( MsgXmlDom.getElementValue(domReq, "strTransCode").equals("906301") ||
					    MsgXmlDom.getElementValue(domReq, "strTransCode").equals("906302") ||
						MsgXmlDom.getElementValue(domReq, "strTransCode").equals("906406")){
						BigDecimal amt = new BigDecimal(strAmount); //把交易金额转化成BigDecimal型
						entity.setAmt(amt);
					}else{
						strAmount = new DataConversion().fromFenToYuan(strAmount);//分转换为元
						BigDecimal amt = new BigDecimal(strAmount); //把交易金额转化成BigDecimal型
						entity.setAmt(amt);
					}
				}
		    	if(MsgXmlDom.getElementValue(domReq, "fee") == null || MsgXmlDom.getElementValue(domReq, "fee").equals("") || MsgXmlDom.getElementValue(domReq, "fee").equals("0") ){
		    		BigDecimal amt = new BigDecimal("0"); //把交易金额转化成BigDecimal型
		    		entity.setFee(amt);
				}else{
					String strFee = MsgXmlDom.getElementValue(domReq, "fee");
					strFee = new DataConversion().fromFenToYuan(strFee);//分转换为元
					BigDecimal amt = new BigDecimal(strFee); //把交易金额转化成BigDecimal型
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
		    	entity.setTermBatchNo(1);//默认为1
		    	entity.setReverseStatus(RESTATUS_NEEDLESS);//冲正状态
		    	entity.setStrTermSerialNo(strTerminalTsn);
		    	entity.setCheckFlag(0);//0需要对账，1不需要对账
		    	entity.setStrOrigstrTxSerialNo(MsgXmlDom.getElementValue(domReq, "strOrigstrTxSerialNo"));
		    	entity.setStrSingleBusinessNum(MsgXmlDom.getElementValue(domReq, "strSingleBusinessNum"));
		    	entity.setStrExInfo2(MsgXmlDom.getElementValue(domReq, "strBatchId"));//记录对应上传影像平台的批次流水
		    	new OtherTransLogDB().save(entity);
		    	transLogId = entity.getId();
			}
		}
	}

	/**
	 * 把交易信息发往监控服务器
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
		
		//对公存款
		if(MsgXmlDom.getElementValue(domReq, "strTransCode").equals("909020")){
			msg.put("strPan", MsgXmlDom.getElementValue(domReq, "strAccount"));	
		}else if(MsgXmlDom.getElementValue(domReq, "strTransCode").equals("909005")){
			//个人存款
			if(MsgXmlDom.getElementValue(domReq, "strPan")!=null && !MsgXmlDom.getElementValue(domReq, "strPan").equals("")){
				msg.put("strPan", MsgXmlDom.getElementValue(domReq, "strPan"));
			}else{
				msg.put("strPan", MsgXmlDom.getElementValue(domReq, "strAccount"));
			}
		}else if(MsgXmlDom.getElementValue(domReq, "strTransCode").equals("909002")){
			//个人取款
			if(MsgXmlDom.getElementValue(domReq, "strPan")!=null && !MsgXmlDom.getElementValue(domReq, "strPan").equals("")){
				msg.put("strPan", MsgXmlDom.getElementValue(domReq, "strPan"));
			 }else{
				msg.put("strPan", MsgXmlDom.getElementValue(domReq, "strDestPan"));
		    }
		}else if(MsgXmlDom.getElementValue(domReq, "strTransCode").equals("909017")){
			   //对公取款
			    msg.put("strPan", MsgXmlDom.getElementValue(domReq, "strDestPan"));
		}else{
			 msg.put("strPan", MsgXmlDom.getElementValue(domReq, "strPan"));
		}
		msg.put("strDestPan", MsgXmlDom.getElementValue(domReq, "strDestPan"));
		if(MsgXmlDom.getElementValue(domReq, "Amount") == null || MsgXmlDom.getElementValue(domReq, "Amount").equals("") || MsgXmlDom.getElementValue(domReq, "Amount").equals("0")){
			msg.put("Amount", "0.00");
		}else{
			String strAmount = MsgXmlDom.getElementValue(domReq, "Amount");
			//外汇业务(906301/906302/906406)是以元为单位的，不进行格式转化:
			if( MsgXmlDom.getElementValue(domReq, "strTransCode").equals("906301") ||
				MsgXmlDom.getElementValue(domReq, "strTransCode").equals("906302") ||
				MsgXmlDom.getElementValue(domReq, "strTransCode").equals("906406"))
			{
				msg.put("Amount",strAmount);
			}else{
				try{
					strAmount = new DataConversion().fromFenToYuan(strAmount);//分转换为元
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
			strFee = new DataConversion().fromFenToYuan(strFee);//分转换为元
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
		//往监控服务器发送交易流水
		if(MsgXmlDom.getElementValue(domReq, "strTransCode") != null && !MsgXmlDom.getElementValue(domReq, "strTransCode").equals("")){
			//PAD审核结果查询与PAD帮助结果查询不发送监控
			//增加 柜员签到状态查询不发送监控
			if(!MsgXmlDom.getElementValue(domReq, "strTransCode").equals("910305")
				&& !MsgXmlDom.getElementValue(domReq, "strTransCode").equals("910303")
				&& !MsgXmlDom.getElementValue(domReq, "strTransCode").equals("911205")
				&& !MsgXmlDom.getElementValue(domReq, "strTransCode").equals("912104")//叫号查询
				&& !MsgXmlDom.getElementValue(domReq, "strTransCode").equals("912107")//叫号重呼
				){
				if(MsgXmlDom.getElementValue(domReq, "strTransCode").equals("909014")){
					//钞箱信息上送
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
	 * 时间转换
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
