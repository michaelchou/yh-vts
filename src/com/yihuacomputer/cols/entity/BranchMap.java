package com.yihuacomputer.cols.entity;

/**
 * ����ת�˻�·�����
 * �����������Թɷ����޹�˾
 * 2017-07-13
 */
public class BranchMap
{
    private int id;                         //���
    private String strLocalRouteCode;       //���л�·����
    private String strLocalBankCode;        //���н������

    public int getId() {
		return id;
    }
	public void setId(int id) {
		this.id = id;
	}

	public String getStrLocalRouteCode() {
		return strLocalRouteCode;
	}
	public void setStrLocalRouteCode(String strLocalRouteCode) {
		this.strLocalRouteCode = strLocalRouteCode;
	}
	public String getStrLocalBankCode() {
		return strLocalBankCode;
	}
	public void setStrLocalBankCode(String strLocalBankCode) {
		this.strLocalBankCode = strLocalBankCode;
	}
}
