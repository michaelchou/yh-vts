package com.yihuacomputer.cols.crypto;
import java.io.IOException;
import java.util.List;

import org.apache.log4j.Logger;

import com.sunyard.TransEngine.client.ClientApi;
import com.sunyard.TransEngine.doc.ECMDoc;
import com.sunyard.TransEngine.exception.SunTransEngineException;
import com.sunyard.TransEngine.util.OptionKey;
import com.sunyard.TransEngine.util.key.DocKey;
import com.sunyard.TransEngine.util.key.DocPartKey;
import com.yihuacomputer.cols.entity.VideoPlat;


public class VideoPlatFormID {
	private String ip = "";
	private String port = "";
	private String username = "";
	private String password = "";
    //身份证项类型名称
	private String objName = "ID_DOC";
	//身份证文档部件名称
	private String partName = "ID_PART";

	private Logger error = Logger.getLogger("Error");

	public VideoPlatFormID(String ip, String port, String username, String password) {
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
			System.out.println("开始登录(身份影像平台)");
			api.login();
			System.out.println("登录成功(身份影像平台)");
			return true;
		} catch (SunTransEngineException e) {
			error.error("影像平台系统登录失败:"+"\r\n"+e.getMessage()+"\r\n");
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
			System.out.println("登出成功(身份影像平台)");
		} catch (SunTransEngineException e) {
			error.error("影像平台系统登出失败:"+"\r\n"+e.getMessage()+"\r\n");
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
			//必传字段,应用号身份证固定为App_0002
			doc.setBusiAttribute("APP_NO", "App_0002");
			//必传字段，客户号，身份证影像的唯一索引
			doc.setBusiAttribute("CONT_ID", bean.getStrCustomerId());
			//必传字段，批次文件数量
			if(imageInfoList !=null && imageInfoList.size() > 0){
				doc.setBusiAttribute(DocKey.AMOUNT, String.valueOf(imageInfoList.size()));
			}else{
				doc.setBusiAttribute(DocKey.AMOUNT, "0");
			}
			//必传字段，业务产生时间
			doc.setBusiAttribute(DocKey.BUSI_START_TIME, bean.getStrBusiStartTime());
            //首次留存身份证件影像网点
			doc.setBusiAttribute("EXIST_BRANCH", "SRCB001");
			//最后更新机构
			doc.setBusiAttribute("LAST_UPDATE_ORG", "SRCB002");
			//最后更新时间
			doc.setBusiAttribute("LAST_UPDATE_DT", bean.getStrLastUpdateTime());

			//必传字段，文档部件名称
			doc.beginFilePart(partName);
			if(imageInfoList !=null && imageInfoList.size() > 0){
				for(int i=0; i<imageInfoList.size(); i++ ){
					VideoPlat entity = (VideoPlat) imageInfoList.get(i);
					String strPicName = entity.getStrFilePath().substring(entity.getStrFilePath().lastIndexOf('/')+1, entity.getStrFilePath().lastIndexOf('.'));
					if(null != strPicName && "" != strPicName && "Card".equals(strPicName)) {
						continue;
					}
					// 开始 设置第一张影像信息
					doc.beginFile();
					// 必传字段，文件格式
					doc.setFileAttribute(DocPartKey.FILE_FORMAT, entity.getStrFilePath().substring(entity.getStrFilePath().lastIndexOf('.')+1, entity.getStrFilePath().length()));
					// 必传字段，文件大小，单位字节
					doc.setFileAttribute(DocPartKey.FILE_SIZE, entity.getStrFileSize());
					// 可选字段，页数
					doc.setFileAttribute("BUSI_FILE_PAGENUM", "1");
					//客户号
					doc.setFileAttribute("CUS_ID" ,bean.getStrCustomerId());
					//证件号码
					doc.setFileAttribute("REF_NO" ,bean.getStrIDCardNum());
					//签发机关
					doc.setFileAttribute("ISSUED_DEP" ,"");//上送中文时使用UTF-8编码，后台解析使用GBK，防止出现乱码，影像提议不上送
					//证件种类
					doc.setFileAttribute("ID_TP_CD" ,"SFZ");
					//有效证件标记
					doc.setFileAttribute("USEFLAG" ,"0");
					//修改标记
					doc.setFileAttribute("MODF" ,"0");
					//前端业务流水号
					doc.setFileAttribute("SERIAL_NO" ,bean.getStrSerialNo());
					//是否开户证件
					doc.setFileAttribute("OPEN_IDENT_IND" ,"0");
					//最后修改时间
					doc.setFileAttribute("LAST_MOD_TIME" ,bean.getStrLastModTime());
					//影像创建时间
					doc.setFileAttribute("DATE" ,bean.getStrDate());
					// 必传信息，文件路径和是否进行MD5校验
					doc.setFile(entity.getStrFilePath(), true);
					//截取上传的文件名称
					doc.setFileAttribute("IMG_ID_NOTE" ,entity.getStrFilePath().substring(entity.getStrFilePath().lastIndexOf('/')+1, entity.getStrFilePath().lastIndexOf('.')));
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
			error.error("影像平台系统上传文件失败:"+"\r\n"+e.getMessage()+"\r\n");
			return false;
		}
	}

	/**
	 * 通过批次号、业务模型号删除文件
	*/
	public boolean deleteBatchFile(VideoPlat bean) {
		try {
			ClientApi api = new ClientApi(ip, port, username, password);
			ECMDoc doc = new ECMDoc();
			//指定要查询的批次号
			doc.setBatchID(bean.getStrBatchId());
			//指定查询批次所属的项类型名称
			doc.setObjName(objName);
			//指定删除标识为逻辑删除
			doc.setOption(OptionKey.LOGICAL_DEL);
			//设置批次号，元数据对象名
			api.del(doc);
			System.out.println("删除成功");
			return true;
		} catch (SunTransEngineException e) {
			error.error("影像平台系统删除失败:"+"\r\n"+e.getMessage()+"\r\n");
			return false;
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
			error.error("影像平台系统查询失败:"+"\r\n"+e.getMessage()+"\r\n");
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
			//上传之前先做查询
			String strQuertDate = queryBatchFile(bean);
			if(strQuertDate != null && !strQuertDate.equals("") && strQuertDate.length() > 50){
                //先做删除后上传
				ret = deleteBatchFile(bean);
				if(ret){
				   //上传文件
				   ret = add(bean,imageInfoList);
				}
			}else{//没有直接上传
				//上传文件
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
}
