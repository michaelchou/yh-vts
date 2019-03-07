package com.yihuacomputer.cols.service;

import com.yihuacomputer.cols.database.BrunchRegisterDB;
import com.yihuacomputer.cols.entity.BrunchRegister;
import com.yihuacomputer.cols.util.MsgXmlDom;


public class Processor_AddBrunchRegister extends Processor{

	public Processor_AddBrunchRegister() {
		super();
	}

    protected String getTransName()
	{
		return "增加转账常用登记簿支行信息";
	}
	/**
	 * <p>
	 * 服务处理
	 * </p>
	 */

	public void process() throws ProcessorException {

        String StrPanOut = MsgXmlDom.getElementValue(domReq, "StrPanOut");
        String StrBankCode = MsgXmlDom.getElementValue(domReq, "StrBankCode");
        String StrBankName = MsgXmlDom.getElementValue(domReq, "StrBankName");
        String StrPanIn = MsgXmlDom.getElementValue(domReq, "StrPanIn");
        String StrPanNameIn = MsgXmlDom.getElementValue(domReq, "StrPanName");
        String StrPanInType = MsgXmlDom.getElementValue(domReq, "StrPanInType");
        String StrRouteCode = MsgXmlDom.getElementValue(domReq, "StrRouteCode");
        /*System.out.println(">>>>>>>>>>" + StrBankCode);
        System.out.println(">>>>>>>>>>" + StrBankName);
        System.out.println(">>>>>>>>>>" + StrPanIn);
        System.out.println(">>>>>>>>>>" + StrPanNameIn);
        System.out.println(">>>>>>>>>>" + StrPanOut);*/

		BrunchRegister BR = new BrunchRegister();
		BR.setStrPanOut(StrPanOut);
		BR.setStrBankCode(StrBankCode);
		BR.setStrBankName(StrBankName);
		BR.setStrPanIn(StrPanIn);
		BR.setStrNameIn(StrPanNameIn);
		BR.setStrPanInType(StrPanInType);
		BR.setStrRouteCode(StrRouteCode);
		new BrunchRegisterDB().setBrunchRegisterList(BR);
		setSucceedRespDom();

	}
}
