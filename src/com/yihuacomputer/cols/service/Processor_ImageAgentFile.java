package com.yihuacomputer.cols.service;

import java.io.File;
import java.util.Date;
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

public class Processor_ImageAgentFile extends Processor {

	public Logger error = Logger.getLogger("Error");
	public Logger info = Logger.getLogger("Info");
	
	public Processor_ImageAgentFile() {
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
      //����ʱ�������ҵ�����
      	String strtm = "" + new Date().getTime();
      	String strtime = strtm.substring(strtm.length() - 8, strtm.length());
      	String strAddPath = "_"+ strtime;
        String strFilePath = strSavePath + File.separator + strBatchId + strAddPath +".7z";
        if(strFileData != null && !strFileData.equals("")){
        	Base64 base64 = new Base64();
        	ret = base64.GenerateImage(strFileData,strFilePath);
        	if(ret){
        		ZipUtil zipUtil = new ZipUtil();
        		String strNewFilePath  = strFilePath.substring(0,strFilePath.lastIndexOf("."));
        		ret = zipUtil.extractile(strFilePath, strNewFilePath);
//        		//��ѹ�ɹ���������������˲����Ƭ���������˲����Ƭ���浽�ļ�����
//        		if(strIDOnLineImage !=null && !strIDOnLineImage.equals("")){
//        			ret = base64.GenerateImage(strIDOnLineImage,strSavePath + File.separator + strBatchId + strAddPath + File.separator +"agentcheck"+ strtime +".jpg");
//        		}
        		if(ret){
        		   //��������Ƭ����������
         		   String strAgentPath = strSavePath + File.separator + strBatchId + strAddPath + File.separator;
         		   //������������Ƭ
         		   File frontFile=new File(strAgentPath +"Front.jpg");
         		   if(frontFile.exists()){
         			  frontFile.renameTo(new File(strAgentPath +"agentFront" + strtime + ".jpg"));
         			  frontFile.delete();//ɾ��ԭ�ļ�
                    }
         		   File backFile=new File(strAgentPath +"back.jpg");
         		   if(backFile.exists()){
         			  backFile.renameTo(new File(strAgentPath +"agentback" + strtime + ".jpg"));
         			  backFile.delete();//ɾ��ԭ�ļ�
                    }
         		   
         		   File cardFile=new File(strAgentPath +"Card.jpg");
         		   if(cardFile.exists()){
         			  cardFile.renameTo(new File(strAgentPath +"agentCard" + strtime + ".jpg"));
         			  cardFile.delete();//ɾ��ԭ�ļ�
                    }
         		   
        		   File deleteFile = new File(strFilePath);
                   if(deleteFile.exists()){//ɾ���ļ�
                	   deleteFile.delete();
                   }
                   //������Ӱ���ļ�����
                   ZipUtil zipAgentUtil = new ZipUtil();
                   zipAgentUtil.extractileAgent(new File(strAgentPath),strAgentPath);
                   
                   String strVideoPlatIP = new MiscDB().get("00001", "VideoPlatIP", "");
                   String strVideoPlatPort = new MiscDB().get("00001", "VideoPlatPort", "");
               	   String strVideoPlatUser = new MiscDB().get("00001", "VideoPlatUser", "");
               	   String strVideoPlatPwd = new MiscDB().get("00001", "VideoPlatPwd", "");
               	   VideoPlatFormZNGY  vpf = new VideoPlatFormZNGY(strVideoPlatIP,strVideoPlatPort,strVideoPlatUser,strVideoPlatPwd);
               	   List<VideoPlat> imageInfoList = zipAgentUtil.getImageInfoList();
               	   VideoPlat entity = new VideoPlat();
               	   String strBusiStartTime = dtCur.getTransDateToView();//ҵ�����ʱ��
               	   //�¿ͻ�û�и��ֶ�
	               String strNewBatchId = MsgXmlDom.getElementValue(domReq,"strBatchId");
	               if(strNewBatchId == null || strNewBatchId.equals("")){
               			info.info("������Ӱ��:"+strBatchId+"_"+strtime+"\r\n");
               			entity.setStrBatchId(strBatchId);//���κ�  
	               }else{
               			info.info("������Ӱ��:"+strNewBatchId+"_"+strtime+"\r\n");
               			entity.setStrBatchId(strNewBatchId);//���κ�  
	               }                  		 
	               entity.setStrBusiStartTime(strBusiStartTime);
	               ret = vpf.videoPlatUpload(entity,imageInfoList);
	               if(!ret){
	            	   	error.error("�ļ��ϴ�Ӱ��ƽ̨(���ܹ�Ա)ʧ��:"+"\r\n");
	            	   	throw new ProcessorException(TERMRETCODE_UPLOADFILE,TERMRETDESC_UPLOADFILE, TERMRETDESCEN_UPLOADFILE);
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
