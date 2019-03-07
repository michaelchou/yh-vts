package com.yihuacomputer.cols.entity;

/**
 * 发卡箱表对象
 * 深圳怡化电脑股份有限公司
 * 2017-01-17
 */
public class CardUnitStatus
{
    private int id;                 //序号
    private String strTerminalNum;  //终端编号
    private int cuNum;              //卡箱序列号
    private String strCuType;       //卡箱类型
    private int initialCount;       //卡箱初始张数
    private int curCount;           //当前张数
    private String strCuStatus;     //当前状态
    private String strCardType;     //卡类型
    private String strCardTrackStart;//开始卡段
    private String strCardTrackEnd;//结束卡段
    private int cardSuccCount;     //发卡成功张数
    private int cardCaptureCount;  //发卡成功吞卡张数
    private int cardDestroyCount;  //销卡张数
    private int cardUnknown;       //状态未知吞卡张数
    private int cardTakenCount;//卡发送成功，但是客户未取走，被管机员拿走张数

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
	public int getCuNum() {
		return cuNum;
	}
	public void setCuNum(int cuNum) {
		this.cuNum = cuNum;
	}
	public String getStrCuType() {
		return strCuType;
	}
	public void setStrCuType(String strCuType) {
		this.strCuType = strCuType;
	}
	public int getInitialCount() {
		return initialCount;
	}
	public void setInitialCount(int initialCount) {
		this.initialCount = initialCount;
	}
	public int getCurCount() {
		return curCount;
	}
	public void setCurCount(int curCount) {
		this.curCount = curCount;
	}
	public String getStrCuStatus() {
		return strCuStatus;
	}
	public void setStrCuStatus(String strCuStatus) {
		this.strCuStatus = strCuStatus;
	}
	public String getStrCardType() {
		return strCardType;
	}
	public void setStrCardType(String strCardType) {
		this.strCardType = strCardType;
	}
	public String getStrCardTrackStart() {
		return strCardTrackStart;
	}
	public void setStrCardTrackStart(String strCardTrackStart) {
		this.strCardTrackStart = strCardTrackStart;
	}
	public String getStrCardTrackEnd() {
		return strCardTrackEnd;
	}
	public void setStrCardTrackEnd(String strCardTrackEnd) {
		this.strCardTrackEnd = strCardTrackEnd;
	}
	public int getCardSuccCount() {
		return cardSuccCount;
	}
	public void setCardSuccCount(int cardSuccCount) {
		this.cardSuccCount = cardSuccCount;
	}
	public int getCardCaptureCount() {
		return cardCaptureCount;
	}
	public void setCardCaptureCount(int cardCaptureCount) {
		this.cardCaptureCount = cardCaptureCount;
	}
	public int getCardDestroyCount() {
		return cardDestroyCount;
	}
	public void setCardDestroyCount(int cardDestroyCount) {
		this.cardDestroyCount = cardDestroyCount;
	}
	public int getCardUnknown() {
		return cardUnknown;
	}
	public void setCardUnknown(int cardUnknown) {
		this.cardUnknown = cardUnknown;
	}
	public int getCardTakenCount() {
		return cardTakenCount;
	}
	public void setCardTakenCount(int cardTakenCount) {
		this.cardTakenCount = cardTakenCount;
	}
}
