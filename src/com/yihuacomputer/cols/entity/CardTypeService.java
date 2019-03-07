package com.yihuacomputer.cols.entity;

/**
 * 卡类型服务表对象
 * 深圳怡化电脑股份有限公司
 * 2017-04-18
 */
public class CardTypeService
{
    private int id;               //序号
    private String strCardType;   //卡类型 1：本行借记卡 3：本行信用卡 4：他行卡
    private String strCardFlag;   //卡bin
    private int serviceMenuId;    //菜单Id

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
