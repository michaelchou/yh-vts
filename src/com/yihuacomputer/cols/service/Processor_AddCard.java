package com.yihuacomputer.cols.service;

import java.util.ArrayList;
import java.util.List;

import com.yihuacomputer.cols.common.util.ColsTransMsg;
import com.yihuacomputer.cols.database.CardSettleCycleLogDB;
import com.yihuacomputer.cols.database.CardUnitStatusDB;
import com.yihuacomputer.cols.entity.CardSettleCycleLog;
import com.yihuacomputer.cols.entity.CardUnitStatus;
import com.yihuacomputer.cols.monitor.LinxViewProxy;
import com.yihuacomputer.cols.util.DateCtrl;
import com.yihuacomputer.cols.util.MsgXmlDom;

public class Processor_AddCard extends Processor {

	public Processor_AddCard() {
		super();
	}

    protected String getTransName()
	{
		return "�ӿ�ҵ��";
	}
	/**
	 * ������
	 */
	public void process() throws ProcessorException {
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
						throw new ProcessorException(TERMRETCODE_ADDCARD,TERMRETDESC_ADDCARD, TERMRETDESCEN_ADDCARD);
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
					throw new ProcessorException(TERMRETCODE_ADDCARD,TERMRETDESC_ADDCARD, TERMRETDESCEN_ADDCARD);
				}
			}else{
				throw new ProcessorException(TERMRETCODE_ADDCARD,TERMRETDESC_ADDCARD, TERMRETDESCEN_ADDCARD);
			}
		}catch(Exception e){
			throw new ProcessorException(TERMRETCODE_INNERR,TERMRETDESC_INNERR, TERMRETDESCEN_INNERR);
		}
	    // ���óɹ���Ϣ
		setSucceedRespDom();
	}
}
