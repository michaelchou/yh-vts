package com.yihuacomputer.cols.entity;

/**
 * ģ������
 * �����������Թɷ����޹�˾
 * 2016-10-25
 */
public class Module
{
    private int id;               //���
    private String strModuleName; //ģ������
    private String strModuleClsid;//ģ���Ӧ��Clsidֵ
    private String strModuleDesc; //ģ������

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
