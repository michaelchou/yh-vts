package com.yihuacomputer.cols.util;

import org.jdom.Document;
import org.jdom.Element;

public class MsgXmlDom
{
	public static final String YH_TRANS_XMLROOT = "TransMsg";
	public static final String YH_REQUEST_XMLROOT = "Request";
	public static final String YH_BODY_XMLROOT = "Body";
	public static final String YH_RESPONSE_XMLROOT = "Response";

	public static String decodeXml(String val)
	{
		return val.replaceAll("&amp;", "&").replaceAll("&apos;", "'").replaceAll("&quot;", "\"")
				.replaceAll("&lt;", "<").replaceAll("&gt;", ">");
	}

	public static String getElementValue(Document dom, String name)
	{
		if (name.length() == 0)
			return "";
		if (name.charAt(0) != '/')
			name = "/" + YH_TRANS_XMLROOT + "/" + name;
		String val = XmlHelper.getSingleNodeValue(dom, name, "");
		return decodeXml(val);
	}

	public static String getElementValueResp(Document dom, String name)
	{
		if (name.length() == 0)
			return "";
		if (name.charAt(0) != '/')
			name = "/" + YH_RESPONSE_XMLROOT + "/" + "Ctrl" + "/" + name;
		String val = XmlHelper.getSingleNodeValue(dom, name, "");
		return decodeXml(val);
	}

	public static String getElementValueBody(Document dom, String name)
	{
		if (name.length() == 0)
			return "";
		if (name.charAt(0) != '/')
			name = "/" + YH_RESPONSE_XMLROOT + "/" + "Body" + "/" + name;
		String val = XmlHelper.getSingleNodeValue(dom, name, "");
		return decodeXml(val);
	}

	public static int getElementValueInt(Document dom, String name, int def)
	{
		return DataConversion.str2Int(getElementValue(dom, name), def);
	}

	public static boolean setElementValue(Document dom, String name, String val)
	{
		if (name.length() > 0 && name.charAt(0) != '/')
			name = "/" + YH_TRANS_XMLROOT + "/" + name;
		return XmlHelper.setSingleNodeValue(dom, name, val);
	}

	public static boolean setElementValueReq(Document dom, String name, String val)
	{
		if (name.length() > 0 && name.charAt(0) != '/')
			name = "/" + YH_REQUEST_XMLROOT + "/" + "Ctrl" + "/" + name;
		return XmlHelper.setSingleNodeValue(dom, name, val);
	}

	public static boolean setElementValueBody(Document dom, String name, String val)
	{
		if (name.length() > 0 && name.charAt(0) != '/')
			name = "/" + YH_BODY_XMLROOT + "/" + name;
		return XmlHelper.setSingleNodeValue(dom, name, val);
	}

	public static boolean appendContent(Document dom, String strXml)
	{
		if (!dom.hasRootElement())
			dom.addContent(new Element(YH_TRANS_XMLROOT ));
		try
		{
			dom.getRootElement().addContent(XmlHelper.parseStr2Dom(strXml).detachRootElement());
		}
		catch (Exception e)
		{
		}
		return true;
	}
}
