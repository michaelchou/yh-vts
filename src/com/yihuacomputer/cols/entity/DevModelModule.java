package com.yihuacomputer.cols.entity;

/**
 * �ͺ�ģ����������
 * �����������Թɷ����޹�˾
 * 2017-06-09
 */
public class DevModelModule
{
    private int id;                   //���
    private int devModelId;          //�豸�ͺ�Id��
    private int moduleId;            //�豸ģ��Id��

    public int getId() {
		return id;
    }
	public void setId(int id) {
		this.id = id;
	}
	public int getDevModelId() {
		return devModelId;
	}
	public void setDevModelId(int devModelId) {
		this.devModelId = devModelId;
	}
	public int getModuleId() {
		return moduleId;
	}
	public void setModuleId(int moduleId) {
		this.moduleId = moduleId;
	}
}
