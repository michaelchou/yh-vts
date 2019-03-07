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
    //批次号
    private int termBatchNo =0;

	public Processor_DepositOpen() {
		super();
	}

    protected String getTransName()
	{
		return "存单信息查询";
	}

	/**
	 * 服务处理
	 */
	@SuppressWarnings("rawtypes")
	public void process() throws ProcessorException {
		String strIDCardNum = MsgXmlDom.getElementValue(domReq, "strIDCardNum");
		String strAuthIDCardNum = MsgXmlDom.getElementValue(domReq, "strAuthIDCardNum");	
		
        //统一增加受卡方所在地时间 、受卡方所在地日期数据、系统跟踪号
        map.put("strTerminalTsn", getTerminalTsn());//系统跟踪号
        map.put("strTransTime", dtCur.getDateTimeToView());//受卡方所在地时间 hhmmss
        map.put("strTransDate", dtCur.getTransDateToView());//受卡方所在地日期数据yyyyMMdd
        
        
        System.out.println("1111111111111111111111111111111111111111111111");
        
		//先获取当前交易的批次号
		//先获取当前交易的批次号
		CDSSettleCycleLog  cdsSettleCycleLog = new CDSSettleCycleLogDB().getCurBatchNoEntity(MsgXmlDom.getElementValue(domReq, "strTerminalNum"),0);
		if(cdsSettleCycleLog == null ){
			return;
		}
		termBatchNo = cdsSettleCycleLog.getTermBatchNo();
        
		//保存数据
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
    		BigDecimal amt = new BigDecimal("0"); //把交易金额转化成BigDecimal型
    		entity.setAmt(amt);
		}else{
			BigDecimal amt = new BigDecimal(MsgXmlDom.getElementValue(domReq, "Amount")); //把交易金额转化成BigDecimal型
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

    	entity.setTermTxStatus(0);//默认为0，未动作
    	entity.setHostTxStatus(0);
    	entity.setStrHostRetCode("0000");
    	entity.setStrHostSerialNo("1111");
    	entity.setStrCDSType("3504");
    	entity.setDtHostOccur(new DateCtrl().getStrToTimestamp(dataFormat()));    	    	
    	entity.setTermBatchNo(termBatchNo);
    	entity.setStrTermSerialNo(getTerminalTsn());
    	entity.setStrOrigstrTxSerialNo(getTerminalTsn());
    	entity.setStrSingleBusinessNum(MsgXmlDom.getElementValue(domReq, "strTransRandom"));
    	entity.setStrExInfo1(MsgXmlDom.getElementValue(domReq, "strCDtime"));//存期
    	boolean str = new CDSTransLogDB().save(entity);  	
    	 System.out.println("3333333333333"+str);
		// 设置成功信息
		setSucceedRespDom();
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
    /**
	 * 获取16位终端流水号:8位终端编号 + 8位终端流水号
	*/
	public String getTerminalTsn()
	{
		String strtm = "" + new Date().getTime();
		String str = MsgXmlDom.getElementValue(domReq, "strTerminalNum") + strtm.substring(strtm.length() - 8, strtm.length());
		return str;
	}
}
