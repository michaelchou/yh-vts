package com.yihuacomputer.cols.service;

import java.sql.Timestamp;
import java.text.DateFormat;
import java.text.SimpleDateFormat;
import java.util.List;

import com.yihuacomputer.cols.database.CardTransLogDB;
import com.yihuacomputer.cols.database.ExpLogDB;
import com.yihuacomputer.cols.database.UKeySettleCycleLogDB;
import com.yihuacomputer.cols.database.UKeyTransLogDB;
import com.yihuacomputer.cols.database.UKeyUnitStatusDB;
import com.yihuacomputer.cols.entity.CardTransLog;
import com.yihuacomputer.cols.entity.ExpLog;
import com.yihuacomputer.cols.entity.UKeySettleCycleLog;
import com.yihuacomputer.cols.entity.UKeyTransLog;
import com.yihuacomputer.cols.entity.UKeyUnitStatus;
import com.yihuacomputer.cols.util.MsgXmlDom;

public class Processor_UKeyUnitQuery extends Processor {

	public Processor_UKeyUnitQuery() {
		super();
	}

    protected String getTransName()
	{
		return "UKey箱信息查询";
	}
	/**
	 * <p>
	 * 服务处理
	 * </p>
	 * @throws ProcessorException
	 */
	public void process() throws ProcessorException {
		String ukeyBoxInfoStr ="";//Ukey箱信息
		String ukeyTransLogStr="";//本周期内交易明细信息
		String strTerminalNum = MsgXmlDom.getElementValue(domReq,"strTerminalNum");
		UKeySettleCycleLogDB ukeySettleCycleLogDB = new UKeySettleCycleLogDB();
		UKeySettleCycleLog  uKeySettleCycleLog = ukeySettleCycleLogDB.getCurBatchNoEntity(strTerminalNum, 0);//0位未清UKey状态
		if(uKeySettleCycleLog == null){
			throw new ProcessorException(TERMRETCODE_CLEANUKEY_NORECORD,TERMRETDESC_CLEANUKEY_NORECORD, TERMRETDESCEN_CLEANUKEY_NORECORD);
		}
		
		UKeyUnitStatusDB ukeyUnitStatusDB = new UKeyUnitStatusDB();
		List<?> ukeyUnitList = ukeyUnitStatusDB.getUKeyUnitList(strTerminalNum);
		if(ukeyUnitList != null && ukeyUnitList.size() > 0){
			for(int i=0; i < ukeyUnitList.size(); i++){
				UKeyUnitStatus entity = (UKeyUnitStatus)ukeyUnitList.get(i);
				ukeyBoxInfoStr = ukeyBoxInfoStr + entity.getCuNum()  + "," +
				                                  entity.getStrCuType() + "," +
						                          entity.getInitialCount() + "," +
				                                  entity.getCurCount() + "," +
						                          entity.getStrCuStatus()+ "," +
						                          entity.getStrUKeyType()+ "," +
						                          entity.getStrUKeyTrackStart()+ "," +
						                          entity.getStrUKeyTrackEnd()+ "," +
						                          entity.getuKeySuccCount()+ "," +
						                          entity.getuKeyCaptureCount()+ "," +
						                          entity.getuKeyDestroyCount()+ "," +
						                          entity.getuKeyUnknown()+ "," +
						                          entity.getuKeyTakenCount()+ "|";
			}
		}else{
			throw new ProcessorException(TERMRETCODE_UKEYUNITQUERY,TERMRETDESC_UKEYUNITQUERY, TERMRETDESCEN_UKEYUNITQUERY);
		}
		
		//本周期内交易明细信息
		UKeyTransLogDB  transLogDB = new UKeyTransLogDB();
		List<?> list = transLogDB.getBatchList(strTerminalNum);
		if(list != null && list.size() > 0){
			for(int i=0; i < list.size(); i++){
				UKeyTransLog entity = (UKeyTransLog)list.get(i);
				int iHostTxStatus=entity.getHostTxStatus();
				int iTermTxStatus=entity.getTermTxStatus();
				String strUkeyNum=entity.getStrUKeyNum();
				//没有交易或交易失败的都暂定为需要上交的
			     if(iHostTxStatus==-1||iHostTxStatus==1) continue;
			     if(entity.getTransCode()==null)
						 continue;
				     
					 if(!entity.getTransCode().equals("908201")){
						continue;
					 }
				 ukeyTransLogStr = ukeyTransLogStr +
						 strUkeyNum + "," +
						 iHostTxStatus+ "," +
                         iTermTxStatus+ "|";
			}
		}
		
		//本周期内吞key交易明细信息
				String explogInfoArr="";//本周期内吞key明细信息
				ExpLogDB  expLogDB = new ExpLogDB();
				List<?> listExpLog = expLogDB.getDispenserKeyList(strTerminalNum);
				if(listExpLog != null && listExpLog.size() > 0){
					for(int i=0; i < listExpLog.size(); i++){
						ExpLog entity = (ExpLog)listExpLog.get(i);
						
						String strPan=entity.getStrPan();
						if(strPan==null) strPan="";
						String strExpCode=entity.getStrExpCode();
						if(strExpCode==null) strExpCode="";
						String strMemo=entity.getStrMemo();
						if(strMemo==null) strMemo="";
						 DateFormat sdf = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
						 Timestamp ts = entity.getDtOccur();
						 String tsStr = "";
						 tsStr = sdf.format(ts);
						 
						 explogInfoArr = explogInfoArr +
								 strPan + "," +
								 strExpCode + "," +
								 strMemo+ "," +
								 tsStr+ "|";
						
					}
					
					 System.out.println(explogInfoArr);
				}
		
		//把卡箱信息数据进行分解，以,|进行分割
		//设置成功信息
		setSucceedRespDom();
		MsgXmlDom.setElementValue(domResp, "ukeyBoxInfoStr", ukeyBoxInfoStr);
		MsgXmlDom.setElementValue(domResp, "ukeyTransLogStr", ukeyTransLogStr);
		MsgXmlDom.setElementValue(domResp, "explogInfoStr", explogInfoArr);
	}
}
