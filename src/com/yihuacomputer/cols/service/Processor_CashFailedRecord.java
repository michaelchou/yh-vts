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
	private String addCashRecord = ""; //加钞记录
	private StringBuffer faieldWithDralRecord = new StringBuffer();//取款异常记录
	private StringBuffer faieldDepositRecord = new StringBuffer();//存款异常记录
	private StringBuffer faieldWithDralCompRecord = new StringBuffer();//对公取款异常记录
	@Override
	protected void process() throws ProcessorException {
		String strTerminalNum = MsgXmlDom.getElementValue(domReq,"strTerminalNum");
		SettleCycleLogDB settleCycleLogDB = new SettleCycleLogDB();
		TransLogWithdrawalDB withdrawalDB = new TransLogWithdrawalDB();
		TransLogDepositDB depositDB = new TransLogDepositDB();

		//查询加钞记录
		SettleCycleLog settleCycleLog = settleCycleLogDB.getEntityByTermianl(strTerminalNum);
		if(settleCycleLog != null){
			addCashRecord = settleCycleLog.toString();
		}

		//查询取款异常记录     主机返回状态为0：交易成功， 终端状态不为1：已送钞 的记录
		List<?> withdrawalList = withdrawalDB.getGZrecord(strTerminalNum);
		if(withdrawalList !=  null){
			for(int i = 0; i < withdrawalList.size();){
				TransLogWithdrawal withdrawal = (TransLogWithdrawal) withdrawalList.get(i);
				faieldWithDralRecord.append(withdrawal.getStrTerminalNum()).append(",");
				faieldWithDralRecord.append(formatTimestamp(withdrawal.getDtOccur())).append(",");    //交易时间
				faieldWithDralRecord.append(withdrawal.getStrPan()).append(",");
				faieldWithDralRecord.append(withdrawal.getDamount()).append(",");
				faieldWithDralRecord.append(withdrawal.getDfee()).append(","); //手续费
				faieldWithDralRecord.append(withdrawal.getIhostTransStatus()).append(","); //主机交易状态
				faieldWithDralRecord.append(withdrawal.getStrHostTsn()).append(","); //主机流水号
				faieldWithDralRecord.append(withdrawal.getItermTransStatus()).append(",");//终端交易状态
				faieldWithDralRecord.append(withdrawal.getStrTermSerialNo()).append(",");//终端流水号
				faieldWithDralRecord.append(withdrawal.getiReverSeenTryStatus());
				if( (++i) !=withdrawalList.size()){
					faieldWithDralRecord.append("|");
				}
			}
		}

		//查询存款异常记录     主机返回状态不为0：交易成功  的记录
		List<?> depositList = depositDB.getGZrecord(strTerminalNum);
		if(depositList !=  null){
			for(int i = 0; i < depositList.size();){
				TransLogDeposit deposit = (TransLogDeposit) depositList.get(i);
				faieldDepositRecord.append(deposit.getStrTerminalNum()).append(",");
				faieldDepositRecord.append(formatTimestamp(deposit.getDtOccur())).append(",");    //交易时间
				faieldDepositRecord.append(deposit.getStrPan()).append(",");
				faieldDepositRecord.append(deposit.getDamount()).append(",");
				faieldDepositRecord.append(deposit.getDfee()).append(","); //手续费
				faieldDepositRecord.append(deposit.getIhostTransStatus()).append(","); //主机交易状态
				faieldDepositRecord.append(deposit.getStrHostTsn()).append(","); //主机流水号
				faieldDepositRecord.append(deposit.getItermTransStatus()).append(",");//终端交易状态
				faieldDepositRecord.append(deposit.getStrTermSerialNo());//终端流水号
				if((++i)!=depositList.size()){
					faieldDepositRecord.append("|");
				}
			}
		}

		//查询对公取款异常记录     主机返回状态不为0：交易成功  的记录
		List<?> withdrawalCompList = withdrawalDB.getGZrecord(strTerminalNum,"909017");
		if(withdrawalCompList !=  null){
			 for(int i = 0; i < withdrawalCompList.size();){
				 TransLogWithdrawal withdrawal = (TransLogWithdrawal) withdrawalCompList.get(i);
				faieldWithDralCompRecord.append(withdrawal.getStrTerminalNum()).append(",");
				faieldWithDralCompRecord.append(formatTimestamp(withdrawal.getDtOccur())).append(",");    //交易时间
				faieldWithDralCompRecord.append(withdrawal.getStrPan()).append(",");
				faieldWithDralCompRecord.append(withdrawal.getDamount()).append(",");
				faieldWithDralCompRecord.append(withdrawal.getDfee()).append(","); //手续费
				faieldWithDralCompRecord.append(withdrawal.getIhostTransStatus()).append(","); //主机交易状态
				faieldWithDralCompRecord.append(withdrawal.getStrHostTsn()).append(","); //主机流水号
				faieldWithDralCompRecord.append(withdrawal.getItermTransStatus()).append(",");//终端交易状态
				faieldWithDralCompRecord.append(withdrawal.getStrTermSerialNo());//终端流水号
				if((++i)!=withdrawalCompList.size()){
						faieldWithDralCompRecord.append("|");
					}
				}
			}
		// 设置成功信息
		setSucceedRespDom();
		MsgXmlDom.setElementValue(domResp, "addCashRecord",addCashRecord);
		MsgXmlDom.setElementValue(domResp, "faieldWithDralRecord",faieldWithDralRecord.toString());
		MsgXmlDom.setElementValue(domResp, "faieldDepositRecord",faieldDepositRecord.toString());
		MsgXmlDom.setElementValue(domResp, "faieldWithDralCompRecord",faieldWithDralCompRecord.toString());
	}

	/**
	 *格式化时间
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
