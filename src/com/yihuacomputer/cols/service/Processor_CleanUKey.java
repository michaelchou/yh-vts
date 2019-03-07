package com.yihuacomputer.cols.service;

import com.yihuacomputer.cols.common.util.ColsTransMsg;
import com.yihuacomputer.cols.database.ExpLogDB;
import com.yihuacomputer.cols.database.UKeySettleCycleLogDB;
import com.yihuacomputer.cols.database.UKeyTransLogDB;
import com.yihuacomputer.cols.entity.UKeySettleCycleLog;
import com.yihuacomputer.cols.entity.UKeyTransLog;
import com.yihuacomputer.cols.monitor.LinxViewProxy;
import com.yihuacomputer.cols.util.DateCtrl;
import com.yihuacomputer.cols.util.MsgXmlDom;

public class Processor_CleanUKey extends Processor {

	public Processor_CleanUKey() {
		super();
	}

    protected String getTransName()
	{
		return "��UKey";
	}
	/**
	 * <p>
	 * ������
	 * </p>
	 * @throws ProcessorException
	 */
	public void process() throws ProcessorException {
		String strTerminalNum = MsgXmlDom.getElementValue(domReq,"strTerminalNum");
		UKeySettleCycleLogDB ukeySettleCycleLogDB = new UKeySettleCycleLogDB();
		UKeySettleCycleLog  entity = ukeySettleCycleLogDB.getCurBatchNoEntity(strTerminalNum, 0);//0λδ��UKey״̬
		if(entity != null){
			entity.setStatus(1);//��Ϊ�����״̬
			entity.setDtEnd(new DateCtrl().getTimestamp());//�����ν���ʱ��
			boolean ret = ukeySettleCycleLogDB.update(entity);
			if(!ret){
				throw new ProcessorException(TERMRETCODE_CLEANUKEY,TERMRETDESC_CLEANUKEY, TERMRETDESCEN_CLEANUKEY);
			}
			//�޸���ˮ����浥״̬
			UKeyTransLog bean = new UKeyTransLog();
			bean.setSettleCycleStatus(1);
			bean.setStrTerminalNum(strTerminalNum);
			new UKeyTransLogDB().updateStatus(bean);
			//����UKey������Ϣ���͸����
   		    ColsTransMsg msg = new ColsTransMsg();
   		    msg.put("strTerminalNum", strTerminalNum);
   		    msg.put("iTermBatchNo", String.valueOf(entity.getTermBatchNo()));
   		    msg.put("dtStart",  new DateCtrl(entity.getDtStart()).getDateTimeStrSimpleFull());
   		    msg.put("dtEnd", new DateCtrl(entity.getDtEnd()).getDateTimeStrSimpleFull());
   		    msg.put("iStatus", String.valueOf(1));
   		    msg.put("iUKeySurplusCount", String.valueOf(entity.getuKeySurplusCount()));
   		    msg.put("iUKeyRefillCount", String.valueOf(entity.getuKeyRefillCount()));
   		    new LinxViewProxy().sendUKeySettleCycleLogMsg_Clean(msg.toString());
   		    
   		     //ɾ����UKEY��ϸ
   			ExpLogDB  expLogDB = new ExpLogDB();
			expLogDB.removeUkeyExpLog(strTerminalNum);
   		    
   			//���óɹ���Ϣ
   			setSucceedRespDom();
		}else
		throw new ProcessorException(TERMRETCODE_CLEANUKEY_NORECORD,TERMRETDESC_CLEANUKEY_NORECORD, TERMRETDESCEN_CLEANUKEY_NORECORD);
	}
}
