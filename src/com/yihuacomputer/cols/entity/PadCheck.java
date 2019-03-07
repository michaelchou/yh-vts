package com.yihuacomputer.cols.entity;

import java.sql.Timestamp;

/**
 * PAD审核状态表对象
 * 深圳怡化电脑股份有限公司
 * 2017-06-18
 */
public class PadCheck
{
    private int id;                      //序号
    private String strTerminalNum;       //终端编号
    private String strTransCode;         //交易编码
    private String strCheckSerialNo;     //审核交易流水号
    private String strBusinessCode;      //业务编码
    private String strBusinessName;      //业务名称
    private String strBatchId;           //审批的批次号
    private String strCustomNo;          //客户号
    private String strCustManagerNo;     //客户经理编号
    private String strCustManagerName;   //客户经理名称
    private int status;                  //审批状态  0;未审批；1：已审批;2:取消审核
    private Timestamp dtStart;           //审批开始时间
    private Timestamp dtEnd;             //审批结束时间
    private String strMemo;              //备注

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
	public String getStrCheckSerialNo() {
		return strCheckSerialNo;
	}
	public void setStrCheckSerialNo(String strCheckSerialNo) {
		this.strCheckSerialNo = strCheckSerialNo;
	}
	public String getStrBusinessCode() {
		return strBusinessCode;
	}
	public void setStrBusinessCode(String strBusinessCode) {
		this.strBusinessCode = strBusinessCode;
	}
	public String getStrBusinessName() {
		return strBusinessName;
	}
	public void setStrBusinessName(String strBusinessName) {
		this.strBusinessName = strBusinessName;
	}
	public String getStrBatchId() {
		return strBatchId;
	}
	public void setStrBatchId(String strBatchId) {
		this.strBatchId = strBatchId;
	}
	public String getStrCustomNo() {
		return strCustomNo;
	}
	public void setStrCustomNo(String strCustomNo) {
		this.strCustomNo = strCustomNo;
	}
	public int getStatus() {
		return status;
	}
	public void setStatus(int status) {
		this.status = status;
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
	public String getStrMemo() {
		return strMemo;
	}
	public void setStrMemo(String strMemo) {
		this.strMemo = strMemo;
	}
	public String getStrCustManagerNo() {
		return strCustManagerNo;
	}
	public void setStrCustManagerNo(String strCustManagerNo) {
		this.strCustManagerNo = strCustManagerNo;
	}
	public String getStrCustManagerName() {
		return strCustManagerName;
	}
	public void setStrCustManagerName(String strCustManagerName) {
		this.strCustManagerName = strCustManagerName;
	}
	public String getStrTransCode() {
		return strTransCode;
	}
	public void setStrTransCode(String strTransCode) {
		this.strTransCode = strTransCode;
	}
}
