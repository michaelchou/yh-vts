package com.yihuacomputer.cols.entity;

/**
 * 城市表对象
 * 深圳怡化电脑股份有限公司
 * 2017-05-25
 */
public class City
{
    private int id;                   //序号
    private String strProvinceCode;   //省份编码
    private String strCityCode;       //城市编码
    private String strCityName;       //城市名称

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
