package com.yihuacomputer.cols.service;

import java.util.List;

import com.yihuacomputer.cols.database.CDSSettleCycleLogDB;
import com.yihuacomputer.cols.database.CDSTransLogDB;
import com.yihuacomputer.cols.database.CDSUnitStatusDB;
import com.yihuacomputer.cols.entity.CDSSettleCycleLog;
import com.yihuacomputer.cols.entity.CDSTransLog;
import com.yihuacomputer.cols.entity.CDSUnitStatus;
import com.yihuacomputer.cols.util.MsgXmlDom;

public class Processor_CDSUnitQueryCycle extends Processor {

	public Processor_CDSUnitQueryCycle() {
		super();
	}

    protected String getTransName()
	{
		return "存单箱信息查询";
	}
	/**
	 * <p>
	 * 服务处理
	 * </p>
	 * @throws ProcessorException
	 */
	public void process() throws ProcessorException {
		String cdsBoxInfoStr ="";//存单箱信息
		String strTerminalNum = MsgXmlDom.getElementValue(domReq,"strTerminalNum");
		CDSSettleCycleLogDB cdsSettleCycleLogDB = new CDSSettleCycleLogDB();
		CDSSettleCycleLog  cDSSettleCycleLog = cdsSettleCycleLogDB.getCurBatchNoEntity(strTerminalNum, 0);//0位未清存单状态
		//批次号为空
		if(cDSSettleCycleLog == null){	
			throw new ProcessorException(TERMRETCODE_CLEANCDS_NORECORD,TERMRETDESC_CLEANCDS_NORECORD, TERMRETDESCEN_CLEANCDS_NORECORD);
		}
		
		
		String cdsTransLogStr="";//本周期内交易明细信息
		//本周期内是否有加单数据
		String cdsSettleCyclMsg="";
		CDSUnitStatusDB cdsUnitStatusDB = new CDSUnitStatusDB();
		List<?> cdsUnitList = cdsUnitStatusDB.getCDSUnitList(strTerminalNum);
		if(cdsUnitList != null && cdsUnitList.size() > 0){
			for(int i=0; i < cdsUnitList.size(); i++){
				CDSUnitStatus entity = (CDSUnitStatus)cdsUnitList.get(i);
				cdsBoxInfoStr = cdsBoxInfoStr + entity.getCuNum()  + "," +
				                                  entity.getStrCuType() + "," +
						                          entity.getInitialCount() + "," +
				                                  entity.getCurCount() + "," +
						                          entity.getStrCuStatus()+ "," +
						                          entity.getStrCdsTrackStart()+ "," +
						                          entity.getStrCdsTrackEnd()+ "," +
						                          entity.getCdsSuccCount()+ "," +
						                          entity.getCdsCaptureCount()+ "," +
						                          entity.getCdsDestroyCount()+ "," +
						                          entity.getCdsUnknown()+ "," +
						                          entity.getCdsTakenCount()+ "|";
			}
		}else{
			//批次号不为空，但是不存在加单周期
			cdsBoxInfoStr="";
			cdsSettleCyclMsg="1";
		}

		//本周期内交易明细信息
		CDSTransLogDB  transLogDB = new CDSTransLogDB();
		List<?> list = transLogDB.getCDSBatchList(strTerminalNum);
		if(list != null && list.size() > 0){
			for(int i=0; i < list.size(); i++){
				CDSTransLog entity = (CDSTransLog)list.get(i);
				int iHostTxStatus=entity.getHostTxStatus();
				int iTermTxStatus=entity.getTermTxStatus();
				String strOCRNum=entity.getStrOCRNum();

				//没有交易或交易失败的都暂定为需要上交的
			     if(iHostTxStatus==-1||iHostTxStatus==1) continue;
			     
			     if(entity.getTransCode()==null)
					 continue;
				 
				 if(entity.getTransCode().equals("905107")||
						 entity.getTransCode().equals("905104")||
						 entity.getTransCode().equals("905103")
						 ){
				 }else  
					 continue;
			     
				cdsTransLogStr = cdsTransLogStr +
						strOCRNum + "," +
						 iHostTxStatus+ "," +
                         iTermTxStatus+ "|";
			}
		}

		//把存单箱信息数据进行分解，以,|进行分割
		//设置成功信息
		setSucceedRespDom();
		MsgXmlDom.setElementValue(domResp, "cdsBoxInfoStr", cdsBoxInfoStr);
		MsgXmlDom.setElementValue(domResp, "cdsTransLogStr", cdsTransLogStr);
		MsgXmlDom.setElementValue(domResp, "cdsSettleCyclMsg", cdsSettleCyclMsg);
	}
}
