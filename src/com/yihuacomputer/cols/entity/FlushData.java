package com.yihuacomputer.cols.entity;

import java.math.BigDecimal;

/**
 * �洢�������ݱ����
 * �����������Թɷ����޹�˾
 * 2017-06-01
 */
public class FlushData
{
    private int id;                    //���
    private String strPan;             //���׿���
    private String strTransCode;       //���״�����
    private BigDecimal amount;         //���׽��
    private String strDestPan;         //��չ���˺�
    private String strTrack2;          //�ڶ��ŵ�����
    private String strTrack3;          //�����ŵ�����
    private String strTerminalNum;     //���߱��
    private String strPinBlock;        //���˱�ʶ������
    private String strEncrypType;      //��ȫ������Ϣ 06-�����㷨 04-�����㷨
    private String strField55;         //55��
    private String strField57;         //�����۳�������
    private String strOrgTsn;          //ԭʼ����Ԫ
    private int flushTimes;            //������ɴ���
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
