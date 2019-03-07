package com.yihuacomputer.cols.crypto;
import java.io.IOException;
import java.util.ArrayList;
import java.util.List;

import org.apache.log4j.Logger;

import com.sunyard.TransEngine.client.ClientApi;
import com.sunyard.TransEngine.doc.ECMDoc;
import com.sunyard.TransEngine.exception.SunTransEngineException;
import com.sunyard.TransEngine.util.OptionKey;
import com.sunyard.TransEngine.util.key.DocKey;
import com.sunyard.TransEngine.util.key.DocPartKey;
import com.yihuacomputer.cols.entity.VideoPlat;


public class VideoPlatFormZNGY {
	private String ip = "";
	private String port = "";
	private String username = "";
	private String password = "";
    //其他项类型名称
	private String objName = "ZNGY_DOC";
	//其他文档部件名称
	private String partName = "ZNGY_PART";

	private Logger error = Logger.getLogger("Error");

	public Logger info = Logger.getLogger("Info");
	public VideoPlatFormZNGY(String ip, String port, String username, String password) {
		this.ip = ip;
		this.port = port;
		this.username = username;
		this.password = password;
	}

	/**
	 * 登录
	 *
	 * @return
	 * @throws SunTransEngineException
	 * @throws IOException
	 */
	public boolean login() {
		ClientApi api = new ClientApi(this.ip, this.port, this.username, this.password);
		try {
			System.out.println("开始登录(智能柜员影像平台)");
			api.login();
			System.out.println("登录成功(智能柜员影像平台)");
			return true;
		} catch (SunTransEngineException e) {
			error.error("影像平台系统(智能柜员)登录失败:"+"\r\n"+e.getMessage()+"\r\n");
			return false;
		}
	}

	/**
	 * 登出
	 *
	 * @throws SunTransEngineException
	 * @throws IOException
	 */
	public void logOut() {
		ClientApi api = new ClientApi(ip, port, username);
		try {
			api.logout();
			System.out.println("登出成功(智能柜员影像平台)");
		} catch (SunTransEngineException e) {
			error.error("影像平台系统(智能柜员)登出失败:"+"\r\n"+e.getMessage()+"\r\n");
		}
	}

	/**
	 * 上传
	 */

	public boolean add(VideoPlat bean, List<?> imageInfoList) {
		ClientApi api = new ClientApi(ip, port, username, password);
		try {
			// 如果设置为true表示对文件进行压缩
			ECMDoc doc = new ECMDoc();
			//必传字段，批次ID（确保批次唯一字段，如卡号唯一，建议送卡号）
			doc.setBatchID(bean.getStrBatchId());
			//必传字段，项类型名称
			doc.setObjName(objName);
			//必传字段，批次文件数量
			if(imageInfoList !=null && imageInfoList.size() > 0){
				doc.setBusiAttribute(DocKey.AMOUNT, String.valueOf(imageInfoList.size()));
			}else{
				doc.setBusiAttribute(DocKey.AMOUNT, "0");
			}
			//必传字段，业务产生时间
			doc.setBusiAttribute(DocKey.BUSI_START_TIME, bean.getStrBusiStartTime());

			//必传字段，文档部件名称
			doc.beginFilePart(partName);
			if(imageInfoList !=null && imageInfoList.size() > 0){
				for(int i=0; i<imageInfoList.size(); i++ ){
					VideoPlat entity = (VideoPlat) imageInfoList.get(i);
					// 开始 设置第一张影像信息
					doc.beginFile();
					// 必传字段，文件格式
					doc.setFileAttribute(DocPartKey.FILE_FORMAT, entity.getStrFilePath().substring(entity.getStrFilePath().lastIndexOf('.')+1, entity.getStrFilePath().length()));
					// 必传字段，文件大小，单位字节
					doc.setFileAttribute(DocPartKey.FILE_SIZE, entity.getStrFileSize());
					// 可选字段，页数
					doc.setFileAttribute("BUSI_FILE_PAGENUM", "1");
					// 必传信息，文件路径和是否进行MD5校验
					doc.setFile(entity.getStrFilePath(), true);
					//截取上传的文件名称
					doc.setFileAttribute("BUSI_FILE_TYPE" ,entity.getStrFilePath().substring(entity.getStrFilePath().lastIndexOf('/')+1, entity.getStrFilePath().lastIndexOf('.')));
					// 结束设置
					doc.endFile();
				}
            }
			doc.endFilePart();
			System.out.println(doc.getDocInfo().asXML());
			System.out.println(api.add(doc));
			System.out.println("上传成功");
			return true;
		} catch (SunTransEngineException e) {
			error.error("影像平台系统(智能柜员)上传文件失败:"+"\r\n"+e.getMessage()+"\r\n");
			return false;
		}
	}

