package com.yihuacomputer.cols.entity;

/**
 * ���б����
 * �����������Թɷ����޹�˾
 * 2017-05-25
 */
public class Bank
{
    private int id;                   //���
    private String strBankCode;       //���б���
    private String strBankName;       //��������

    public int getId() {
		return id;
    }
	public void setId(int id) {
		this.id = id;
	}
	public String getStrBankCode() {
		return strBankCode;
	}
	public void setStrBankCode(String strBankCode) {
		this.strBankCode = strBankCode;
	}
	public String getStrBankName() {
		return strBankName;
	}
	public void setStrBankName(String strBankName) {
		this.strBankName = strBankName;
	}
}
