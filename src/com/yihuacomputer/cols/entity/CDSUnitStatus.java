package com.yihuacomputer.cols.entity;

/**
 * 存单箱表对象
 * 深圳怡化电脑股份有限公司
 * 2017-05-03
 */
public class CDSUnitStatus
{
    private int id;                 //序号
    private String strTerminalNum;  //终端编号
    private int cuNum;              //存单箱序列号
    private String strCuType;       //存单箱类型
    private int initialCount;       //存单箱初始张数
    private int curCount;           //当前张数
    private String strCuStatus;     //当前状态
    private String strCdsTrackStart;//开始存单段
    private String strCdsTrackEnd;//结束存单段
    private int cdsSuccCount;     //发存单成功张数
    private int cdsCaptureCount;  //发存单成功吞存单张数
    private int cdsDestroyCount;  //销存单张数
    private int cdsUnknown;       //状态未知吞存单张数
    private int cdsTakenCount;//存单发送成功，但是客户未取走，被管机员拿走张数

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
	public String getStrCdsTrackStart() {
		return strCdsTrackStart;
	}
	public void setStrCdsTrackStart(String strCdsTrackStart) {
		this.strCdsTrackStart = strCdsTrackStart;
	}
	public String getStrCdsTrackEnd() {
		return strCdsTrackEnd;
	}
	public void setStrCdsTrackEnd(String strCdsTrackEnd) {
		this.strCdsTrackEnd = strCdsTrackEnd;
	}
	public int getCdsSuccCount() {
		return cdsSuccCount;
	}
	public void setCdsSuccCount(int cdsSuccCount) {
		this.cdsSuccCount = cdsSuccCount;
	}
	public int getCdsCaptureCount() {
		return cdsCaptureCount;
	}
	public void setCdsCaptureCount(int cdsCaptureCount) {
		this.cdsCaptureCount = cdsCaptureCount;
	}
	public int getCdsDestroyCount() {
		return cdsDestroyCount;
	}
	public void setCdsDestroyCount(int cdsDestroyCount) {
		this.cdsDestroyCount = cdsDestroyCount;
	}
	public int getCdsUnknown() {
		return cdsUnknown;
	}
	public void setCdsUnknown(int cdsUnknown) {
		this.cdsUnknown = cdsUnknown;
	}
	public int getCdsTakenCount() {
		return cdsTakenCount;
	}
	public void setCdsTakenCount(int cdsTakenCount) {
		this.cdsTakenCount = cdsTakenCount;
	}
}
