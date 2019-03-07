package com.yihuacomputer.cols.entity;

/**
 * 菜单模板表对象
 * 深圳怡化电脑股份有限公司
 * 2017-06-09
 */
public class TemplateMenu
{
    private int id;                 //序号
    private String strTemplateName; //菜单模板名称
    private String strDescription;  //菜单模板描述

    public int getId() {
		return id;
    }
	public void setId(int id) {
		this.id = id;
	}
	public String getStrTemplateName() {
		return strTemplateName;
	}
	public void setStrTemplateName(String strTemplateName) {
		this.strTemplateName = strTemplateName;
	}
	public String getStrDescription() {
		return strDescription;
	}
	public void setStrDescription(String strDescription) {
		this.strDescription = strDescription;
	}
}
