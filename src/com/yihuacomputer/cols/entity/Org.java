package com.yihuacomputer.cols.entity;

/**
 * 机构表表对象
 * 深圳怡化电脑股份有限公司
 * 2017-01-12
 */
public class Org
{
    private int id;                  //序号
    private String strParentOrgCode; //上级机构编号
    private String strOrgNum;        //机构编号
    private String strOrgName;       //机构名称

    public int getId() {
		return id;
    }
	public void setId(int id) {
		this.id = id;
	}
	public String getStrOrgNum() {
		return strOrgNum;
	}
	public void setStrOrgNum(String strOrgNum) {
		this.strOrgNum = strOrgNum;
	}
	public String getStrOrgName() {
		return strOrgName;
	}
	public void setStrOrgName(String strOrgName) {
		this.strOrgName = strOrgName;
	}
	public String getStrParentOrgCode() {
		return strParentOrgCode;
	}
	public void setStrParentOrgCode(String strParentOrgCode) {
		this.strParentOrgCode = strParentOrgCode;
	}
}
