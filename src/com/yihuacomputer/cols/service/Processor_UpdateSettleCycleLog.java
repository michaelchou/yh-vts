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
		return "更新取款存款尾箱表";
	}
	@Override
	protected void process() throws ProcessorException {
		//交易码
		String strTransCode = MsgXmlDom.getElementValue(domReq, "strTransCode");
		//终端号
		String strTerminalNum = MsgXmlDom.getElementValue(domReq,"strTerminalNum");
		//取款金额
		String strAmount = MsgXmlDom.getElementValue(domReq, "Amount");
		BigDecimal strAmountBD = new BigDecimal(strAmount);
		SettleCycleLog entity = new SettleCycleLogDB().getEntityByTermianl(strTerminalNum);
		if(strTransCode.equals("909002") || strTransCode.equals("909010")|| strTransCode.equals("909119") ||strTransCode.equals("909017") ){//取款
			//取款箱剩余取款金额
			BigDecimal WithDrawAmount = entity.getDcdmSurplusAmt();
			BigDecimal leftWithDrawAmount = WithDrawAmount.subtract(strAmountBD);
			System.out.println(">>>>取款箱剩余取款金额>>>>>:" + WithDrawAmount);
			System.out.println(">>>>本次取款金额>>>>>:" + strAmountBD);
			System.out.println(">>>>更新后取款箱剩余取款金额>>>>>:" + leftWithDrawAmount);
			SettleCycleLog bean = new SettleCycleLog();
			bean.setStrTerminalNum(strTerminalNum);
			bean.setDcdmSurplusAmt(leftWithDrawAmount);
			new SettleCycleLogDB().updateSettleCycleLogDcdm(bean);
		}else if(strTransCode.equals("909005") || strTransCode.equals("909008") || strTransCode.equals("909120")||strTransCode.equals("909020")){
			//存款箱剩余存款金额
			BigDecimal DepositAmount = entity.getDcimSurplusAmt();
			BigDecimal leftDepositAmount = DepositAmount.add(strAmountBD).abs();
			System.out.println(">>>>存款箱剩余存款金额>>>>>:" + DepositAmount);
			System.out.println(">>>>本次存款金额>>>>>:" + strAmountBD);
			System.out.println(">>>>更新后存款箱剩余存款金额>>>>>:" + leftDepositAmount);
			SettleCycleLog bean = new SettleCycleLog();
			bean.setStrTerminalNum(strTerminalNum);
			bean.setDcimSurplusAmt(leftDepositAmount);
			new SettleCycleLogDB().updateSettleCycleLogDcim(bean);
		}
		setSucceedRespDom();
	}
}
