package com.yihuacomputer.cols.entity;

import java.sql.Timestamp;

/**
 * UKey������
 * �����������Թɷ����޹�˾
 * 2017-05-03
 */
public class UKeySettleCycleLog
{
    private int id;                	 //���
    private String strTerminalNum;   //�ն˱��
    private int termBatchNo;         //���κ�
    private Timestamp dtStart;       //��UKeyʱ��
    private Timestamp dtEnd;         //
    private int status;           	 //״̬(0)
    private int uKeySurplusCount;    //ʣ��UKey��
    private int uKeyRefillCount;	 //��ʼUKey��

	public int getId() {
		return id;
	}
	public void setId(int id) {
		this.id = id;
	}
	public String getStrTerminalNum() {
		return strTerminalNum;
	}
	public void setStrTerminalNum(String strTerminalNum) {
		this.strTerminalNum = strTerminalNum;
	}
	public int getTermBatchNo() {
		return termBatchNo;
	}
	public void setTermBatchNo(int termBatchNo) {
		this.termBatchNo = termBatchNo;
	}
	public Timestamp getDtStart() {
		return dtStart;
	}
	public void setDtStart(Timestamp dtStart) {
		this.dtStart = dtStart;
	}
	public Timestamp getDtEnd() {
		return dtEnd;
	}
	public void setDtEnd(Timestamp dtEnd) {
		this.dtEnd = dtEnd;
	}
	public int getStatus() {
		return status;
	}
	public void setStatus(int status) {
		this.status = status;
	}
	public int getuKeySurplusCount() {
		return uKeySurplusCount;
	}
	public void setuKeySurplusCount(int uKeySurplusCount) {
		this.uKeySurplusCount = uKeySurplusCount;
	}
	public int getuKeyRefillCount() {
		return uKeyRefillCount;
	}
	public void setuKeyRefillCount(int uKeyRefillCount) {
		this.uKeyRefillCount = uKeyRefillCount;
	}
}
