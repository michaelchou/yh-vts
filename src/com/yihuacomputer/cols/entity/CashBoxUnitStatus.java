package com.yihuacomputer.cols.entity;

/**
 * �ն˳�����Ϣ��
 * @author Administrator
 *
 */
public class CashBoxUnitStatus {

	private int  id;                         //ΨһID

	private int boxNum;        //��/����������

	private int boxType;          //��/��������

	private int initCount;               //��ʼ����/������

	private int currentCount ;                //��ǰ����/������

	private int boxStatus;              //��/����״̬
	
	private String strTerminalNum;   //�ն˺�

	private int denom;					//ȯ��
	
	public int getDenom() {
		return denom;
	}

	public void setDenom(int denom) {
		this.denom = denom;
	}

	public String getStrTerminalNum() {
		return strTerminalNum;
	}

	public void setStrTerminalNum(String strTerminalNum) {
		this.strTerminalNum = strTerminalNum;
	}

	public int getId() {
		return id;
	}

	public void setId(int id) {
		this.id = id;
	}

	public int getBoxNum() {
		return boxNum;
	}

	public void setBoxNum(int boxNum) {
		this.boxNum = boxNum;
	}

	public int getBoxType() {
		return boxType;
	}

	public void setBoxType(int boxType) {
		this.boxType = boxType;
	}

	public int getInitCount() {
		return initCount;
	}

	public void setInitCount(int initCount) {
		this.initCount = initCount;
	}

	public int getCurrentCount() {
		return currentCount;
	}

	public void setCurrentCount(int currentCount) {
		this.currentCount = currentCount;
	}

	public int getBoxStatus() {
		return boxStatus;
	}

	public void setBoxStatus(int boxStatus) {
		this.boxStatus = boxStatus;
	}
}
