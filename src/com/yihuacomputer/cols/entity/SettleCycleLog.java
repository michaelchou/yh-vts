package com.yihuacomputer.cols.entity;

import java.math.BigDecimal;
import java.sql.Timestamp;
import java.text.SimpleDateFormat;

/**
 * 终端批次表（加钞表）
 * @author Administrator
 *
 */
public class SettleCycleLog {

	private int  id;                         //唯一ID

	private String    strTerminalNum;        //终端编号

	private int	  isettlecycle;          //批次号

	private Timestamp dtStart;               //开始时间

	private Timestamp dtEnd ;                //结束时间

	private int	  isStatus;              //清机状态  0:未清机   1:已清机

	private BigDecimal	dcdmSurplusAmt;      //取款箱剩余金额

	private BigDecimal	dcimSurplusAmt;      //存款箱剩余金额

	private BigDecimal	dcdmAddAmt;          //加钞金额

	private String	strExInfo1;				 //预留1

	private String	strExInfo2;              //预留2

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

	public int getIsettlecycle() {
		return isettlecycle;
	}

	public void setIsettlecycle(int isettlecycle) {
		this.isettlecycle = isettlecycle;
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

	public int getIsStatus() {
		return isStatus;
	}

	public void setIsStatus(int isStatus) {
		this.isStatus = isStatus;
	}

	public BigDecimal getDcdmSurplusAmt() {
		return dcdmSurplusAmt;
	}

	public void setDcdmSurplusAmt(BigDecimal dcdmSurplusAmt) {
		this.dcdmSurplusAmt = dcdmSurplusAmt;
	}

	public BigDecimal getDcimSurplusAmt() {
		return dcimSurplusAmt;
	}

	public void setDcimSurplusAmt(BigDecimal dcimSurplusAmt) {
		this.dcimSurplusAmt = dcimSurplusAmt;
	}

	public BigDecimal getDcdmAddAmt() {
		return dcdmAddAmt;
	}

	public void setDcdmAddAmt(BigDecimal dcdmAddAmt) {
		this.dcdmAddAmt = dcdmAddAmt;
	}

	public String getStrExInfo1() {
		return strExInfo1;
	}

	public void setStrExInfo1(String strExInfo1) {
		this.strExInfo1 = strExInfo1;
	}

	public String getStrExInfo2() {
		return strExInfo2;
	}

	public void setStrExInfo2(String strExInfo2) {
		this.strExInfo2 = strExInfo2;
	}

	@Override
	public String toString() {
		return id + "," + strTerminalNum + "," + isettlecycle + ","
				+ formatTimestamp(dtStart) + ","
				+ formatTimestamp(dtEnd) + "," + isStatus+ ","
				+ dcdmSurplusAmt + "," + dcimSurplusAmt + ","
				+ dcdmAddAmt + "," + strExInfo1 + "," + strExInfo2;
	}

	private String formatTimestamp(Timestamp date){
		if(null == date){
			return "";
		}
		return  new SimpleDateFormat("yyyy-MM-dd HH:mm:ss").format(date);
	}



}
