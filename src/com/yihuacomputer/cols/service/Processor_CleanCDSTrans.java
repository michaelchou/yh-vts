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
		return "�����ύ";
	}
	/**
	 * <p>
	 * ������
	 * </p>
	 * @throws ProcessorException
	 */
	public void process() throws ProcessorException {
		String strTerminalNum = MsgXmlDom.getElementValue(domReq,"strTerminalNum");
		String strSuccessfulAcceptedCDS = MsgXmlDom.getElementValue(domReq,"successfulAcceptedCDS");
		CDSSettleCycleLogDB cdsSettleCycleLogDB = new CDSSettleCycleLogDB();
		CDSSettleCycleLog  entity = cdsSettleCycleLogDB.getCurBatchNoEntity(strTerminalNum, 0);//0λδ��浥״̬
		if(entity != null){
			//�޸���ˮ������״̬
			CDSTransLog bean = new CDSTransLog();
			//�Ѿ��������ݱ�־λ�޸�Ϊ3
			bean.setSettleCycleStatus(3);
			bean.setStrTerminalNum(strTerminalNum);
			bean.setTermBatchNo(entity.getTermBatchNo());
			new CDSTransLogDB().updateTranslogStatus(bean,strSuccessfulAcceptedCDS);
			info.info("CleanCDSTrans success:"+entity.getTermBatchNo()+"\r\n");
   			//���óɹ���Ϣ
   			setSucceedRespDom();
		}else{
			info.info("CleanCDSTrans failed"+ "\r\n");
			throw new ProcessorException(TERMRETCODE_CLEANCDS_NORECORD,"�����ύʧ�ܣ��޿���������", TERMRETDESCEN_CLEANCDS_NORECORD);
		}
	}
}
