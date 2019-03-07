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
        String strFilePath = strSavePath + File.separator + strBatchId +".7z";
        if(strFileData != null && !strFileData.equals("")){
        	Base64 base64 = new Base64();
        	ret = base64.GenerateImage(strFileData,strFilePath);
        	if(ret){
        		ZipUtil zipUtil = new ZipUtil();
        		String strNewFilePath  = strFilePath.substring(0,strFilePath.lastIndexOf("."));
        		ret = zipUtil.extractile(strFilePath, strNewFilePath);
        		//解压成功后，如果存在联网核查的照片，把联网核查的照片保存到文件夹中
        		if(strIDOnLineImage !=null && !strIDOnLineImage.equals("")){
        			ret = base64.GenerateImage(strIDOnLineImage,strSavePath + File.separator + strBatchId + File.separator +"check.jpg");
        		}
        		if(ret){
        		   //解压完成以后，由于SP组不给力，需要应用这边单独对指纹的图片单独处理
        		   String strFingerPath = strSavePath + File.separator + strBatchId+ File.separator;
        		   File fingerFile=new File(strFingerPath +"Finger.bmp");
        		   if(fingerFile.exists()){//如果文件存在，则把bmp格式的转换为jpg
        			   new BmpReader().bmpTojpg(strFingerPath +"Finger.bmp", strFingerPath +"Finger.jpg");
        			   fingerFile.delete();//删除对应的bmp文件
                   }
        		   File deleteFile = new File(strFilePath);
                   if(deleteFile.exists()){//删除文件
                	   deleteFile.delete();
                   }
                   String strCustomerId = MsgXmlDom.getElementValue(domReq,"strCustomerId");//客户号
                   //把文件上传至影像平台系统
                   String strImageType = MsgXmlDom.getElementValue(domReq,"strImageType");//上传类型,后台会根据这个区分送到影像平台哪个接口
                   if(strImageType != null && !strImageType.equals("") && strImageType.equals("IDType")){//这个送到身份证平台，其他送到另外平台
                	   //为防止垃圾数据，如果是老客户将身份证影像上传至ZNGY目录，同时判断客户号是否为空来过滤 无效的身份证影像数据              	
                	   if(strCustomerId == null || strCustomerId.equals("")){
                		   error.error("老客户文件上传影像平台(智能柜员)失败:老客户号为空"+"\r\n");
                  	      throw new ProcessorException(TERMRETCODE_UPLOADFILE,"客户信息异常,请至柜面办理", TERMRETDESCEN_UPLOADFILE);
                	   }
                       String strVideoPlatIP = new MiscDB().get("00001", "VideoPlatIP", "");
               		   String strVideoPlatPort = new MiscDB().get("00001", "VideoPlatPort", "");
               		   String strVideoPlatUser = new MiscDB().get("00001", "VideoPlatUser", "");
               		   String strVideoPlatPwd = new MiscDB().get("00001", "VideoPlatPwd", "");
               		   VideoPlatFormZNGY  vpf = new VideoPlatFormZNGY(strVideoPlatIP,strVideoPlatPort,strVideoPlatUser,strVideoPlatPwd);
               		   List<VideoPlat> imageInfoList = zipUtil.getImageInfoList();
               		   VideoPlat entity = new VideoPlat();
               		   String strBusiStartTime = dtCur.getTransDateToView();//业务产生时间
               		   //新客户没有该字段
	               	   String strNewBatchId = MsgXmlDom.getElementValue(domReq,"strBatchId");
	               	   //客户号
	               	   entity.setStrCustomerId(strCustomerId);
               		   if(strNewBatchId == null || strNewBatchId.equals("")){
               			   entity.setStrBatchId(strBatchId);//批次号  
               		   }else{
               			  entity.setStrBatchId(strNewBatchId);//批次号  
               		   }                  		 
               		   entity.setStrBusiStartTime(strBusiStartTime);
               		   ret = vpf.videoPlatUpload(entity,imageInfoList);
               		   if(!ret){
                 	      error.error("文件上传影像平台(智能柜员)失败:"+"\r\n");
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
               		   String strBusiStartTime = dtCur.getTransDateToView();//业务产生时间
               		   //新客户没有该字段
	               	   String strNewBatchId = MsgXmlDom.getElementValue(domReq,"strBatchId");
	               	   
	               	   if(strCustomerId != null || !strCustomerId.equals("")){
	               		entity.setStrCustomerId(strCustomerId); 
	               	   }
               		   if(strNewBatchId == null || strNewBatchId.equals("")){
               			   entity.setStrBatchId(strBatchId);//批次号  
               		   }else{
               			  entity.setStrBatchId(strNewBatchId);//批次号  
               		   }                  		 
               		   entity.setStrBusiStartTime(strBusiStartTime);
               		   ret = vpf.videoPlatUpload(entity,imageInfoList);
               		   if(!ret){
                 	      error.error("文件上传影像平台(智能柜员)失败:"+"\r\n");
                 	      throw new ProcessorException(TERMRETCODE_UPLOADFILE,TERMRETDESC_UPLOADFILE, TERMRETDESCEN_UPLOADFILE);
                       }
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
