package com.yihuacomputer.cols.service;

import java.math.BigDecimal;

import org.apache.log4j.Logger;

import com.yihuacomputer.cols.common.util.ColsTransMsg;
import com.yihuacomputer.cols.database.SettleCycleLogDB;
import com.yihuacomputer.cols.entity.SettleCycleLog;
import com.yihuacomputer.cols.monitor.LinxViewProxy;
import com.yihuacomputer.cols.util.DataConversion;
import com.yihuacomputer.cols.util.DateCtrl;
import com.yihuacomputer.cols.util.MsgXmlDom;

public class Processor_AddCash extends Processor_Trans{
	public Logger infoLog = Logger.getLogger("Info");

	public String ADDCASH_FAILEDCODE = "0301";
	public String ADDCASH_FAILEDDESC = "加钞失败";
	public String ADDCASH_FAILEDDESCEN = "ADDCash Failed";

	/**
	 * 记录交易流水
	*/
	protected void append2TransLog()
	{
		//加钞交易强制记录日志，不需要根据报文F999判断
		if (TERMRETCODE_SUCCEED.equals(MsgXmlDom.getElementValue(domResp, "TermRetCode"))){
			//只有成功的时候，才要修改其状态
			executeAddCash();
		}
	}
	/**
	 * 数据库数据处理
	 */
	public void executeAddCash(){
		String strTerminalNum = MsgXmlDom.getElementValue(domReq,"strTerminalNum");
		String totalAmount = MsgXmlDom.getElementValue(domReq,"strTotalAmount"); //加钞总金额
		if(totalAmount == null || totalAmount.length() == 0){
			totalAmount = "0";
		}
		SettleCycleLogDB settleCycleLogDB = new SettleCycleLogDB();
		SettleCycleLog settleCycleLog = settleCycleLogDB.getEntityByTermianl(strTerminalNum);
		if(settleCycleLog  == null){
			try{
				BigDecimal totalAmountBig = new BigDecimal(totalAmount);
				totalAmountBig = totalAmountBig.divide(new BigDecimal(100));
				boolean result = settleCycleLogDB.addCash(strTerminalNum,totalAmountBig);
				if(result){
					//把加卡信息发送给监控  ????????
	       			//new LinxViewProxy();
				}else{
					infoLog.info("加钞失败：" + strTerminalNum + "错误码：" + ADDCASH_FAILEDCODE);
					setSimpleRespDom(ADDCASH_FAILEDCODE,ADDCASH_FAILEDDESC, ADDCASH_FAILEDDESCEN);
				}
			}catch(NumberFormatException e){
				infoLog.info("加钞失败：" + strTerminalNum + " 总金额有误  totalAmount:" + totalAmount  );
				setSimpleRespDom(ADDCASH_FAILEDCODE,ADDCASH_FAILEDDESC, ADDCASH_FAILEDDESCEN);
			}
		}else{
			infoLog.info("加钞失败：" + strTerminalNum + " 已有加钞记录，请先设备清钞" + "错误码：" + TERMRETCODE_NOCLEANCASH );
			setSimpleRespDom(TERMRETCODE_NOCLEANCASH,TERMRETDESC_NOCLEANCASH, TERMRETDESCEN_NOCLEANCASH);
		}

	}
	//发往监控
	protected void notifyxViewProxy(){
		//把加钞批次信息发送给监控
		String strTerminalNum = MsgXmlDom.getElementValue(domReq,"strTerminalNum");
		String totalAmount = MsgXmlDom.getElementValue(domReq,"strTotalAmount"); //加钞总金额
		SettleCycleLogDB settleCycleLogDB = new SettleCycleLogDB();
		String dtDate = new DateCtrl().getDateTimeStrSimpleFull();
		SettleCycleLog CashsettleCycleLog = settleCycleLogDB.getEntityByTermianl(strTerminalNum);
		ColsTransMsg addmsg = new ColsTransMsg();
		addmsg.put("strTerminalNum", strTerminalNum);
		if(CashsettleCycleLog == null){
			addmsg.put("iTermBatchNo", String.valueOf(0));
		}else{
			addmsg.put("iTermBatchNo", String.valueOf(CashsettleCycleLog.getIsettlecycle()));
		}
		addmsg.put("dtStart", dtDate);
		addmsg.put("iStatus", String.valueOf(0));
		addmsg.put("addBillAmount", new DataConversion().fromFenToYuan(totalAmount));
		addmsg.put("surplusBillAmount","0.00");
		new LinxViewProxy().sendCashSettleCycleLogMsg_Add(addmsg.toString());
	}
}
