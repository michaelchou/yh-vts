package com.yihuacomputer.cols.entity;

import java.math.BigDecimal;
import java.sql.Timestamp;

/**
 * �����ˮ��
 * @author Administrator
 *
 */
public class TransLogDeposit {

	private int id;                   //ΨһID

    private String strTerminalNum;    //�ն˱��

    private String transCode;           //���ױ���
    
	private Timestamp dtOccur;        //����ʱ��

	private String strPan;            //�����˺�  ����

	private BigDecimal damount;       //���׽��

	private BigDecimal dfee;          //������

	private int ihostTransStatus;  //��������״̬

	private String strHostRetCode;    //����������

	private String strHostTsn;        //������ˮ��

	private int itermTransStatus;  //�ն˽���״̬

	private String strTermSerialNo;   //�ն���ˮ��

	private int isettleCycle;      //��ǰ����

	private int isettleCycleStatus; //�Ƿ����
	
	private String strSingleBusinessNum;//����ҵ����ˮ�ţ����ﱣ���ն˱��+���8λ������µ�16λ����ˮ�ţ����ڱ��������׵�������

	private String strExInfo1;        //Ԥ��1

	private String strExInfo2;        //Ԥ��2

	private String strExInfo3;        //Ԥ��3

	private String strExInfo4;        //Ԥ��4

	private String strExInfo5;        //Ԥ��5

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

	public Timestamp getDtOccur() {
		return dtOccur;
	}

	public void setDtOccur(Timestamp dtOccur) {
		this.dtOccur = dtOccur;
	}

	public String getStrPan() {
		return strPan;
	}

	public void setStrPan(String strPan) {
		this.strPan = strPan;
	}

	public BigDecimal getDamount() {
		return damount;
	}

	public void setDamount(BigDecimal damount) {
		this.damount = damount;
	}

	public BigDecimal getDfee() {
		return dfee;
	}

	public void setDfee(BigDecimal dfee) {
		this.dfee = dfee;
	}

	public int getIhostTransStatus() {
		return ihostTransStatus;
	}

	public void setIhostTransStatus(int ihostTransStatus) {
		this.ihostTransStatus = ihostTransStatus;
	}

	public String getStrHostRetCode() {
		return strHostRetCode;
	}

	public void setStrHostRetCode(String strHostRetCode) {
		this.strHostRetCode = strHostRetCode;
	}

	public String getStrHostTsn() {
		return strHostTsn;
	}

	public void setStrHostTsn(String strHostTsn) {
		this.strHostTsn = strHostTsn;
	}

	public int getItermTransStatus() {
		return itermTransStatus;
	}

	public void setItermTransStatus(int itermTransStatus) {
		this.itermTransStatus = itermTransStatus;
	}

	public String getStrTermSerialNo() {
		return strTermSerialNo;
	}

	public void setStrTermSerialNo(String strTermSerialNo) {
		this.strTermSerialNo = strTermSerialNo;
	}

	public int getIsettleCycle() {
		return isettleCycle;
	}

	public void setIsettleCycle(int isettleCycle) {
		this.isettleCycle = isettleCycle;
	}

	public int getIsettleCycleStatus() {
		return isettleCycleStatus;
	}

	public void setIsettleCycleStatus(int isettleCycleStatus) {
		this.isettleCycleStatus = isettleCycleStatus;
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
	public String getTransCode() {
		return transCode;
	}
	public void setTransCode(String transCode) {
		this.transCode = transCode;
	}
	public String getStrSingleBusinessNum() {
		return strSingleBusinessNum;
	}
	public void setStrSingleBusinessNum(String strSingleBusinessNum) {
		this.strSingleBusinessNum = strSingleBusinessNum;
	}
}
