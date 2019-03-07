package com.yihuacomputer.cols.crypto;

import java.io.UnsupportedEncodingException;
import java.util.List;

import org.jdom.Document;
import org.jdom.Element;

import com.yihuacomputer.cols.util.DataConversion;
import com.yihuacomputer.cols.util.XmlHelper;

/**
 * 安全相关的工具类
 */
public class SecurityHelper
{
  /**
   * 构造函数
  */
  public SecurityHelper()
  {
  }

  /**
   * <p>验证Mac(国密)</p>
   * @param strMac 用于验证的Mac，长度为8
   * @param strData 用来计算Mac的数据，该数据将首先求出Md5，然后用该Md5数据求出Mac
   * @param IP String IP地址
   * @param strMacKey String 终端的MAC密钥
   * @return boolean 验证通过返回true,否则返回false
   */
  @SuppressWarnings("unchecked")
  public boolean validateMacSM4(String strMac, String strData, String strTermNo)
  {
	  int iRet = -1;
      strMac = strMac.trim();
      strData = new DataConversion().ToDBC(strData);
      //去掉字符串中的中文节点
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
      //0：表示成功，其他表示失败
      if(iRet == 0)
      return true;
      else
      return false;
  }

  /**
   * <p>验证Mac(Des)</p>
   * @param strMac 用于验证的Mac，长度为8
   * @param strData 用来计算Mac的数据，该数据将首先求出Md5，然后用该Md5数据求出Mac
   * @param IP String IP地址
   * @param strMacKey String 终端的MAC密钥
   * @return boolean 验证通过返回true,否则返回false
 * @throws UnsupportedEncodingException
   */
  @SuppressWarnings("unchecked")
  public boolean validateMacDes(String strMac, String strData, String strTermNo) throws UnsupportedEncodingException
  {
	  int iRet = -1;
      strMac = strMac.trim();
      strData = new DataConversion().ToDBC(strData);
      //去掉字符串中的中文节点
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
      //0：表示成功，其他表示失败
      if(iRet == 0)
      return true;
      else
      return false;
  }
}
