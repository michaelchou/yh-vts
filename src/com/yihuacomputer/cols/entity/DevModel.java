package com.yihuacomputer.cols.entity;

/**
 * 设备型号表对象
 * 深圳怡化电脑股份有限公司
 * 2017-06-08
 */
public class DevModel
{
    private int id;                   //序号
    private int devManuId;            //品牌Id号
    private String strDevModelName;   //设备型号

    public int getId() {
		return id;
    }
	public void setId(int id) {
		this.id = id;
	}
	public int getDevManuId() {
		return devManuId;
	}
	public void setDevManuId(int devManuId) {
		this.devManuId = devManuId;
	}
	public String getStrDevModelName() {
		return strDevModelName;
	}
	public void setStrDevModelName(String strDevModelName) {
		this.strDevModelName = strDevModelName;
	}
}
