package com.yihuacomputer.cols.entity;

import java.sql.Timestamp;

/**
 * �浥������
 * �����������Թɷ����޹�˾
 * 2017-05-03
 */
public class CDSSettleCycleLog
{
    private int id;                	 //���
    private String strTerminalNum;   //�ն˱��
    private int termBatchNo;         //���κ�
    private Timestamp dtStart;       //�ӿ�ʱ��
    private Timestamp dtEnd;         //
    private int status;           	 //״̬(0)
    private int cdsSurplusCount;    //ʣ�࿨��
    private int cdsRefillCount;	 //��ʼ����

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
	public int getCdsSurplusCount() {
		return cdsSurplusCount;
	}
	public void setCdsSurplusCount(int cdsSurplusCount) {
		this.cdsSurplusCount = cdsSurplusCount;
	}
	public int getCdsRefillCount() {
		return cdsRefillCount;
	}
	public void setCdsRefillCount(int cdsRefillCount) {
		this.cdsRefillCount = cdsRefillCount;
	}
}
