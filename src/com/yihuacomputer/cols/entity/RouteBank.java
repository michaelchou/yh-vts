package com.yihuacomputer.cols.entity;

/**
 * 转账汇路行表对象
 * 深圳怡化电脑股份有限公司
 * 2017-05-25
 */
public class RouteBank
{
    private int id;                   //序号
    private String strRouteCode;      //汇路代码
    private String strBankCode;       //汇路行号
    private String strBankName;       //汇路行名
    private String strBankType;       //汇路行号类别
    private String strBankTypeCode;   //汇路行别代码
    private String strSettleBankCode; //清算行号
    private String strCCPCCode;       //CCPC所在节点代码
    private String strSizeMark;       //参与大小额标识

	public int getId() {
		return id;
	}
	public void setId(int id) {
		this.id = id;
	}
	public String getStrRouteCode() {
		return strRouteCode;
	}
	public void setStrRouteCode(String strRouteCode) {
		this.strRouteCode = strRouteCode;
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
	public String getStrBankType() {
		return strBankType;
	}
	public void setStrBankType(String strBankType) {
		this.strBankType = strBankType;
	}
	public String getStrBankTypeCode() {
		return strBankTypeCode;
	}
	public void setStrBankTypeCode(String strBankTypeCode) {
		this.strBankTypeCode = strBankTypeCode;
	}
	public String getStrSettleBankCode() {
		return strSettleBankCode;
	}
	public void setStrSettleBankCode(String strSettleBankCode) {
		this.strSettleBankCode = strSettleBankCode;
	}
	public String getStrCCPCCode() {
		return strCCPCCode;
	}
	public void setStrCCPCCode(String strCCPCCode) {
		this.strCCPCCode = strCCPCCode;
	}
	public String getStrSizeMark() {
		return strSizeMark;
	}
	public void setStrSizeMark(String strSizeMark) {
		this.strSizeMark = strSizeMark;
	}
}
