package com.yihuacomputer.cols.service;

import org.apache.log4j.Logger;

import com.yihuacomputer.cols.database.CDSSettleCycleLogDB;
import com.yihuacomputer.cols.entity.CDSSettleCycleLog;
import com.yihuacomputer.cols.entity.CDSTransLog;
import com.yihuacomputer.cols.util.DateCtrl;
import com.yihuacomputer.cols.util.MsgXmlDom;

public class Processor_CDSSettleCycleStatus extends Processor {
	public Logger info = Logger.getLogger("Info");
	public Processor_CDSSettleCycleStatus() {
		super();
	}

    protected String getTransName()
	{
		return "获取当前设备周期状态";
	}
	/**
	 * <p>
	 * 服务处理
	 * </p>
	 * @throws ProcessorException
	 */
	public void process() throws ProcessorException {
		String strTerminalNum = MsgXmlDom.getElementValue(domReq,"strTerminalNum");
		System.out.println("strTerminalNum=="+strTerminalNum);
		CDSSettleCycleLogDB cdsSettleCycleLogDB = new CDSSettleCycleLogDB();
		int termBatchNo = 1;//批次号,默认从1开始
		boolean ret = false;
		//判断是否有过周期数据
		CDSSettleCycleLog cdsSettleCycleLog = cdsSettleCycleLogDB.getEntity(strTerminalNum);
		CDSSettleCycleLog  entity = cdsSettleCycleLogDB.getCurBatchNoEntity(strTerminalNum, 0);//0为已经有周期开始
		CDSSettleCycleLog bean = new CDSSettleCycleLog();
		if(cdsSettleCycleLog != null ){	
			if(entity == null || entity.equals("")){
				//未开启新周期，创建周期
				termBatchNo = cdsSettleCycleLog.getTermBatchNo() + 1;
				String dtDate = new DateCtrl().getDateTimeStrSimpleFull();
				bean.setStrTerminalNum(strTerminalNum);
				bean.setTermBatchNo(termBatchNo);
				bean.setDtStart(new DateCtrl().getStrToTimestamp(dtDate));
				bean.setStatus(0);
				bean.setCdsRefillCount(0);
				bean.setCdsSurplusCount(0);
				ret = cdsSettleCycleLogDB.save(bean);
			}else{
				//已经有新周期
				ret=true;
			}
		}else{
			//无周期数据,创建周期
			String dtDate = new DateCtrl().getDateTimeStrSimpleFull();
			bean.setStrTerminalNum(strTerminalNum);
			bean.setTermBatchNo(termBatchNo);
			bean.setDtStart(new DateCtrl().getStrToTimestamp(dtDate));
			bean.setStatus(0);
			bean.setCdsRefillCount(0);
			bean.setCdsSurplusCount(0);
			ret = cdsSettleCycleLogDB.save(bean);
		}
		if(!ret){
				info.info("销户创建新周期失败\r\n");
				throw new ProcessorException("0115","销户创建新周期失败", "CREATE CYCLE Error");
			}
		//设置成功信息
		setSucceedRespDom();

	}
}
