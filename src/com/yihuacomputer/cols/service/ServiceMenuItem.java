package com.yihuacomputer.cols.service;

/**
 * 服务菜单项类
 */
public class ServiceMenuItem
{
    public int id;
    public String strServiceMenuId = "";
    public String strServiceMenuName = "";
    public String strServiceMenuNameEn = "";
    public int btnPos = 0;
    public int serviceMenuType;
    public String strServiceMenuAction;
    public boolean bShow = false;

	public int getId() {
		return id;
	}
	public void setId(int id) {
		this.id = id;
	}
	public String getStrServiceMenuId() {
		return strServiceMenuId;
	}
	public void setStrServiceMenuId(String strServiceMenuId) {
		this.strServiceMenuId = strServiceMenuId;
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
	public boolean isbShow() {
		return bShow;
	}
	public void setbShow(boolean bShow) {
		this.bShow = bShow;
	}
	public String getStrServiceMenuNameEn() {
		return strServiceMenuNameEn;
	}
	public void setStrServiceMenuNameEn(String strServiceMenuNameEn) {
		this.strServiceMenuNameEn = strServiceMenuNameEn;
	}
}
