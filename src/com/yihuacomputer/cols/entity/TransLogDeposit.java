package com.yihuacomputer.cols.entity;

import java.math.BigDecimal;
import java.sql.Timestamp;

/**
 * 存款流水表
 * @author Administrator
 *
 */
public class TransLogDeposit {

	private int id;                   //唯一ID

    private String strTerminalNum;    //终端编号

    private String transCode;           //交易编码
    
	private Timestamp dtOccur;        //交易时间

	private String strPan;            //交易账号  卡号

	private BigDecimal damount;       //交易金额

	private BigDecimal dfee;          //手续费

	private int ihostTransStatus;  //主机交易状态

	private String strHostRetCode;    //主机返回码

	private String strHostTsn;        //主机流水号

	private int itermTransStatus;  //终端交易状态

	private String strTermSerialNo;   //终端流水号

	private int isettleCycle;      //当前批次

	private int isettleCycleStatus; //是否清机
	
	private String strSingleBusinessNum;//单笔业务流水号：这里保存终端编号+随机8位数组成新的16位的流水号，用于保持整交易的完整祥

	private String strExInfo1;        //预留1

	private String strExInfo2;        //预留2

	private String strExInfo3;        //预留3

	private String strExInfo4;        //预留4

	private String strExInfo5;        //预留5

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

	public Timestamp getDtOccur() {
		return dtOccur;
	}

	public void setDtOccur(Timestamp dtOccur) {
		this.dtOccur = dtOccur;
	}

	public String getStrPan() {
		return strPan;
	}

	public void setStrPan(String strPan) {
		this.strPan = strPan;
	}

	public BigDecimal getDamount() {
		return damount;
	}

	public void setDamount(BigDecimal damount) {
		this.damount = damount;
	}

	public BigDecimal getDfee() {
		return dfee;
	}

	public void setDfee(BigDecimal dfee) {
		this.dfee = dfee;
	}

	public int getIhostTransStatus() {
		return ihostTransStatus;
	}

	public void setIhostTransStatus(int ihostTransStatus) {
		this.ihostTransStatus = ihostTransStatus;
	}

	public String getStrHostRetCode() {
		return strHostRetCode;
	}

	public void setStrHostRetCode(String strHostRetCode) {
		this.strHostRetCode = strHostRetCode;
	}

	public String getStrHostTsn() {
		return strHostTsn;
	}

	public void setStrHostTsn(String strHostTsn) {
		this.strHostTsn = strHostTsn;
	}

	public int getItermTransStatus() {
		return itermTransStatus;
	}

	public void setItermTransStatus(int itermTransStatus) {
		this.itermTransStatus = itermTransStatus;
	}

	public String getStrTermSerialNo() {
		return strTermSerialNo;
	}

	public void setStrTermSerialNo(String strTermSerialNo) {
		this.strTermSerialNo = strTermSerialNo;
	}

	public int getIsettleCycle() {
		return isettleCycle;
	}

	public void setIsettleCycle(int isettleCycle) {
		this.isettleCycle = isettleCycle;
	}

	public int getIsettleCycleStatus() {
		return isettleCycleStatus;
	}

	public void setIsettleCycleStatus(int isettleCycleStatus) {
		this.isettleCycleStatus = isettleCycleStatus;
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

	public String getStrExInfo3() {
		return strExInfo3;
	}

	public void setStrExInfo3(String strExInfo3) {
		this.strExInfo3 = strExInfo3;
	}

	public String getStrExInfo4() {
		return strExInfo4;
	}

	public void setStrExInfo4(String strExInfo4) {
		this.strExInfo4 = strExInfo4;
	}

	public String getStrExInfo5() {
		return strExInfo5;
	}

	public void setStrExInfo5(String strExInfo5) {
		this.strExInfo5 = strExInfo5;
	}
	public String getTransCode() {
		return transCode;
	}
	public void setTransCode(String transCode) {
		this.transCode = transCode;
	}
	public String getStrSingleBusinessNum() {
		return strSingleBusinessNum;
	}
	public void setStrSingleBusinessNum(String strSingleBusinessNum) {
		this.strSingleBusinessNum = strSingleBusinessNum;
	}
}
