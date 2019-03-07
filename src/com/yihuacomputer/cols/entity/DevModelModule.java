package com.yihuacomputer.cols.entity;

/**
 * 型号模块关联表对象
 * 深圳怡化电脑股份有限公司
 * 2017-06-09
 */
public class DevModelModule
{
    private int id;                   //序号
    private int devModelId;          //设备型号Id号
    private int moduleId;            //设备模块Id号

    public int getId() {
		return id;
    }
	public void setId(int id) {
		this.id = id;
	}
	public int getDevModelId() {
		return devModelId;
	}
	public void setDevModelId(int devModelId) {
		this.devModelId = devModelId;
	}
	public int getModuleId() {
		return moduleId;
	}
	public void setModuleId(int moduleId) {
		this.moduleId = moduleId;
	}
}
