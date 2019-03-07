package com.yihuacomputer.cols.service;

import java.util.List;

import org.jdom.Element;

import com.yihuacomputer.cols.database.BranchMapDB;
import com.yihuacomputer.cols.entity.BranchMap;
import com.yihuacomputer.cols.util.MsgXmlDom;
import com.yihuacomputer.cols.util.XmlHelper;

public class Processor_QueryBranchMapNo extends Processor{

	public Processor_QueryBranchMapNo() {
		super();
	}

    protected String getTransName()
	{
		return "获取跨行转账转出卡开户行网点号";
	}
	/**
	 * <p>
	 * 服务处理
	 * </p>
	 */

	public void process() throws ProcessorException {
		//System.out.println("****************开始取开卡行网点号*******************");
        //转出卡开户行行号
        String strLocalRouteCode = MsgXmlDom.getElementValue(domReq, "strLocalRouteCode");
        //System.out.println(">>>>>>>>>>>>>>>行号：" + strLocalRouteCode);
        BranchMap BM = new BranchMap();
        BM.setStrLocalRouteCode(strLocalRouteCode);
		setSucceedRespDom();
		List<?> BMlist = new BranchMapDB().getBranchMapNoList(BM);
		if (BMlist != null && BMlist.size() > 0) {
			Element rootElement = domResp.getRootElement();
			Element BMEle = new Element("BM");
			for (int i=0; BMlist!=null && i<BMlist.size(); i++)
			{
				BranchMap branchmap = (BranchMap) BMlist.get(i);
				String strLocalBankCode = branchmap.getStrLocalBankCode();
				//System.out.println(">>>>>>>>>>>>>>>网点号：" + strLocalBankCode);
				Element itemEle = new Element("ITEM");
				itemEle.addContent(XmlHelper.createElement("strLocalBankCode", strLocalBankCode));
				BMEle.addContent(itemEle);
			}
			rootElement.addContent(BMEle);
		}

	}


}
