package com.yihuacomputer.cols.service;
import java.io.UnsupportedEncodingException;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import org.jdom.Document;

import com.yihuacomputer.cols.util.DataConversion;
import com.yihuacomputer.cols.util.XmlHelper;

/**
 * 交易解析基类
 */
public class ReponseMessage
{
  public String retCode = "";
  public String retCodeMessage = "";
  public String strChildNodeValue = "";//如果存在多条记录时，全部放置在此变量里面
  public Map <String,String> RepMap = new HashMap<String, String>();
  /**
   * 解析
   * @param byteArrSrc 源数组
   * @return 解析成功时返回源数组的当前位置，否则返回-1
   * 注意：解析成功与交易成功是两个概念
   * @throws UnsupportedEncodingException
   */
  public int parse(Document domReq) throws UnsupportedEncodingException
  {
	    //第一步 根据配置文件解析交易报文
	    analyzeRequest(domReq);//拆分响应报文
		retCode = RepMap.get("F39");
		retCodeMessage  = RepMap.get("F39_INFO");
		//解析报文体详细内容
		if (retCode.equals("0000")){//成功
			return 1;
		}else{
			return -1;
		}
  }

  //分解交易请求信息
  @SuppressWarnings("unchecked")
  public void analyzeRequest(Document domReq){
	  RepMap= new HashMap<String, String>();
  	  org.jdom.Element root = domReq.getRootElement();
  	  List<?> list=root.getChildren();//解析所有的节点元素
      for(int i=0;i<list.size();i++)
      {
      	org.jdom.Element element=(org.jdom.Element)list.get(i);//依此遍历所有的disk节点
      	String key=element.getName();
      	String value=element.getText();
      	org.jdom.Element elementChild = root.getChild(key);
      	List<org.jdom.Element> children = elementChild.getChildren();
      	if(children !=null && children.size() > 0){
      		String  strRecDate= XmlHelper.transformDom2Str(domReq, "UTF-8");
      		int iFiledStart = strRecDate.lastIndexOf("<"+key+">");
			int iFiledEnd = strRecDate.lastIndexOf("</"+key+">");
			strChildNodeValue = strChildNodeValue + strRecDate.substring(iFiledStart, iFiledEnd+("</"+key+">").length());
      	}
      	else{
      	  RepMap.put(key, value);
      	}
      }
      if(strChildNodeValue != null && !strChildNodeValue.equals("") && strChildNodeValue.length() > 0){
    	  RepMap.put("dataList", new DataConversion().replaceBlank(strChildNodeValue));
      }
   }
}
