package com.yihuacomputer.cols.service;

import java.util.List;
import org.jdom.Element;
import com.yihuacomputer.cols.database.CardUnitStatusDB;
import com.yihuacomputer.cols.database.MiscDB;
import com.yihuacomputer.cols.entity.CardUnitStatus;
import com.yihuacomputer.cols.util.MsgXmlDom;
import com.yihuacomputer.cols.util.XmlHelper;

public class Processor_ChooseCard extends Processor {

	public Processor_ChooseCard() {
		super();
	}

    protected String getTransName()
	{
		return "获取卡类型信息";
	}
	/**
	 * <p>
	 * 服务处理
	 * </p>
	 */
	public void process() throws ProcessorException {
		//终端号
        String strTerminalNum = MsgXmlDom.getElementValue(domReq, "strTerminalNum");
		//卡箱统计信息
		CardUnitStatusDB cardUnitStatusDB = new CardUnitStatusDB();
		List<?> cardUnitList = cardUnitStatusDB.getCardUnitList(strTerminalNum);
		if (null == cardUnitList || cardUnitList.size() <= 0)
			throw new ProcessorException(TERMRETCODE_INNERR,TERMRETDESC_INNERR, TERMRETDESCEN_INNERR);

		// 设置成功信息
		setSucceedRespDom();

		if (cardUnitList != null && cardUnitList.size() > 0) {
			Element rootElement = domResp.getRootElement();
			Element cardEle = new Element("CARD");
			for (int i = 0; i < cardUnitList.size(); i++) {
				CardUnitStatus entity = (CardUnitStatus)cardUnitList.get(i);
				String strCuNum = String.valueOf(entity.getCuNum());
				String strCardType = entity.getStrCardType();
				String strCardName = new MiscDB().getDesc("00001", "strCardType", strCardType);
				String strCardDesc = new MiscDB().getDesc("00001", "strCardTypeDesc", strCardType);
				String strCardPic = new MiscDB().getDesc("00001", "strCardTypePic", strCardType);
				Element itemEle = new Element("ITEM");
				itemEle.addContent(XmlHelper.createElement("strCuNum", strCuNum));
				itemEle.addContent(XmlHelper.createElement("strCardType", strCardType));
				itemEle.addContent(XmlHelper.createElement("strCardName", strCardName));
				itemEle.addContent(XmlHelper.createElement("strCardDesc", strCardDesc));
				itemEle.addContent(XmlHelper.createElement("strCardPic", strCardPic));
				cardEle.addContent(itemEle);
			}
			rootElement.addContent(cardEle);
		}
	}
}
