package com.yihuacomputer.cols.util;

public class XmlTextConstructor
{
	private StringBuffer strbufMsg = new StringBuffer(512);

	public XmlTextConstructor()
	{
	}

	public static String encodeXml(String val)
	{
		return val.replaceAll("&", "&amp;").replaceAll("'", "&apos;").replaceAll("\"", "&quot;")
				.replaceAll("<", "&lt;").replaceAll(">", "&gt;");
	}

	public void appendNode(String strName, String strVal)
	{
		startNode(strName);
		strbufMsg.append(encodeXml(strVal));
		endNode(strName);
	}

	public void startNode(String strName)
	{
		strbufMsg.append("<");
		strbufMsg.append(strName);
		strbufMsg.append(">");
	}

	public void endNode(String strName)
	{
		strbufMsg.append("</");
		strbufMsg.append(strName);
		strbufMsg.append(">");
	}

	public String toString()
	{
		return this.strbufMsg.toString();
	}
}
