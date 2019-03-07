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
		return "更新取款流水表数据";
	}

	@Override
	protected void process() throws ProcessorException {
		String strTermTSN = MsgXmlDom.getElementValue(domReq, "strTermTSN");//原终端流水号
		int strTermTransResult = MsgXmlDom.getElementValueInt(domReq, "strTermTransResult",3);//终端交易状态 0未动作 1已送钞 2出钞失败 3不确定
		int strReverseentryResult = MsgXmlDom.getElementValueInt(domReq, "strReverseentryResult",3);//冲正状态 0不冲正 1冲正成功 2冲正失败 3不确定
		TransLogWithdrawal TLW = new  TransLogWithdrawal();
		TLW.setStrTermSerialNo(strTermTSN);
		TLW.setItermTransStatus(strTermTransResult);
		TLW.setiReverSeenTryStatus(strReverseentryResult);

		new TransLogWithdrawalDB().updateDraw(TLW);
		setSucceedRespDom();
	}

}