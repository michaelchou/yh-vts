package com.yihuacomputer.cols.entity;

/**
 * �豸�ͺű����
 * �����������Թɷ����޹�˾
 * 2017-06-08
 */
public class DevModel
{
    private int id;                   //���
    private int devManuId;            //Ʒ��Id��
    private String strDevModelName;   //�豸�ͺ�

    public int getId() {
		return id;
    }
	public void setId(int id) {
		this.id = id;
	}
	public int getDevManuId() {
		return devManuId;
	}
	public void setDevManuId(int devManuId) {
		this.devManuId = devManuId;
	}
	public String getStrDevModelName() {
		return strDevModelName;
	}
	public void setStrDevModelName(String strDevModelName) {
		this.strDevModelName = strDevModelName;
	}
}
