package com.yihuacomputer.cols.monitor;

import java.util.List;

import com.yihuacomputer.cols.entity.CDSSettleCycleLog;
import com.yihuacomputer.cols.entity.CDSUnitStatus;
import com.yihuacomputer.cols.entity.CardSettleCycleLog;
import com.yihuacomputer.cols.entity.CardUnitStatus;
import com.yihuacomputer.cols.entity.ExpLog;
import com.yihuacomputer.cols.entity.HostRetCode;
import com.yihuacomputer.cols.entity.UKeySettleCycleLog;
import com.yihuacomputer.cols.entity.UKeyUnitStatus;

public class  ATMVTrans<T>{
	private String msgType;                          //报文类型
	private List<T> data;                        //交易数据对象
	public String getMsgType() {
		return msgType;
	}
	public void setMsgType(String msgType) {
		this.msgType = msgType;
	}
	public List<T> getData() {
		return data;
	}
	public void setData(List<T> data) {
		this.data = data;
	}
	
	/*private ExpLog expLog;                           //异常信息对象
	private HostRetCode hostRetCode;                 //主机返回码对象
	private CardSettleCycleLog  cardSettleCycleLog;  //发卡箱表
	private CDSSettleCycleLog  cdsSettleCycleLog;    //存单箱表
	private UKeySettleCycleLog ukeySettleCycleLog;   //UKey箱表
	private List<CardUnitStatus> cardList;           //卡箱状态表
	private List<CDSUnitStatus> cdsList;             //存单箱状态表
	private List<UKeyUnitStatus> ukeyList;           //UKey箱状态表

	public String getMsgType() {
		return msgType;
	}
	public void setMsgType(String msgType) {
		this.msgType = msgType;
	}
	public Transaction getData() {
		return data;
	}
	public void setData(Transaction data) {
		this.data = data;
	}
	public ExpLog getExpLog() {
		return expLog;
	}
	public void setExpLog(ExpLog expLog) {
		this.expLog = expLog;
	}
	public HostRetCode getHostRetCode() {
		return hostRetCode;
	}
	public void setHostRetCode(HostRetCode hostRetCode) {
		this.hostRetCode = hostRetCode;
	}
	public CardSettleCycleLog getCardSettleCycleLog() {
		return cardSettleCycleLog;
	}
	public void setCardSettleCycleLog(CardSettleCycleLog cardSettleCycleLog) {
		this.cardSettleCycleLog = cardSettleCycleLog;
	}
	public CDSSettleCycleLog getCdsSettleCycleLog() {
		return cdsSettleCycleLog;
	}
	public void setCdsSettleCycleLog(CDSSettleCycleLog cdsSettleCycleLog) {
		this.cdsSettleCycleLog = cdsSettleCycleLog;
	}
	public UKeySettleCycleLog getUkeySettleCycleLog() {
		return ukeySettleCycleLog;
	}
	public void setUkeySettleCycleLog(UKeySettleCycleLog ukeySettleCycleLog) {
		this.ukeySettleCycleLog = ukeySettleCycleLog;
	}
	public List<CardUnitStatus> getCardList() {
		return cardList;
	}
	public void setCardList(List<CardUnitStatus> cardList) {
		this.cardList = cardList;
	}
	public List<CDSUnitStatus> getCdsList() {
		return cdsList;
	}
	public void setCdsList(List<CDSUnitStatus> cdsList) {
		this.cdsList = cdsList;
	}
	public List<UKeyUnitStatus> getUkeyList() {
		return ukeyList;
	}
	public void setUkeyList(List<UKeyUnitStatus> ukeyList) {
		this.ukeyList = ukeyList;
	}*/
}