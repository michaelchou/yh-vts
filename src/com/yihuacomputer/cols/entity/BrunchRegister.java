package com.yihuacomputer.cols.entity;
/**
 * 转账登记簿表对象
 * 深圳怡化电脑股份有限公司
 * 2017-06-06
 */
public class BrunchRegister {

	private int id;                   //序号
    private String strBankCode;       //支行行号
    private String strBankName;       //支行行名
    private String strPanIn;          //对方卡号
    private String strNameIn;        //对方姓名
    private String strPanOut;         //卡号
    private String strPanInType;      //对方卡号类型 本行/跨行
    private String strRouteCode;      //汇路代码

	public int getId() {
		return id;
	}
	public void setId(int id) {
		this.id = id;
	}
	public String getStrBankCode() {
		return strBankCode;
	}
	public void setStrBankCode(String strBankCode) {
		this.strBankCode = strBankCode;
	}
	public String getStrBankName() {
		return strBankName;
	}
	public void setStrBankName(String strBankName) {
		this.strBankName = strBankName;
	}
	public String getStrPanIn() {
		return strPanIn;
	}
	public void setStrPanIn(String strPanIn) {
		this.strPanIn = strPanIn;
	}

	public String getStrPanOut() {
		return strPanOut;
	}
	public void setStrPanOut(String strPanOut) {
		this.strPanOut = strPanOut;
	}
	public String getStrNameIn() {
		return strNameIn;
	}
	public void setStrNameIn(String strNameIn) {
		this.strNameIn = strNameIn;
	}
	public String getStrPanInType() {
		return strPanInType;
	}
	public void setStrPanInType(String strPanInType) {
		this.strPanInType = strPanInType;
	}
	public String getStrRouteCode() {
		return strRouteCode;
	}
	public void setStrRouteCode(String strRouteCode) {
		this.strRouteCode = strRouteCode;
	}
}
