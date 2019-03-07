package com.yihuacomputer.cols.service;

import com.yihuacomputer.cols.database.CardSettleCycleLogDB;
import com.yihuacomputer.cols.entity.CardSettleCycleLog;
import com.yihuacomputer.cols.util.MsgXmlDom;

public class Processor_CardSettleCycLogStatus extends Processor {

	public Processor_CardSettleCycLogStatus() {
		super();
	}

    protected String getTransName()
	{
		return "��ȡ�忨״̬";
	}
	/**
	 * <p>
	 * ������
	 * </p>
	 * @throws ProcessorException
	 */
	public void process() throws ProcessorException {
		String strTerminalNum = MsgXmlDom.getElementValue(domReq,"strTerminalNum");
		CardSettleCycleLogDB cardSettleCycleLogDB = new CardSettleCycleLogDB();
		CardSettleCycleLog  entity = cardSettleCycleLogDB.getCurBatchNoEntity(strTerminalNum, 0);//0λδ�忨״̬
		if(entity != null){//��δ����ļ�¼
				throw new ProcessorException(TERMRETCODE_NOCLEANCARD,TERMRETDESC_NOCLEANCARD, TERMRETDESCEN_NOCLEANCARD);
		}
		//���óɹ���Ϣ
		setSucceedRespDom();
	}
}
