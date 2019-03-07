package com.yihuacomputer.cols.entity;

/**
 * 银行表对象
 * 深圳怡化电脑股份有限公司
 * 2017-05-25
 */
public class Bank
{
    private int id;                   //序号
    private String strBankCode;       //银行编码
    private String strBankName;       //银行名称

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
}
