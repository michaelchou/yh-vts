package com.yihuacomputer.cols.service;

import org.apache.log4j.Logger;

import com.yihuacomputer.cols.common.util.ColsTransMsg;
import com.yihuacomputer.cols.database.CDSSettleCycleLogDB;
import com.yihuacomputer.cols.database.CDSTransLogDB;
import com.yihuacomputer.cols.database.CDSUnitStatusDB;
import com.yihuacomputer.cols.entity.CDSSettleCycleLog;
import com.yihuacomputer.cols.entity.CDSTransLog;
import com.yihuacomputer.cols.monitor.LinxViewProxy;
import com.yihuacomputer.cols.util.DateCtrl;
import com.yihuacomputer.cols.util.MsgXmlDom;

public class Processor_CleanCDS extends Processor {

	public Processor_CleanCDS() {
		super();
	}

    protected String getTransName()
	{
		return "��浥";
	}
	/**
	 * <p>
	 * ������
	 * </p>
	 * @throws ProcessorException
	 */
	public void process() throws ProcessorException {
		String strTerminalNum = MsgXmlDom.getElementValue(domReq,"strTerminalNum");
		CDSSettleCycleLogDB cdsSettleCycleLogDB = new CDSSettleCycleLogDB();
		CDSSettleCycleLog  entity = cdsSettleCycleLogDB.getCurBatchNoEntity(strTerminalNum, 0);//0λδ��浥״̬
		if(entity != null){
			entity.setStatus(1);//��Ϊ�����״̬
			entity.setDtEnd(new DateCtrl().getTimestamp());//�����ν���ʱ��
			boolean ret = cdsSettleCycleLogDB.update(entity);
			if(!ret){
				throw new ProcessorException(TERMRETCODE_CLEANCDS,TERMRETDESC_CLEANCDS, TERMRETDESCEN_CLEANCDS);
			}
			//�޸���ˮ����浥״̬
			CDSTransLog bean = new CDSTransLog();
			bean.setSettleCycleStatus(1);
			bean.setStrTerminalNum(strTerminalNum);
			new CDSTransLogDB().updateStatus(bean);
			//��ռӵ�����
			CDSUnitStatusDB cdsUnitStatusDB = new CDSUnitStatusDB();
			boolean rets = cdsUnitStatusDB.delete(strTerminalNum);//��ɾ����ʷ����
			if(!rets){
				throw new ProcessorException(TERMRETCODE_CLEANCDS,TERMRETDESC_CLEANCDS, TERMRETDESCEN_CLEANCDS);
			}
			//����浥������Ϣ���͸����
   		    ColsTransMsg msg = new ColsTransMsg();
   		    msg.put("strTerminalNum", strTerminalNum);
 		    msg.put("iTermBatchNo", String.valueOf(entity.getTermBatchNo()));
 		    msg.put("dtStart",  new DateCtrl(entity.getDtStart()).getDateTimeStrSimpleFull());
 		    msg.put("dtEnd", new DateCtrl(entity.getDtEnd()).getDateTimeStrSimpleFull());
 		    msg.put("iStatus", String.valueOf(1));
   		    msg.put("iDepSurplusCount", String.valueOf(entity.getCdsSurplusCount()));
   		    msg.put("iDepRefillCount", String.valueOf(entity.getCdsRefillCount()));
   		    new LinxViewProxy().sendCDSSettleCycleLogMsg_Clean(msg.toString());
   			//���óɹ���Ϣ
   			setSucceedRespDom();
		}else
			throw new ProcessorException(TERMRETCODE_CLEANCDS_NORECORD,TERMRETDESC_CLEANCDS_NORECORD, TERMRETDESCEN_CLEANCDS_NORECORD);
	}
}
