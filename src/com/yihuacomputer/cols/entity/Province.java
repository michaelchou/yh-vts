package com.yihuacomputer.cols.entity;

/**
 * ʡ�ݱ����
 * �����������Թɷ����޹�˾
 * 2017-05-25
 */
public class Province
{
    private int id;                   //���
    private String strProvinceCode;   //ʡ�ݱ���
    private String strProvinceName;   //ʡ������

    public int getId() {
		return id;
    }
	public void setId(int id) {
		this.id = id;
	}
	public String getStrProvinceCode() {
		return strProvinceCode;
	}
	public void setStrProvinceCode(String strProvinceCode) {
		this.strProvinceCode = strProvinceCode;
	}
	public String getStrProvinceName() {
		return strProvinceName;
	}
	public void setStrProvinceName(String strProvinceName) {
		this.strProvinceName = strProvinceName;
	}
}
