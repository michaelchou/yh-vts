package com.yihuacomputer.cols.util;

import java.io.StringReader;
import java.util.ArrayList;
import java.util.List;

import javax.xml.transform.Transformer;
import javax.xml.transform.TransformerFactory;
import javax.xml.transform.stream.StreamSource;

import org.dom4j.Attribute;
import org.jdom.Document;
import org.jdom.Element;
import org.jdom.input.SAXBuilder;
import org.jdom.output.Format;
import org.jdom.output.XMLOutputter;
import org.jdom.transform.JDOMResult;
import org.jdom.transform.JDOMSource;
import org.jdom.transform.XSLTransformer;
import org.jdom.xpath.XPath;
import org.xml.sax.InputSource;

import com.yihuacomputer.cols.crypto.Base64;
import com.yihuacomputer.cols.entity.XMLEntity;

/**
 * XML处理工具类
 * 深圳怡化电脑股份有限公司
 * 2016-11-13
 */
public class XmlHelper
{
	/**
	 * <p>构造函数</p>
	 */
	public XmlHelper()
	{
	}

	/**
	 * <p>解析XML字符串为JDOM文档对象</p>
	 * @param str String XML字符串
	 * @return Document JDOM文档对象
	 */
	public static Document parseStr2Dom(String str)
	{
		SAXBuilder builder = new SAXBuilder();
		InputSource is = new InputSource(new StringReader(str));
		try
		{
			return builder.build(is);
		}
		catch (Exception e)
		{
			e.printStackTrace();
		}
		return null;
	}

	/**
	 * <p>转换JDOM文档对象为XML字符串</p>
	 * @param doc Document　JDOM文档对象
	 * @param encode String 字符集
	 * @return String XML字符串
	 */
	public static String transformDom2Str(Document doc, String encode)
	{
		try
		{
			Format format = Format.getPrettyFormat();
			format.setIndent(" ");
			if (encode != null && encode.length() > 0)
				format.setEncoding(encode);
			XMLOutputter outputter = new XMLOutputter(format);
			return outputter.outputString(doc);
		}
		catch (Exception e)
		{
		}
		return null;
	}

	/**
	 * <p>转换JDOM文档对象为XML字符串</p>
	 * @param doc Document　JDOM文档对象
	 * @param encode String 字符集
	 * @param flag String 值为空不以/结束
	 * @return String XML字符串
	 */
	public static String transformDom2Str(Document doc, String encode,boolean flag)
	{
		try
		{
			Format format = Format.getPrettyFormat();
			format.setIndent(" ");
			if (encode != null && encode.length() > 0)
				format.setEncoding(encode);
			format.setExpandEmptyElements(flag);
			XMLOutputter outputter = new XMLOutputter(format);
			return outputter.outputString(doc);
		}
		catch (Exception e)
		{
		}
		return null;
	}

	/**
	 * <p>将JDOM文档对象使用XSL转换为另一种格式的JDOM文档对象</p>
	 * @param docSrc Document 源XML文档对象
	 * @param docXsl Document XSL文档对象
	 * @return Document 目的XML文档对象
	 */
	public static Document transformDom_Simple(Document docSrc, Document docXsl)
	{
		if (null == docXsl)
			return docSrc;

		try
		{
			XSLTransformer xslt = new XSLTransformer(docXsl);
			return xslt.transform(docSrc);
		}
		catch (Exception e)
		{
		}
		return null;
	}

	/**
	 * <p>将JDOM文档对象使用XSL转换为另一种格式的JDOM文档对象</p>
	 * @param docSrc Document 源XML文档对象
	 * @param strXsl String XSL内容字符串
	 * @return Document 目的XML文档对象
	 */
	public static Document transformDom(Document docSrc, String strXsl)
	{
		if (null == strXsl || strXsl.length() == 0)
			return docSrc;

		try
		{
			Transformer transformer = TransformerFactory.newInstance().newTransformer(
					new StreamSource(new java.io.StringReader(strXsl)));
			JDOMSource in = new JDOMSource(docSrc);
			JDOMResult out = new JDOMResult();
			transformer.transform(in, out);
			return out.getDocument();
		}
		catch (Exception e)
		{
		}
		return null;
	}

