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
		return "��UKeyҵ��";
	}
	/**
	 * ������
	 */
	public void process() throws ProcessorException {
		try{
			//��CARDUNITSTATUS����в���  ˳��UKey��������,UKey������,��ʼ����,��ǰ����,UKey��״̬,UKey����,��ʼUKeybin,����UKeybin
			int ukeyRefillCount = 0;//��ʼ����������
			String strTerminalNum = MsgXmlDom.getElementValue(domReq,"strTerminalNum");
			String ukeyBox[] = MsgXmlDom.getElementValue(domReq,"ukeyBoxInfoStr").split("\\|");//һ������Ԫ�ش���һ����������Ϣ
			UKeyUnitStatusDB ukeyUnitStatusDB = new UKeyUnitStatusDB();
			List<UKeyUnitStatus> ukeyList = new ArrayList<UKeyUnitStatus>();
			if(ukeyList != null && ukeyBox.length >0){
				for(int i=0;i<ukeyBox.length;i++){
					String ukeyBoxInfo[] = ukeyBox[i].split(",");//һ������Ԫ�ش���ĳ�������ĳ������
					int cuNum = Integer.parseInt(ukeyBoxInfo[0]);//����������
					String strCuType = ukeyBoxInfo[1];//��������
					System.out.println(strCuType);
					int initialCount = Integer.parseInt(ukeyBoxInfo[2]);//��ʼ����
					ukeyRefillCount =  ukeyRefillCount + initialCount;//�������������ӵ�������
					int curCount = Integer.parseInt(ukeyBoxInfo[3]);//��ǰ����
					String strCuStatus = ukeyBoxInfo[4];//����״̬
					System.out.println(strCuStatus);
					String strUKeyType = ukeyBoxInfo[5];//������
					System.out.println(strUKeyType);
					String strUKeyTrackStart = ukeyBoxInfo[6];//��ʼ��bin
					System.out.println(strUKeyTrackStart);
					String strUKeyTrackEnd = ukeyBoxInfo[7];//������bin
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
			boolean ret = ukeyUnitStatusDB.delete(strTerminalNum);//��ɾ����ʷ����
			System.out.println("ret1="+ret);
			if(ret){
				System.out.print("ukeyList:"+ukeyList);
				System.out.print("ukeyList:"+ukeyList.size());
				ret = ukeyUnitStatusDB.insert(ukeyList);
				System.out.println("ret2="+ret);
				if(ret){
					//�Ѽ�Ukey��Ϣ���͸����
					new LinxViewProxy().sendUKeyUnitStatusMsg(ukeyList);
					//�޸����α�
					int termBatchNo = 1;//���κ�,Ĭ�ϴ�1��ʼ
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
					//�Ѽ�UKey������Ϣ���͸����
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
	    // ���óɹ���Ϣ
		setSucceedRespDom();
	}
}
