package com.yihuacomputer.cols.service;

import java.util.ArrayList;
import java.util.List;

import com.yihuacomputer.cols.common.util.ColsTransMsg;
import com.yihuacomputer.cols.database.CDSSettleCycleLogDB;
import com.yihuacomputer.cols.database.CDSUnitStatusDB;
import com.yihuacomputer.cols.entity.CDSSettleCycleLog;
import com.yihuacomputer.cols.entity.CDSUnitStatus;
import com.yihuacomputer.cols.monitor.LinxViewProxy;
import com.yihuacomputer.cols.util.DateCtrl;
import com.yihuacomputer.cols.util.MsgXmlDom;

public class Processor_AddCDS extends Processor {

	public Processor_AddCDS() {
		super();
	}

    protected String getTransName()
	{
		return "加存单业务";
	}
	/**
	 * 服务处理
	 */
	public void process() throws ProcessorException {
		try{
			//对COLS_CARDUNITSTATUS表进行操作  顺序：存单箱索引号,存单箱类型,初始张数,当前张数,存单箱状态,开始卡bin,结束卡bin
			int cdsRefillCount = 0;//初始存单总张数
			String strTerminalNum = MsgXmlDom.getElementValue(domReq,"strTerminalNum");
			String cdsBox[] = MsgXmlDom.getElementValue(domReq,"cdsBoxInfoStr").split("\\|");//一个数组元素代表一个发卡箱信息
			CDSUnitStatusDB cdsUnitStatusDB = new CDSUnitStatusDB();
			List<CDSUnitStatus> cdsList = new ArrayList<CDSUnitStatus>();
			if(cdsBox != null && cdsBox.length >0){
				for(int i=0;i<cdsBox.length;i++){
					String cdsBoxInfo[] = cdsBox[i].split(",");//一个数组元素代表某个卡箱的某个属性
					int cuNum = Integer.parseInt(cdsBoxInfo[0]);//存单箱索引号
					String strCuType = cdsBoxInfo[1];//存单箱类型
					int initialCount = Integer.parseInt(cdsBoxInfo[2]);//初始张数
					cdsRefillCount =  cdsRefillCount + initialCount;//计算整个机器加的总张数
					int curCount = Integer.parseInt(cdsBoxInfo[3]);//当前张数
					String strCuStatus = cdsBoxInfo[4];//存单箱状态
					String strCdsTrackStart = cdsBoxInfo[5];//开始卡bin
					String strCdsTrackEnd = cdsBoxInfo[6];//结束卡bin
					CDSUnitStatus cdsUnitStatus = new CDSUnitStatus();
					cdsUnitStatus.setStrTerminalNum(strTerminalNum);
					cdsUnitStatus.setCuNum(cuNum);
					cdsUnitStatus.setStrCuType(strCuType);
					cdsUnitStatus.setInitialCount(initialCount);
					cdsUnitStatus.setCurCount(curCount);
					cdsUnitStatus.setStrCuStatus(strCuStatus);
					cdsUnitStatus.setStrCdsTrackStart(strCdsTrackStart);
					cdsUnitStatus.setStrCdsTrackEnd(strCdsTrackEnd);
					cdsUnitStatus.setCdsSuccCount(0);
					cdsUnitStatus.setCdsCaptureCount(0);
					cdsUnitStatus.setCdsDestroyCount(0);
					cdsUnitStatus.setCdsUnknown(0);
					cdsUnitStatus.setCdsTakenCount(0);
					cdsList.add(cdsUnitStatus);
				}
			}
			boolean ret = cdsUnitStatusDB.delete(strTerminalNum);//先删除历史数据
			if(ret){
				ret = cdsUnitStatusDB.insert(cdsList);
				if(ret){
					//把加存单信息发送给监控
					new LinxViewProxy().sendDepositReceiptStatusMsg(cdsList);
					//修改批次表
					int termBatchNo = 1;//批次号,默认从1开始
					CDSSettleCycleLogDB cdsSettleCycleLogDB = new CDSSettleCycleLogDB();
					CDSSettleCycleLog entity = cdsSettleCycleLogDB.getEntity(strTerminalNum);
					if(entity != null ){
						termBatchNo = entity.getTermBatchNo() + 1;
					}
					CDSSettleCycleLog  cdsSettleCycleLog = new  CDSSettleCycleLog();
					String dtDate = new DateCtrl().getDateTimeStrSimpleFull();
					cdsSettleCycleLog.setStrTerminalNum(strTerminalNum);
					cdsSettleCycleLog.setTermBatchNo(termBatchNo);
					cdsSettleCycleLog.setDtStart(new DateCtrl().getStrToTimestamp(dtDate));
					cdsSettleCycleLog.setStatus(0);
					cdsSettleCycleLog.setCdsRefillCount(cdsRefillCount);
					cdsSettleCycleLog.setCdsSurplusCount(cdsRefillCount);
					ret = cdsSettleCycleLogDB.save(cdsSettleCycleLog);
					if(!ret){
						throw new ProcessorException(TERMRETCODE_ADDCDS,TERMRETDESC_ADDCDS, TERMRETDESCEN_ADDCDS);
					}
					//把加存单批次信息发送给监控
	       		    ColsTransMsg msg = new ColsTransMsg();
	       		    msg.put("strTerminalNum", strTerminalNum);
	       		    msg.put("iTermBatchNo", String.valueOf(termBatchNo));
	       		    msg.put("dtStart", dtDate);
	       		    msg.put("iStatus", String.valueOf(0));
	       		    msg.put("iDepSurplusCount", String.valueOf(cdsRefillCount));
	       		    msg.put("iDepRefillCount", String.valueOf(cdsRefillCount));
	       		    new LinxViewProxy().sendCDSSettleCycleLogMsg(msg.toString());
				}else{
					throw new ProcessorException(TERMRETCODE_ADDCDS,TERMRETDESC_ADDCDS, TERMRETDESCEN_ADDCDS);
				}
			}else{
				throw new ProcessorException(TERMRETCODE_ADDCDS,TERMRETDESC_ADDCDS, TERMRETDESCEN_ADDCDS);
			}
		}catch(Exception e){
			e.printStackTrace();
			throw new ProcessorException(TERMRETCODE_INNERR,TERMRETDESC_INNERR, TERMRETDESCEN_INNERR);
		}
	    // 设置成功信息
		setSucceedRespDom();
	}
}
