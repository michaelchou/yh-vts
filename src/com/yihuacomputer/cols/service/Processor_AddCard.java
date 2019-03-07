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
		return "加卡业务";
	}
	/**
	 * 服务处理
	 */
	public void process() throws ProcessorException {
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
						throw new ProcessorException(TERMRETCODE_ADDCARD,TERMRETDESC_ADDCARD, TERMRETDESCEN_ADDCARD);
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
					throw new ProcessorException(TERMRETCODE_ADDCARD,TERMRETDESC_ADDCARD, TERMRETDESCEN_ADDCARD);
				}
			}else{
				throw new ProcessorException(TERMRETCODE_ADDCARD,TERMRETDESC_ADDCARD, TERMRETDESCEN_ADDCARD);
			}
		}catch(Exception e){
			throw new ProcessorException(TERMRETCODE_INNERR,TERMRETDESC_INNERR, TERMRETDESCEN_INNERR);
		}
	    // 设置成功信息
		setSucceedRespDom();
	}
}
