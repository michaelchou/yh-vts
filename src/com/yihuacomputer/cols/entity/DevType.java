package com.yihuacomputer.cols.entity;

/**
 * 设备类型表对象
 * 深圳怡化电脑股份有限公司
 * 2017-06-08
 */
public class DevType
{
    private int id;                   //序号
    private String strDevTypeName;    //设备类型

    public int getId() {
		return id;
    }
	public void setId(int id) {
		this.id = id;
	}
	public String getStrDevTypeName() {
		return strDevTypeName;
	}
	public void setStrDevTypeName(String strDevTypeName) {
		this.strDevTypeName = strDevTypeName;
	}
}
