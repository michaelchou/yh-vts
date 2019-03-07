package com.yihuacomputer.cols.service;
import java.io.UnsupportedEncodingException;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import org.jdom.Document;

import com.yihuacomputer.cols.util.DataConversion;
import com.yihuacomputer.cols.util.XmlHelper;

/**
 * ���׽�������
 */
public class ReponseMessage
{
  public String retCode = "";
  public String retCodeMessage = "";
  public String strChildNodeValue = "";//������ڶ�����¼ʱ��ȫ�������ڴ˱�������
  public Map <String,String> RepMap = new HashMap<String, String>();
  /**
   * ����
   * @param byteArrSrc Դ����
   * @return �����ɹ�ʱ����Դ����ĵ�ǰλ�ã����򷵻�-1
   * ע�⣺�����ɹ��뽻�׳ɹ�����������
   * @throws UnsupportedEncodingException
   */
  public int parse(Document domReq) throws UnsupportedEncodingException
  {
	    //��һ�� ���������ļ��������ױ���
	    analyzeRequest(domReq);//�����Ӧ����
		retCode = RepMap.get("F39");
		retCodeMessage  = RepMap.get("F39_INFO");
		//������������ϸ����
		if (retCode.equals("0000")){//�ɹ�
			return 1;
		}else{
			return -1;
		}
  }

  //�ֽ⽻��������Ϣ
  @SuppressWarnings("unchecked")
  public void analyzeRequest(Document domReq){
	  RepMap= new HashMap<String, String>();
  	  org.jdom.Element root = domReq.getRootElement();
  	  List<?> list=root.getChildren();//�������еĽڵ�Ԫ��
      for(int i=0;i<list.size();i++)
      {
      	org.jdom.Element element=(org.jdom.Element)list.get(i);//���˱������е�disk�ڵ�
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
