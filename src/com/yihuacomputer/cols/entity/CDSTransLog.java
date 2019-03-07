package com.yihuacomputer.cols.entity;

import java.math.BigDecimal;
import java.sql.Timestamp;

/**
 * 存单账务表对象
 * 深圳怡化电脑股份有限公司
 * 2017-01-20
 */
public class CDSTransLog
{
    private int id;                     //序号
    private String strTerminalNum;      //终端编号
    private String transCode;           //交易编码
    private String strOCRNum;           //存单OCR号
    private String strAccountNum;       //存单账号
    private String strIDCardNum;        //办理人身份证号
    private BigDecimal amt;             //交易金额
    private Timestamp dtOccur;          //终端交易时间
    private BigDecimal fee;             //手续费
    private String strAuthIDCardNum;    //委托人身份证号
    private String strHostRetCode;      //主机返回码
    private int hostTxStatus;           //主机交易状态
    private int termTxStatus;           //终端交易状态
    private String strHostSerialNo;     //主机交易流水
    private String strAccMode;          //存取方式
    private String strCDSType;          //存单类型  1:开户  2：销户  3：续存  4：部提
    private Timestamp dtHostOccur;      //主机交易时间
    private int termBatchNo;            //批次号
    private String strTermSerialNo;     //终端交易状态
    private String strOrigstrTxSerialNo;//原交易流水号
    private String strSingleBusinessNum;//单笔业务流水号：这里保存终端编号+随机8位数组成新的16位的流水号，用于保持整交易的完整祥
    private String strRate;             //利率
    private String strInterest;         //利息
    private String strTimeLimit;        //期限
    private String strExInfo1;          //预留字段1
    private String strExInfo2;          //预留字段2
    private String strExInfo3;          //预留字段3
    private String strExInfo4;          //预留字段4
    private String strExInfo5;          //预留字段5
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
	public BigDecimal getAmt() {
		return amt;
	}
	public void setAmt(BigDecimal amt) {
		this.amt = amt;
	}
	public Timestamp getDtOccur() {
		return dtOccur;
	}
	public void setDtOccur(Timestamp dtOccur) {
		this.dtOccur = dtOccur;
	}
	public BigDecimal getFee() {
		return fee;
	}
	public void setFee(BigDecimal fee) {
		this.fee = fee;
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
	public int getTermTxStatus() {
		return termTxStatus;
	}
	public void setTermTxStatus(int termTxStatus) {
		this.termTxStatus = termTxStatus;
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
	public String getStrOCRNum() {
		return strOCRNum;
	}
	public void setStrOCRNum(String strOCRNum) {
		this.strOCRNum = strOCRNum;
	}
	public String getStrAccountNum() {
		return strAccountNum;
	}
	public void setStrAccountNum(String strAccountNum) {
		this.strAccountNum = strAccountNum;
	}
	public String getStrIDCardNum() {
		return strIDCardNum;
	}
	public void setStrIDCardNum(String strIDCardNum) {
		this.strIDCardNum = strIDCardNum;
	}
	public String getStrAuthIDCardNum() {
		return strAuthIDCardNum;
	}
	public void setStrAuthIDCardNum(String strAuthIDCardNum) {
		this.strAuthIDCardNum = strAuthIDCardNum;
	}
	public String getStrCDSType() {
		return strCDSType;
	}
	public void setStrCDSType(String strCDSType) {
		this.strCDSType = strCDSType;
	}
	public String getStrSingleBusinessNum() {
		return strSingleBusinessNum;
	}
	public void setStrSingleBusinessNum(String strSingleBusinessNum) {
		this.strSingleBusinessNum = strSingleBusinessNum;
	}
	public String getStrHostRetCode() {
		return strHostRetCode;
	}
	public void setStrHostRetCode(String strHostRetCode) {
		this.strHostRetCode = strHostRetCode;
	}
	public String getStrRate() {
		return strRate;
	}
	public void setStrRate(String strRate) {
		this.strRate = strRate;
	}
	public String getStrInterest() {
		return strInterest;
	}
	public void setStrInterest(String strInterest) {
		this.strInterest = strInterest;
	}
	public String getStrAccMode() {
		return strAccMode;
	}
	public void setStrAccMode(String strAccMode) {
		this.strAccMode = strAccMode;
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
	public String getStrTimeLimit() {
		return strTimeLimit;
	}
	public void setStrTimeLimit(String strTimeLimit) {
		this.strTimeLimit = strTimeLimit;
	}
	public int getSettleCycleStatus() {
		return settleCycleStatus;
	}
	public void setSettleCycleStatus(int settleCycleStatus) {
		this.settleCycleStatus = settleCycleStatus;
	}
}
