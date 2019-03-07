package com.yihuacomputer.cols.service;

import java.util.ArrayList;
import java.util.Iterator;
import java.util.Map;
import java.util.Set;

import org.apache.log4j.Logger;
import org.jdom.Document;

import com.yihuacomputer.cols.util.XmlHelper;
/**
 * ������������
 */
public class RequestMessage {
	public Logger error = Logger.getLogger("Error");
	private Document reqDom = null;
	//���򼯺�
	private ArrayList<String> childlist =null;
	/*
	 * ���ɻ�����������
	*/
	public Document appendContentPrimary(Map<?, ?> map) {
		childlist= new ArrayList<String>();
		Document priDoc = null;
		StringBuffer sb = new StringBuffer();
		sb.append("<?xml version=\"1.0\" encoding=\"UTF-8\"?>");
		sb.append("<its>");
		//�����Ӱ�������Ľڵ�
		sb.append(appendChildNode(map));
		//������û���ӽڵ����
		sb.append(appendParentNode(map));
		sb.append("</its>");
		priDoc = XmlHelper.parseStr2Dom(sb.toString());
		reqDom = priDoc;
	    return reqDom;
	}

	/**
	 * ������õı�����װ������Ľڵ�
	*/
	public String appendChildNode(Map<?, ?> map) {
		StringBuffer sb = new StringBuffer();
		if (map != null && map.size() > 0) {
			//�ȱ�����������ҳ��и��������
			Set<?> keySet_child = map.keySet();
			Iterator<?> keyIter_child = keySet_child.iterator();
			while (keyIter_child.hasNext()) {
				String key_child = (String)keyIter_child.next();
				String value_child = (String)map.get(key_child);
				if(key_child != null && !key_child.equals("") && key_child.indexOf(",")!=-1){//�б����ݴ���
                    String[] key_splits = key_child.split(",");
                    String[] value_splits = value_child.split("\\|");
                    sb.append("<F59>");
                    if(value_splits != null && value_splits.length > 0){
                    	for(int j=0;j < value_splits.length; j++){//����ÿ����¼
                    		String  record_value = value_splits[j];
                    		String[] field_value = record_value.split(",");
                    		sb.append("<item>");
                            if(field_value != null && field_value.length > 0){
                            	for(int k=0;k < field_value.length; k++){//����ÿ���ֶε�ֵ
                            		if(key_splits.length == field_value.length){//��ֹ���ݲ�������������Խ�����
                            		  sb.append("<"+key_splits[k]+">"+field_value[k]+"</"+key_splits[k]+">");
                            		}
                            		else{
                            			error.error("���ͷ�������ݴ����б������е�����ֵ��ƥ�䣩\r\n");
                            		}
                            	}
                            }
                            sb.append("</item>");
                    	}
                    }
                    sb.append("</F59>");
				}
				else if(value_child != null && !value_child.equals("") && value_child.indexOf(",")!=-1 
						&& value_child.indexOf("{") == -1 && value_child.indexOf("}") == -1){//����JSON��ʽ���ַ������������������
					//ȡ����������Ľڵ�ֵ
					String[] splits = value_child.split(",");
					if(splits != null && splits.length > 0){
						sb.append("<"+key_child+">");
						for(int i=0;i < splits.length; i++){
							String value_Key = (String)map.get(splits[i]);//ȡ�������Ӧ��ֵ
							if(null == value_Key || "null".equals(value_Key)) value_Key = "";
							sb.append("<"+splits[i]+">"+value_Key+"</"+splits[i]+">");
							childlist.add(splits[i]);//������������ӽ�ȥ
						}
						sb.append("</"+key_child+">");
						childlist.add(key_child);//���Լ�ҲҪ��ӽ�ȥ
					}
				}
			}
		}
		return sb.toString();
	}
	/**
	 * ������õı�����װ������Ľڵ�
	*/
	public String appendParentNode(Map<?, ?> map) {
		StringBuffer sb = new StringBuffer();
		if (map != null && map.size() > 0) {
			//�ȱ�����������ҳ��и��������
			Set<?> keySet_parent = map.keySet();
			Iterator<?> keyIter_parent = keySet_parent.iterator();
			while (keyIter_parent.hasNext()) {
				String key_parent = (String)keyIter_parent.next();
				String value_parent = (String)map.get(key_parent);
				if(key_parent != null && !key_parent.equals("") && key_parent.indexOf(",") == -1){//�������б�����
				   if(childlist != null && childlist.size() > 0 && childlist.contains(key_parent)){
					   //������������Ǹ������������
				   }else{
					  if(null == value_parent || "null".equals(value_parent)) value_parent = "";
					  sb.append("<"+key_parent+">"+value_parent+"</"+key_parent+">");
				   }
				}
			}
		}
		return sb.toString();
	}
	/**
	 * ���String��ʽ��������
	*/
	public String getRequestText() {
		if (reqDom != null)
			return XmlHelper.transformDom2Str(reqDom, "UTF-8");
		return "";
	}
}
