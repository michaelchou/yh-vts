package com.yihuacomputer.cols.entity;

import java.sql.Timestamp;

/**
 * UKey表对象
 * 深圳怡化电脑股份有限公司
 * 2017-05-10
 */
public class UKeyTransLog
{
    private int id;                     //序号
    private String strTerminalNum;      //终端编号
    private String transCode;           //交易编码
    private String strUKeyNum;          //Ukey号码
    private String strIDCardNum;        //身份证号
    private String strBindCardNum;      //UKey绑定的卡号
    private Timestamp dtOccur;          //终端交易时间
    private int hostTxStatus;           //主机交易状态
    private int termTxStatus;           //终端交易状态
    private String strHostSerialNo;     //主机交易流水
    private String strHostRetCode;      //主机返回码
    private String strUKeyType;         //UKey类型
    private Timestamp dtHostOccur;      //主机交易时间
    private int termBatchNo;            //批次号
    private String strTermSerialNo;     //终端交易状态
    private String strOrigstrTxSerialNo;//原交易流水号
    private String strSingleBusinessNum;//单笔业务流水号：这里保存终端编号+随机8位数组成新的16位的流水号，用于保持整交易的完整祥
    private String strExInfo1;          //预留字段1
    private String strExInfo2;          //预留字段2
    private int settleCycleStatus;      //清机状态   0：未清机 1：已清机

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
	public String getTransCode() {
		return transCode;
	}
	public void setTransCode(String transCode) {
		this.transCode = transCode;
	}
	public Timestamp getDtOccur() {
		return dtOccur;
	}
	public void setDtOccur(Timestamp dtOccur) {
		this.dtOccur = dtOccur;
	}
	public int getHostTxStatus() {
		return hostTxStatus;
	}
	public void setHostTxStatus(int hostTxStatus) {
		this.hostTxStatus = hostTxStatus;
	}
	public String getStrHostSerialNo() {
		return strHostSerialNo;
	}
	public void setStrHostSerialNo(String strHostSerialNo) {
		this.strHostSerialNo = strHostSerialNo;
	}
	public Timestamp getDtHostOccur() {
		return dtHostOccur;
	}
	public void setDtHostOccur(Timestamp dtHostOccur) {
		this.dtHostOccur = dtHostOccur;
	}
	public int getTermBatchNo() {
		return termBatchNo;
	}
	public void setTermBatchNo(int termBatchNo) {
		this.termBatchNo = termBatchNo;
	}
	public String getStrTermSerialNo() {
		return strTermSerialNo;
	}
	public void setStrTermSerialNo(String strTermSerialNo) {
		this.strTermSerialNo = strTermSerialNo;
	}
	public String getStrOrigstrTxSerialNo() {
		return strOrigstrTxSerialNo;
	}
	public void setStrOrigstrTxSerialNo(String strOrigstrTxSerialNo) {
		this.strOrigstrTxSerialNo = strOrigstrTxSerialNo;
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
	public String getStrIDCardNum() {
		return strIDCardNum;
	}
	public void setStrIDCardNum(String strIDCardNum) {
		this.strIDCardNum = strIDCardNum;
	}
	public String getStrHostRetCode() {
		return strHostRetCode;
	}
	public void setStrHostRetCode(String strHostRetCode) {
		this.strHostRetCode = strHostRetCode;
	}
	public int getTermTxStatus() {
		return termTxStatus;
	}
	public void setTermTxStatus(int termTxStatus) {
		this.termTxStatus = termTxStatus;
	}
	public String getStrUKeyNum() {
		return strUKeyNum;
	}
	public void setStrUKeyNum(String strUKeyNum) {
		this.strUKeyNum = strUKeyNum;
	}
	public String getStrBindCardNum() {
		return strBindCardNum;
	}
	public void setStrBindCardNum(String strBindCardNum) {
		this.strBindCardNum = strBindCardNum;
	}
	public String getStrUKeyType() {
		return strUKeyType;
	}
	public void setStrUKeyType(String strUKeyType) {
		this.strUKeyType = strUKeyType;
	}
	public String getStrSingleBusinessNum() {
		return strSingleBusinessNum;
	}
	public void setStrSingleBusinessNum(String strSingleBusinessNum) {
		this.strSingleBusinessNum = strSingleBusinessNum;
	}
	public int getSettleCycleStatus() {
		return settleCycleStatus;
	}
	public void setSettleCycleStatus(int settleCycleStatus) {
		this.settleCycleStatus = settleCycleStatus;
	}
}
