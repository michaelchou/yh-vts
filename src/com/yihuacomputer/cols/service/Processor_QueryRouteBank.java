package com.yihuacomputer.cols.service;

import java.math.BigDecimal;
import java.text.DecimalFormat;
import java.util.List;

import org.jdom.Element;

import com.yihuacomputer.cols.database.RouteBankDB;
import com.yihuacomputer.cols.entity.CDSTransLog;
import com.yihuacomputer.cols.entity.RouteBank;
import com.yihuacomputer.cols.util.MsgXmlDom;
import com.yihuacomputer.cols.util.XmlHelper;

public class Processor_QueryRouteBank extends Processor {

	public Processor_QueryRouteBank() {
		super();
	}

    protected String getTransName()
	{
		return "获取支行信息";
	}
	/**
	 * <p>
	 * 服务处理
	 * </p>
	 */
	public void process() throws ProcessorException {
		//城市代号
        String cityCode = MsgXmlDom.getElementValue(domReq, "cityCode");
        //银行代号
        String bankCode = MsgXmlDom.getElementValue(domReq, "bankCode");
		RouteBank RB = new RouteBank();
		RB.setStrBankTypeCode(bankCode);
		RB.setStrCCPCCode(cityCode);
		setSucceedRespDom();
		List<?> RBlist = new RouteBankDB().getRouteBankList(RB);
		if (RBlist != null && RBlist.size() > 0) {
			Element rootElement = domResp.getRootElement();
			Element RBEle = new Element("RB");
			for (int i=0; RBlist!=null && i<RBlist.size(); i++)
			{
				RouteBank routebank = (RouteBank)RBlist.get(i);
				String strBankName = routebank.getStrBankName();
				String strBankCode = routebank.getStrBankCode();
				String strRouteCode = routebank.getStrRouteCode();
				Element itemEle = new Element("ITEM");
				itemEle.addContent(XmlHelper.createElement("strBankName", strBankName));
				itemEle.addContent(XmlHelper.createElement("strBankCode", strBankCode));
				itemEle.addContent(XmlHelper.createElement("strRouteCode", strRouteCode));
				RBEle.addContent(itemEle);
			}
			rootElement.addContent(RBEle);
		}
		
	}
}
