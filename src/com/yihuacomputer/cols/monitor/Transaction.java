package com.yihuacomputer.cols.monitor;

import java.util.Date;

public class Transaction {

	private String termId;                   //�ն˱��
	private String transId;                  //���ױ���
	private String debitAccount;             //ת���˺�
	private String creditAccount;            //ת���˺�
	private String transCode;                //��������
	private double amt;                      //���׽��
	private String currency;                 //����
	private long dateTime;                   //����ʱ��
	private String hostRet;                  //��������״̬
	private String localRet ;                //�ն˽���״̬
	private double tipFee;                   //������
	private int transDate;                   //��������
	private String cardType;                 //������
	private long costTime;                   //���׺�ʱ
	private int iHostTxStatus;               //��������״̬
	private String strHostSerialNo;          //����������ˮ��
	private String iTermBatchNo;             //�������κ�
	private String iTermTxStatus;            //�ն˽���״̬
	private String strOrigstrTxSerialNo;     //ԭ������ˮ��
	private Date dtHostOccur;                //��������ʱ��

	public String getTermId() {
		return termId;
	}
	public void setTermId(String termId) {
		this.termId = termId;
	}
	public String getTransId() {
		return transId;
	}
	public void setTransId(String transId) {
		this.transId = transId;
	}
	public String getDebitAccount() {
		return debitAccount;
	}
	public void setDebitAccount(String debitAccount) {
		this.debitAccount = debitAccount;
	}
	public String getCreditAccount() {
		return creditAccount;
	}
	public void setCreditAccount(String creditAccount) {
		this.creditAccount = creditAccount;
	}
	public String getTransCode() {
		return transCode;
	}
	public void setTransCode(String transCode) {
		this.transCode = transCode;
	}
	public double getAmt() {
		return amt;
	}
	public void setAmt(double amt) {
		this.amt = amt;
	}
	public String getCurrency() {
		return currency;
	}
	public void setCurrency(String currency) {
		this.currency = currency;
	}
	public long getDateTime() {
		return dateTime;
	}
	public void setDateTime(long dateTime) {
		this.dateTime = dateTime;
	}
	public String getHostRet() {
		return hostRet;
	}
	public void setHostRet(String hostRet) {
		this.hostRet = hostRet;
	}
	public String getLocalRet() {
		return localRet;
	}
	public void setLocalRet(String localRet) {
		this.localRet = localRet;
	}
	public double getTipFee() {
		return tipFee;
	}
	public void setTipFee(double tipFee) {
		this.tipFee = tipFee;
	}
	public int getTransDate() {
		return transDate;
	}
	public void setTransDate(int transDate) {
		this.transDate = transDate;
	}
	public String getCardType() {
		return cardType;
	}
	public void setCardType(String cardType) {
		this.cardType = cardType;
	}
	public long getCostTime() {
		return costTime;
	}
	public void setCostTime(long costTime) {
		this.costTime = costTime;
	}
	public int getiHostTxStatus() {
		return iHostTxStatus;
	}
	public void setiHostTxStatus(int iHostTxStatus) {
		this.iHostTxStatus = iHostTxStatus;
	}
	public String getStrHostSerialNo() {
		return strHostSerialNo;
	}
	public void setStrHostSerialNo(String strHostSerialNo) {
		this.strHostSerialNo = strHostSerialNo;
	}
	public String getiTermBatchNo() {
		return iTermBatchNo;
	}
	public void setiTermBatchNo(String iTermBatchNo) {
		this.iTermBatchNo = iTermBatchNo;
	}
	public String getiTermTxStatus() {
		return iTermTxStatus;
	}
	public void setiTermTxStatus(String iTermTxStatus) {
		this.iTermTxStatus = iTermTxStatus;
	}
	public String getStrOrigstrTxSerialNo() {
		return strOrigstrTxSerialNo;
	}
	public void setStrOrigstrTxSerialNo(String strOrigstrTxSerialNo) {
		this.strOrigstrTxSerialNo = strOrigstrTxSerialNo;
	}
	public Date getDtHostOccur() {
		return dtHostOccur;
	}
	public void setDtHostOccur(Date dtHostOccur) {
		this.dtHostOccur = dtHostOccur;
	}
}
