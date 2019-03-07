package com.yihuacomputer.cols.service;

import java.sql.Timestamp;
import java.text.DateFormat;
import java.text.SimpleDateFormat;
import java.util.List;

import com.yihuacomputer.cols.common.util.ColsTransMsg;
import com.yihuacomputer.cols.database.CardSettleCycleLogDB;
import com.yihuacomputer.cols.database.CardTransLogDB;
import com.yihuacomputer.cols.database.ExpLogDB;
import com.yihuacomputer.cols.entity.CardSettleCycleLog;
import com.yihuacomputer.cols.entity.CardTransLog;
import com.yihuacomputer.cols.entity.ExpLog;
import com.yihuacomputer.cols.monitor.LinxViewProxy;
import com.yihuacomputer.cols.util.DateCtrl;
import com.yihuacomputer.cols.util.MsgXmlDom;

public class Processor_CleanCard extends Processor {

	public Processor_CleanCard() {
		super();
	}

    protected String getTransName()
	{
		return "清卡";
	}
	/**
	 * <p>
	 * 服务处理
	 * </p>
	 * @throws ProcessorException
	 */
	public void process() throws ProcessorException {
		String strTerminalNum = MsgXmlDom.getElementValue(domReq,"strTerminalNum");
		CardSettleCycleLogDB cardSettleCycleLogDB = new CardSettleCycleLogDB();
		CardSettleCycleLog  entity = cardSettleCycleLogDB.getCurBatchNoEntity(strTerminalNum, 0);//0位未清卡状态
		if(entity != null){
			entity.setStatus(1);//置为已清机状态
			entity.setDtEnd(new DateCtrl().getTimestamp());//该批次结束时间
			boolean ret = cardSettleCycleLogDB.update(entity);
			if(!ret){
				throw new ProcessorException(TERMRETCODE_CLEANCARD,TERMRETDESC_CLEANCARD, TERMRETDESCEN_CLEANCARD);
			}
			//修改流水表清卡状态
			CardTransLog bean = new CardTransLog();
			bean.setSettleCycleStatus(1);
			bean.setStrTerminalNum(strTerminalNum);
			new CardTransLogDB().updateStatus(bean);
			//把清卡批次信息发送给监控
   		    ColsTransMsg msg = new ColsTransMsg();
   		    msg.put("strTerminalNum", strTerminalNum);
   		    msg.put("iTermBatchNo", String.valueOf(entity.getTermBatchNo()));
   		    msg.put("dtStart",  new DateCtrl(entity.getDtStart()).getDateTimeStrSimpleFull());
   		    msg.put("dtEnd", new DateCtrl(entity.getDtEnd()).getDateTimeStrSimpleFull());
   		    msg.put("iStatus", String.valueOf(1));
   		    msg.put("iCardSurplusCount", String.valueOf(entity.getCardSurplusCount()));
   		    msg.put("iCardRefillCount", String.valueOf(entity.getCardRefillCount()));
   		    System.out.println(msg.toString());
   		    new LinxViewProxy().sendCardSettleCycleLogMsg_Clean(msg.toString());
		}else
			throw new ProcessorException(TERMRETCODE_CLEANCARD_NORECORD,TERMRETDESC_CLEANCARD_NORECORD, TERMRETDESCEN_CLEANCARD_NORECORD);



		String cardExplogInfoArr="";//本周期内吞卡明细信息
		//本周期内卡交易明细信息
		ExpLogDB  expLogDB = new ExpLogDB();
		List<?> list = expLogDB.getCardList(strTerminalNum);
		if(list != null && list.size() > 0){
			for(int i=0; i < list.size(); i++){
				ExpLog expEntity = (ExpLog)list.get(i);

				String strPan=expEntity.getStrPan();
				if(strPan==null) strPan="";
				String strExpCode=expEntity.getStrExpCode();
				if(strExpCode==null) strExpCode="";
				String strMemo=expEntity.getStrMemo();
				if(strMemo==null) strMemo="";
				 DateFormat sdf = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
				 Timestamp ts = expEntity.getDtOccur();
				 String tsStr = "";
				 tsStr = sdf.format(ts);

				 cardExplogInfoArr = cardExplogInfoArr +
						 strPan + "," +
						 strExpCode + "," +
						 strMemo+ "," +
						 tsStr+ "|";

			}

			 //删除吞卡明细
			expLogDB.removeCardExpLog(strTerminalNum);
		}
		//吞卡明细
		MsgXmlDom.setElementValue(domResp, "cardExplogInfoStr", cardExplogInfoArr);
		//设置成功信息
		setSucceedRespDom();
	}
}
