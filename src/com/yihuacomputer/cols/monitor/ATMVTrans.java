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
	private String msgType;                          //��������
	private List<T> data;                        //�������ݶ���
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
	
	/*private ExpLog expLog;                           //�쳣��Ϣ����
	private HostRetCode hostRetCode;                 //�������������
	private CardSettleCycleLog  cardSettleCycleLog;  //�������
	private CDSSettleCycleLog  cdsSettleCycleLog;    //�浥���
	private UKeySettleCycleLog ukeySettleCycleLog;   //UKey���
	private List<CardUnitStatus> cardList;           //����״̬��
	private List<CDSUnitStatus> cdsList;             //�浥��״̬��
	private List<UKeyUnitStatus> ukeyList;           //UKey��״̬��

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