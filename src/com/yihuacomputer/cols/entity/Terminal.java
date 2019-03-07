package com.yihuacomputer.cols.entity;

import java.sql.Timestamp;

/**
 * 终端表对象
 * 深圳怡化电脑股份有限公司
 * 2016-10-24
 */
public class Terminal
{
    private int id;                 //序号
    private String strTerminalNum;  //终端编号
    private String strOrgNum;       //机构编号
    private String strNetAddr;      //设备IP地址
    private String strTellerNum;    //柜员号
    private int status;             //设备状态
    private String strTerminalStyle;//终端风格
    private String strTerminalAddr; //设备安装地址
    private String strDevSn;        //设备序列号
    private int devType;            //设备类型
    private String strParentOrgNum; //上级机构编号
    private int devModel;           //设备型号
    private int devManu;            //设备品牌
    private Timestamp dtStart;      //设备生效日期
    private Timestamp dtEnd;        //设备停用日期
    private String strMemo;         //备注信息


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
	public String getStrOrgNum() {
		return strOrgNum;
	}
	public void setStrOrgNum(String strOrgNum) {
		this.strOrgNum = strOrgNum;
	}
	public String getStrNetAddr() {
		return strNetAddr;
	}
	public void setStrNetAddr(String strNetAddr) {
		this.strNetAddr = strNetAddr;
	}
	public String getStrTellerNum() {
		return strTellerNum;
	}
	public void setStrTellerNum(String strTellerNum) {
		this.strTellerNum = strTellerNum;
	}
	public int getStatus() {
		return status;
	}
	public void setStatus(int status) {
		this.status = status;
	}
	public String getStrTerminalStyle() {
		return strTerminalStyle;
	}
	public void setStrTerminalStyle(String strTerminalStyle) {
		this.strTerminalStyle = strTerminalStyle;
	}
	public String getStrTerminalAddr() {
		return strTerminalAddr;
	}
	public void setStrTerminalAddr(String strTerminalAddr) {
		this.strTerminalAddr = strTerminalAddr;
	}
	public String getStrDevSn() {
		return strDevSn;
	}
	public void setStrDevSn(String strDevSn) {
		this.strDevSn = strDevSn;
	}
	public int getDevType() {
		return devType;
	}
	public void setDevType(int devType) {
		this.devType = devType;
	}
	public String getStrParentOrgNum() {
		return strParentOrgNum;
	}
	public void setStrParentOrgNum(String strParentOrgNum) {
		this.strParentOrgNum = strParentOrgNum;
	}
	public int getDevModel() {
		return devModel;
	}
	public void setDevModel(int devModel) {
		this.devModel = devModel;
	}
	public int getDevManu() {
		return devManu;
	}
	public void setDevManu(int devManu) {
		this.devManu = devManu;
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
}
