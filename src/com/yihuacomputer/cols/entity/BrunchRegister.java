package com.yihuacomputer.cols.entity;
/**
 * ת�˵Ǽǲ������
 * �����������Թɷ����޹�˾
 * 2017-06-06
 */
public class BrunchRegister {

	private int id;                   //���
    private String strBankCode;       //֧���к�
    private String strBankName;       //֧������
    private String strPanIn;          //�Է�����
    private String strNameIn;        //�Է�����
    private String strPanOut;         //����
    private String strPanInType;      //�Է��������� ����/����
    private String strRouteCode;      //��·����

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
