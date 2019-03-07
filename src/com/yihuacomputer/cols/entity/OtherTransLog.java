package com.yihuacomputer.cols.entity;

import java.math.BigDecimal;
import java.sql.Timestamp;

/**
 * ����������ˮ�����(���浥����������UKEY)
 * �����������Թɷ����޹�˾
 * 2017-05-05
 */
public class OtherTransLog
{
    private int id;                     //���
    private String strTerminalNum;      //�ն˱��
    private String transCode;           //���ױ���
    private String strPan;              //ת������
    private String strDestPan;          //ת�뿨��
    private BigDecimal amt;             //���׽��
    private String strIDCardNum;        //���֤��
    private Timestamp dtOccur;          //�ն˽���ʱ��
    private BigDecimal fee;             //������
    private String currency;            //����
    private int hostTxStatus;           //��������״̬
    private String strHostSerialNo;     //����������ˮ
    private String strHostRetCode;      //����������
    private String strCardType;         //������
    private Timestamp dtHostOccur;      //��������ʱ��
    private int termBatchNo;            //���κ�
    private int reverseStatus;          //����״̬  0:δ����; 1:�ɹ�;2:ʧ��;3:�����ȷ��
    private String strTermSerialNo;     //�ն˽���״̬
    private String strOrigstrTxSerialNo;//ԭ������ˮ��
    private int checkFlag;              //�Ƿ���˱�ʶ
    private String strSingleBusinessNum;//����ҵ����ˮ�ţ����ﱣ���ն˱��+���8λ������µ�16λ����ˮ�ţ����ڱ��������׵�������
    private String strExInfo1;          //Ԥ���ֶ�1
    private String strExInfo2;          //Ԥ���ֶ�2

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
	public String getStrCardType() {
		return strCardType;
	}
	public void setStrCardType(String strCardType) {
		this.strCardType = strCardType;
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
	public String getStrPan() {
		return strPan;
	}
	public void setStrPan(String strPan) {
		this.strPan = strPan;
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
	public String getStrDestPan() {
		return strDestPan;
	}
	public void setStrDestPan(String strDestPan) {
		this.strDestPan = strDestPan;
	}
	public BigDecimal getAmt() {
		return amt;
	}
	public void setAmt(BigDecimal amt) {
		this.amt = amt;
	}
	public BigDecimal getFee() {
		return fee;
	}
	public void setFee(BigDecimal fee) {
		this.fee = fee;
	}
	public String getCurrency() {
		return currency;
	}
	public void setCurrency(String currency) {
		this.currency = currency;
	}
	public int getCheckFlag() {
		return checkFlag;
	}
	public void setCheckFlag(int checkFlag) {
		this.checkFlag = checkFlag;
	}
	public int getReverseStatus() {
		return reverseStatus;
	}
	public void setReverseStatus(int reverseStatus) {
		this.reverseStatus = reverseStatus;
	}
	public String getStrSingleBusinessNum() {
		return strSingleBusinessNum;
	}
	public void setStrSingleBusinessNum(String strSingleBusinessNum) {
		this.strSingleBusinessNum = strSingleBusinessNum;
	}

}
