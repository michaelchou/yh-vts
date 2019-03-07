package com.yihuacomputer.cols.entity;

import java.math.BigDecimal;

/**
 * 存储冲正数据表对象
 * 深圳怡化电脑股份有限公司
 * 2017-06-01
 */
public class FlushData
{
    private int id;                    //序号
    private String strPan;             //交易卡号
    private String strTransCode;       //交易处理码
    private BigDecimal amount;         //交易金额
    private String strDestPan;         //拓展主账号
    private String strTrack2;          //第二磁道数据
    private String strTrack3;          //第三磁道数据
    private String strTerminalNum;     //机具编号
    private String strPinBlock;        //个人标识码数据
    private String strEncrypType;      //安全控制信息 06-国际算法 04-国密算法
    private String strField55;         //55域
    private String strField57;         //补登折冲正数据
    private String strOrgTsn;          //原始数据元
    private int flushTimes;            //冲正完成次数
	public int getId() {
		return id;
	}
	public void setId(int id) {
		this.id = id;
	}
	public String getStrPan() {
		return strPan;
	}
	public void setStrPan(String strPan) {
		this.strPan = strPan;
	}
	public String getStrTransCode() {
		return strTransCode;
	}
	public void setStrTransCode(String strTransCode) {
		this.strTransCode = strTransCode;
	}
	public BigDecimal getAmount() {
		return amount;
	}
	public void setAmount(BigDecimal amount) {
		this.amount = amount;
	}
	public String getStrDestPan() {
		return strDestPan;
	}
	public void setStrDestPan(String strDestPan) {
		this.strDestPan = strDestPan;
	}
	public String getStrTrack2() {
		return strTrack2;
	}
	public void setStrTrack2(String strTrack2) {
		this.strTrack2 = strTrack2;
	}
	public String getStrTrack3() {
		return strTrack3;
	}
	public void setStrTrack3(String strTrack3) {
		this.strTrack3 = strTrack3;
	}
	public String getStrTerminalNum() {
		return strTerminalNum;
	}
	public void setStrTerminalNum(String strTerminalNum) {
		this.strTerminalNum = strTerminalNum;
	}
	public String getStrPinBlock() {
		return strPinBlock;
	}
	public void setStrPinBlock(String strPinBlock) {
		this.strPinBlock = strPinBlock;
	}
	public String getStrField55() {
		return strField55;
	}
	public void setStrField55(String strField55) {
		this.strField55 = strField55;
	}
	public String getStrField57() {
		return strField57;
	}
	public void setStrField57(String strField57) {
		this.strField57 = strField57;
	}
	public String getStrOrgTsn() {
		return strOrgTsn;
	}
	public void setStrOrgTsn(String strOrgTsn) {
		this.strOrgTsn = strOrgTsn;
	}
	public int getFlushTimes() {
		return flushTimes;
	}
	public void setFlushTimes(int flushTimes) {
		this.flushTimes = flushTimes;
	}
	public String getStrEncrypType() {
		return strEncrypType;
	}
	public void setStrEncrypType(String strEncrypType) {
		this.strEncrypType = strEncrypType;
	}
}
