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
	public String ADDCASH_FAILEDDESC = "�ӳ�ʧ��";
	public String ADDCASH_FAILEDDESCEN = "ADDCash Failed";

	/**
	 * ��¼������ˮ
	*/
	protected void append2TransLog()
	{
		//�ӳ�����ǿ�Ƽ�¼��־������Ҫ���ݱ���F999�ж�
		if (TERMRETCODE_SUCCEED.equals(MsgXmlDom.getElementValue(domResp, "TermRetCode"))){
			//ֻ�гɹ���ʱ�򣬲�Ҫ�޸���״̬
			executeAddCash();
		}
	}
	/**
	 * ���ݿ����ݴ���
	 */
	public void executeAddCash(){
		String strTerminalNum = MsgXmlDom.getElementValue(domReq,"strTerminalNum");
		String totalAmount = MsgXmlDom.getElementValue(domReq,"strTotalAmount"); //�ӳ��ܽ��
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
					//�Ѽӿ���Ϣ���͸����  ????????
	       			//new LinxViewProxy();
				}else{
					infoLog.info("�ӳ�ʧ�ܣ�" + strTerminalNum + "�����룺" + ADDCASH_FAILEDCODE);
					setSimpleRespDom(ADDCASH_FAILEDCODE,ADDCASH_FAILEDDESC, ADDCASH_FAILEDDESCEN);
				}
			}catch(NumberFormatException e){
				infoLog.info("�ӳ�ʧ�ܣ�" + strTerminalNum + " �ܽ������  totalAmount:" + totalAmount  );
				setSimpleRespDom(ADDCASH_FAILEDCODE,ADDCASH_FAILEDDESC, ADDCASH_FAILEDDESCEN);
			}
		}else{
			infoLog.info("�ӳ�ʧ�ܣ�" + strTerminalNum + " ���мӳ���¼�������豸�峮" + "�����룺" + TERMRETCODE_NOCLEANCASH );
			setSimpleRespDom(TERMRETCODE_NOCLEANCASH,TERMRETDESC_NOCLEANCASH, TERMRETDESCEN_NOCLEANCASH);
		}

	}
	//�������
	protected void notifyxViewProxy(){
		//�Ѽӳ�������Ϣ���͸����
		String strTerminalNum = MsgXmlDom.getElementValue(domReq,"strTerminalNum");
		String totalAmount = MsgXmlDom.getElementValue(domReq,"strTotalAmount"); //�ӳ��ܽ��
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
