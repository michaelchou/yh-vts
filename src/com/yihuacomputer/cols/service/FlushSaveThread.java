package com.yihuacomputer.cols.service;

import java.io.File;
import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.io.IOException;
import java.util.ArrayList;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.apache.log4j.Logger;
import org.dom4j.DocumentException;
import org.dom4j.Element;
import org.dom4j.io.SAXReader;

import com.yihuacomputer.cols.common.util.ColsTransMsg;
import com.yihuacomputer.cols.crypto.Base64;
import com.yihuacomputer.cols.crypto.VideoPlatFormZNGY;
import com.yihuacomputer.cols.database.FlushDataDB;
import com.yihuacomputer.cols.database.MiscDB;
import com.yihuacomputer.cols.database.OtherTransLogDB;
import com.yihuacomputer.cols.entity.FlushData;
import com.yihuacomputer.cols.entity.OtherTransLog;
import com.yihuacomputer.cols.entity.VideoPlat;
import com.yihuacomputer.cols.monitor.LinxViewProxy;
import com.yihuacomputer.cols.util.DataConversion;
import com.yihuacomputer.cols.util.DateCtrl;

/**
 * 冲正线程类
 * 深圳怡化电脑股份有限公司
 * 2017-06-01
 */
public class FlushSaveThread extends Thread{

    //冲正状态:未冲正
	protected int RESTATUS_NEEDLESS = 0;
    //冲正状态:成功
    protected int RESTATUS_OK = 1;
    //冲正状态:失败
    protected int RESTATUS_FAILED = 2;
    //冲正状态:结果不确定
    protected int RESTATUS_UNCER = 3;
	//休眠时间
    protected int iSleepMsel=0;
    //当前处理发送线程号
    protected String strTransFlushNum=null;
    protected Map<String, String> map = new HashMap<String, String>(100, 0.8f);
    protected Logger error = Logger.getLogger("Error");
    protected Logger info = Logger.getLogger("Info");
	/**
	 * <p>构造函数</p>
	 */
	public FlushSaveThread(int iSleepMsel, String strTransFlushNum)
	{
		this.iSleepMsel=iSleepMsel;
		this.strTransFlushNum=strTransFlushNum;
	}

