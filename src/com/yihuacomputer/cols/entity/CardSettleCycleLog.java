package com.yihuacomputer.cols.entity;

import java.sql.Timestamp;

/**
 * 发卡箱表对象
 * 深圳怡化电脑股份有限公司
 * 2017-01-17
 */
public class CardSettleCycleLog
{
    private int id;                	 //序号
    private String strTerminalNum;   //终端编号
    private int termBatchNo;         //批次号
    private Timestamp dtStart;       //加卡时间
    private Timestamp dtEnd;         //
    private int status;           	 //状态(0)
    private int cardSurplusCount;    //剩余卡数
    private int cardRefillCount;	 //初始卡数

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
	public int getCardSurplusCount() {
		return cardSurplusCount;
	}
	public void setCardSurplusCount(int cardSurplusCount) {
		this.cardSurplusCount = cardSurplusCount;
	}
	public int getCardRefillCount() {
		return cardRefillCount;
	}
	public void setCardRefillCount(int cardRefillCount) {
		this.cardRefillCount = cardRefillCount;
	}
}
