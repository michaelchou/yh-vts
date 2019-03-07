package com.yihuacomputer.cols.crypto;

import java.io.UnsupportedEncodingException;
import java.util.List;

import org.jdom.Document;
import org.jdom.Element;

import com.yihuacomputer.cols.util.DataConversion;
import com.yihuacomputer.cols.util.XmlHelper;

/**
 * ��ȫ��صĹ�����
 */
public class SecurityHelper
{
  /**
   * ���캯��
  */
  public SecurityHelper()
  {
  }

  /**
   * <p>��֤Mac(����)</p>
   * @param strMac ������֤��Mac������Ϊ8
   * @param strData ��������Mac�����ݣ������ݽ��������Md5��Ȼ���ø�Md5�������Mac
   * @param IP String IP��ַ
   * @param strMacKey String �ն˵�MAC��Կ
   * @return boolean ��֤ͨ������true,���򷵻�false
   */
  @SuppressWarnings("unchecked")
  public boolean validateMacSM4(String strMac, String strData, String strTermNo)
  {
	  int iRet = -1;
      strMac = strMac.trim();
      strData = new DataConversion().ToDBC(strData);
      //ȥ���ַ����е����Ľڵ�
      Document doc = XmlHelper.parseStr2Dom(strData);
      Element rootElement = doc.getRootElement();
		  List<Element> list = rootElement.getChildren();
		  for (Element el : list) {
          String strValue = el.getText();
          if(new DataConversion().hasChineseByReg(strValue)){
        	  rootElement.getChild(el.getName()).setText("srcb");
          }
          if(strValue ==null || strValue.equals(""))
          {
       	      rootElement.getChild(el.getName()).setText("srcb");
          }
	  }
	  strData = XmlHelper.transformDom2Str(doc, "gb2312").replace("<?xml version=\"1.0\" encoding=\"gb2312\"?>", "").replaceAll("(\r\n|\r|\n|\n\r)", "").replace(" ", "").trim();
      byte[] byteArrMd5Data = Md5.getDigest(strData.getBytes());
      String macKeyName = "ATM."+strTermNo+".zak";
      String strMacData ="";
	  try {
		  strMacData = new String(byteArrMd5Data, "UTF-8");
	  } catch (UnsupportedEncodingException e) {
		  return false;
	  }
      iRet = EncryptUtil.UnionVerifyMacSM4(macKeyName,strMacData, strMac);
      //0����ʾ�ɹ���������ʾʧ��
      if(iRet == 0)
      return true;
      else
      return false;
  }

  /**
   * <p>��֤Mac(Des)</p>
   * @param strMac ������֤��Mac������Ϊ8
   * @param strData ��������Mac�����ݣ������ݽ��������Md5��Ȼ���ø�Md5�������Mac
   * @param IP String IP��ַ
   * @param strMacKey String �ն˵�MAC��Կ
   * @return boolean ��֤ͨ������true,���򷵻�false
 * @throws UnsupportedEncodingException
   */
  @SuppressWarnings("unchecked")
  public boolean validateMacDes(String strMac, String strData, String strTermNo) throws UnsupportedEncodingException
  {
	  int iRet = -1;
      strMac = strMac.trim();
      strData = new DataConversion().ToDBC(strData);
      //ȥ���ַ����е����Ľڵ�
      Document doc = XmlHelper.parseStr2Dom(strData);
      Element rootElement = doc.getRootElement();
		  List<Element> list = rootElement.getChildren();
		  for (Element el : list) {
          String strValue = el.getText();
          if(new DataConversion().hasChineseByReg(strValue)){
        	  rootElement.getChild(el.getName()).setText("srcb");
          }
          if(strValue ==null || strValue.equals(""))
          {
       	      rootElement.getChild(el.getName()).setText("srcb");
          }
	  }
	  strData = XmlHelper.transformDom2Str(doc, "gb2312").replace("<?xml version=\"1.0\" encoding=\"gb2312\"?>", "").replaceAll("(\r\n|\r|\n|\n\r)", "").replace(" ", "").trim();
	  byte[] byteArrMd5Data = Md5.getDigest(strData.getBytes());
      String macKeyName = "atmp."+strTermNo+".tak";
      iRet = EncryptUtil.UnionVerifyMacDes(macKeyName,byteArrMd5Data, strMac);
      //0����ʾ�ɹ���������ʾʧ��
      if(iRet == 0)
      return true;
      else
      return false;
  }
}
