package com.yihuacomputer.cols.entity;

/**
 * �����ͷ�������
 * �����������Թɷ����޹�˾
 * 2017-04-18
 */
public class CardTypeService
{
    private int id;               //���
    private String strCardType;   //������ 1�����н�ǿ� 3���������ÿ� 4�����п�
    private String strCardFlag;   //��bin
    private int serviceMenuId;    //�˵�Id

	public int getId() {
		return id;
	}
	public void setId(int id) {
		this.id = id;
	}
	public String getStrCardType() {
		return strCardType;
	}
	public void setStrCardType(String strCardType) {
		this.strCardType = strCardType;
	}
	public String getStrCardFlag() {
		return strCardFlag;
	}
	public void setStrCardFlag(String strCardFlag) {
		this.strCardFlag = strCardFlag;
	}
	public int getServiceMenuId() {
		return serviceMenuId;
	}
	public void setServiceMenuId(int serviceMenuId) {
		this.serviceMenuId = serviceMenuId;
	}
}
