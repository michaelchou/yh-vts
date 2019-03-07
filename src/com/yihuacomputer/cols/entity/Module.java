package com.yihuacomputer.cols.entity;

/**
 * 模块表对象
 * 深圳怡化电脑股份有限公司
 * 2016-10-25
 */
public class Module
{
    private int id;               //序号
    private String strModuleName; //模块名称
    private String strModuleClsid;//模块对应的Clsid值
    private String strModuleDesc; //模块描述

    public int getId() {
		return id;
    }
	public void setId(int id) {
		this.id = id;
	}
	public String getStrModuleName() {
		return strModuleName;
	}
	public void setStrModuleName(String strModuleName) {
		this.strModuleName = strModuleName;
	}
	public String getStrModuleClsid() {
		return strModuleClsid;
	}
	public void setStrModuleClsid(String strModuleClsid) {
		this.strModuleClsid = strModuleClsid;
	}
	public String getStrModuleDesc() {
		return strModuleDesc;
	}
	public void setStrModuleDesc(String strModuleDesc) {
		this.strModuleDesc = strModuleDesc;
	}
}
