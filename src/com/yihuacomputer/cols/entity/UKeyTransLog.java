package com.yihuacomputer.cols.entity;

import java.sql.Timestamp;

/**
 * UKey�����
 * �����������Թɷ����޹�˾
 * 2017-05-10
 */
public class UKeyTransLog
{
    private int id;                     //���
    private String strTerminalNum;      //�ն˱��
    private String transCode;           //���ױ���
    private String strUKeyNum;          //Ukey����
    private String strIDCardNum;        //���֤��
    private String strBindCardNum;      //UKey�󶨵Ŀ���
    private Timestamp dtOccur;          //�ն˽���ʱ��
    private int hostTxStatus;           //��������״̬
    private int termTxStatus;           //�ն˽���״̬
    private String strHostSerialNo;     //����������ˮ
    private String strHostRetCode;      //����������
    private String strUKeyType;         //UKey����
    private Timestamp dtHostOccur;      //��������ʱ��
    private int termBatchNo;            //���κ�
    private String strTermSerialNo;     //�ն˽���״̬
    private String strOrigstrTxSerialNo;//ԭ������ˮ��
    private String strSingleBusinessNum;//����ҵ����ˮ�ţ����ﱣ���ն˱��+���8λ������µ�16λ����ˮ�ţ����ڱ��������׵�������
    private String strExInfo1;          //Ԥ���ֶ�1
    private String strExInfo2;          //Ԥ���ֶ�2
    private int settleCycleStatus;      //���״̬   0��δ��� 1�������

	public int getId() {
		return id;
	}
	public void setId(int id) {
		this.id = id;
	}
	public String getStrTerminalNum() {
		return strTerminalNum;
	}
	public void setStrTerminalNum(String strTerminalNum) {
		this.strTerminalNum = strTerminalNum;
	}
	public String getTransCode() {
		return transCode;
	}
	public void setTransCode(String transCode) {
		this.transCode = transCode;
	}
	public Timestamp getDtOccur() {
		return dtOccur;
	}
	public void setDtOccur(Timestamp dtOccur) {
		this.dtOccur = dtOccur;
	}
	public int getHostTxStatus() {
		return hostTxStatus;
	}
	public void setHostTxStatus(int hostTxStatus) {
		this.hostTxStatus = hostTxStatus;
	}
	public String getStrHostSerialNo() {
		return strHostSerialNo;
	}
	public void setStrHostSerialNo(String strHostSerialNo) {
		this.strHostSerialNo = strHostSerialNo;
	}
	public Timestamp getDtHostOccur() {
		return dtHostOccur;
	}
	public void setDtHostOccur(Timestamp dtHostOccur) {
		this.dtHostOccur = dtHostOccur;
	}
	public int getTermBatchNo() {
		return termBatchNo;
	}
	public void setTermBatchNo(int termBatchNo) {
		this.termBatchNo = termBatchNo;
	}
	public String getStrTermSerialNo() {
		return strTermSerialNo;
	}
	public void setStrTermSerialNo(String strTermSerialNo) {
		this.strTermSerialNo = strTermSerialNo;
	}
	public String getStrOrigstrTxSerialNo() {
		return strOrigstrTxSerialNo;
	}
	public void setStrOrigstrTxSerialNo(String strOrigstrTxSerialNo) {
		this.strOrigstrTxSerialNo = strOrigstrTxSerialNo;
	}
	public String getStrExInfo1() {
		return strExInfo1;
	}
	public void setStrExInfo1(String strExInfo1) {
		this.strExInfo1 = strExInfo1;
	}
	public String getStrExInfo2() {
		return strExInfo2;
	}
	public void setStrExInfo2(String strExInfo2) {
		this.strExInfo2 = strExInfo2;
	}
	public String getStrIDCardNum() {
		return strIDCardNum;
	}
	public void setStrIDCardNum(String strIDCardNum) {
		this.strIDCardNum = strIDCardNum;
	}
	public String getStrHostRetCode() {
		return strHostRetCode;
	}
	public void setStrHostRetCode(String strHostRetCode) {
		this.strHostRetCode = strHostRetCode;
	}
	public int getTermTxStatus() {
		return termTxStatus;
	}
	public void setTermTxStatus(int termTxStatus) {
		this.termTxStatus = termTxStatus;
	}
	public String getStrUKeyNum() {
		return strUKeyNum;
	}
	public void setStrUKeyNum(String strUKeyNum) {
		this.strUKeyNum = strUKeyNum;
	}
	public String getStrBindCardNum() {
		return strBindCardNum;
	}
	public void setStrBindCardNum(String strBindCardNum) {
		this.strBindCardNum = strBindCardNum;
	}
	public String getStrUKeyType() {
		return strUKeyType;
	}
	public void setStrUKeyType(String strUKeyType) {
		this.strUKeyType = strUKeyType;
	}
	public String getStrSingleBusinessNum() {
		return strSingleBusinessNum;
	}
	public void setStrSingleBusinessNum(String strSingleBusinessNum) {
		this.strSingleBusinessNum = strSingleBusinessNum;
	}
	public int getSettleCycleStatus() {
		return settleCycleStatus;
	}
	public void setSettleCycleStatus(int settleCycleStatus) {
		this.settleCycleStatus = settleCycleStatus;
	}
}
