package com.yihuacomputer.cols.entity;

/**
 * ����������
 * �����������Թɷ����޹�˾
 * 2017-01-12
 */
public class Org
{
    private int id;                  //���
    private String strParentOrgCode; //�ϼ��������
    private String strOrgNum;        //�������
    private String strOrgName;       //��������

    public int getId() {
		return id;
    }
	public void setId(int id) {
		this.id = id;
	}
	public String getStrOrgNum() {
		return strOrgNum;
	}
	public void setStrOrgNum(String strOrgNum) {
		this.strOrgNum = strOrgNum;
	}
	public String getStrOrgName() {
		return strOrgName;
	}
	public void setStrOrgName(String strOrgName) {
		this.strOrgName = strOrgName;
	}
	public String getStrParentOrgCode() {
		return strParentOrgCode;
	}
	public void setStrParentOrgCode(String strParentOrgCode) {
		this.strParentOrgCode = strParentOrgCode;
	}
}
