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
 * XML��������
 * �����������Թɷ����޹�˾
 * 2016-11-13
 */
public class XmlHelper
{
	/**
	 * <p>���캯��</p>
	 */
	public XmlHelper()
	{
	}

	/**
	 * <p>����XML�ַ���ΪJDOM�ĵ�����</p>
	 * @param str String XML�ַ���
	 * @return Document JDOM�ĵ�����
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
	 * <p>ת��JDOM�ĵ�����ΪXML�ַ���</p>
	 * @param doc Document��JDOM�ĵ�����
	 * @param encode String �ַ���
	 * @return String XML�ַ���
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
	 * <p>ת��JDOM�ĵ�����ΪXML�ַ���</p>
	 * @param doc Document��JDOM�ĵ�����
	 * @param encode String �ַ���
	 * @param flag String ֵΪ�ղ���/����
	 * @return String XML�ַ���
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
	 * <p>��JDOM�ĵ�����ʹ��XSLת��Ϊ��һ�ָ�ʽ��JDOM�ĵ�����</p>
	 * @param docSrc Document ԴXML�ĵ�����
	 * @param docXsl Document XSL�ĵ�����
	 * @return Document Ŀ��XML�ĵ�����
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
	 * <p>��JDOM�ĵ�����ʹ��XSLת��Ϊ��һ�ָ�ʽ��JDOM�ĵ�����</p>
	 * @param docSrc Document ԴXML�ĵ�����
	 * @param strXsl String XSL�����ַ���
	 * @return Document Ŀ��XML�ĵ�����
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
	 * <p>��ȡJDOM�ĵ�������ĳ�ڵ��ֵ</p>
	 * @param doc Document JDOM�ĵ�����
	 * @param strPathName String �ڵ��·��
	 * @param strValDefault String ȱʡֵ
	 * @return String �ڵ��ֵ����ȡʧ��ʱ����ȱʡֵ
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
	 * <p>ɾ��JDOM�ĵ������е�ĳ���ڵ�</p>
	 * @param doc Document JDOM�ĵ�����
	 * @param strPathName String �ڵ��·��
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
	 * �����½ڵ�
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
	 * ����XML�ļ�
	 * @param name
	 * @param text
	 * @return
	 */
	@SuppressWarnings({ "rawtypes", "unchecked" })
	public List getDocDataList(org.dom4j.Document document,String strNode)
	{
		List dataList  = new ArrayList();
		List<org.dom4j.Element> list = document.selectNodes(strNode); //strNode �ڵ㣬��/ROOT/IMAGES/IMAGE
		for (int i = 0; i < list.size(); i++) {
			org.dom4j.Element element=list.get(i);
			List<org.dom4j.Attribute> listAttr=element.attributes();//��ǰ�ڵ���������Ե�list
		    XMLEntity entity = new XMLEntity();
		    Base64 base64 = new Base64();
			for(Attribute attr:listAttr){//������ǰ�ڵ����������
			     String strName=attr.getName();//��������
				 String strValue=attr.getValue();//���Ե�ֵ
			     if(strName != null && !strName.equals("") && strName.equals("URL")){//���õ������������Ҫ��ʱ�����޸�
				   entity.setStrUrlKey(strName);
				   entity.setStrUrlValue(base64.encode(strValue.getBytes()));
			     }
			     if(strName != null && !strName.equals("") && strName.equals("IMG_ID_NOTE")){//ͼƬ����,Ŀǰֻ��Ӧ���֤
					entity.setStrImgIdNoteKey(strName);
					entity.setStrImgIdNoteValue(strValue);
			     }
			     if(strName != null && !strName.equals("") && strName.equals("BUSI_FILE_TYPE")){//ͼƬ����,Ŀǰֻ��Ӧ�����֤���ͼƬ
					entity.setStrBusiFileTypeKey(strName);
					entity.setStrBusiFileTypeValue(strValue);
				 }
			}
			dataList.add(entity);
		}
		return dataList;
	}

}
