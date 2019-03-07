package com.yihuacomputer.cols.entity;

/**
 * 终端钞箱信息表
 * @author Administrator
 *
 */
public class CashBoxUnitStatus {

	private int  id;                         //唯一ID

	private int boxNum;        //钞/币箱索引号

	private int boxType;          //钞/币箱类型

	private int initCount;               //初始（张/个）数

	private int currentCount ;                //当前（张/个）数

	private int boxStatus;              //钞/币箱状态
	
	private String strTerminalNum;   //终端号

	private int denom;					//券别
	
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
