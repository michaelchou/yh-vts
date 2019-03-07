package com.yihuacomputer.cols.entity;

import java.sql.Timestamp;

/**
 * 异常处理表对象
 * 深圳怡化电脑股份有限公司
 * 2017-06-12
 */

public class ExpLog
{
    private int id;                   //序号
    private String strTerminalNum;    //终端编号
    private String strExpCode;        //异常处理码
    private String strMemo;           //描述
    private Timestamp dtOccur;        //发生时间
    private String strPan;            //卡号或其他介质号码

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
	public String getStrExpCode() {
		return strExpCode;
	}
	public void setStrExpCode(String strExpCode) {
		this.strExpCode = strExpCode;
	}
	public String getStrMemo() {
		return strMemo;
	}
	public void setStrMemo(String strMemo) {
		this.strMemo = strMemo;
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
}
