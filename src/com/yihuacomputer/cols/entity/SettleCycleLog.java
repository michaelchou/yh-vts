package com.yihuacomputer.cols.entity;

import java.math.BigDecimal;
import java.sql.Timestamp;
import java.text.SimpleDateFormat;

/**
 * �ն����α��ӳ���
 * @author Administrator
 *
 */
public class SettleCycleLog {

	private int  id;                         //ΨһID

	private String    strTerminalNum;        //�ն˱��

	private int	  isettlecycle;          //���κ�

	private Timestamp dtStart;               //��ʼʱ��

	private Timestamp dtEnd ;                //����ʱ��

	private int	  isStatus;              //���״̬  0:δ���   1:�����

	private BigDecimal	dcdmSurplusAmt;      //ȡ����ʣ����

	private BigDecimal	dcimSurplusAmt;      //�����ʣ����

	private BigDecimal	dcdmAddAmt;          //�ӳ����

	private String	strExInfo1;				 //Ԥ��1

	private String	strExInfo2;              //Ԥ��2

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
