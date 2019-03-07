package com.yihuacomputer.cols.service;

import org.apache.log4j.Logger;

import com.yihuacomputer.cols.common.util.ColsTransMsg;
import com.yihuacomputer.cols.database.CDSSettleCycleLogDB;
import com.yihuacomputer.cols.database.CDSTransLogDB;
import com.yihuacomputer.cols.entity.CDSSettleCycleLog;
import com.yihuacomputer.cols.entity.CDSTransLog;
import com.yihuacomputer.cols.monitor.LinxViewProxy;
import com.yihuacomputer.cols.util.DateCtrl;
import com.yihuacomputer.cols.util.MsgXmlDom;

public class Processor_CleanCDSTrans extends Processor {
	public Logger info = Logger.getLogger("Info");
	public Processor_CleanCDSTrans() {
		super();
	}

    protected String getTransName()
	{
		return "轧账提交";
	}
	/**
	 * <p>
	 * 服务处理
	 * </p>
	 * @throws ProcessorException
	 */
	public void process() throws ProcessorException {
		String strTerminalNum = MsgXmlDom.getElementValue(domReq,"strTerminalNum");
		String strSuccessfulAcceptedCDS = MsgXmlDom.getElementValue(domReq,"successfulAcceptedCDS");
		CDSSettleCycleLogDB cdsSettleCycleLogDB = new CDSSettleCycleLogDB();
		CDSSettleCycleLog  entity = cdsSettleCycleLogDB.getCurBatchNoEntity(strTerminalNum, 0);//0位未清存单状态
		if(entity != null){
			//修改流水表轧账状态
			CDSTransLog bean = new CDSTransLog();
			//已经轧账数据标志位修改为3
			bean.setSettleCycleStatus(3);
			bean.setStrTerminalNum(strTerminalNum);
			bean.setTermBatchNo(entity.getTermBatchNo());
			new CDSTransLogDB().updateTranslogStatus(bean,strSuccessfulAcceptedCDS);
			info.info("CleanCDSTrans success:"+entity.getTermBatchNo()+"\r\n");
   			//设置成功信息
   			setSucceedRespDom();
		}else{
			info.info("CleanCDSTrans failed"+ "\r\n");
			throw new ProcessorException(TERMRETCODE_CLEANCDS_NORECORD,"轧账提交失败，无可轧账数据", TERMRETDESCEN_CLEANCDS_NORECORD);
		}
	}
}
