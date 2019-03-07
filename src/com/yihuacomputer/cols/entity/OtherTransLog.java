package com.yihuacomputer.cols.entity;

import java.math.BigDecimal;
import java.sql.Timestamp;

/**
 * 其他交易流水表对象(除存单、发卡、发UKEY)
 * 深圳怡化电脑股份有限公司
 * 2017-05-05
 */
public class OtherTransLog
{
    private int id;                     //序号
    private String strTerminalNum;      //终端编号
    private String transCode;           //交易编码
    private String strPan;              //转出卡号
    private String strDestPan;          //转入卡号
    private BigDecimal amt;             //交易金额
    private String strIDCardNum;        //身份证号
    private Timestamp dtOccur;          //终端交易时间
    private BigDecimal fee;             //手续费
    private String currency;            //币种
    private int hostTxStatus;           //主机交易状态
    private String strHostSerialNo;     //主机交易流水
    private String strHostRetCode;      //主机返回码
    private String strCardType;         //卡类型
    private Timestamp dtHostOccur;      //主机交易时间
    private int termBatchNo;            //批次号
    private int reverseStatus;          //冲正状态  0:未冲正; 1:成功;2:失败;3:结果不确定
    private String strTermSerialNo;     //终端交易状态
    private String strOrigstrTxSerialNo;//原交易流水号
    private int checkFlag;              //是否对账标识
    private String strSingleBusinessNum;//单笔业务流水号：这里保存终端编号+随机8位数组成新的16位的流水号，用于保持整交易的完整祥
    private String strExInfo1;          //预留字段1
    private String strExInfo2;          //预留字段2

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
	public String getStrCardType() {
		return strCardType;
	}
	public void setStrCardType(String strCardType) {
		this.strCardType = strCardType;
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
	public String getStrPan() {
		return strPan;
	}
	public void setStrPan(String strPan) {
		this.strPan = strPan;
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
	public String getStrDestPan() {
		return strDestPan;
	}
	public void setStrDestPan(String strDestPan) {
		this.strDestPan = strDestPan;
	}
	public BigDecimal getAmt() {
		return amt;
	}
	public void setAmt(BigDecimal amt) {
		this.amt = amt;
	}
	public BigDecimal getFee() {
		return fee;
	}
	public void setFee(BigDecimal fee) {
		this.fee = fee;
	}
	public String getCurrency() {
		return currency;
	}
	public void setCurrency(String currency) {
		this.currency = currency;
	}
	public int getCheckFlag() {
		return checkFlag;
	}
	public void setCheckFlag(int checkFlag) {
		this.checkFlag = checkFlag;
	}
	public int getReverseStatus() {
		return reverseStatus;
	}
	public void setReverseStatus(int reverseStatus) {
		this.reverseStatus = reverseStatus;
	}
	public String getStrSingleBusinessNum() {
		return strSingleBusinessNum;
	}
	public void setStrSingleBusinessNum(String strSingleBusinessNum) {
		this.strSingleBusinessNum = strSingleBusinessNum;
	}

}
