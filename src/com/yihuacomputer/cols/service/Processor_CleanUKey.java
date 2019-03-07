package com.yihuacomputer.cols.service;

import com.yihuacomputer.cols.common.util.ColsTransMsg;
import com.yihuacomputer.cols.database.ExpLogDB;
import com.yihuacomputer.cols.database.UKeySettleCycleLogDB;
import com.yihuacomputer.cols.database.UKeyTransLogDB;
import com.yihuacomputer.cols.entity.UKeySettleCycleLog;
import com.yihuacomputer.cols.entity.UKeyTransLog;
import com.yihuacomputer.cols.monitor.LinxViewProxy;
import com.yihuacomputer.cols.util.DateCtrl;
import com.yihuacomputer.cols.util.MsgXmlDom;

public class Processor_CleanUKey extends Processor {

	public Processor_CleanUKey() {
		super();
	}

    protected String getTransName()
	{
		return "清UKey";
	}
	/**
	 * <p>
	 * 服务处理
	 * </p>
	 * @throws ProcessorException
	 */
	public void process() throws ProcessorException {
		String strTerminalNum = MsgXmlDom.getElementValue(domReq,"strTerminalNum");
		UKeySettleCycleLogDB ukeySettleCycleLogDB = new UKeySettleCycleLogDB();
		UKeySettleCycleLog  entity = ukeySettleCycleLogDB.getCurBatchNoEntity(strTerminalNum, 0);//0位未清UKey状态
		if(entity != null){
			entity.setStatus(1);//置为已清机状态
			entity.setDtEnd(new DateCtrl().getTimestamp());//该批次结束时间
			boolean ret = ukeySettleCycleLogDB.update(entity);
			if(!ret){
				throw new ProcessorException(TERMRETCODE_CLEANUKEY,TERMRETDESC_CLEANUKEY, TERMRETDESCEN_CLEANUKEY);
			}
			//修改流水表清存单状态
			UKeyTransLog bean = new UKeyTransLog();
			bean.setSettleCycleStatus(1);
			bean.setStrTerminalNum(strTerminalNum);
			new UKeyTransLogDB().updateStatus(bean);
			//把清UKey批次信息发送给监控
   		    ColsTransMsg msg = new ColsTransMsg();
   		    msg.put("strTerminalNum", strTerminalNum);
   		    msg.put("iTermBatchNo", String.valueOf(entity.getTermBatchNo()));
   		    msg.put("dtStart",  new DateCtrl(entity.getDtStart()).getDateTimeStrSimpleFull());
   		    msg.put("dtEnd", new DateCtrl(entity.getDtEnd()).getDateTimeStrSimpleFull());
   		    msg.put("iStatus", String.valueOf(1));
   		    msg.put("iUKeySurplusCount", String.valueOf(entity.getuKeySurplusCount()));
   		    msg.put("iUKeyRefillCount", String.valueOf(entity.getuKeyRefillCount()));
   		    new LinxViewProxy().sendUKeySettleCycleLogMsg_Clean(msg.toString());
   		    
   		     //删除吞UKEY明细
   			ExpLogDB  expLogDB = new ExpLogDB();
			expLogDB.removeUkeyExpLog(strTerminalNum);
   		    
   			//设置成功信息
   			setSucceedRespDom();
		}else
		throw new ProcessorException(TERMRETCODE_CLEANUKEY_NORECORD,TERMRETDESC_CLEANUKEY_NORECORD, TERMRETDESCEN_CLEANUKEY_NORECORD);
	}
}
