package com.yihuacomputer.cols.entity;

/**
 * �˵���ģ��Ĺ��������
 * �����������Թɷ����޹�˾
 * 2017-06-09
 */
public class TemplateMenuRelation
{
    private int id;                 //���
    private int templateId;         //ģ��id
    private int serviceMenuId;      //�˵�id

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
