package com.yihuacomputer.cols.entity;

/**
 * �˵�ģ������
 * �����������Թɷ����޹�˾
 * 2017-06-09
 */
public class TemplateMenu
{
    private int id;                 //���
    private String strTemplateName; //�˵�ģ������
    private String strDescription;  //�˵�ģ������

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
