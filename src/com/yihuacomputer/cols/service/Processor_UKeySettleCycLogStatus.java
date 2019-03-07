package com.yihuacomputer.cols.service;

import com.yihuacomputer.cols.database.UKeySettleCycleLogDB;
import com.yihuacomputer.cols.entity.UKeySettleCycleLog;
import com.yihuacomputer.cols.util.MsgXmlDom;

public class Processor_UKeySettleCycLogStatus extends Processor {

	public Processor_UKeySettleCycLogStatus() {
		super();
	}

    protected String getTransName()
	{
		return "��ȡ��UKey״̬";
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
		UKeySettleCycleLog  entity = ukeySettleCycleLogDB.getCurBatchNoEntity(strTerminalNum, 0);//0λδ�忨״̬
		if(entity != null){//��δ����ļ�¼
				throw new ProcessorException(TERMRETCODE_NOCLEANUKEY,TERMRETDESC_NOCLEANUKEY, TERMRETDESCEN_NOCLEANUKEY);
		}
		//���óɹ���Ϣ
		setSucceedRespDom();
	}
}
