package com.yihuacomputer.cols.entity;

import java.sql.Timestamp;

/**
 * �쳣��������
 * �����������Թɷ����޹�˾
 * 2017-06-12
 */

public class ExpLog
{
    private int id;                   //���
    private String strTerminalNum;    //�ն˱��
    private String strExpCode;        //�쳣������
    private String strMemo;           //����
    private Timestamp dtOccur;        //����ʱ��
    private String strPan;            //���Ż��������ʺ���

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
