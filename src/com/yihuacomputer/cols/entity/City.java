package com.yihuacomputer.cols.entity;

/**
 * ���б����
 * �����������Թɷ����޹�˾
 * 2017-05-25
 */
public class City
{
    private int id;                   //���
    private String strProvinceCode;   //ʡ�ݱ���
    private String strCityCode;       //���б���
    private String strCityName;       //��������

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
	public String getStrCityCode() {
		return strCityCode;
	}
	public void setStrCityCode(String strCityCode) {
		this.strCityCode = strCityCode;
	}
	public String getStrCityName() {
		return strCityName;
	}
	public void setStrCityName(String strCityName) {
		this.strCityName = strCityName;
	}
}
