package com.yihuacomputer.cols.entity;

import java.sql.Timestamp;

/**
 * PAD���״̬�����
 * �����������Թɷ����޹�˾
 * 2017-06-18
 */
public class PadCheck
{
    private int id;                      //���
    private String strTerminalNum;       //�ն˱��
    private String strTransCode;         //���ױ���
    private String strCheckSerialNo;     //��˽�����ˮ��
    private String strBusinessCode;      //ҵ�����
    private String strBusinessName;      //ҵ������
    private String strBatchId;           //���������κ�
    private String strCustomNo;          //�ͻ���
    private String strCustManagerNo;     //�ͻ�������
    private String strCustManagerName;   //�ͻ���������
    private int status;                  //����״̬  0;δ������1��������;2:ȡ�����
    private Timestamp dtStart;           //������ʼʱ��
    private Timestamp dtEnd;             //��������ʱ��
    private String strMemo;              //��ע

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
