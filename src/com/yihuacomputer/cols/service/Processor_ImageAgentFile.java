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
		return "影像文件上传";
	}
	/**
	 * <p>
	 * 服务处理
	 * </p>
	 */
	@SuppressWarnings("static-access")
	public void process() throws ProcessorException {
		boolean ret = false;
		String strIDOnLineImage = MsgXmlDom.getElementValue(domReq,"strIDOnLineImage");//联网核查照片(base64字符串)
		String strFileData = MsgXmlDom.getElementValue(domReq,"strFileData");
		String strBatchId = MsgXmlDom.getElementValue(domReq,"strBatchId");
		if(strBatchId == null || strBatchId.equals("")){
			strBatchId = getTerminalTsn();
		}
		String path = (getClass().getProtectionDomain().getCodeSource().getLocation().getPath()).substring(1, (getClass().getProtectionDomain().getCodeSource().getLocation().getPath()).indexOf("WEB-INF"));//获取工程路径
        String strSavePath = File.separator + path + "File" ;//完整的保存路径
        File dir = new File(strSavePath);
        if (!dir.exists()) {
        	dir.mkdir();
        }
      //根据时间戳生成业务办理单
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
//        		//解压成功后，如果存在联网核查的照片，把联网核查的照片保存到文件夹中
//        		if(strIDOnLineImage !=null && !strIDOnLineImage.equals("")){
//        			ret = base64.GenerateImage(strIDOnLineImage,strSavePath + File.separator + strBatchId + strAddPath + File.separator +"agentcheck"+ strtime +".jpg");
//        		}
        		if(ret){
        		   //代理人照片名称重命名
         		   String strAgentPath = strSavePath + File.separator + strBatchId + strAddPath + File.separator;
         		   //代理人正面照片
         		   File frontFile=new File(strAgentPath +"Front.jpg");
         		   if(frontFile.exists()){
         			  frontFile.renameTo(new File(strAgentPath +"agentFront" + strtime + ".jpg"));
         			  frontFile.delete();//删除原文件
                    }
         		   File backFile=new File(strAgentPath +"back.jpg");
         		   if(backFile.exists()){
         			  backFile.renameTo(new File(strAgentPath +"agentback" + strtime + ".jpg"));
         			  backFile.delete();//删除原文件
                    }
         		   
         		   File cardFile=new File(strAgentPath +"Card.jpg");
         		   if(cardFile.exists()){
         			  cardFile.renameTo(new File(strAgentPath +"agentCard" + strtime + ".jpg"));
         			  cardFile.delete();//删除原文件
                    }
         		   
        		   File deleteFile = new File(strFilePath);
                   if(deleteFile.exists()){//删除文件
                	   deleteFile.delete();
                   }
                   //代理人影像文件名称
                   ZipUtil zipAgentUtil = new ZipUtil();
                   zipAgentUtil.extractileAgent(new File(strAgentPath),strAgentPath);
                   
                   String strVideoPlatIP = new MiscDB().get("00001", "VideoPlatIP", "");
                   String strVideoPlatPort = new MiscDB().get("00001", "VideoPlatPort", "");
               	   String strVideoPlatUser = new MiscDB().get("00001", "VideoPlatUser", "");
               	   String strVideoPlatPwd = new MiscDB().get("00001", "VideoPlatPwd", "");
               	   VideoPlatFormZNGY  vpf = new VideoPlatFormZNGY(strVideoPlatIP,strVideoPlatPort,strVideoPlatUser,strVideoPlatPwd);
               	   List<VideoPlat> imageInfoList = zipAgentUtil.getImageInfoList();
               	   VideoPlat entity = new VideoPlat();
               	   String strBusiStartTime = dtCur.getTransDateToView();//业务产生时间
               	   //新客户没有该字段
	               String strNewBatchId = MsgXmlDom.getElementValue(domReq,"strBatchId");
	               if(strNewBatchId == null || strNewBatchId.equals("")){
               			info.info("代理人影像:"+strBatchId+"_"+strtime+"\r\n");
               			entity.setStrBatchId(strBatchId);//批次号  
	               }else{
               			info.info("代理人影像:"+strNewBatchId+"_"+strtime+"\r\n");
               			entity.setStrBatchId(strNewBatchId);//批次号  
	               }                  		 
	               entity.setStrBusiStartTime(strBusiStartTime);
	               ret = vpf.videoPlatUpload(entity,imageInfoList);
	               if(!ret){
	            	   	error.error("文件上传影像平台(智能柜员)失败:"+"\r\n");
	            	   	throw new ProcessorException(TERMRETCODE_UPLOADFILE,TERMRETDESC_UPLOADFILE, TERMRETDESCEN_UPLOADFILE);
	               }
        		}else{
        		   error.error("影像平台数据解压失败:"+"\r\n");
            	   throw new ProcessorException(TERMRETCODE_UPLOADFILE,TERMRETDESC_UPLOADFILE, TERMRETDESCEN_UPLOADFILE);
        		}
        	}else{
        		error.error("影像平台数据转文件失败:"+"\r\n");
        		throw new ProcessorException(TERMRETCODE_UPLOADFILE,TERMRETDESC_UPLOADFILE, TERMRETDESCEN_UPLOADFILE);
        	}
        }else{
        	error.error("读取上传影像平台数据失败:"+"\r\n");
        	throw new ProcessorException(TERMRETCODE_UPLOADFILE,TERMRETDESC_UPLOADFILE, TERMRETDESCEN_UPLOADFILE);
        }
		// 设置成功信息
		setSucceedRespDom();
		MsgXmlDom.setElementValue(domResp, "strBatchId", strBatchId);
	}
}
