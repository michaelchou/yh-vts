package com.yihuacomputer.cols.entity;

/**
 * 终端钞箱表
 * @author Administrator
 *
 */
public class CashBoxUnit {

	private int  id;                         //唯一ID

	private String box_no;        //钞/币箱索引号

	private String box_type;          //钞/币箱类型

	private String denom;               //面额

	private String cash_count ;                //当前（张/个）数
	
	private String cash_count0 ;                //初始化（张/个）数
	
	private String status;              //钞/币箱状态

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
