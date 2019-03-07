package com.yihuacomputer.cols.service;

import com.yihuacomputer.cols.database.UKeySettleCycleLogDB;
import com.yihuacomputer.cols.entity.UKeySettleCycleLog;
import com.yihuacomputer.cols.util.MsgXmlDom;

public class Processor_UKeySettleCycLogStatus extends Processor {

	public Processor_UKeySettleCycLogStatus() {
		super();
	}

    protected String getTransName()
	{
		return "获取清UKey状态";
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
		UKeySettleCycleLog  entity = ukeySettleCycleLogDB.getCurBatchNoEntity(strTerminalNum, 0);//0位未清卡状态
		if(entity != null){//有未清机的记录
				throw new ProcessorException(TERMRETCODE_NOCLEANUKEY,TERMRETDESC_NOCLEANUKEY, TERMRETDESCEN_NOCLEANUKEY);
		}
		//设置成功信息
		setSucceedRespDom();
	}
}