	/**
	 * 线程处理函数
	 */
	@SuppressWarnings({ "rawtypes", "unchecked", "static-access" })
	public void run()
	{
		while(true)
		{
			List<Map> listBeanMap = null;
			try
			{
				Thread.sleep(iSleepMsel);
				int iTransFlushNum =Integer.parseInt(strTransFlushNum);
				//这步取出所有冲正次数为0的冲正数据MAP键值对，放到LIST中
				listBeanMap = getListBeanMap(iTransFlushNum);
				//如果是发送第4次冲正，则在取出标志为4的冲正流水后，删除冲正次数标志为4
				if(listBeanMap.size() != 0 && strTransFlushNum != null && "4".equals(strTransFlushNum))
				{
					new FlushDataDB().deleteFlushDataByFlushTimes(strTransFlushNum);
				}
				for(int i=0;i<listBeanMap.size();i++)
     			{
					DateCtrl dtCur = new DateCtrl();
					//这边取出单个冲正数据MAP键值对
     				Map<String, String> flushDataMap = listBeanMap.get(i);
     				if(flushDataMap.get("strTransCode") != null && flushDataMap.get("strOrgTsn") != null  && !flushDataMap.get("strOrgTsn").equals("") && flushDataMap.get("strTransCode").equals("999999")){//业务申请单单独处理
     					String strVideoPlatIP = new MiscDB().get("00001", "VideoPlatIP", "");
     					String strVideoPlatPort = new MiscDB().get("00001", "VideoPlatPort", "");
     					String strVideoPlatUser = new MiscDB().get("00001", "VideoPlatUser", "");
     					String strVideoPlatPwd = new MiscDB().get("00001", "VideoPlatPwd", "");
     					VideoPlatFormZNGY  vpf = new VideoPlatFormZNGY(strVideoPlatIP,strVideoPlatPort,strVideoPlatUser,strVideoPlatPwd);
     					List<VideoPlat> imageInfoList = new ArrayList<VideoPlat>();
     					VideoPlat bean = new VideoPlat();
     					String filePath = filePath(flushDataMap.get("strOrgTsn"));//根据原交易流水(批次号)取出对应的文件路径
     					filePath = filePath+"business.png";
     					System.out.println("***************************:"+filePath);
     			  	    bean.setStrFilePath(filePath);
     			  	    try {
     			  	    	bean.setStrFileSize(String.valueOf(new FileInputStream(new File(filePath)).available()));
     					} catch (FileNotFoundException e) {
     						error.error("生成业务申请单失败(找不到对应的业务电子文件):"+ e.getMessage() + "\r\n");
     					} catch (IOException e) {
     						error.error("生成业务申请单失败(业务电子文件错误):"+ e.getMessage() + "\r\n");
     					}
     			  	    imageInfoList.add(bean);
     			  	    VideoPlat entity = new VideoPlat();
     		  	        String strBusiStartTime = dtCur.getTransDateToView();//业务产生时间
     				    entity.setStrBatchId(flushDataMap.get("strOrgTsn"));//批次号
     				    entity.setStrBusiStartTime(strBusiStartTime);
     				    boolean ret = vpf.videoPlatUpload(entity,imageInfoList);
     				    if(!ret){//重新上传失败
	     					if(!"4".equals(strTransFlushNum))
	     					{
	     						System.out.println("----------------修改重复上传次数----------------");
	     						FlushData  flushData=  new FlushDataDB().getEntity(Integer.parseInt(flushDataMap.get("id")));
	     						if(entity != null ){
	     						  flushData.setFlushTimes(Integer.parseInt(strTransFlushNum) + 1);
	             				  new FlushDataDB().updateFlushDataState(flushData);
	     						}
	     					}
	     					else if("4".equals(strTransFlushNum))
	     					{
	     						//最终冲正失败，删除重复上传的数据
		     		        	new FlushDataDB().deleteFlushDataByID(Integer.parseInt(flushDataMap.get("id")));
	     					}
     				    }else{
	     		        	System.out.println(">>>>>>>>>>>>>>>>>>>>>>:"+flushDataMap.get("id"));
	     		        	//删除重复上传的数据
	     		        	new FlushDataDB().deleteFlushDataByID(Integer.parseInt(flushDataMap.get("id")));
     				    }
     				}else{
	     				//防止和配置文件中的字段不一样，这边重新赋值一下
	     				map.put("strPan", flushDataMap.get("strPan"));
	     				map.put("strTransCode", flushDataMap.get("strTransCode"));
	     				//冲正金额转为分为单位
	     				map.put("Amount", new DataConversion().getMoneyToFen(flushDataMap.get("amount")));	     				
	     				
	     				map.put("DestPan", flushDataMap.get("strDestPan"));
	     				map.put("strTrack2", new String(new Base64().decode(flushDataMap.get("strTrack2"))));
	     				map.put("strTrack3", new String(new Base64().decode(flushDataMap.get("strTrack3"))));
	     				map.put("strTerminalNum", flushDataMap.get("strTerminalNum"));
	                    map.put("strEncrypType", flushDataMap.get("strEncrypType"));
	     				map.put("strPinBlock", new String(new Base64().decode(flushDataMap.get("strPinBlock"))));
	     				map.put("strField55", new String(new Base64().decode(flushDataMap.get("strField55"))));
	     				map.put("strField57", flushDataMap.get("strField57"));
	     				map.put("orgTsn", flushDataMap.get("strOrgTsn"));
	     				map.put("strTerminalTsn", getTerminalTsn(flushDataMap.get("strTerminalNum")));//系统跟踪号
	     		        map.put("strTransTime", dtCur.getDateTimeToView());//受卡方所在地时间 hhmmss
	     		        map.put("strTransDate", dtCur.getTransDateToView());//受卡方所在地日期数据yyyyMMdd
	     				//第一步 根据交易码取出交易配置文件
	     		        String strPathXML = pathXML(flushDataMap.get("strTransCode"));
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
	     		        	error.error("与主机进行通讯失败:"+e.getMessage());
	     		        }
	     		        if (iRet == 0)//交易成功，需要把冲正数据清除,并修改原交易流水冲正状态
	     		        {
	     		        	System.out.println(">>>>>>>>>>>>>>>>>>>>>>:"+flushDataMap.get("id"));
	     		        	//第一步删除冲正的数据
	     		        	new FlushDataDB().deleteFlushDataByID(Integer.parseInt(flushDataMap.get("id")));
	     		        	//第二步，修改原交易流水的冲正状态
	     		        	OtherTransLog  entity = new OtherTransLogDB().getEntity(flushDataMap.get("strOrgTsn"));
	     		        	if(entity != null ){
	     		        		entity.setReverseStatus(RESTATUS_OK);
	     		        		new OtherTransLogDB().update(entity);
	     		        	}
	     		        }
	     				else
	     				{
	     					if(response.retCode != null && response.retCode.equals("2025"))//返回码为2025，表示无原交易
	     					{
	     						new FlushDataDB().deleteFlushDataByID(Integer.parseInt(flushDataMap.get("id")));
	     						//冲正失败，修改原交易流水的冲正状态
	         		        	OtherTransLog  entity = new OtherTransLogDB().getEntity(flushDataMap.get("strOrgTsn"));
	         		        	if(entity != null ){
	         		        		entity.setReverseStatus(RESTATUS_UNCER);
	         		        		new OtherTransLogDB().update(entity);
	         		        	}
	    	       	        }
	     					else if(!"4".equals(strTransFlushNum))
	     					{
	     						System.out.println("----------------修改冲正次数----------------");
	     						FlushData entity =  new FlushDataDB().getEntity(Integer.parseInt(flushDataMap.get("id")));
	     						if(entity != null ){
	     						  entity.setFlushTimes(Integer.parseInt(strTransFlushNum) + 1);
	             				  new FlushDataDB().updateFlushDataState(entity);
	     						}
	     					}
	     					else if("4".equals(strTransFlushNum))
	     					{
	     						//最终冲正失败，修改原交易流水的冲正状态
	         		        	OtherTransLog  entity = new OtherTransLogDB().getEntity(flushDataMap.get("strOrgTsn"));
	         		        	if(entity != null ){
	         		        		entity.setReverseStatus(RESTATUS_FAILED);
	         		        		new OtherTransLogDB().update(entity);
	         		        	}
	     					}
	     				}
	     				// 把交易信息发往监控
	     				notifyxViewProxy(response);
     			    }
     			}

			}
			catch(Exception e)
			{
				error.error("取冲正数据信息失败:"+e.getMessage());
				continue;
			}
			finally
			{
				if(listBeanMap != null)
				{
					listBeanMap.clear();
					listBeanMap = null;
				}
			}
		}
	}

    //取出需要冲正的数据集
	@SuppressWarnings({ "rawtypes", "unchecked" })
	public List<Map> getListBeanMap(int iTransFlushNum)
	{
		List listBean = new FlushDataDB().getFlushDataList(iTransFlushNum);
		Map beanMap = null;
		List<Map> listBeanMap = new ArrayList();
		if(listBean !=null)
		{
			for(int i=0;i<listBean.size();i++)
			{
				FlushData f = (FlushData)listBean.get(i);
				beanMap = new HashMap<String,String>(150,0.8f);
				beanMap= new FlushDataDB().getBeanToMap(f, beanMap);
				listBeanMap.add(beanMap);
			}
		}
		return listBeanMap;
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

	/**
	 * 根据批次号取出对应的文件路径
	 * @return  文件存储路劲
	*/
    public String filePath(String strBatchId)
    {
    	String path = (getClass().getProtectionDomain().getCodeSource().getLocation().getPath()).substring(1, (getClass().getProtectionDomain().getCodeSource().getLocation().getPath()).indexOf("WEB-INF"));//获取工程路径
    	String classpath= File.separator + path+"File";
		StringBuffer filePath = new StringBuffer(64);
        filePath.append(classpath);
        filePath.append(File.separator);
        filePath.append(strBatchId);
        filePath.append(File.separator);
        path = filePath.toString();
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

	//获取16位终端流水号:8位终端编号 + 8位终端流水号
	public String getTerminalTsn(String strTerminalNum)
	{
		String strtm = "" + new Date().getTime();
		String str = strTerminalNum + strtm.substring(strtm.length() - 8, strtm.length());
		return str;
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
	 * 把交易信息发往监控服务器
	*/
	protected void notifyxViewProxy(ReponseMessage response)
	{
		String strTermRetCode = response.RepMap.get("F39");
		String strHostTransStatus,strLocalRet;
		if ("0000".equals(strTermRetCode))
		{
			strHostTransStatus = String.valueOf("0");
			strLocalRet ="OK";
		}
		else if ("0002".equals(strTermRetCode))
		{
			strHostTransStatus = String.valueOf("2");
			strLocalRet ="FAILED";
		}
		else
		{
			strHostTransStatus = String.valueOf("1");
			strLocalRet ="FAILED";
		}
		ColsTransMsg msg = new ColsTransMsg();
		msg.put("strTransCode", map.get("strTransCode"));
		msg.put("strTerminalNum", map.get("strTerminalNum"));
		msg.put("strTerminalTsn", map.get("strTerminalTsn"));
		if(map.get("strPan") != null && !map.get("strPan").equals("")){
			msg.put("CardType", "1");
		}
		else{
			msg.put("CardType", "");
		}
		if((map.get("strPan") == null || map.get("strPan").equals("")) && (map.get("DestPan") !=null && !map.get("DestPan").equals(""))){
			msg.put("strPan", map.get("DestPan"));
			msg.put("strDestPan", "");
		}else{
		    msg.put("strPan", map.get("strPan"));
		    msg.put("strDestPan", map.get("DestPan"));
		}
		if(map.get("Amount") == null || map.get("Amount").equals("") || map.get("Amount").equals("0")){
			msg.put("Amount", "0.00");
		}else{
			String strAmount = map.get("Amount");
			msg.put("Amount",strAmount);
		}
		msg.put("DateTime", String.valueOf(System.currentTimeMillis()));
		msg.put("TransDate", map.get("strTransDate"));
		msg.put("strHostRet", response.RepMap.get("F39"));
		msg.put("strLocalRet", strLocalRet);
		msg.put("strHostTransStatus", strHostTransStatus);
		if(map.get("fee") == null || map.get("fee").equals("") || map.get("fee").equals("0")){
			msg.put("fee", "0.00");
		}else{
			String strFee = map.get("fee");
			strFee = new DataConversion().fromFenToYuan(strFee);//分转换为元
			msg.put("fee", strFee);
		}
		msg.put("CostTime", "0");
		msg.put("iHostTxStatus", strHostTransStatus);
		msg.put("strHostSerialNo", response.RepMap.get("F37"));
		msg.put("iTermBatchNo", "1");
		msg.put("iTermTxStatus", strHostTransStatus);
		msg.put("strOrigstrTxSerialNo",map.get("orgTsn"));
		if(map.get("dtHostOccur") == null || map.get("dtHostOccur").equals("")){
			msg.put("dtHostOccur", new DateCtrl().getDateTimeStrSimpleFull());
		}else{
			msg.put("dtHostOccur", map.get("dtHostOccur"));
		}
		//往监控服务器发送交易流水
		if(map.get("strTransCode") != null && !map.get("strTransCode").equals("")){
			new LinxViewProxy().sendTransMsg(msg.toString());
		}
	}
}