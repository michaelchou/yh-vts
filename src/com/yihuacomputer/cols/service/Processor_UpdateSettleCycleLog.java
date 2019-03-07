package com.yihuacomputer.cols.service;

import java.math.BigDecimal;

import com.yihuacomputer.cols.database.SettleCycleLogDB;
import com.yihuacomputer.cols.entity.SettleCycleLog;
import com.yihuacomputer.cols.util.MsgXmlDom;

public class Processor_UpdateSettleCycleLog extends Processor{

	public Processor_UpdateSettleCycleLog() {
		super();
	}

    protected String getTransName()
	{
		return "����ȡ����β���";
	}
	@Override
	protected void process() throws ProcessorException {
		//������
		String strTransCode = MsgXmlDom.getElementValue(domReq, "strTransCode");
		//�ն˺�
		String strTerminalNum = MsgXmlDom.getElementValue(domReq,"strTerminalNum");
		//ȡ����
		String strAmount = MsgXmlDom.getElementValue(domReq, "Amount");
		BigDecimal strAmountBD = new BigDecimal(strAmount);
		SettleCycleLog entity = new SettleCycleLogDB().getEntityByTermianl(strTerminalNum);
		if(strTransCode.equals("909002") || strTransCode.equals("909010")|| strTransCode.equals("909119") ||strTransCode.equals("909017") ){//ȡ��
			//ȡ����ʣ��ȡ����
			BigDecimal WithDrawAmount = entity.getDcdmSurplusAmt();
			BigDecimal leftWithDrawAmount = WithDrawAmount.subtract(strAmountBD);
			System.out.println(">>>>ȡ����ʣ��ȡ����>>>>>:" + WithDrawAmount);
			System.out.println(">>>>����ȡ����>>>>>:" + strAmountBD);
			System.out.println(">>>>���º�ȡ����ʣ��ȡ����>>>>>:" + leftWithDrawAmount);
			SettleCycleLog bean = new SettleCycleLog();
			bean.setStrTerminalNum(strTerminalNum);
			bean.setDcdmSurplusAmt(leftWithDrawAmount);
			new SettleCycleLogDB().updateSettleCycleLogDcdm(bean);
		}else if(strTransCode.equals("909005") || strTransCode.equals("909008") || strTransCode.equals("909120")||strTransCode.equals("909020")){
			//�����ʣ������
			BigDecimal DepositAmount = entity.getDcimSurplusAmt();
			BigDecimal leftDepositAmount = DepositAmount.add(strAmountBD).abs();
			System.out.println(">>>>�����ʣ������>>>>>:" + DepositAmount);
			System.out.println(">>>>���δ����>>>>>:" + strAmountBD);
			System.out.println(">>>>���º�����ʣ������>>>>>:" + leftDepositAmount);
			SettleCycleLog bean = new SettleCycleLog();
			bean.setStrTerminalNum(strTerminalNum);
			bean.setDcimSurplusAmt(leftDepositAmount);
			new SettleCycleLogDB().updateSettleCycleLogDcim(bean);
		}
		setSucceedRespDom();
	}
}
