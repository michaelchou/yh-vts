package com.yihuacomputer.cols.entity;

/**
 * �ն˶�Ӧ�ķ������
 * �����������Թɷ����޹�˾
 * 2016-11-23
 */
public class TerminalService
{
    private int id;                      //���
    private int terminalId;              //�ն�Id
    private int serviceMenuId;           //�˵�Id
    private int templateId;              //�˵�ģ��Id

	public int getId() {
		return id;
	}
	public void setId(int id) {
		this.id = id;
	}
	public int getTerminalId() {
		return terminalId;
	}
	public void setTerminalId(int terminalId) {
		this.terminalId = terminalId;
	}
	public int getServiceMenuId() {
		return serviceMenuId;
	}
	public void setServiceMenuId(int serviceMenuId) {
		this.serviceMenuId = serviceMenuId;
	}
	public int getTemplateId() {
		return templateId;
	}
	public void setTemplateId(int templateId) {
		this.templateId = templateId;
	}
}
