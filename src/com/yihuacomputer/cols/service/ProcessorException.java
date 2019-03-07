package com.yihuacomputer.cols.service;

public class ProcessorException extends Exception
{
    private static final long serialVersionUID = 3162561570597982053L;

    protected String strTermRetCode = "";
    protected String strTermRetDesc = "";
    protected String strTermRetDescEn = "";

    public ProcessorException(String code, String desc, String descen)
    {
	this.strTermRetCode = code;
	this.strTermRetDesc = desc;
	this.strTermRetDescEn = descen;
    }

    public String getTermRetCode()
    {
	return strTermRetCode;
    }

    public String getTermRetDesc()
    {
	return strTermRetDesc;
    }

    public String getTermRetDescEn()
    {
	return strTermRetDescEn;
    }
}
