package com.yihuacomputer.cols.entity;

/**
 * 服务菜单表对象
 * 深圳怡化电脑股份有限公司
 * 2016-11-23
 */
public class ServiceMenu
{
    private int id;                      //序号
    private int serviceMenuId;           //菜单Id
    private String strServiceMenuName;   //服务菜单名称
    private String strServiceMenuNameEn; //服务菜单名称英文
    private int btnPos;                  //菜单显示位置
    private int serviceMenuType;         //菜单类型
    private String strServiceMenuAction; //菜单链接
    private String strOrgNum;            //机构号
    private String strCardType;          //菜单对应的卡类型  1：借记卡  3：信用卡

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
