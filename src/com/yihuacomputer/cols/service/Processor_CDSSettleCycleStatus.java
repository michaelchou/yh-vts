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
		return "��ȡ��ǰ�豸����״̬";
	}
	/**
	 * <p>
	 * ������
	 * </p>
	 * @throws ProcessorException
	 */
	public void process() throws ProcessorException {
		String strTerminalNum = MsgXmlDom.getElementValue(domReq,"strTerminalNum");
		System.out.println("strTerminalNum=="+strTerminalNum);
		CDSSettleCycleLogDB cdsSettleCycleLogDB = new CDSSettleCycleLogDB();
		int termBatchNo = 1;//���κ�,Ĭ�ϴ�1��ʼ
		boolean ret = false;
		//�ж��Ƿ��й���������
		CDSSettleCycleLog cdsSettleCycleLog = cdsSettleCycleLogDB.getEntity(strTerminalNum);
		CDSSettleCycleLog  entity = cdsSettleCycleLogDB.getCurBatchNoEntity(strTerminalNum, 0);//0Ϊ�Ѿ������ڿ�ʼ
		CDSSettleCycleLog bean = new CDSSettleCycleLog();
		if(cdsSettleCycleLog != null ){	
			if(entity == null || entity.equals("")){
				//δ���������ڣ���������
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
				//�Ѿ���������
				ret=true;
			}
		}else{
			//����������,��������
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
				info.info("��������������ʧ��\r\n");
				throw new ProcessorException("0115","��������������ʧ��", "CREATE CYCLE Error");
			}
		//���óɹ���Ϣ
		setSucceedRespDom();

	}
}
