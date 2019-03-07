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
		return "������Ϣ��ѯ";
	}
	/**
	 * <p>
	 * ������
	 * </p>
	 * @throws ProcessorException
	 */
	public void process() throws ProcessorException {
		String cardBoxInfoStr ="";//������Ϣ
		String cardTransLogStr="";//�������ڿ�������ϸ��Ϣ
		String strTerminalNum = MsgXmlDom.getElementValue(domReq,"strTerminalNum");
		CardSettleCycleLogDB cardSettleCycleLogDB = new CardSettleCycleLogDB();
		CardSettleCycleLog  cardSettleCycleLog = cardSettleCycleLogDB.getCurBatchNoEntity(strTerminalNum, 0);//0λδ�忨״̬
		if(cardSettleCycleLog == null){
			throw new ProcessorException(TERMRETCODE_CLEANCARD_NORECORD,TERMRETDESC_CLEANCARD_NORECORD, TERMRETDESCEN_CLEANCARD_NORECORD);
			
		}
		//����ͳ����Ϣ
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
		//�������ڿ�������ϸ��Ϣ
		CardTransLogDB  transLogDB = new CardTransLogDB();
		List<?> list = transLogDB.getBatchList(strTerminalNum);
		if(list != null && list.size() > 0){
			for(int i=0; i < list.size(); i++){
				CardTransLog entity = (CardTransLog)list.get(i);
				int iHostTxStatus=entity.getHostTxStatus();
				int iTermTxStatus=entity.getTermTxStatus();
				String strPan=entity.getStrPan();
				String strCardType=entity.getStrCardType();
			     
				//û�н��׻���ʧ�ܵĶ��ݶ�Ϊ��Ҫ�Ͻ���
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
		
		//����������card������ϸ��Ϣ
		String explogInfoArr="";//����������card��ϸ��Ϣ
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
		
		//�ѿ�����Ϣ���ݽ��зֽ⣬��,|���зָ�
		//���óɹ���Ϣ
		setSucceedRespDom();
		MsgXmlDom.setElementValue(domResp, "cardBoxInfoStr", cardBoxInfoStr);
		MsgXmlDom.setElementValue(domResp, "cardTransLogStr", cardTransLogStr);
		MsgXmlDom.setElementValue(domResp, "explogInfoStr", explogInfoArr);
	}
}
