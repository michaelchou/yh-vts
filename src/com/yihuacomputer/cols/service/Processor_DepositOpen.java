package com.yihuacomputer.cols.service;


import org.apache.log4j.Logger;

import java.math.BigDecimal;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;

import com.yihuacomputer.cols.crypto.Base64;
import com.yihuacomputer.cols.database.CDSSettleCycleLogDB;
import com.yihuacomputer.cols.database.CDSTransLogDB;
import com.yihuacomputer.cols.entity.CDSSettleCycleLog;
import com.yihuacomputer.cols.entity.CDSTransLog;
import com.yihuacomputer.cols.util.DateCtrl;
import com.yihuacomputer.cols.util.MsgXmlDom;

public class Processor_DepositOpen extends Processor {

	public Logger error = Logger.getLogger("Error");
    protected Map<String, String> map = new HashMap<String, String>(100, 0.8f);
    //���κ�
    private int termBatchNo =0;

	public Processor_DepositOpen() {
		super();
	}

    protected String getTransName()
	{
		return "�浥��Ϣ��ѯ";
	}

	/**
	 * ������
	 */
	@SuppressWarnings("rawtypes")
	public void process() throws ProcessorException {
		String strIDCardNum = MsgXmlDom.getElementValue(domReq, "strIDCardNum");
		String strAuthIDCardNum = MsgXmlDom.getElementValue(domReq, "strAuthIDCardNum");	
		
        //ͳһ�����ܿ������ڵ�ʱ�� ���ܿ������ڵ��������ݡ�ϵͳ���ٺ�
        map.put("strTerminalTsn", getTerminalTsn());//ϵͳ���ٺ�
        map.put("strTransTime", dtCur.getDateTimeToView());//�ܿ������ڵ�ʱ�� hhmmss
        map.put("strTransDate", dtCur.getTransDateToView());//�ܿ������ڵ���������yyyyMMdd
        
        
        System.out.println("1111111111111111111111111111111111111111111111");
        
		//�Ȼ�ȡ��ǰ���׵����κ�
		//�Ȼ�ȡ��ǰ���׵����κ�
		CDSSettleCycleLog  cdsSettleCycleLog = new CDSSettleCycleLogDB().getCurBatchNoEntity(MsgXmlDom.getElementValue(domReq, "strTerminalNum"),0);
		if(cdsSettleCycleLog == null ){
			return;
		}
		termBatchNo = cdsSettleCycleLog.getTermBatchNo();
        
		//��������
		CDSTransLog entity = new CDSTransLog();
		entity.setStrTerminalNum(MsgXmlDom.getElementValue(domReq, "strTerminalNum"));
    	entity.setTransCode("901103");
    	
    	if(MsgXmlDom.getElementValue(domReq, "strOCRNum") == null || MsgXmlDom.getElementValue(domReq, "strOCRNum").equals("")){
    		entity.setStrOCRNum("00386763");
    	}else{   		
    		entity.setStrOCRNum(MsgXmlDom.getElementValue(domReq, "strOCRNum"));
    	}    	
    	
    	entity.setStrAccountNum(getTerminalTsn());
    	if(MsgXmlDom.getElementValue(domReq, "Amount") == null || MsgXmlDom.getElementValue(domReq, "Amount").equals("")){
    		BigDecimal amt = new BigDecimal("0"); //�ѽ��׽��ת����BigDecimal��
    		entity.setAmt(amt);
		}else{
			BigDecimal amt = new BigDecimal(MsgXmlDom.getElementValue(domReq, "Amount")); //�ѽ��׽��ת����BigDecimal��
			entity.setAmt(amt);
		}
    	
    	 System.out.println("222222==="+strIDCardNum+"==1111=="+getTerminalTsn());
    	 
    	 
    	entity.setDtOccur(new DateCtrl().getStrToTimestamp(dataFormat()));
    	if(strAuthIDCardNum == null || strAuthIDCardNum.equals("")){
    		entity.setStrIDCardNum(new Base64().encode(strIDCardNum.getBytes()));
    		entity.setStrAuthIDCardNum(new Base64().encode("1111".getBytes()));
    	}else{
    		entity.setStrIDCardNum(new Base64().encode(strAuthIDCardNum.getBytes()));
    		entity.setStrAuthIDCardNum(new Base64().encode(strIDCardNum.getBytes()));
    	}

    	entity.setTermTxStatus(0);//Ĭ��Ϊ0��δ����
    	entity.setHostTxStatus(0);
    	entity.setStrHostRetCode("0000");
    	entity.setStrHostSerialNo("1111");
    	entity.setStrCDSType("3504");
    	entity.setDtHostOccur(new DateCtrl().getStrToTimestamp(dataFormat()));    	    	
    	entity.setTermBatchNo(termBatchNo);
    	entity.setStrTermSerialNo(getTerminalTsn());
    	entity.setStrOrigstrTxSerialNo(getTerminalTsn());
    	entity.setStrSingleBusinessNum(MsgXmlDom.getElementValue(domReq, "strTransRandom"));
    	entity.setStrExInfo1(MsgXmlDom.getElementValue(domReq, "strCDtime"));//����
    	boolean str = new CDSTransLogDB().save(entity);  	
    	 System.out.println("3333333333333"+str);
		// ���óɹ���Ϣ
		setSucceedRespDom();
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
    /**
	 * ��ȡ16λ�ն���ˮ��:8λ�ն˱�� + 8λ�ն���ˮ��
	*/
	public String getTerminalTsn()
	{
		String strtm = "" + new Date().getTime();
		String str = MsgXmlDom.getElementValue(domReq, "strTerminalNum") + strtm.substring(strtm.length() - 8, strtm.length());
		return str;
	}
}
