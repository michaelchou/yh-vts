package com.yihuacomputer.cols.entity;

import java.sql.Timestamp;

/**
 * �ն˱����
 * �����������Թɷ����޹�˾
 * 2016-10-24
 */
public class Terminal
{
    private int id;                 //���
    private String strTerminalNum;  //�ն˱��
    private String strOrgNum;       //�������
    private String strNetAddr;      //�豸IP��ַ
    private String strTellerNum;    //��Ա��
    private int status;             //�豸״̬
    private String strTerminalStyle;//�ն˷��
    private String strTerminalAddr; //�豸��װ��ַ
    private String strDevSn;        //�豸���к�
    private int devType;            //�豸����
    private String strParentOrgNum; //�ϼ��������
    private int devModel;           //�豸�ͺ�
    private int devManu;            //�豸Ʒ��
    private Timestamp dtStart;      //�豸��Ч����
    private Timestamp dtEnd;        //�豸ͣ������
    private String strMemo;         //��ע��Ϣ


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
