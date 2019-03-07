package com.yihuacomputer.cols.entity;

/**
 * 终端支持的模块表对象
 * 深圳怡化电脑股份有限公司
 * 2016-10-25
 */
public class TerminalModule
{
    private int id;               //序号
    private int terminalId;       //终端id
    private int moduleId;         //模块id
    private int moduleFlag; //模块是否启用状态  “1”为启用;  “-1”为不启用

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
	public int getModuleId() {
		return moduleId;
	}
	public void setModuleId(int moduleId) {
		this.moduleId = moduleId;
	}
	public int getModuleFlag() {
		return moduleFlag;
	}
	public void setModuleFlag(int moduleFlag) {
		this.moduleFlag = moduleFlag;
	}
}
