package com.yihuacomputer.cols.service;

import java.util.List;

import org.jdom.Element;

import com.yihuacomputer.cols.database.MiscDB;
import com.yihuacomputer.cols.database.UKeyUnitStatusDB;
import com.yihuacomputer.cols.entity.UKeyUnitStatus;
import com.yihuacomputer.cols.util.MsgXmlDom;
import com.yihuacomputer.cols.util.XmlHelper;

public class Processor_ChooseUkey extends Processor {

	public Processor_ChooseUkey() {
		super();
	}

    protected String getTransName()
	{
		return "��ȡUkey������Ϣ";
	}
	/**
	 * <p>
	 * ������
	 * </p>
	 */
	public void process() throws ProcessorException {
		//�ն˺�
        String strTerminalNum = MsgXmlDom.getElementValue(domReq, "strTerminalNum");
		//Ukey��ͳ����Ϣ
        UKeyUnitStatusDB uKeyUnitStatusDB = new UKeyUnitStatusDB();
		List<?> ukeyUnitList = uKeyUnitStatusDB.getUKeyUnitList(strTerminalNum);
		if (null == ukeyUnitList || ukeyUnitList.size() <= 0)
			throw new ProcessorException(TERMRETCODE_INNERR,TERMRETDESC_INNERR, TERMRETDESCEN_INNERR);

		// ���óɹ���Ϣ
		setSucceedRespDom();

		if (ukeyUnitList != null && ukeyUnitList.size() > 0) {
			Element rootElement = domResp.getRootElement();
			Element ukeyEle = new Element("UKEY");
			for (int i = 0; i < ukeyUnitList.size(); i++) {
				UKeyUnitStatus entity = (UKeyUnitStatus)ukeyUnitList.get(i);
				String strCuNum = String.valueOf(entity.getCuNum());
				String strUkeyType = entity.getStrUKeyType();
				String strUkeyName = new MiscDB().getDesc("00001", "strUkeyType", strUkeyType);
				Element itemEle = new Element("ITEM");
				itemEle.addContent(XmlHelper.createElement("strCuNum", strCuNum));
				itemEle.addContent(XmlHelper.createElement("strUkeyType", strUkeyType));
				itemEle.addContent(XmlHelper.createElement("strUkeyName", strUkeyName));
				ukeyEle.addContent(itemEle);
			}
			rootElement.addContent(ukeyEle);
		}
	}
}
