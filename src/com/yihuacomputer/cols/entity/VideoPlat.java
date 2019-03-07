package com.yihuacomputer.cols.entity;

/**
 * 影像平台数据对象
 * 深圳怡化电脑股份有限公司
 * 2017-04-26
 */
public class VideoPlat
{
	private String strBatchId;    //批次号
	private String strCustomerId; //客户号
	private String strBusiStartTime; //业务产生时间
	private String strLastUpdateTime; //最后更新时间
	private String strIDCardNum; //证件号码
	private String strIDGrantDept; //签证机关
	private String strSerialNo; //前端业务流水号
	private String strLastModTime; //前端业务流水号
	private String strDate; //影像创建时间
    private String strFilePath;   //文件保存路径
    private String strFileSize;   //文件大小

	public String getStrFilePath() {
		return strFilePath;
	}
	public void setStrFilePath(String strFilePath) {
		this.strFilePath = strFilePath;
	}
	public String getStrFileSize() {
		return strFileSize;
	}
	public void setStrFileSize(String strFileSize) {
		this.strFileSize = strFileSize;
	}
	public String getStrBatchId() {
		return strBatchId;
	}
	public void setStrBatchId(String strBatchId) {
		this.strBatchId = strBatchId;
	}
	public String getStrCustomerId() {
		return strCustomerId;
	}
	public void setStrCustomerId(String strCustomerId) {
		this.strCustomerId = strCustomerId;
	}
	public String getStrBusiStartTime() {
		return strBusiStartTime;
	}
	public void setStrBusiStartTime(String strBusiStartTime) {
		this.strBusiStartTime = strBusiStartTime;
	}
	public String getStrLastUpdateTime() {
		return strLastUpdateTime;
	}
	public void setStrLastUpdateTime(String strLastUpdateTime) {
		this.strLastUpdateTime = strLastUpdateTime;
	}
	public String getStrIDCardNum() {
		return strIDCardNum;
	}
	public void setStrIDCardNum(String strIDCardNum) {
		this.strIDCardNum = strIDCardNum;
	}
	public String getStrIDGrantDept() {
		return strIDGrantDept;
	}
	public void setStrIDGrantDept(String strIDGrantDept) {
		this.strIDGrantDept = strIDGrantDept;
	}
	public String getStrSerialNo() {
		return strSerialNo;
	}
	public void setStrSerialNo(String strSerialNo) {
		this.strSerialNo = strSerialNo;
	}
	public String getStrLastModTime() {
		return strLastModTime;
	}
	public void setStrLastModTime(String strLastModTime) {
		this.strLastModTime = strLastModTime;
	}
	public String getStrDate() {
		return strDate;
	}
	public void setStrDate(String strDate) {
		this.strDate = strDate;
	}
}
