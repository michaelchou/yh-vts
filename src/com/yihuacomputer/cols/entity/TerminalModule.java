package com.yihuacomputer.cols.entity;

/**
 * �ն�֧�ֵ�ģ������
 * �����������Թɷ����޹�˾
 * 2016-10-25
 */
public class TerminalModule
{
    private int id;               //���
    private int terminalId;       //�ն�id
    private int moduleId;         //ģ��id
    private int moduleFlag; //ģ���Ƿ�����״̬  ��1��Ϊ����;  ��-1��Ϊ������

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
