package com.yihuacomputer.cols.entity;

/**
 * XML对象
 * 深圳怡化电脑股份有限公司
 * 2017-04-27
 */
public class XMLEntity
{
    private String strUrlKey;             //URL属性名称
    private String strUrlValue;           //URL属性值
    private String strImgIdNoteKey;       //图片类型属性名称 只适应身份证
    private String strImgIdNoteValue;     //图片类型属性值 只适应身份证
    private String strBusiFileTypeKey;    //图片类型属性名称 目前只适应除身份证外的图片
    private String strBusiFileTypeValue;  //图片类型属性值 目前只适应除身份证外的图片
	public String getStrUrlKey() {
		return strUrlKey;
	}
	public void setStrUrlKey(String strUrlKey) {
		this.strUrlKey = strUrlKey;
	}
	public String getStrUrlValue() {
		return strUrlValue;
	}
	public void setStrUrlValue(String strUrlValue) {
		this.strUrlValue = strUrlValue;
	}
	public String getStrImgIdNoteKey() {
		return strImgIdNoteKey;
	}
	public void setStrImgIdNoteKey(String strImgIdNoteKey) {
		this.strImgIdNoteKey = strImgIdNoteKey;
	}
	public String getStrImgIdNoteValue() {
		return strImgIdNoteValue;
	}
	public void setStrImgIdNoteValue(String strImgIdNoteValue) {
		this.strImgIdNoteValue = strImgIdNoteValue;
	}
	public String getStrBusiFileTypeKey() {
		return strBusiFileTypeKey;
	}
	public void setStrBusiFileTypeKey(String strBusiFileTypeKey) {
		this.strBusiFileTypeKey = strBusiFileTypeKey;
	}
	public String getStrBusiFileTypeValue() {
		return strBusiFileTypeValue;
	}
	public void setStrBusiFileTypeValue(String strBusiFileTypeValue) {
		this.strBusiFileTypeValue = strBusiFileTypeValue;
	}
}
