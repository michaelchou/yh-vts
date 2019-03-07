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
		return "�Ӵ浥ҵ��";
	}
	/**
	 * ������
	 */
	public void process() throws ProcessorException {
		try{
			//��COLS_CARDUNITSTATUS����в���  ˳�򣺴浥��������,�浥������,��ʼ����,��ǰ����,�浥��״̬,��ʼ��bin,������bin
			int cdsRefillCount = 0;//��ʼ�浥������
			String strTerminalNum = MsgXmlDom.getElementValue(domReq,"strTerminalNum");
			String cdsBox[] = MsgXmlDom.getElementValue(domReq,"cdsBoxInfoStr").split("\\|");//һ������Ԫ�ش���һ����������Ϣ
			CDSUnitStatusDB cdsUnitStatusDB = new CDSUnitStatusDB();
			List<CDSUnitStatus> cdsList = new ArrayList<CDSUnitStatus>();
			if(cdsBox != null && cdsBox.length >0){
				for(int i=0;i<cdsBox.length;i++){
					String cdsBoxInfo[] = cdsBox[i].split(",");//һ������Ԫ�ش���ĳ�������ĳ������
					int cuNum = Integer.parseInt(cdsBoxInfo[0]);//�浥��������
					String strCuType = cdsBoxInfo[1];//�浥������
					int initialCount = Integer.parseInt(cdsBoxInfo[2]);//��ʼ����
					cdsRefillCount =  cdsRefillCount + initialCount;//�������������ӵ�������
					int curCount = Integer.parseInt(cdsBoxInfo[3]);//��ǰ����
					String strCuStatus = cdsBoxInfo[4];//�浥��״̬
					String strCdsTrackStart = cdsBoxInfo[5];//��ʼ��bin
					String strCdsTrackEnd = cdsBoxInfo[6];//������bin
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
			boolean ret = cdsUnitStatusDB.delete(strTerminalNum);//��ɾ����ʷ����
			if(ret){
				ret = cdsUnitStatusDB.insert(cdsList);
				if(ret){
					//�ѼӴ浥��Ϣ���͸����
					new LinxViewProxy().sendDepositReceiptStatusMsg(cdsList);
					//�޸����α�
					int termBatchNo = 1;//���κ�,Ĭ�ϴ�1��ʼ
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
					//�ѼӴ浥������Ϣ���͸����
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
	    // ���óɹ���Ϣ
		setSucceedRespDom();
	}
}
