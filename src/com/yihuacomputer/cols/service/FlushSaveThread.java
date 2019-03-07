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
 * �����߳���
 * �����������Թɷ����޹�˾
 * 2017-06-01
 */
public class FlushSaveThread extends Thread{

    //����״̬:δ����
	protected int RESTATUS_NEEDLESS = 0;
    //����״̬:�ɹ�
    protected int RESTATUS_OK = 1;
    //����״̬:ʧ��
    protected int RESTATUS_FAILED = 2;
    //����״̬:�����ȷ��
    protected int RESTATUS_UNCER = 3;
	//����ʱ��
    protected int iSleepMsel=0;
    //��ǰ�������̺߳�
    protected String strTransFlushNum=null;
    protected Map<String, String> map = new HashMap<String, String>(100, 0.8f);
    protected Logger error = Logger.getLogger("Error");
    protected Logger info = Logger.getLogger("Info");
	/**
	 * <p>���캯��</p>
	 */
	public FlushSaveThread(int iSleepMsel, String strTransFlushNum)
	{
		this.iSleepMsel=iSleepMsel;
		this.strTransFlushNum=strTransFlushNum;
	}

	/**
	 * �̴߳�����
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
				//�ⲽȡ�����г�������Ϊ0�ĳ�������MAP��ֵ�ԣ��ŵ�LIST��
				listBeanMap = getListBeanMap(iTransFlushNum);
				//����Ƿ��͵�4�γ���������ȡ����־Ϊ4�ĳ�����ˮ��ɾ������������־Ϊ4
				if(listBeanMap.size() != 0 && strTransFlushNum != null && "4".equals(strTransFlushNum))
				{
					new FlushDataDB().deleteFlushDataByFlushTimes(strTransFlushNum);
				}
				for(int i=0;i<listBeanMap.size();i++)
     			{
					DateCtrl dtCur = new DateCtrl();
					//���ȡ��������������MAP��ֵ��
     				Map<String, String> flushDataMap = listBeanMap.get(i);
     				if(flushDataMap.get("strTransCode") != null && flushDataMap.get("strOrgTsn") != null  && !flushDataMap.get("strOrgTsn").equals("") && flushDataMap.get("strTransCode").equals("999999")){//ҵ�����뵥��������
     					String strVideoPlatIP = new MiscDB().get("00001", "VideoPlatIP", "");
     					String strVideoPlatPort = new MiscDB().get("00001", "VideoPlatPort", "");
     					String strVideoPlatUser = new MiscDB().get("00001", "VideoPlatUser", "");
     					String strVideoPlatPwd = new MiscDB().get("00001", "VideoPlatPwd", "");
     					VideoPlatFormZNGY  vpf = new VideoPlatFormZNGY(strVideoPlatIP,strVideoPlatPort,strVideoPlatUser,strVideoPlatPwd);
     					List<VideoPlat> imageInfoList = new ArrayList<VideoPlat>();
     					VideoPlat bean = new VideoPlat();
     					String filePath = filePath(flushDataMap.get("strOrgTsn"));//����ԭ������ˮ(���κ�)ȡ����Ӧ���ļ�·��
     					filePath = filePath+"business.png";
     					System.out.println("***************************:"+filePath);
     			  	    bean.setStrFilePath(filePath);
     			  	    try {
     			  	    	bean.setStrFileSize(String.valueOf(new FileInputStream(new File(filePath)).available()));
     					} catch (FileNotFoundException e) {
     						error.error("����ҵ�����뵥ʧ��(�Ҳ�����Ӧ��ҵ������ļ�):"+ e.getMessage() + "\r\n");
     					} catch (IOException e) {
     						error.error("����ҵ�����뵥ʧ��(ҵ������ļ�����):"+ e.getMessage() + "\r\n");
     					}
     			  	    imageInfoList.add(bean);
     			  	    VideoPlat entity = new VideoPlat();
     		  	        String strBusiStartTime = dtCur.getTransDateToView();//ҵ�����ʱ��
     				    entity.setStrBatchId(flushDataMap.get("strOrgTsn"));//���κ�
     				    entity.setStrBusiStartTime(strBusiStartTime);
     				    boolean ret = vpf.videoPlatUpload(entity,imageInfoList);
     				    if(!ret){//�����ϴ�ʧ��
	     					if(!"4".equals(strTransFlushNum))
	     					{
	     						System.out.println("----------------�޸��ظ��ϴ�����----------------");
	     						FlushData  flushData=  new FlushDataDB().getEntity(Integer.parseInt(flushDataMap.get("id")));
	     						if(entity != null ){
	     						  flushData.setFlushTimes(Integer.parseInt(strTransFlushNum) + 1);
	             				  new FlushDataDB().updateFlushDataState(flushData);
	     						}
	     					}
	     					else if("4".equals(strTransFlushNum))
	     					{
	     						//���ճ���ʧ�ܣ�ɾ���ظ��ϴ�������
		     		        	new FlushDataDB().deleteFlushDataByID(Integer.parseInt(flushDataMap.get("id")));
	     					}
     				    }else{
	     		        	System.out.println(">>>>>>>>>>>>>>>>>>>>>>:"+flushDataMap.get("id"));
	     		        	//ɾ���ظ��ϴ�������
	     		        	new FlushDataDB().deleteFlushDataByID(Integer.parseInt(flushDataMap.get("id")));
     				    }
     				}else{
	     				//��ֹ�������ļ��е��ֶβ�һ����������¸�ֵһ��
	     				map.put("strPan", flushDataMap.get("strPan"));
	     				map.put("strTransCode", flushDataMap.get("strTransCode"));
	     				//�������תΪ��Ϊ��λ
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
	     				map.put("strTerminalTsn", getTerminalTsn(flushDataMap.get("strTerminalNum")));//ϵͳ���ٺ�
	     		        map.put("strTransTime", dtCur.getDateTimeToView());//�ܿ������ڵ�ʱ�� hhmmss
	     		        map.put("strTransDate", dtCur.getTransDateToView());//�ܿ������ڵ���������yyyyMMdd
	     				//��һ�� ���ݽ�����ȡ�����������ļ�
	     		        String strPathXML = pathXML(flushDataMap.get("strTransCode"));
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
	     		        	error.error("����������ͨѶʧ��:"+e.getMessage());
	     		        }
	     		        if (iRet == 0)//���׳ɹ�����Ҫ�ѳ����������,���޸�ԭ������ˮ����״̬
	     		        {
	     		        	System.out.println(">>>>>>>>>>>>>>>>>>>>>>:"+flushDataMap.get("id"));
	     		        	//��һ��ɾ������������
	     		        	new FlushDataDB().deleteFlushDataByID(Integer.parseInt(flushDataMap.get("id")));
	     		        	//�ڶ������޸�ԭ������ˮ�ĳ���״̬
	     		        	OtherTransLog  entity = new OtherTransLogDB().getEntity(flushDataMap.get("strOrgTsn"));
	     		        	if(entity != null ){
	     		        		entity.setReverseStatus(RESTATUS_OK);
	     		        		new OtherTransLogDB().update(entity);
	     		        	}
	     		        }
	     				else
	     				{
	     					if(response.retCode != null && response.retCode.equals("2025"))//������Ϊ2025����ʾ��ԭ����
	     					{
	     						new FlushDataDB().deleteFlushDataByID(Integer.parseInt(flushDataMap.get("id")));
	     						//����ʧ�ܣ��޸�ԭ������ˮ�ĳ���״̬
	         		        	OtherTransLog  entity = new OtherTransLogDB().getEntity(flushDataMap.get("strOrgTsn"));
	         		        	if(entity != null ){
	         		        		entity.setReverseStatus(RESTATUS_UNCER);
	         		        		new OtherTransLogDB().update(entity);
	         		        	}
	    	       	        }
	     					else if(!"4".equals(strTransFlushNum))
	     					{
	     						System.out.println("----------------�޸ĳ�������----------------");
	     						FlushData entity =  new FlushDataDB().getEntity(Integer.parseInt(flushDataMap.get("id")));
	     						if(entity != null ){
	     						  entity.setFlushTimes(Integer.parseInt(strTransFlushNum) + 1);
	             				  new FlushDataDB().updateFlushDataState(entity);
	     						}
	     					}
	     					else if("4".equals(strTransFlushNum))
	     					{
	     						//���ճ���ʧ�ܣ��޸�ԭ������ˮ�ĳ���״̬
	         		        	OtherTransLog  entity = new OtherTransLogDB().getEntity(flushDataMap.get("strOrgTsn"));
	         		        	if(entity != null ){
	         		        		entity.setReverseStatus(RESTATUS_FAILED);
	         		        		new OtherTransLogDB().update(entity);
	         		        	}
	     					}
	     				}
	     				// �ѽ�����Ϣ�������
	     				notifyxViewProxy(response);
     			    }
     			}

			}
			catch(Exception e)
			{
				error.error("ȡ����������Ϣʧ��:"+e.getMessage());
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

    //ȡ����Ҫ���������ݼ�
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

	/**
	 * �������κ�ȡ����Ӧ���ļ�·��
	 * @return  �ļ��洢·��
	*/
    public String filePath(String strBatchId)
    {
    	String path = (getClass().getProtectionDomain().getCodeSource().getLocation().getPath()).substring(1, (getClass().getProtectionDomain().getCodeSource().getLocation().getPath()).indexOf("WEB-INF"));//��ȡ����·��
    	String classpath= File.separator + path+"File";
		StringBuffer filePath = new StringBuffer(64);
        filePath.append(classpath);
        filePath.append(File.separator);
        filePath.append(strBatchId);
        filePath.append(File.separator);
        path = filePath.toString();
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

	//��ȡ16λ�ն���ˮ��:8λ�ն˱�� + 8λ�ն���ˮ��
	public String getTerminalTsn(String strTerminalNum)
	{
		String strtm = "" + new Date().getTime();
		String str = strTerminalNum + strtm.substring(strtm.length() - 8, strtm.length());
		return str;
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
	 * �ѽ�����Ϣ������ط�����
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
			strFee = new DataConversion().fromFenToYuan(strFee);//��ת��ΪԪ
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
		//����ط��������ͽ�����ˮ
		if(map.get("strTransCode") != null && !map.get("strTransCode").equals("")){
			new LinxViewProxy().sendTransMsg(msg.toString());
		}
	}
}