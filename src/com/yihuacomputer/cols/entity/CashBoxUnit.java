package com.yihuacomputer.cols.entity;

/**
 * �ն˳����
 * @author Administrator
 *
 */
public class CashBoxUnit {

	private int  id;                         //ΨһID

	private String box_no;        //��/����������

	private String box_type;          //��/��������

	private String denom;               //���

	private String cash_count ;                //��ǰ����/������
	
	private String cash_count0 ;                //��ʼ������/������
	
	private String status;              //��/����״̬

	public int getId() {
		return id;
	}

	public void setId(int id) {
		this.id = id;
	}

	public String getBox_no() {
		return box_no;
	}

	public void setBox_no(String box_no) {
		this.box_no = box_no;
	}

	public String getBox_type() {
		return box_type;
	}

	public void setBox_type(String box_type) {
		this.box_type = box_type;
	}

	public String getDenom() {
		return denom;
	}

	public void setDenom(String denom) {
		this.denom = denom;
	}

	public String getCash_count() {
		return cash_count;
	}

	public void setCash_count(String cash_count) {
		this.cash_count = cash_count;
	}

	public String getStatus() {
		return status;
	}

	public void setStatus(String status) {
		this.status = status;
	}

	public String getCash_count0() {
		return cash_count0;
	}

	public void setCash_count0(String cash_count0) {
		this.cash_count0 = cash_count0;
	}
	
}
