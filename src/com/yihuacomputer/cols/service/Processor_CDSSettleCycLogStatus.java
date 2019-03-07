package com.yihuacomputer.cols.service;

import com.yihuacomputer.cols.database.CDSSettleCycleLogDB;
import com.yihuacomputer.cols.entity.CDSSettleCycleLog;
import com.yihuacomputer.cols.util.MsgXmlDom;

public class Processor_CDSSettleCycLogStatus extends Processor {

	public Processor_CDSSettleCycLogStatus() {
		super();
	}

    protected String getTransName()
	{
		return "获取清存单状态";
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
		if(entity != null){//有未清机的记录
				throw new ProcessorException(TERMRETCODE_NOCLEANCDS,TERMRETDESC_NOCLEANCDS, TERMRETDESCEN_NOCLEANCDS);
		}
		//设置成功信息
		setSucceedRespDom();
	}
}
