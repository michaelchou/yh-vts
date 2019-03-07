package com.yihuacomputer.cols.entity;

/**
 * 终端对应的服务对象
 * 深圳怡化电脑股份有限公司
 * 2016-11-23
 */
public class TerminalService
{
    private int id;                      //序号
    private int terminalId;              //终端Id
    private int serviceMenuId;           //菜单Id
    private int templateId;              //菜单模板Id

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
