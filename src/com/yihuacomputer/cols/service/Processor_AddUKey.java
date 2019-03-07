package com.yihuacomputer.cols.service;

import java.util.ArrayList;
import java.util.List;

import com.yihuacomputer.cols.common.util.ColsTransMsg;
import com.yihuacomputer.cols.database.UKeySettleCycleLogDB;
import com.yihuacomputer.cols.database.UKeyUnitStatusDB;
import com.yihuacomputer.cols.entity.UKeySettleCycleLog;
import com.yihuacomputer.cols.entity.UKeyUnitStatus;
import com.yihuacomputer.cols.monitor.LinxViewProxy;
import com.yihuacomputer.cols.util.DateCtrl;
import com.yihuacomputer.cols.util.MsgXmlDom;

public class Processor_AddUKey extends Processor {

	public Processor_AddUKey() {
		super();
	}

    protected String getTransName()
	{
		return "加UKey业务";
	}
	/**
	 * 服务处理
	 */
	public void process() throws ProcessorException {
		try{
			//对CARDUNITSTATUS表进行操作  顺序：UKey箱索引号,UKey箱类型,初始张数,当前张数,UKey箱状态,UKey类型,开始UKeybin,结束UKeybin
			int ukeyRefillCount = 0;//初始卡数总张数
			String strTerminalNum = MsgXmlDom.getElementValue(domReq,"strTerminalNum");
			String ukeyBox[] = MsgXmlDom.getElementValue(domReq,"ukeyBoxInfoStr").split("\\|");//一个数组元素代表一个发卡箱信息
			UKeyUnitStatusDB ukeyUnitStatusDB = new UKeyUnitStatusDB();
			List<UKeyUnitStatus> ukeyList = new ArrayList<UKeyUnitStatus>();
			if(ukeyList != null && ukeyBox.length >0){
				for(int i=0;i<ukeyBox.length;i++){
					String ukeyBoxInfo[] = ukeyBox[i].split(",");//一个数组元素代表某个卡箱的某个属性
					int cuNum = Integer.parseInt(ukeyBoxInfo[0]);//卡箱索引号
					String strCuType = ukeyBoxInfo[1];//卡箱类型
					System.out.println(strCuType);
					int initialCount = Integer.parseInt(ukeyBoxInfo[2]);//初始张数
					ukeyRefillCount =  ukeyRefillCount + initialCount;//计算整个机器加的总张数
					int curCount = Integer.parseInt(ukeyBoxInfo[3]);//当前张数
					String strCuStatus = ukeyBoxInfo[4];//卡箱状态
					System.out.println(strCuStatus);
					String strUKeyType = ukeyBoxInfo[5];//卡类型
					System.out.println(strUKeyType);
					String strUKeyTrackStart = ukeyBoxInfo[6];//开始卡bin
					System.out.println(strUKeyTrackStart);
					String strUKeyTrackEnd = ukeyBoxInfo[7];//结束卡bin
					System.out.println(strUKeyTrackEnd);
					UKeyUnitStatus ukeyUnitStatus = new UKeyUnitStatus();
					ukeyUnitStatus.setStrTerminalNum(strTerminalNum);
					ukeyUnitStatus.setCuNum(cuNum);
					ukeyUnitStatus.setStrCuType(strCuType);
					ukeyUnitStatus.setInitialCount(initialCount);
					ukeyUnitStatus.setCurCount(curCount);
					ukeyUnitStatus.setStrCuStatus(strCuStatus);
					ukeyUnitStatus.setStrUKeyType(strUKeyType);
					ukeyUnitStatus.setStrUKeyTrackStart(strUKeyTrackStart);
					ukeyUnitStatus.setStrUKeyTrackEnd(strUKeyTrackEnd);
					ukeyUnitStatus.setuKeySuccCount(0);
					ukeyUnitStatus.setuKeyCaptureCount(0);
					ukeyUnitStatus.setuKeyDestroyCount(0);
					ukeyUnitStatus.setuKeyUnknown(0);
					ukeyUnitStatus.setuKeyTakenCount(0);
					ukeyList.add(ukeyUnitStatus);
				}
			}
			boolean ret = ukeyUnitStatusDB.delete(strTerminalNum);//先删除历史数据
			System.out.println("ret1="+ret);
			if(ret){
				System.out.print("ukeyList:"+ukeyList);
				System.out.print("ukeyList:"+ukeyList.size());
				ret = ukeyUnitStatusDB.insert(ukeyList);
				System.out.println("ret2="+ret);
				if(ret){
					//把加Ukey信息发送给监控
					new LinxViewProxy().sendUKeyUnitStatusMsg(ukeyList);
					//修改批次表
					int termBatchNo = 1;//批次号,默认从1开始
					UKeySettleCycleLogDB ukeySettleCycleLogDB = new UKeySettleCycleLogDB();
					UKeySettleCycleLog entity = ukeySettleCycleLogDB.getEntity(strTerminalNum);
					if(entity != null ){
						termBatchNo = entity.getTermBatchNo() + 1;
					}
					UKeySettleCycleLog  ukeySettleCycleLog = new  UKeySettleCycleLog();
					String dtDate = new DateCtrl().getDateTimeStrSimpleFull();
					ukeySettleCycleLog.setStrTerminalNum(strTerminalNum);
					ukeySettleCycleLog.setTermBatchNo(termBatchNo);
					ukeySettleCycleLog.setDtStart(new DateCtrl().getStrToTimestamp(dtDate));
					ukeySettleCycleLog.setStatus(0);
					ukeySettleCycleLog.setuKeyRefillCount(ukeyRefillCount);
					ukeySettleCycleLog.setuKeySurplusCount(ukeyRefillCount);
					ret = ukeySettleCycleLogDB.save(ukeySettleCycleLog);
					System.out.println("ret3="+ret);
					if(!ret){
						throw new ProcessorException(TERMRETCODE_ADDUKEY,TERMRETDESC_ADDUKEY, TERMRETDESCEN_ADDUKEY);
					}
					//把加UKey批次信息发送给监控
	       		    ColsTransMsg msg = new ColsTransMsg();
	       		    msg.put("strTerminalNum", strTerminalNum);
	       		    msg.put("iTermBatchNo", String.valueOf(termBatchNo));
	       		    msg.put("dtStart", dtDate);
	       		    msg.put("iStatus", String.valueOf(0));
	       		    msg.put("iUKeySurplusCount", String.valueOf(ukeyRefillCount));
	       		    msg.put("iUKeyRefillCount", String.valueOf(ukeyRefillCount));
	       		    new LinxViewProxy().sendUKeySettleCycleLogMsg(msg.toString());
				}else{
					throw new ProcessorException(TERMRETCODE_ADDUKEY,TERMRETDESC_ADDUKEY, TERMRETDESCEN_ADDUKEY);
				}
			}else{
				throw new ProcessorException(TERMRETCODE_ADDUKEY,TERMRETDESC_ADDUKEY, TERMRETDESCEN_ADDUKEY);
			}
		}catch(Exception e){
			throw new ProcessorException(TERMRETCODE_INNERR,TERMRETDESC_INNERR, TERMRETDESCEN_INNERR);
		}
	    // 设置成功信息
		setSucceedRespDom();
	}
}