	/**
	 * <p>获取JDOM文档对象中某节点的值</p>
	 * @param doc Document JDOM文档对象
	 * @param strPathName String 节点的路径
	 * @param strValDefault String 缺省值
	 * @return String 节点的值，获取失败时返回缺省值
	 */
	public static String getSingleNodeValue(Document doc, String strPathName, String strValDefault)
	{
		try
		{
			return ((Element) XPath.selectSingleNode(doc, strPathName)).getText();
		}
		catch (Exception e)
		{
		}
		return strValDefault;
	}

	/**
	 * <p>删除JDOM文档对象中的某个节点</p>
	 * @param doc Document JDOM文档对象
	 * @param strPathName String 节点的路径
	 */
	public static void deleteSingleNode(Document doc, String strPathName)
	{
		try
		{
			Element element = ((Element) XPath.selectSingleNode(doc, strPathName));
			element.getParentElement().removeChild(element.getName());
		}
		catch (Exception e)
		{
		}
	}

	public static boolean setSingleNodeValue(Document doc, String strPathName, String strVal)
	{
		try
		{
			((Element) XPath.selectSingleNode(doc, strPathName)).setText(strVal);
			return true;
		}
		catch (Exception e)
		{
		}

		try
		{
			Element eleParent = null;
			Element eleChild = null;
			String name;
			int i = 1;
			String pathName = "";
			if (strPathName.charAt(0) == '/')
				pathName = strPathName.substring(1);
			Object[] namearr = DataConversion.separate(pathName, '/');
			if (namearr != null && namearr.length > 0)
			{
				if (!doc.hasRootElement())
				{
					name = (String) namearr[0];
					if (name.length() == 0)
					{
						return false;
					}
					Element rootElement = new Element(name);
					doc.setRootElement(rootElement);
				}
				eleParent = doc.getRootElement();

				for (; i < namearr.length; i++)
				{
					name = (String) namearr[i];
					if (name.length() == 0)
						break;
					eleChild = eleParent.getChild(name);
					if (null == eleChild)
						eleChild = eleParent.addContent(new Element(name));
					if (null == eleChild)
						break;
					eleParent = eleChild;
				}
			}
			try
			{
				((Element) XPath.selectSingleNode(doc, strPathName)).setText(strVal);
				return true;
			}
			catch (Exception e)
			{
			}
		}
		catch (Exception e)
		{
		}
		return false;
	}

	/**
	 * 创建新节点
	 *
	 * @param name
	 * @param text
	 * @return
	 */
	public static Element createElement(String name, String text)
	{
		return new Element(name).setText(text);
	}

	/**
	 * 解析XML文件
	 * @param name
	 * @param text
	 * @return
	 */
	@SuppressWarnings({ "rawtypes", "unchecked" })
	public List getDocDataList(org.dom4j.Document document,String strNode)
	{
		List dataList  = new ArrayList();
		List<org.dom4j.Element> list = document.selectNodes(strNode); //strNode 节点，如/ROOT/IMAGES/IMAGE
		for (int i = 0; i < list.size(); i++) {
			org.dom4j.Element element=list.get(i);
			List<org.dom4j.Attribute> listAttr=element.attributes();//当前节点的所有属性的list
		    XMLEntity entity = new XMLEntity();
		    Base64 base64 = new Base64();
			for(Attribute attr:listAttr){//遍历当前节点的所有属性
			     String strName=attr.getName();//属性名称
				 String strValue=attr.getValue();//属性的值
			     if(strName != null && !strName.equals("") && strName.equals("URL")){//先用到这个后期有需要的时候再修改
				   entity.setStrUrlKey(strName);
				   entity.setStrUrlValue(base64.encode(strValue.getBytes()));
			     }
			     if(strName != null && !strName.equals("") && strName.equals("IMG_ID_NOTE")){//图片名称,目前只适应身份证
					entity.setStrImgIdNoteKey(strName);
					entity.setStrImgIdNoteValue(strValue);
			     }
			     if(strName != null && !strName.equals("") && strName.equals("BUSI_FILE_TYPE")){//图片名称,目前只适应除身份证外的图片
					entity.setStrBusiFileTypeKey(strName);
					entity.setStrBusiFileTypeValue(strValue);
				 }
			}
			dataList.add(entity);
		}
		return dataList;
	}

}
