package com.yihuacomputer.cols.entity;

/**
 * 参数表对象
 * 深圳怡化电脑股份有限公司
 * 2016-10-24
 */
public class Misc
{
    private int id;           //序号
    private String strName;   //参数名称
    private String strValue;  //参数值
    private String strDesc;   //参数描述
    private String strOrgNum; //机构号

    public int getId() {
		return id;
    }
	public void setId(int id) {
		this.id = id;
	}
	public String getStrName() {
		return strName;
	}
	public void setStrName(String strName) {
		this.strName = strName;
	}
	public String getStrValue() {
		return strValue;
	}
	public void setStrValue(String strValue) {
		this.strValue = strValue;
	}
	public String getStrDesc() {
		return strDesc;
	}
	public void setStrDesc(String strDesc) {
		this.strDesc = strDesc;
	}
	public String getStrOrgNum() {
		return strOrgNum;
	}
	public void setStrOrgNum(String strOrgNum) {
		this.strOrgNum = strOrgNum;
	}
}
