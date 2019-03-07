package com.yihuacomputer.cols.entity;

import java.math.BigDecimal;
import java.sql.Timestamp;

/**
 * �浥��������
 * �����������Թɷ����޹�˾
 * 2017-01-20
 */
public class CDSTransLog
{
    private int id;                     //���
    private String strTerminalNum;      //�ն˱��
    private String transCode;           //���ױ���
    private String strOCRNum;           //�浥OCR��
    private String strAccountNum;       //�浥�˺�
    private String strIDCardNum;        //���������֤��
    private BigDecimal amt;             //���׽��
    private Timestamp dtOccur;          //�ն˽���ʱ��
    private BigDecimal fee;             //������
    private String strAuthIDCardNum;    //ί�������֤��
    private String strHostRetCode;      //����������
    private int hostTxStatus;           //��������״̬
    private int termTxStatus;           //�ն˽���״̬
    private String strHostSerialNo;     //����������ˮ
    private String strAccMode;          //��ȡ��ʽ
    private String strCDSType;          //�浥����  1:����  2������  3������  4������
    private Timestamp dtHostOccur;      //��������ʱ��
    private int termBatchNo;            //���κ�
    private String strTermSerialNo;     //�ն˽���״̬
    private String strOrigstrTxSerialNo;//ԭ������ˮ��
    private String strSingleBusinessNum;//����ҵ����ˮ�ţ����ﱣ���ն˱��+���8λ������µ�16λ����ˮ�ţ����ڱ��������׵�������
    private String strRate;             //����
    private String strInterest;         //��Ϣ
    private String strTimeLimit;        //����
    private String strExInfo1;          //Ԥ���ֶ�1
    private String strExInfo2;          //Ԥ���ֶ�2
    private String strExInfo3;          //Ԥ���ֶ�3
    private String strExInfo4;          //Ԥ���ֶ�4
    private String strExInfo5;          //Ԥ���ֶ�5
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
	public BigDecimal getAmt() {
		return amt;
	}
	public void setAmt(BigDecimal amt) {
		this.amt = amt;
	}
	public Timestamp getDtOccur() {
		return dtOccur;
	}
	public void setDtOccur(Timestamp dtOccur) {
		this.dtOccur = dtOccur;
	}
	public BigDecimal getFee() {
		return fee;
	}
	public void setFee(BigDecimal fee) {
		this.fee = fee;
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
	public int getTermTxStatus() {
		return termTxStatus;
	}
	public void setTermTxStatus(int termTxStatus) {
		this.termTxStatus = termTxStatus;
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
	public String getStrOCRNum() {
		return strOCRNum;
	}
	public void setStrOCRNum(String strOCRNum) {
		this.strOCRNum = strOCRNum;
	}
	public String getStrAccountNum() {
		return strAccountNum;
	}
	public void setStrAccountNum(String strAccountNum) {
		this.strAccountNum = strAccountNum;
	}
	public String getStrIDCardNum() {
		return strIDCardNum;
	}
	public void setStrIDCardNum(String strIDCardNum) {
		this.strIDCardNum = strIDCardNum;
	}
	public String getStrAuthIDCardNum() {
		return strAuthIDCardNum;
	}
	public void setStrAuthIDCardNum(String strAuthIDCardNum) {
		this.strAuthIDCardNum = strAuthIDCardNum;
	}
	public String getStrCDSType() {
		return strCDSType;
	}
	public void setStrCDSType(String strCDSType) {
		this.strCDSType = strCDSType;
	}
	public String getStrSingleBusinessNum() {
		return strSingleBusinessNum;
	}
	public void setStrSingleBusinessNum(String strSingleBusinessNum) {
		this.strSingleBusinessNum = strSingleBusinessNum;
	}
	public String getStrHostRetCode() {
		return strHostRetCode;
	}
	public void setStrHostRetCode(String strHostRetCode) {
		this.strHostRetCode = strHostRetCode;
	}
	public String getStrRate() {
		return strRate;
	}
	public void setStrRate(String strRate) {
		this.strRate = strRate;
	}
	public String getStrInterest() {
		return strInterest;
	}
	public void setStrInterest(String strInterest) {
		this.strInterest = strInterest;
	}
	public String getStrAccMode() {
		return strAccMode;
	}
	public void setStrAccMode(String strAccMode) {
		this.strAccMode = strAccMode;
	}
	public String getStrExInfo3() {
		return strExInfo3;
	}
	public void setStrExInfo3(String strExInfo3) {
		this.strExInfo3 = strExInfo3;
	}
	public String getStrExInfo4() {
		return strExInfo4;
	}
	public void setStrExInfo4(String strExInfo4) {
		this.strExInfo4 = strExInfo4;
	}
	public String getStrExInfo5() {
		return strExInfo5;
	}
	public void setStrExInfo5(String strExInfo5) {
		this.strExInfo5 = strExInfo5;
	}
	public String getStrTimeLimit() {
		return strTimeLimit;
	}
	public void setStrTimeLimit(String strTimeLimit) {
		this.strTimeLimit = strTimeLimit;
	}
	public int getSettleCycleStatus() {
		return settleCycleStatus;
	}
	public void setSettleCycleStatus(int settleCycleStatus) {
		this.settleCycleStatus = settleCycleStatus;
	}
}
