package com.yihuacomputer.cols.entity;

import java.sql.Timestamp;

/**
 * UKey箱表对象
 * 深圳怡化电脑股份有限公司
 * 2017-05-03
 */
public class UKeySettleCycleLog
{
    private int id;                	 //序号
    private String strTerminalNum;   //终端编号
    private int termBatchNo;         //批次号
    private Timestamp dtStart;       //加UKey时间
    private Timestamp dtEnd;         //
    private int status;           	 //状态(0)
    private int uKeySurplusCount;    //剩余UKey数
    private int uKeyRefillCount;	 //初始UKey数

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
