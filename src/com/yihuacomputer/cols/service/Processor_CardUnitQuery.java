package com.yihuacomputer.cols.service;

import java.sql.Timestamp;
import java.text.DateFormat;
import java.text.SimpleDateFormat;
import java.util.List;

import com.yihuacomputer.cols.database.CardSettleCycleLogDB;
import com.yihuacomputer.cols.database.CardTransLogDB;
import com.yihuacomputer.cols.database.CardUnitStatusDB;
import com.yihuacomputer.cols.database.ExpLogDB;
import com.yihuacomputer.cols.entity.CardSettleCycleLog;
import com.yihuacomputer.cols.entity.CardTransLog;
import com.yihuacomputer.cols.entity.CardUnitStatus;
import com.yihuacomputer.cols.entity.ExpLog;
import com.yihuacomputer.cols.util.MsgXmlDom;

public class Processor_CardUnitQuery extends Processor {

	public Processor_CardUnitQuery() {
		super();
	}

    protected String getTransName()
	{
		return "卡箱信息查询";
	}
	/**
	 * <p>
	 * 服务处理
	 * </p>
	 * @throws ProcessorException
	 */
	public void process() throws ProcessorException {
		String cardBoxInfoStr ="";//卡箱信息
		String cardTransLogStr="";//本周期内卡交易明细信息
		String strTerminalNum = MsgXmlDom.getElementValue(domReq,"strTerminalNum");
		CardSettleCycleLogDB cardSettleCycleLogDB = new CardSettleCycleLogDB();
		CardSettleCycleLog  cardSettleCycleLog = cardSettleCycleLogDB.getCurBatchNoEntity(strTerminalNum, 0);//0位未清卡状态
		if(cardSettleCycleLog == null){
			throw new ProcessorException(TERMRETCODE_CLEANCARD_NORECORD,TERMRETDESC_CLEANCARD_NORECORD, TERMRETDESCEN_CLEANCARD_NORECORD);
			
		}
		//卡箱统计信息
		CardUnitStatusDB cardUnitStatusDB = new CardUnitStatusDB();
		List<?> cardUnitList = cardUnitStatusDB.getCardUnitList(strTerminalNum);
		if(cardUnitList != null && cardUnitList.size() > 0){
			for(int i=0; i < cardUnitList.size(); i++){
				CardUnitStatus entity = (CardUnitStatus)cardUnitList.get(i);
				cardBoxInfoStr = cardBoxInfoStr + entity.getCuNum()  + "," +
				                                  entity.getStrCuType() + "," +
						                          entity.getInitialCount() + "," +
				                                  entity.getCurCount() + "," +
						                          entity.getStrCuStatus()+ "," +
						                          entity.getStrCardType()+ "," +
						                          entity.getStrCardTrackStart()+ "," +
						                          entity.getStrCardTrackEnd()+ "," +
						                          entity.getCardSuccCount()+ "," +
						                          entity.getCardCaptureCount()+ "," +
						                          entity.getCardDestroyCount()+ "," +
						                          entity.getCardUnknown()+ "," +
						                          entity.getCardTakenCount()+ "|";
			}
		}else{
			throw new ProcessorException(TERMRETCODE_CARDUNITQUERY,TERMRETDESC_CARDUNITQUERY, TERMRETDESCEN_CARDUNITQUERY);
		}
		//本周期内卡交易明细信息
		CardTransLogDB  transLogDB = new CardTransLogDB();
		List<?> list = transLogDB.getBatchList(strTerminalNum);
		if(list != null && list.size() > 0){
			for(int i=0; i < list.size(); i++){
				CardTransLog entity = (CardTransLog)list.get(i);
				int iHostTxStatus=entity.getHostTxStatus();
				int iTermTxStatus=entity.getTermTxStatus();
				String strPan=entity.getStrPan();
				String strCardType=entity.getStrCardType();
			     
				//没有交易或交易失败的都暂定为需要上交的
			     if(iHostTxStatus==-1||iHostTxStatus==1) continue;
			     
			     if(entity.getTransCode()==null)
					 continue;
			     
				 if(!entity.getTransCode().equals("901104") && !entity.getTransCode().equals("901301")
						 && !entity.getTransCode().equals("901401")){
					continue;
				 }
				 
				 cardTransLogStr = cardTransLogStr +
						 strPan + "," +
						 strCardType + "," +
						 iHostTxStatus+ "," +
                         iTermTxStatus+ "|";
			}
		}
//		else{
//			throw new ProcessorException(TERMRETCODE_CARD_TRANSLOG_QUERY,TERMRETDESC_CARD_TRANSLOG_QUERY, TERMRETDESCEN_CARD_TRANSLOG_QUERY);
//		}
		
		//本周期内吞card交易明细信息
		String explogInfoArr="";//本周期内吞card明细信息
		ExpLogDB  expLogDB = new ExpLogDB();
		List<?> listExpLog = expLogDB.getDispenserCardList(strTerminalNum);
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
		MsgXmlDom.setElementValue(domResp, "cardBoxInfoStr", cardBoxInfoStr);
		MsgXmlDom.setElementValue(domResp, "cardTransLogStr", cardTransLogStr);
		MsgXmlDom.setElementValue(domResp, "explogInfoStr", explogInfoArr);
	}
}
