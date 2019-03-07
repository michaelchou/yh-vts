package com.yihuacomputer.cols.entity;

/**
 * 省份表对象
 * 深圳怡化电脑股份有限公司
 * 2017-05-25
 */
public class Province
{
    private int id;                   //序号
    private String strProvinceCode;   //省份编码
    private String strProvinceName;   //省份名称

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
