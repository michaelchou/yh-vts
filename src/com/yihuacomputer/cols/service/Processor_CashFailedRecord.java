package com.yihuacomputer.cols.service;

import java.sql.Timestamp;
import java.text.SimpleDateFormat;
import java.util.List;

import com.yihuacomputer.cols.database.SettleCycleLogDB;
import com.yihuacomputer.cols.database.TransLogDepositDB;
import com.yihuacomputer.cols.database.TransLogWithdrawalDB;
import com.yihuacomputer.cols.entity.SettleCycleLog;
import com.yihuacomputer.cols.entity.TransLogDeposit;
import com.yihuacomputer.cols.entity.TransLogWithdrawal;
import com.yihuacomputer.cols.util.MsgXmlDom;

public class Processor_CashFailedRecord extends Processor {
	private String addCashRecord = ""; //�ӳ���¼
	private StringBuffer faieldWithDralRecord = new StringBuffer();//ȡ���쳣��¼
	private StringBuffer faieldDepositRecord = new StringBuffer();//����쳣��¼
	private StringBuffer faieldWithDralCompRecord = new StringBuffer();//�Թ�ȡ���쳣��¼
	@Override
	protected void process() throws ProcessorException {
		String strTerminalNum = MsgXmlDom.getElementValue(domReq,"strTerminalNum");
		SettleCycleLogDB settleCycleLogDB = new SettleCycleLogDB();
		TransLogWithdrawalDB withdrawalDB = new TransLogWithdrawalDB();
		TransLogDepositDB depositDB = new TransLogDepositDB();

		//��ѯ�ӳ���¼
		SettleCycleLog settleCycleLog = settleCycleLogDB.getEntityByTermianl(strTerminalNum);
		if(settleCycleLog != null){
			addCashRecord = settleCycleLog.toString();
		}

		//��ѯȡ���쳣��¼     ��������״̬Ϊ0�����׳ɹ��� �ն�״̬��Ϊ1�����ͳ� �ļ�¼
		List<?> withdrawalList = withdrawalDB.getGZrecord(strTerminalNum);
		if(withdrawalList !=  null){
			for(int i = 0; i < withdrawalList.size();){
				TransLogWithdrawal withdrawal = (TransLogWithdrawal) withdrawalList.get(i);
				faieldWithDralRecord.append(withdrawal.getStrTerminalNum()).append(",");
				faieldWithDralRecord.append(formatTimestamp(withdrawal.getDtOccur())).append(",");    //����ʱ��
				faieldWithDralRecord.append(withdrawal.getStrPan()).append(",");
				faieldWithDralRecord.append(withdrawal.getDamount()).append(",");
				faieldWithDralRecord.append(withdrawal.getDfee()).append(","); //������
				faieldWithDralRecord.append(withdrawal.getIhostTransStatus()).append(","); //��������״̬
				faieldWithDralRecord.append(withdrawal.getStrHostTsn()).append(","); //������ˮ��
				faieldWithDralRecord.append(withdrawal.getItermTransStatus()).append(",");//�ն˽���״̬
				faieldWithDralRecord.append(withdrawal.getStrTermSerialNo()).append(",");//�ն���ˮ��
				faieldWithDralRecord.append(withdrawal.getiReverSeenTryStatus());
				if( (++i) !=withdrawalList.size()){
					faieldWithDralRecord.append("|");
				}
			}
		}

		//��ѯ����쳣��¼     ��������״̬��Ϊ0�����׳ɹ�  �ļ�¼
		List<?> depositList = depositDB.getGZrecord(strTerminalNum);
		if(depositList !=  null){
			for(int i = 0; i < depositList.size();){
				TransLogDeposit deposit = (TransLogDeposit) depositList.get(i);
				faieldDepositRecord.append(deposit.getStrTerminalNum()).append(",");
				faieldDepositRecord.append(formatTimestamp(deposit.getDtOccur())).append(",");    //����ʱ��
				faieldDepositRecord.append(deposit.getStrPan()).append(",");
				faieldDepositRecord.append(deposit.getDamount()).append(",");
				faieldDepositRecord.append(deposit.getDfee()).append(","); //������
				faieldDepositRecord.append(deposit.getIhostTransStatus()).append(","); //��������״̬
				faieldDepositRecord.append(deposit.getStrHostTsn()).append(","); //������ˮ��
				faieldDepositRecord.append(deposit.getItermTransStatus()).append(",");//�ն˽���״̬
				faieldDepositRecord.append(deposit.getStrTermSerialNo());//�ն���ˮ��
				if((++i)!=depositList.size()){
					faieldDepositRecord.append("|");
				}
			}
		}

		//��ѯ�Թ�ȡ���쳣��¼     ��������״̬��Ϊ0�����׳ɹ�  �ļ�¼
		List<?> withdrawalCompList = withdrawalDB.getGZrecord(strTerminalNum,"909017");
		if(withdrawalCompList !=  null){
			 for(int i = 0; i < withdrawalCompList.size();){
				 TransLogWithdrawal withdrawal = (TransLogWithdrawal) withdrawalCompList.get(i);
				faieldWithDralCompRecord.append(withdrawal.getStrTerminalNum()).append(",");
				faieldWithDralCompRecord.append(formatTimestamp(withdrawal.getDtOccur())).append(",");    //����ʱ��
				faieldWithDralCompRecord.append(withdrawal.getStrPan()).append(",");
				faieldWithDralCompRecord.append(withdrawal.getDamount()).append(",");
				faieldWithDralCompRecord.append(withdrawal.getDfee()).append(","); //������
				faieldWithDralCompRecord.append(withdrawal.getIhostTransStatus()).append(","); //��������״̬
				faieldWithDralCompRecord.append(withdrawal.getStrHostTsn()).append(","); //������ˮ��
				faieldWithDralCompRecord.append(withdrawal.getItermTransStatus()).append(",");//�ն˽���״̬
				faieldWithDralCompRecord.append(withdrawal.getStrTermSerialNo());//�ն���ˮ��
				if((++i)!=withdrawalCompList.size()){
						faieldWithDralCompRecord.append("|");
					}
				}
			}
		// ���óɹ���Ϣ
		setSucceedRespDom();
		MsgXmlDom.setElementValue(domResp, "addCashRecord",addCashRecord);
		MsgXmlDom.setElementValue(domResp, "faieldWithDralRecord",faieldWithDralRecord.toString());
		MsgXmlDom.setElementValue(domResp, "faieldDepositRecord",faieldDepositRecord.toString());
		MsgXmlDom.setElementValue(domResp, "faieldWithDralCompRecord",faieldWithDralCompRecord.toString());
	}

	/**
	 *��ʽ��ʱ��
	 * @param date
	 * @return
	 */
	private String formatTimestamp(Timestamp date){
		if(null == date){
			return "";
		}
		return  new SimpleDateFormat("yyyy-MM-dd HH:mm:ss").format(date);
	}


}
