package com.yihuacomputer.cols.service;

import com.yihuacomputer.cols.database.CardSettleCycleLogDB;
import com.yihuacomputer.cols.entity.CardSettleCycleLog;
import com.yihuacomputer.cols.util.MsgXmlDom;

public class Processor_CardSettleCycLogStatus extends Processor {

	public Processor_CardSettleCycLogStatus() {
		super();
	}

    protected String getTransName()
	{
		return "获取清卡状态";
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
		if(entity != null){//有未清机的记录
				throw new ProcessorException(TERMRETCODE_NOCLEANCARD,TERMRETDESC_NOCLEANCARD, TERMRETDESCEN_NOCLEANCARD);
		}
		//设置成功信息
		setSucceedRespDom();
	}
}
