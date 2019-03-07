package com.yihuacomputer.cols.service;

import com.yihuacomputer.cols.database.TransLogDepositDB;
import com.yihuacomputer.cols.database.TransLogWithdrawalDB;
import com.yihuacomputer.cols.entity.TransLogDeposit;
import com.yihuacomputer.cols.entity.TransLogWithdrawal;
import com.yihuacomputer.cols.util.MsgXmlDom;

public class Processor_UpdateWithDrawTransLog extends Processor{

	public Processor_UpdateWithDrawTransLog() {
		super();
	}

    protected String getTransName()
	{
		return "����ȡ����ˮ������";
	}

	@Override
	protected void process() throws ProcessorException {
		String strTermTSN = MsgXmlDom.getElementValue(domReq, "strTermTSN");//ԭ�ն���ˮ��
		int strTermTransResult = MsgXmlDom.getElementValueInt(domReq, "strTermTransResult",3);//�ն˽���״̬ 0δ���� 1���ͳ� 2����ʧ�� 3��ȷ��
		int strReverseentryResult = MsgXmlDom.getElementValueInt(domReq, "strReverseentryResult",3);//����״̬ 0������ 1�����ɹ� 2����ʧ�� 3��ȷ��
		TransLogWithdrawal TLW = new  TransLogWithdrawal();
		TLW.setStrTermSerialNo(strTermTSN);
		TLW.setItermTransStatus(strTermTransResult);
		TLW.setiReverSeenTryStatus(strReverseentryResult);

		new TransLogWithdrawalDB().updateDraw(TLW);
		setSucceedRespDom();
	}

}