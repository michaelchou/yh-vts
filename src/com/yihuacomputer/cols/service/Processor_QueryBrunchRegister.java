package com.yihuacomputer.cols.service;

import java.util.List;

import org.jdom.Element;

import com.yihuacomputer.cols.database.BrunchRegisterDB;
import com.yihuacomputer.cols.database.RouteBankDB;
import com.yihuacomputer.cols.entity.BrunchRegister;
import com.yihuacomputer.cols.entity.RouteBank;
import com.yihuacomputer.cols.util.MsgXmlDom;
import com.yihuacomputer.cols.util.XmlHelper;

public class Processor_QueryBrunchRegister extends Processor{

	public Processor_QueryBrunchRegister() {
		super();
	}

    protected String getTransName()
	{
		return "获取转账常用登记簿支行信息";
	}
	/**
	 * <p>
	 * 服务处理
	 * </p>
	 */

	public void process() throws ProcessorException {

        //扣款卡号
        String StrPanOut = MsgXmlDom.getElementValue(domReq, "StrPanOut");
        //对方卡号类型 本行/跨行
        String StrPanInType = MsgXmlDom.getElementValue(domReq, "StrPanInType");
        //System.out.println(">>>>>>>>>>" + StrPanOut);
		BrunchRegister BR = new BrunchRegister();
		BR.setStrPanOut(StrPanOut);
		BR.setStrPanInType(StrPanInType);
		setSucceedRespDom();
		List<?> BRlist = new BrunchRegisterDB().getBrunchRegisterList(BR);
		if (BRlist != null && BRlist.size() > 0) {
			Element rootElement = domResp.getRootElement();
			Element BREle = new Element("BR");
			for (int i=0; BRlist!=null && i<BRlist.size(); i++)
			{
				BrunchRegister brunchregister = (BrunchRegister) BRlist.get(i);
				String strBankName = brunchregister.getStrBankName();
				String strBankCode = brunchregister.getStrBankCode();
				String strPanName = brunchregister.getStrNameIn();
				String strPanIn = brunchregister.getStrPanIn();
				String strRouteCode = brunchregister.getStrRouteCode();
				Element itemEle = new Element("ITEM");
				itemEle.addContent(XmlHelper.createElement("strBankName", strBankName));
				itemEle.addContent(XmlHelper.createElement("strBankCode", strBankCode));
				itemEle.addContent(XmlHelper.createElement("strPanName", strPanName));
				itemEle.addContent(XmlHelper.createElement("strPanIn", strPanIn));
				itemEle.addContent(XmlHelper.createElement("strRouteCode", strRouteCode));
				BREle.addContent(itemEle);
			}
			rootElement.addContent(BREle);
		}

	}
}
