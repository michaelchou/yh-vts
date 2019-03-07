package com.yihuacomputer.cols.service;

import com.yihuacomputer.cols.database.CDSSettleCycleLogDB;
import com.yihuacomputer.cols.entity.CDSSettleCycleLog;
import com.yihuacomputer.cols.util.MsgXmlDom;

public class Processor_CDSSettleCycLogStatus extends Processor {

	public Processor_CDSSettleCycLogStatus() {
		super();
	}

    protected String getTransName()
	{
		return "��ȡ��浥״̬";
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
		if(entity != null){//��δ����ļ�¼
				throw new ProcessorException(TERMRETCODE_NOCLEANCDS,TERMRETDESC_NOCLEANCDS, TERMRETDESCEN_NOCLEANCDS);
		}
		//���óɹ���Ϣ
		setSucceedRespDom();
	}
}
