package com.yihuacomputer.cols.entity;

/**
 * ����˵������
 * �����������Թɷ����޹�˾
 * 2016-11-23
 */
public class ServiceMenu
{
    private int id;                      //���
    private int serviceMenuId;           //�˵�Id
    private String strServiceMenuName;   //����˵�����
    private String strServiceMenuNameEn; //����˵�����Ӣ��
    private int btnPos;                  //�˵���ʾλ��
    private int serviceMenuType;         //�˵�����
    private String strServiceMenuAction; //�˵�����
    private String strOrgNum;            //������
    private String strCardType;          //�˵���Ӧ�Ŀ�����  1����ǿ�  3�����ÿ�

	public int getId() {
		return id;
	}
	public void setId(int id) {
		this.id = id;
	}
	public int getServiceMenuId() {
		return serviceMenuId;
	}
	public void setServiceMenuId(int serviceMenuId) {
		this.serviceMenuId = serviceMenuId;
	}
	public String getStrServiceMenuName() {
		return strServiceMenuName;
	}
	public void setStrServiceMenuName(String strServiceMenuName) {
		this.strServiceMenuName = strServiceMenuName;
	}
	public int getBtnPos() {
		return btnPos;
	}
	public void setBtnPos(int btnPos) {
		this.btnPos = btnPos;
	}
	public int getServiceMenuType() {
		return serviceMenuType;
	}
	public void setServiceMenuType(int serviceMenuType) {
		this.serviceMenuType = serviceMenuType;
	}
	public String getStrServiceMenuAction() {
		return strServiceMenuAction;
	}
	public void setStrServiceMenuAction(String strServiceMenuAction) {
		this.strServiceMenuAction = strServiceMenuAction;
	}
	public String getStrOrgNum() {
		return strOrgNum;
	}
	public void setStrOrgNum(String strOrgNum) {
		this.strOrgNum = strOrgNum;
	}
	public String getStrServiceMenuNameEn() {
		return strServiceMenuNameEn;
	}
	public void setStrServiceMenuNameEn(String strServiceMenuNameEn) {
		this.strServiceMenuNameEn = strServiceMenuNameEn;
	}
	public String getStrCardType() {
		return strCardType;
	}
	public void setStrCardType(String strCardType) {
		this.strCardType = strCardType;
	}
}
