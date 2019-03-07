package com.yihuacomputer.cols.service;

import java.io.File;
import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.io.IOException;
import java.util.ArrayList;
import java.util.List;

import org.apache.log4j.Logger;

import com.yihuacomputer.cols.crypto.VideoPlatFormID;
import com.yihuacomputer.cols.database.MiscDB;
import com.yihuacomputer.cols.entity.VideoPlat;
import com.yihuacomputer.cols.util.MsgXmlDom;

public class Processor_ImageFileNew extends Processor {

	public Logger error = Logger.getLogger("Error");

	public Processor_ImageFileNew() {
		super();
	}

    protected String getTransName()
	{
		return "影像文件上传";
	}
	/**
	 * <p>
	 * 服务处理
	 * </p>
	 */
	public void process() throws ProcessorException {
		boolean ret = false;
		String strBatchId = MsgXmlDom.getElementValue(domReq,"strBatchId");
		if(strBatchId == null || strBatchId.equals("")){
			strBatchId = getTerminalTsn();
		}
		String path = (getClass().getProtectionDomain().getCodeSource().getLocation().getPath()).substring(1, (getClass().getProtectionDomain().getCodeSource().getLocation().getPath()).indexOf("WEB-INF"));//获取工程路径
        String strSavePath = File.separator + path + "File" ;//完整的保存路径
        String strVideoPlatIP = new MiscDB().get("00001", "VideoPlatIP", "");
        String strVideoPlatPort = new MiscDB().get("00001", "VideoPlatPort", "");
        String strVideoPlatUser = new MiscDB().get("00001", "VideoPlatUser", "");
        String strVideoPlatPwd = new MiscDB().get("00001", "VideoPlatPwd", "");
        VideoPlatFormID  vpf = new VideoPlatFormID(strVideoPlatIP,strVideoPlatPort,strVideoPlatUser,strVideoPlatPwd);
        //String strBatchId = strBatchId;//批次号
        String strCustomerId = MsgXmlDom.getElementValue(domReq,"strCustomerId");//客户号
        String strBusiStartTime = dtCur.getTransDateToView();//业务产生时间
        String strLastUpdateTime = dtCur.getDateTimeStrSimple3();//最后更新时间
        //以下为文件信息
        String strIDCardNum = MsgXmlDom.getElementValue(domReq,"strIDCardNum");//证件号码
        String strIDGrantDept = MsgXmlDom.getElementValue(domReq,"strIDGrantDept");//签证机关
        String strSerialNo = strBatchId.substring(8, strBatchId.length()); //前端业务流水号
        String strLastModTime = strBusiStartTime; //最后修改时间
		String strDate = strBusiStartTime; // 影像创建时间
		List<VideoPlat> imageInfoList = new ArrayList<VideoPlat>();
		VideoPlat bean = new VideoPlat();
		//身份证正反面影像
		String strIDFrontPath = strSavePath + File.separator + strBatchId + File.separator + "Front.jpg";
		String strIDBackPath = strSavePath + File.separator + strBatchId + File.separator + "back.jpg";
		bean.setStrFilePath(strIDFrontPath);
		try {
			bean.setStrFileSize(String.valueOf(new FileInputStream(new File(strIDFrontPath)).available()));
		} catch (FileNotFoundException e) {
			error.error("上传身份证影像失败(找不到正面照片):"+ e.getMessage() + "\r\n");
			throw new ProcessorException(TERMRETCODE_INNERR,TERMRETDESC_INNERR, TERMRETDESCEN_INNERR);
		} catch (IOException e) {
			error.error("上传身份证影像失败(业务电子文件错误):"+ e.getMessage() + "\r\n");
			throw new ProcessorException(TERMRETCODE_INNERR,TERMRETDESC_INNERR, TERMRETDESCEN_INNERR);
		}
		imageInfoList.add(bean);
		bean = new VideoPlat();
		bean.setStrFilePath(strIDBackPath);
		try {
			bean.setStrFileSize(String.valueOf(new FileInputStream(new File(strIDBackPath)).available()));
		} catch (FileNotFoundException e) {
			error.error("上传身份证影像失败(找不到背面照片):"+ e.getMessage() + "\r\n");
			throw new ProcessorException(TERMRETCODE_INNERR,TERMRETDESC_INNERR, TERMRETDESCEN_INNERR);
		} catch (IOException e) {
			error.error("上传身份证影像失败(业务电子文件错误):"+ e.getMessage() + "\r\n");
			throw new ProcessorException(TERMRETCODE_INNERR,TERMRETDESC_INNERR, TERMRETDESCEN_INNERR);
		}
		imageInfoList.add(bean);
		VideoPlat entity = new VideoPlat();
		entity.setStrBatchId(strBatchId);
		entity.setStrBusiStartTime(strBusiStartTime);
		entity.setStrCustomerId(strCustomerId);
		entity.setStrDate(strDate);
		entity.setStrIDCardNum(strIDCardNum);
		entity.setStrIDGrantDept(strIDGrantDept);
		entity.setStrLastModTime(strLastModTime);
		entity.setStrLastUpdateTime(strLastUpdateTime);
		entity.setStrSerialNo(strSerialNo);
		ret = vpf.videoPlatUpload(entity, imageInfoList);
		if(!ret){
			error.error("文件上传影像平台失败(身份证影像补传):"+"\r\n");
			throw new ProcessorException(TERMRETCODE_UPLOADFILE,TERMRETDESC_UPLOADFILE, TERMRETDESCEN_UPLOADFILE);
		}
		// 设置成功信息
		setSucceedRespDom();
		MsgXmlDom.setElementValue(domResp, "strBatchId", strBatchId);
	}
}
