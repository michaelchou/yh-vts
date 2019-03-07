package com.yihuacomputer.cols.service;

import java.util.ArrayList;
import java.util.Iterator;
import java.util.Map;
import java.util.Set;

import org.apache.log4j.Logger;
import org.jdom.Document;

import com.yihuacomputer.cols.util.XmlHelper;
/**
 * 构造请求报文类
 */
public class RequestMessage {
	public Logger error = Logger.getLogger("Error");
	private Document reqDom = null;
	//子域集合
	private ArrayList<String> childlist =null;
	/*
	 * 生成基本类型数据
	*/
	public Document appendContentPrimary(Map<?, ?> map) {
		childlist= new ArrayList<String>();
		Document priDoc = null;
		StringBuffer sb = new StringBuffer();
		sb.append("<?xml version=\"1.0\" encoding=\"UTF-8\"?>");
		sb.append("<its>");
		//先增加包含子域的节点
		sb.append(appendChildNode(map));
		//再增加没有子节点的项
		sb.append(appendParentNode(map));
		sb.append("</its>");
		priDoc = XmlHelper.parseStr2Dom(sb.toString());
		reqDom = priDoc;
	    return reqDom;
	}

	/**
	 * 获得配置的报文组装带子域的节点
	*/
	public String appendChildNode(Map<?, ?> map) {
		StringBuffer sb = new StringBuffer();
		if (map != null && map.size() > 0) {
			//先遍历所有项，并找出有复合域的项
			Set<?> keySet_child = map.keySet();
			Iterator<?> keyIter_child = keySet_child.iterator();
			while (keyIter_child.hasNext()) {
				String key_child = (String)keyIter_child.next();
				String value_child = (String)map.get(key_child);
				if(key_child != null && !key_child.equals("") && key_child.indexOf(",")!=-1){//列表数据处理
                    String[] key_splits = key_child.split(",");
                    String[] value_splits = value_child.split("\\|");
                    sb.append("<F59>");
                    if(value_splits != null && value_splits.length > 0){
                    	for(int j=0;j < value_splits.length; j++){//遍历每条记录
                    		String  record_value = value_splits[j];
                    		String[] field_value = record_value.split(",");
                    		sb.append("<item>");
                            if(field_value != null && field_value.length > 0){
                            	for(int k=0;k < field_value.length; k++){//遍历每个字段的值
                            		if(key_splits.length == field_value.length){//防止数据不完整，报数组越界错误
                            		  sb.append("<"+key_splits[k]+">"+field_value[k]+"</"+key_splits[k]+">");
                            		}
                            		else{
                            			error.error("上送服务端数据错误（列表数据中的列与值不匹配）\r\n");
                            		}
                            	}
                            }
                            sb.append("</item>");
                    	}
                    }
                    sb.append("</F59>");
				}
				else if(value_child != null && !value_child.equals("") && value_child.indexOf(",")!=-1 
						&& value_child.indexOf("{") == -1 && value_child.indexOf("}") == -1){//过滤JSON格式的字符串，不进行子域解析
					//取出包含子域的节点值
					String[] splits = value_child.split(",");
					if(splits != null && splits.length > 0){
						sb.append("<"+key_child+">");
						for(int i=0;i < splits.length; i++){
							String value_Key = (String)map.get(splits[i]);//取出子域对应的值
							if(null == value_Key || "null".equals(value_Key)) value_Key = "";
							sb.append("<"+splits[i]+">"+value_Key+"</"+splits[i]+">");
							childlist.add(splits[i]);//把所有子域添加进去
						}
						sb.append("</"+key_child+">");
						childlist.add(key_child);//把自己也要添加进去
					}
				}
			}
		}
		return sb.toString();
	}
	/**
	 * 获得配置的报文组装无子域的节点
	*/
	public String appendParentNode(Map<?, ?> map) {
		StringBuffer sb = new StringBuffer();
		if (map != null && map.size() > 0) {
			//先遍历所有项，并找出有复合域的项
			Set<?> keySet_parent = map.keySet();
			Iterator<?> keyIter_parent = keySet_parent.iterator();
			while (keyIter_parent.hasNext()) {
				String key_parent = (String)keyIter_parent.next();
				String value_parent = (String)map.get(key_parent);
				if(key_parent != null && !key_parent.equals("") && key_parent.indexOf(",") == -1){//不包含列表数据
				   if(childlist != null && childlist.size() > 0 && childlist.contains(key_parent)){
					   //如果解析的域是复合域的项，则过滤
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
	 * 获得String格式的请求报文
	*/
	public String getRequestText() {
		if (reqDom != null)
			return XmlHelper.transformDom2Str(reqDom, "UTF-8");
		return "";
	}
}
