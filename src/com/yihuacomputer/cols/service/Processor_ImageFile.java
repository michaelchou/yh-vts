package com.yihuacomputer.cols.service;

import java.io.File;
import java.util.List;

import org.apache.log4j.Logger;

import com.yihuacomputer.cols.crypto.Base64;
import com.yihuacomputer.cols.crypto.BmpReader;
import com.yihuacomputer.cols.crypto.VideoPlatFormID;
import com.yihuacomputer.cols.crypto.VideoPlatFormZNGY;
import com.yihuacomputer.cols.database.MiscDB;
import com.yihuacomputer.cols.entity.VideoPlat;
import com.yihuacomputer.cols.util.MsgXmlDom;
import com.yihuacomputer.cols.util.ZipUtil;

public class Processor_ImageFile extends Processor {

	public Logger error = Logger.getLogger("Error");

	public Processor_ImageFile() {
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
	@SuppressWarnings("static-access")
	public void process() throws ProcessorException {
		boolean ret = false;
		String strIDOnLineImage = MsgXmlDom.getElementValue(domReq,"strIDOnLineImage");//�����˲���Ƭ(base64�ַ���)
		String strFileData = MsgXmlDom.getElementValue(domReq,"strFileData");
		String strBatchId = MsgXmlDom.getElementValue(domReq,"strBatchId");
		if(strBatchId == null || strBatchId.equals("")){
			strBatchId = getTerminalTsn();
		}
		String path = (getClass().getProtectionDomain().getCodeSource().getLocation().getPath()).substring(1, (getClass().getProtectionDomain().getCodeSource().getLocation().getPath()).indexOf("WEB-INF"));//��ȡ����·��
        String strSavePath = File.separator + path + "File" ;//�����ı���·��
        File dir = new File(strSavePath);
        if (!dir.exists()) {
        	dir.mkdir();
        }
        String strFilePath = strSavePath + File.separator + strBatchId +".7z";
        if(strFileData != null && !strFileData.equals("")){
        	Base64 base64 = new Base64();
        	ret = base64.GenerateImage(strFileData,strFilePath);
        	if(ret){
        		ZipUtil zipUtil = new ZipUtil();
        		String strNewFilePath  = strFilePath.substring(0,strFilePath.lastIndexOf("."));
        		ret = zipUtil.extractile(strFilePath, strNewFilePath);
        		//��ѹ�ɹ���������������˲����Ƭ���������˲����Ƭ���浽�ļ�����
        		if(strIDOnLineImage !=null && !strIDOnLineImage.equals("")){
        			ret = base64.GenerateImage(strIDOnLineImage,strSavePath + File.separator + strBatchId + File.separator +"check.jpg");
        		}
        		if(ret){
        		   //��ѹ����Ժ�����SP�鲻��������ҪӦ����ߵ�����ָ�Ƶ�ͼƬ��������
        		   String strFingerPath = strSavePath + File.separator + strBatchId+ File.separator;
        		   File fingerFile=new File(strFingerPath +"Finger.bmp");
        		   if(fingerFile.exists()){//����ļ����ڣ����bmp��ʽ��ת��Ϊjpg
        			   new BmpReader().bmpTojpg(strFingerPath +"Finger.bmp", strFingerPath +"Finger.jpg");
        			   fingerFile.delete();//ɾ����Ӧ��bmp�ļ�
                   }
        		   File deleteFile = new File(strFilePath);
                   if(deleteFile.exists()){//ɾ���ļ�
                	   deleteFile.delete();
                   }
                   String strCustomerId = MsgXmlDom.getElementValue(domReq,"strCustomerId");//�ͻ���
                   //���ļ��ϴ���Ӱ��ƽ̨ϵͳ
                   String strImageType = MsgXmlDom.getElementValue(domReq,"strImageType");//�ϴ�����,��̨�������������͵�Ӱ��ƽ̨�ĸ��ӿ�
                   if(strImageType != null && !strImageType.equals("") && strImageType.equals("IDType")){//����͵����֤ƽ̨�������͵�����ƽ̨
                	   //Ϊ��ֹ�������ݣ�������Ͽͻ������֤Ӱ���ϴ���ZNGYĿ¼��ͬʱ�жϿͻ����Ƿ�Ϊ�������� ��Ч�����֤Ӱ������              	
                	   if(strCustomerId == null || strCustomerId.equals("")){
                		   error.error("�Ͽͻ��ļ��ϴ�Ӱ��ƽ̨(���ܹ�Ա)ʧ��:�Ͽͻ���Ϊ��"+"\r\n");
                  	      throw new ProcessorException(TERMRETCODE_UPLOADFILE,"�ͻ���Ϣ�쳣,�����������", TERMRETDESCEN_UPLOADFILE);
                	   }
                       String strVideoPlatIP = new MiscDB().get("00001", "VideoPlatIP", "");
               		   String strVideoPlatPort = new MiscDB().get("00001", "VideoPlatPort", "");
               		   String strVideoPlatUser = new MiscDB().get("00001", "VideoPlatUser", "");
               		   String strVideoPlatPwd = new MiscDB().get("00001", "VideoPlatPwd", "");
               		   VideoPlatFormZNGY  vpf = new VideoPlatFormZNGY(strVideoPlatIP,strVideoPlatPort,strVideoPlatUser,strVideoPlatPwd);
               		   List<VideoPlat> imageInfoList = zipUtil.getImageInfoList();
               		   VideoPlat entity = new VideoPlat();
               		   String strBusiStartTime = dtCur.getTransDateToView();//ҵ�����ʱ��
               		   //�¿ͻ�û�и��ֶ�
	               	   String strNewBatchId = MsgXmlDom.getElementValue(domReq,"strBatchId");
	               	   //�ͻ���
	               	   entity.setStrCustomerId(strCustomerId);
               		   if(strNewBatchId == null || strNewBatchId.equals("")){
               			   entity.setStrBatchId(strBatchId);//���κ�  
               		   }else{
               			  entity.setStrBatchId(strNewBatchId);//���κ�  
               		   }                  		 
               		   entity.setStrBusiStartTime(strBusiStartTime);
               		   ret = vpf.videoPlatUpload(entity,imageInfoList);
               		   if(!ret){
                 	      error.error("�ļ��ϴ�Ӱ��ƽ̨(���ܹ�Ա)ʧ��:"+"\r\n");
                 	      throw new ProcessorException(TERMRETCODE_UPLOADFILE,TERMRETDESC_UPLOADFILE, TERMRETDESCEN_UPLOADFILE);
                       }
                   }
                   else{
                	   String strVideoPlatIP = new MiscDB().get("00001", "VideoPlatIP", "");
               		   String strVideoPlatPort = new MiscDB().get("00001", "VideoPlatPort", "");
               		   String strVideoPlatUser = new MiscDB().get("00001", "VideoPlatUser", "");
               		   String strVideoPlatPwd = new MiscDB().get("00001", "VideoPlatPwd", "");
               		   VideoPlatFormZNGY  vpf = new VideoPlatFormZNGY(strVideoPlatIP,strVideoPlatPort,strVideoPlatUser,strVideoPlatPwd);
               		   List<VideoPlat> imageInfoList = zipUtil.getImageInfoList();
               		   VideoPlat entity = new VideoPlat();
               		   String strBusiStartTime = dtCur.getTransDateToView();//ҵ�����ʱ��
               		   //�¿ͻ�û�и��ֶ�
	               	   String strNewBatchId = MsgXmlDom.getElementValue(domReq,"strBatchId");
	               	   
	               	   if(strCustomerId != null || !strCustomerId.equals("")){
	               		entity.setStrCustomerId(strCustomerId); 
	               	   }
               		   if(strNewBatchId == null || strNewBatchId.equals("")){
               			   entity.setStrBatchId(strBatchId);//���κ�  
               		   }else{
               			  entity.setStrBatchId(strNewBatchId);//���κ�  
               		   }                  		 
               		   entity.setStrBusiStartTime(strBusiStartTime);
               		   ret = vpf.videoPlatUpload(entity,imageInfoList);
               		   if(!ret){
                 	      error.error("�ļ��ϴ�Ӱ��ƽ̨(���ܹ�Ա)ʧ��:"+"\r\n");
                 	      throw new ProcessorException(TERMRETCODE_UPLOADFILE,TERMRETDESC_UPLOADFILE, TERMRETDESCEN_UPLOADFILE);
                       }
                   }
        		}else{
        		   error.error("Ӱ��ƽ̨���ݽ�ѹʧ��:"+"\r\n");
            	   throw new ProcessorException(TERMRETCODE_UPLOADFILE,TERMRETDESC_UPLOADFILE, TERMRETDESCEN_UPLOADFILE);
        		}
        	}else{
        		error.error("Ӱ��ƽ̨����ת�ļ�ʧ��:"+"\r\n");
        		throw new ProcessorException(TERMRETCODE_UPLOADFILE,TERMRETDESC_UPLOADFILE, TERMRETDESCEN_UPLOADFILE);
        	}
        }else{
        	error.error("��ȡ�ϴ�Ӱ��ƽ̨����ʧ��:"+"\r\n");
        	throw new ProcessorException(TERMRETCODE_UPLOADFILE,TERMRETDESC_UPLOADFILE, TERMRETDESCEN_UPLOADFILE);
        }
		// ���óɹ���Ϣ
		setSucceedRespDom();
		MsgXmlDom.setElementValue(domResp, "strBatchId", strBatchId);
	}
}
