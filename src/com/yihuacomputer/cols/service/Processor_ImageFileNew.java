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
		return "Ӱ���ļ��ϴ�";
	}
	/**
	 * <p>
	 * ������
	 * </p>
	 */
	public void process() throws ProcessorException {
		boolean ret = false;
		String strBatchId = MsgXmlDom.getElementValue(domReq,"strBatchId");
		if(strBatchId == null || strBatchId.equals("")){
			strBatchId = getTerminalTsn();
		}
		String path = (getClass().getProtectionDomain().getCodeSource().getLocation().getPath()).substring(1, (getClass().getProtectionDomain().getCodeSource().getLocation().getPath()).indexOf("WEB-INF"));//��ȡ����·��
        String strSavePath = File.separator + path + "File" ;//�����ı���·��
        String strVideoPlatIP = new MiscDB().get("00001", "VideoPlatIP", "");
        String strVideoPlatPort = new MiscDB().get("00001", "VideoPlatPort", "");
        String strVideoPlatUser = new MiscDB().get("00001", "VideoPlatUser", "");
        String strVideoPlatPwd = new MiscDB().get("00001", "VideoPlatPwd", "");
        VideoPlatFormID  vpf = new VideoPlatFormID(strVideoPlatIP,strVideoPlatPort,strVideoPlatUser,strVideoPlatPwd);
        //String strBatchId = strBatchId;//���κ�
        String strCustomerId = MsgXmlDom.getElementValue(domReq,"strCustomerId");//�ͻ���
        String strBusiStartTime = dtCur.getTransDateToView();//ҵ�����ʱ��
        String strLastUpdateTime = dtCur.getDateTimeStrSimple3();//������ʱ��
        //����Ϊ�ļ���Ϣ
        String strIDCardNum = MsgXmlDom.getElementValue(domReq,"strIDCardNum");//֤������
        String strIDGrantDept = MsgXmlDom.getElementValue(domReq,"strIDGrantDept");//ǩ֤����
        String strSerialNo = strBatchId.substring(8, strBatchId.length()); //ǰ��ҵ����ˮ��
        String strLastModTime = strBusiStartTime; //����޸�ʱ��
		String strDate = strBusiStartTime; // Ӱ�񴴽�ʱ��
		List<VideoPlat> imageInfoList = new ArrayList<VideoPlat>();
		VideoPlat bean = new VideoPlat();
		//���֤������Ӱ��
		String strIDFrontPath = strSavePath + File.separator + strBatchId + File.separator + "Front.jpg";
		String strIDBackPath = strSavePath + File.separator + strBatchId + File.separator + "back.jpg";
		bean.setStrFilePath(strIDFrontPath);
		try {
			bean.setStrFileSize(String.valueOf(new FileInputStream(new File(strIDFrontPath)).available()));
		} catch (FileNotFoundException e) {
			error.error("�ϴ����֤Ӱ��ʧ��(�Ҳ���������Ƭ):"+ e.getMessage() + "\r\n");
			throw new ProcessorException(TERMRETCODE_INNERR,TERMRETDESC_INNERR, TERMRETDESCEN_INNERR);
		} catch (IOException e) {
			error.error("�ϴ����֤Ӱ��ʧ��(ҵ������ļ�����):"+ e.getMessage() + "\r\n");
			throw new ProcessorException(TERMRETCODE_INNERR,TERMRETDESC_INNERR, TERMRETDESCEN_INNERR);
		}
		imageInfoList.add(bean);
		bean = new VideoPlat();
		bean.setStrFilePath(strIDBackPath);
		try {
			bean.setStrFileSize(String.valueOf(new FileInputStream(new File(strIDBackPath)).available()));
		} catch (FileNotFoundException e) {
			error.error("�ϴ����֤Ӱ��ʧ��(�Ҳ���������Ƭ):"+ e.getMessage() + "\r\n");
			throw new ProcessorException(TERMRETCODE_INNERR,TERMRETDESC_INNERR, TERMRETDESCEN_INNERR);
		} catch (IOException e) {
			error.error("�ϴ����֤Ӱ��ʧ��(ҵ������ļ�����):"+ e.getMessage() + "\r\n");
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
			error.error("�ļ��ϴ�Ӱ��ƽ̨ʧ��(���֤Ӱ�񲹴�):"+"\r\n");
			throw new ProcessorException(TERMRETCODE_UPLOADFILE,TERMRETDESC_UPLOADFILE, TERMRETDESCEN_UPLOADFILE);
		}
		// ���óɹ���Ϣ
		setSucceedRespDom();
		MsgXmlDom.setElementValue(domResp, "strBatchId", strBatchId);
	}
}
