package com.yihuacomputer.cols.entity;

/**
 * 菜单与模板的关联表对象
 * 深圳怡化电脑股份有限公司
 * 2017-06-09
 */
public class TemplateMenuRelation
{
    private int id;                 //序号
    private int templateId;         //模板id
    private int serviceMenuId;      //菜单id

    public int getId() {
		return id;
    }
	public void setId(int id) {
		this.id = id;
	}
	public int getTemplateId() {
		return templateId;
	}
	public void setTemplateId(int templateId) {
		this.templateId = templateId;
	}
	public int getServiceMenuId() {
		return serviceMenuId;
	}
	public void setServiceMenuId(int serviceMenuId) {
		this.serviceMenuId = serviceMenuId;
	}
}
