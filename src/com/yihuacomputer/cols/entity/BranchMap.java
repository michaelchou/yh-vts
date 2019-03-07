package com.yihuacomputer.cols.entity;

/**
 * 本行转账汇路表对象
 * 深圳怡化电脑股份有限公司
 * 2017-07-13
 */
public class BranchMap
{
    private int id;                         //序号
    private String strLocalRouteCode;       //本行汇路编码
    private String strLocalBankCode;        //本行结算编码

    public int getId() {
		return id;
    }
	public void setId(int id) {
		this.id = id;
	}

	public String getStrLocalRouteCode() {
		return strLocalRouteCode;
	}
	public void setStrLocalRouteCode(String strLocalRouteCode) {
		this.strLocalRouteCode = strLocalRouteCode;
	}
	public String getStrLocalBankCode() {
		return strLocalBankCode;
	}
	public void setStrLocalBankCode(String strLocalBankCode) {
		this.strLocalBankCode = strLocalBankCode;
	}
}
