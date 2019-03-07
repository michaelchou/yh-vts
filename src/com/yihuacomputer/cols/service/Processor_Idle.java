package com.yihuacomputer.cols.service;

import java.util.List;

import com.yihuacomputer.cols.database.MiscDB;
import com.yihuacomputer.cols.entity.Misc;
import com.yihuacomputer.cols.util.MsgXmlDom;

public class Processor_Idle extends Processor
{
    public Processor_Idle()
    {
	    super();
    }
    protected String getTransName()
	{
		return "";
	}
    /**
     * <p>
     * 服务处理
     * </p>
     */
    public void process() throws ProcessorException
    {

    	MiscDB   db= new MiscDB();
    	//是否强制打印品凭条
    	String strPrintReceipt =db.get("00001", "bPrintReceipt", "");
    	//查询参数

		List<?> list = db.getAll("00001");

		StringBuffer sb=new StringBuffer();
		if(list != null && list.size() > 0){
			for(int i=0; i < list.size(); i++){
				Misc entity = (Misc)list.get(i);
				String strName=entity.getStrName();
				String strValue=entity.getStrValue();
				String strDesc=entity.getStrDesc();
				sb.append(strName);
				sb.append(",");
				sb.append(strValue);
				sb.append(",");
				sb.append(strDesc);
				sb.append("|");
			}
		}else{
			sb.append("");
		}
		// 设置成功信息
		setSucceedRespDom();
		MsgXmlDom.setElementValue(domResp, "bPrintReceipt", strPrintReceipt);
		MsgXmlDom.setElementValue(domResp, "strTerminalStyle", super.terminal.getStrTerminalStyle());
		MsgXmlDom.setElementValue(domResp, "listMisc",sb.toString());
		MsgXmlDom.setElementValue(domResp, "UsingStatus", String.valueOf(super.terminal.getStatus()));
		//System.out.println(sb.toString());
    }

}
