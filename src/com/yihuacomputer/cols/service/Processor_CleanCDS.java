package com.yihuacomputer.cols.service;

import org.apache.log4j.Logger;

import com.yihuacomputer.cols.common.util.ColsTransMsg;
import com.yihuacomputer.cols.database.CDSSettleCycleLogDB;
import com.yihuacomputer.cols.database.CDSTransLogDB;
import com.yihuacomputer.cols.database.CDSUnitStatusDB;
import com.yihuacomputer.cols.entity.CDSSettleCycleLog;
import com.yihuacomputer.cols.entity.CDSTransLog;
import com.yihuacomputer.cols.monitor.LinxViewProxy;
import com.yihuacomputer.cols.util.DateCtrl;
import com.yihuacomputer.cols.util.MsgXmlDom;

public class Processor_CleanCDS extends Processor {

	public Processor_CleanCDS() {
		super();
	}

    protected String getTransName()
	{
		return "清存单";
	}
	/**
	 * <p>
	 * 服务处理
	 * </p>
	 * @throws ProcessorException
	 */
	public void process() throws ProcessorException {
		String strTerminalNum = MsgXmlDom.getElementValue(domReq,"strTerminalNum");
		CDSSettleCycleLogDB cdsSettleCycleLogDB = new CDSSettleCycleLogDB();
		CDSSettleCycleLog  entity = cdsSettleCycleLogDB.getCurBatchNoEntity(strTerminalNum, 0);//0位未清存单状态
		if(entity != null){
			entity.setStatus(1);//置为已清机状态
			entity.setDtEnd(new DateCtrl().getTimestamp());//该批次结束时间
			boolean ret = cdsSettleCycleLogDB.update(entity);
			if(!ret){
				throw new ProcessorException(TERMRETCODE_CLEANCDS,TERMRETDESC_CLEANCDS, TERMRETDESCEN_CLEANCDS);
			}
			//修改流水表清存单状态
			CDSTransLog bean = new CDSTransLog();
			bean.setSettleCycleStatus(1);
			bean.setStrTerminalNum(strTerminalNum);
			new CDSTransLogDB().updateStatus(bean);
			//清空加单数据
			CDSUnitStatusDB cdsUnitStatusDB = new CDSUnitStatusDB();
			boolean rets = cdsUnitStatusDB.delete(strTerminalNum);//先删除历史数据
			if(!rets){
				throw new ProcessorException(TERMRETCODE_CLEANCDS,TERMRETDESC_CLEANCDS, TERMRETDESCEN_CLEANCDS);
			}
			//把清存单批次信息发送给监控
   		    ColsTransMsg msg = new ColsTransMsg();
   		    msg.put("strTerminalNum", strTerminalNum);
 		    msg.put("iTermBatchNo", String.valueOf(entity.getTermBatchNo()));
 		    msg.put("dtStart",  new DateCtrl(entity.getDtStart()).getDateTimeStrSimpleFull());
 		    msg.put("dtEnd", new DateCtrl(entity.getDtEnd()).getDateTimeStrSimpleFull());
 		    msg.put("iStatus", String.valueOf(1));
   		    msg.put("iDepSurplusCount", String.valueOf(entity.getCdsSurplusCount()));
   		    msg.put("iDepRefillCount", String.valueOf(entity.getCdsRefillCount()));
   		    new LinxViewProxy().sendCDSSettleCycleLogMsg_Clean(msg.toString());
   			//设置成功信息
   			setSucceedRespDom();
		}else
			throw new ProcessorException(TERMRETCODE_CLEANCDS_NORECORD,TERMRETDESC_CLEANCDS_NORECORD, TERMRETDESCEN_CLEANCDS_NORECORD);
	}
}
