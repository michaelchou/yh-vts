package com.yihuacomputer.cols.service;

import java.util.ArrayList;
import java.util.List;

import org.apache.log4j.Logger;
import org.dom4j.Document;
import org.dom4j.DocumentException;
import org.dom4j.DocumentHelper;
import org.jdom.Element;

import com.yihuacomputer.cols.crypto.VideoPlatFormID;
import com.yihuacomputer.cols.crypto.VideoPlatFormZNGY;
import com.yihuacomputer.cols.database.MiscDB;
import com.yihuacomputer.cols.entity.VideoPlat;
import com.yihuacomputer.cols.entity.XMLEntity;
import com.yihuacomputer.cols.util.MsgXmlDom;
import com.yihuacomputer.cols.util.XmlHelper;

public class Processor_ImageFileQuery extends Processor {

	public Logger error = Logger.getLogger("Error");

	public Processor_ImageFileQuery() {
		super();
	}

    protected String getTransName()
	{
		return "影像文件查询";
	}

	/**
	 * 服务处理
	 */
	@SuppressWarnings("rawtypes")
	public void process() throws ProcessorException {
		List<?> dataList =  new ArrayList();
		String strQuertDate ="";//查询结果
		String strBatchId = MsgXmlDom.getElementValue(domReq,"strBatchId");//查询的批次号
//		String strImageType = MsgXmlDom.getElementValue(domReq,"strImageType");//上传类型,后台会根据这个区分送到影像平台哪个接口
    	VideoPlat entity = new VideoPlat();
    	entity.setStrBatchId(strBatchId);
    	/*
		if(strImageType != null && !strImageType.equals("") && strImageType.equals("IDType")){//这个送到身份证平台，其他送到另外平台
			String strVideoPlatIP = new MiscDB().get("00001", "VideoPlatIP", "");
     		String strVideoPlatPort = new MiscDB().get("00001", "VideoPlatPort", "");
     		String strVideoPlatUser = new MiscDB().get("00001", "VideoPlatUser", "");
     		String strVideoPlatPwd = new MiscDB().get("00001", "VideoPlatPwd", "");
			VideoPlatFormID  vpf = new VideoPlatFormID(strVideoPlatIP,strVideoPlatPort,strVideoPlatUser,strVideoPlatPwd);
			strQuertDate = vpf.videoPlatQuery(entity);
        }
		else{*/
			String strVideoPlatIP = new MiscDB().get("00001", "VideoPlatIP", "");
     		String strVideoPlatPort = new MiscDB().get("00001", "VideoPlatPort", "");
     		String strVideoPlatUser = new MiscDB().get("00001", "VideoPlatUser", "");
     		String strVideoPlatPwd = new MiscDB().get("00001", "VideoPlatPwd", "");
     		VideoPlatFormZNGY  vpf = new VideoPlatFormZNGY(strVideoPlatIP,strVideoPlatPort,strVideoPlatUser,strVideoPlatPwd);
			strQuertDate = vpf.videoPlatQuery(entity);
		//}
		try {
			if(strQuertDate != null && !strQuertDate.equals("") && strQuertDate.length() > 50){
				String strNode = "/ROOT/IMAGES/IMAGE";
				Document document = DocumentHelper.parseText(strQuertDate);
				dataList =  new XmlHelper().getDocDataList(document,strNode);
				if(dataList == null ){
					error.error("影像文件查询失败(数据解析):"+"\r\n");
					throw new ProcessorException(TERMRETCODE_QUERYFILE,TERMRETDESC_QUERYFILE, TERMRETDESCEN_QUERYFILE);
				}
			}
			else{
				error.error("影像文件查询失败(数据解析):"+"\r\n");
				throw new ProcessorException(TERMRETCODE_QUERYFILE,TERMRETDESC_QUERYFILE, TERMRETDESCEN_QUERYFILE);
			}
		} catch (DocumentException e) {
			error.error("影像文件查询失败:"+"\r\n");
			throw new ProcessorException(TERMRETCODE_QUERYFILE,TERMRETDESC_QUERYFILE, TERMRETDESCEN_QUERYFILE);
		}
		// 设置成功信息
		setSucceedRespDom();
        //重新组装数据，待页面解析
		Element rootElement = domResp.getRootElement();
		Element dataEle = new Element("DATA");
		for (int i = 0; i < dataList.size(); i++) {
			XMLEntity xmlEntity = (XMLEntity) dataList.get(i);
			Element itemEle = new Element("ITEM");
			itemEle.addContent(XmlHelper.createElement(xmlEntity.getStrUrlKey(), xmlEntity.getStrUrlValue()));
			if(xmlEntity.getStrImgIdNoteKey() != null && !xmlEntity.getStrImgIdNoteKey().equals("")){
			    itemEle.addContent(XmlHelper.createElement(xmlEntity.getStrImgIdNoteKey(), xmlEntity.getStrImgIdNoteValue()));
			}
			if(xmlEntity.getStrBusiFileTypeKey() != null && !xmlEntity.getStrBusiFileTypeKey().equals("")){
			    itemEle.addContent(XmlHelper.createElement(xmlEntity.getStrBusiFileTypeKey(), xmlEntity.getStrBusiFileTypeValue()));
			}
			dataEle.addContent(itemEle);
		}
		rootElement.addContent(dataEle);
	}
}