	/**
	 * 更新文件
	 */
	public boolean update(VideoPlat bean, List<?> imageInfoList) {
		ClientApi api = new ClientApi(ip, port, username, password);
		// 如果设置为true表示对文件进行压缩
		ECMDoc doc = new ECMDoc();
		try {
			//必传字段，批次ID（确保批次唯一字段，如卡号唯一，建议送卡号）
			doc.setBatchID(bean.getStrBatchId());
			//必传字段，项类型名称
			doc.setObjName(objName);
			//必传字段，批次文件数量
			if(imageInfoList !=null && imageInfoList.size() > 0){
				doc.setBusiAttribute(DocKey.AMOUNT, String.valueOf(imageInfoList.size()));
			}else{
				doc.setBusiAttribute(DocKey.AMOUNT, "0");
			}
			//必传字段，业务产生时间
			doc.setBusiAttribute(DocKey.BUSI_START_TIME, bean.getStrBusiStartTime());

			//必传字段，文档部件名称
			doc.beginFilePart(partName);
			if(imageInfoList !=null && imageInfoList.size() > 0){
				for(int i=0; i<imageInfoList.size(); i++ ){
					VideoPlat entity = (VideoPlat) imageInfoList.get(i);
					// 开始 设置第一张影像信息
					doc.beginFile();
					// 必传字段，文件格式
					doc.setFileAttribute(DocPartKey.FILE_FORMAT, entity.getStrFilePath().substring(entity.getStrFilePath().lastIndexOf('.')+1, entity.getStrFilePath().length()));
					// 必传字段，文件大小，单位字节
					doc.setFileAttribute(DocPartKey.FILE_SIZE, entity.getStrFileSize());
					// 可选字段，页数
					doc.setFileAttribute("BUSI_FILE_PAGENUM", "1");
					// 必传信息，文件路径和是否进行MD5校验
					doc.setFile(entity.getStrFilePath(), true);
					//更新标识
					doc.setUpdateFlag(OptionKey.U_ADD);
					//截取上传的文件名称
					doc.setFileAttribute("BUSI_FILE_TYPE" ,entity.getStrFilePath().substring(entity.getStrFilePath().lastIndexOf('/')+1, entity.getStrFilePath().lastIndexOf('.')));
					// 结束设置
					doc.endFile();
				}
            }
			doc.endFilePart();
			//设置自动检入检出
//			doc.setUpdateCheckOutAndIn(true, "admin");
			info.info("影像检入");
			api.checkout(doc);
			api.update(doc);
			System.out.println("更新成功");
			return true;
		} catch (SunTransEngineException e) {
			error.error("影像平台系统(智能柜员)上传文件失败:"+"\r\n"+e.getMessage()+"\r\n");
			return false;
		}finally{
			try {
				info.info("影像检出");
				api.checkin(doc);
			} catch (SunTransEngineException e) {
				error.error("影像平台系统(智能柜员)检出失败:"+"\r\n"+e.getMessage()+"\r\n");
			}
		}
	}

	/**
	 * 通过批次号查询批次下的所有文件
	 */
	public String queryBatchFile(VideoPlat bean) {
		String strXml ="";
		try {
			ClientApi api = new ClientApi(ip, port, username, password);
			ECMDoc doc = new ECMDoc(false);
			//指定要查询的批次号
			doc.setBatchID(bean.getStrBatchId());
			//指定查询批次所属的项类型名称
			doc.setObjName(objName);
			//指定查询类型为查询批次文件
			doc.setOption(OptionKey.QUERY_BATCH_FILE);
			strXml = api.queryFile(doc);
			System.out.println(strXml);
		} catch (SunTransEngineException e) {
			error.error("影像平台系统(智能柜员)查询失败:"+"\r\n"+e.getMessage()+"\r\n");
		}
		return strXml;
	}

	/**
	 * 影像平台文件上传
	 * @param bean
	 * @param imageInfoList
	 * @return
	 */
	public boolean videoPlatUpload(VideoPlat bean, List<?> imageInfoList)
	{
		boolean ret = login();
		if(ret){
			//先查询一下，如果数据存在，则调用更新接口
			String strQuertDate = queryBatchFile(bean);
			if(strQuertDate != null && !strQuertDate.equals("") && strQuertDate.length() > 50){
			   System.out.println("更新文件");
			   //更新文件
			   ret = update(bean,imageInfoList);
			}else{
		       //上传文件
				System.out.println("上传文件");
			   ret = add(bean,imageInfoList);
			}
		}
		logOut();
		return ret;
	}

	/**
	 * 影像平台文件查询
	 * @param bean
	 * @param imageInfoList
	 * @return
	 */
	public String videoPlatQuery(VideoPlat bean)
	{
		String strUrlDate ="";
		boolean ret = login();
		if(ret){
		    //上传文件
			strUrlDate = queryBatchFile(bean);
		}
		logOut();
		return strUrlDate;
	}

	public static void test1(){
		VideoPlatFormZNGY client = new VideoPlatFormZNGY("10.20.146.164", "8021", "admin", "111");
		VideoPlat bean =  new VideoPlat();
		bean.setStrBatchId("0402019133360976");
		System.out.println("11111111111111:"+client.videoPlatQuery(bean));
	}

	public static void test2(){
		VideoPlatFormZNGY client = new VideoPlatFormZNGY("10.20.146.164", "8021", "admin", "111");
		List<VideoPlat> imageInfoList = new ArrayList<VideoPlat>();
		VideoPlat bean = new VideoPlat();
  	    bean.setStrFilePath("D:/0402019133360976/back.jpg");
  	    bean.setStrFileSize("1111");
  	    imageInfoList.add(bean);
  	    VideoPlat entity = new VideoPlat();
  	    entity.setStrBatchId("0402019133360976");//批次号
		entity.setStrBusiStartTime("20170607");
		boolean ret = client.videoPlatUpload(entity,imageInfoList);
		if(!ret){
			System.out.println("不成功");
		}
		else{
			System.out.println("成功");
		}
	}
	public static void main(String[] args) {
		test1();
		//test2();
	}
}
