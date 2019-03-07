package com.yihuacomputer.cols.entity;

/**
 * UKey箱表对象
 * 深圳怡化电脑股份有限公司
 * 2017-05-03
 */
public class UKeyUnitStatus
{
    private int id;                 //序号
    private String strTerminalNum;  //终端编号
    private int cuNum;              //UKey箱序列号
    private String strCuType;       //UKey箱类型
    private int initialCount;       //UKey箱初始张数
    private int curCount;           //当前张数
    private String strCuStatus;     //当前状态
    private String strUKeyType;     //UKey类型
    private String strUKeyTrackStart;//开始UKey段
    private String strUKeyTrackEnd;//结束UKey段
    private int uKeySuccCount;     //发UKey成功张数
    private int uKeyCaptureCount;  //发UKey成功吞卡张数
    private int uKeyDestroyCount;  //销UKey张数
    private int uKeyUnknown;       //状态未知吞UKey张数
    private int uKeyTakenCount;//UKey发送成功，但是客户未取走，被管机员拿走张数
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
	public String getStrUKeyType() {
		return strUKeyType;
	}
	public void setStrUKeyType(String strUKeyType) {
		this.strUKeyType = strUKeyType;
	}
	public String getStrUKeyTrackStart() {
		return strUKeyTrackStart;
	}
	public void setStrUKeyTrackStart(String strUKeyTrackStart) {
		this.strUKeyTrackStart = strUKeyTrackStart;
	}
	public String getStrUKeyTrackEnd() {
		return strUKeyTrackEnd;
	}
	public void setStrUKeyTrackEnd(String strUKeyTrackEnd) {
		this.strUKeyTrackEnd = strUKeyTrackEnd;
	}
	public int getuKeySuccCount() {
		return uKeySuccCount;
	}
	public void setuKeySuccCount(int uKeySuccCount) {
		this.uKeySuccCount = uKeySuccCount;
	}
	public int getuKeyCaptureCount() {
		return uKeyCaptureCount;
	}
	public void setuKeyCaptureCount(int uKeyCaptureCount) {
		this.uKeyCaptureCount = uKeyCaptureCount;
	}
	public int getuKeyDestroyCount() {
		return uKeyDestroyCount;
	}
	public void setuKeyDestroyCount(int uKeyDestroyCount) {
		this.uKeyDestroyCount = uKeyDestroyCount;
	}
	public int getuKeyUnknown() {
		return uKeyUnknown;
	}
	public void setuKeyUnknown(int uKeyUnknown) {
		this.uKeyUnknown = uKeyUnknown;
	}
	public int getuKeyTakenCount() {
		return uKeyTakenCount;
	}
	public void setuKeyTakenCount(int uKeyTakenCount) {
		this.uKeyTakenCount = uKeyTakenCount;
	}
}
