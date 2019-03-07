package com.yihuacomputer.cols.crypto;
import java.io.IOException;
import java.util.ArrayList;
import java.util.List;

import org.dom4j.Document;
import org.dom4j.DocumentException;
import org.dom4j.DocumentHelper;
import org.dom4j.Element;

import com.sunyard.TransEngine.client.ClientApi;
import com.sunyard.TransEngine.doc.ECMDoc;
import com.sunyard.TransEngine.exception.SunTransEngineException;
import com.sunyard.TransEngine.util.OptionKey;
import com.sunyard.TransEngine.util.key.DocKey;
import com.sunyard.TransEngine.util.key.DocPartKey;


public class ID_Client {
	private String ip = "";
	private String port = "";
	private String username = "";
	private String password = "";
    //身份证项类型名称
	private String objName = "ID_DOC";
	//身份证文档部件名称
	private String partName = "ID_PART";

	public ID_Client(String ip, String port, String username, String password) {
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
	public void login() {
		ClientApi api = new ClientApi(ip, port, username, password);
		try {
			api.login();
			System.out.println("登录成功");
		} catch (SunTransEngineException e) {
			e.printStackTrace();
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
			System.out.println("登出成功");
		} catch (SunTransEngineException e) {
			e.printStackTrace();
		}
	}

	/**
	 * 上传
	 */

	public void add() {
		ClientApi api = new ClientApi(ip, port, username, password);
		try {
			// 如果设置为true表示对文件进行压缩
			ECMDoc doc = new ECMDoc();
			doc.setBatchID("0402019133360976");
			//必传字段，项类型名称
			doc.setObjName(objName);
			//必传字段,应用号身份证固定为App_0002
			doc.setBusiAttribute("APP_NO", "App_0002");
			//必传字段，客户号，身份证影像的唯一索引
			doc.setBusiAttribute("CONT_ID", "001042529368");
			//必传字段，批次文件数量
			doc.setBusiAttribute(DocKey.AMOUNT, "1");
			//必传字段，业务产生时间
			doc.setBusiAttribute(DocKey.BUSI_START_TIME, "20170426");
            //首次留存身份证件影像网点
			doc.setBusiAttribute("EXIST_BRANCH", "SRCB001");
			//最后更新机构
			doc.setBusiAttribute("LAST_UPDATE_ORG", "SRCB002");
			//最后更新时间
			doc.setBusiAttribute("LAST_UPDATE_DT", "20170426185615");

			//必传字段，文档部件名称
			doc.beginFilePart(partName);

			// 开始 设置第一张影像信息
			doc.beginFile();
			// 必传字段，文件格式
			doc.setFileAttribute(DocPartKey.FILE_FORMAT, "jpg");
			// 必传字段，文件大小，单位字节
			doc.setFileAttribute(DocPartKey.FILE_SIZE, "1332383");
			// 可选字段，页数
			doc.setFileAttribute("BUSI_FILE_PAGENUM", "1");
			//客户号
			doc.setFileAttribute("CUS_ID" ,"001042529368");
			//证件号码
			doc.setFileAttribute("REF_NO" ,"32012119810717291X");
			//签发机关
			doc.setFileAttribute("ISSUED_DEP" ,"南京市公安局江宁分局");
			//证件种类
			doc.setFileAttribute("ID_TP_CD" ,"SFZ");
			//有效证件标记
			doc.setFileAttribute("USEFLAG" ,"1");
			//修改标记
			doc.setFileAttribute("MODF" ,"0");
			//前端业务流水号
			doc.setFileAttribute("SERIAL_NO" ,"20170426001");
			//是否开户证件
			doc.setFileAttribute("OPEN_IDENT_IND" ,"0");
			//最后修改时间
			doc.setFileAttribute("LAST_MOD_TIME" ,"20170426");
			//影像创建时间
			doc.setFileAttribute("DATE" ,"20170426");
			// 必传信息，文件路径和是否进行MD5校验
			doc.setFile("D:\\0402019133360976\\Card.jpg", true);
			doc.setFileAttribute("IMG_ID_NOTE" ,"Card");
			// 结束设置
			doc.endFile();

			// 开始 设置第一张影像信息
			doc.beginFile();
			// 必传字段，文件格式
			doc.setFileAttribute(DocPartKey.FILE_FORMAT, "bmp");
			// 必传字段，文件大小，单位字节
			doc.setFileAttribute(DocPartKey.FILE_SIZE, "1332383");
			// 可选字段，页数
			doc.setFileAttribute("BUSI_FILE_PAGENUM", "1");
			//客户号
			doc.setFileAttribute("CUS_ID" ,"001042529368");
			//证件号码
			doc.setFileAttribute("REF_NO" ,"32012119810717291X");
			//签发机关
			doc.setFileAttribute("ISSUED_DEP" ,"南京市公安局江宁分局");
			//证件种类
			doc.setFileAttribute("ID_TP_CD" ,"SFZ");
			//有效证件标记
			doc.setFileAttribute("USEFLAG" ,"1");
			//修改标记
			doc.setFileAttribute("MODF" ,"0");
			//前端业务流水号
			doc.setFileAttribute("SERIAL_NO" ,"20170426001");
			//是否开户证件
			doc.setFileAttribute("OPEN_IDENT_IND" ,"0");
			//最后修改时间
			doc.setFileAttribute("LAST_MOD_TIME" ,"20170426");
			//影像创建时间
			doc.setFileAttribute("DATE" ,"20170426");
			// 必传信息，文件路径和是否进行MD5校验
			doc.setFile("D:\\0402019133360976\\back.jpg", true);
			doc.setFileAttribute("IMG_ID_NOTE" ,"back");
			// 结束设置
			doc.endFile();

			// 开始 设置第一张影像信息
			doc.beginFile();
			// 必传字段，文件格式
			doc.setFileAttribute(DocPartKey.FILE_FORMAT, "bmp");
			// 必传字段，文件大小，单位字节
			doc.setFileAttribute(DocPartKey.FILE_SIZE, "1332383");
			// 可选字段，页数
			doc.setFileAttribute("BUSI_FILE_PAGENUM", "1");
			//客户号
			doc.setFileAttribute("CUS_ID" ,"001042529368");
			//证件号码
			doc.setFileAttribute("REF_NO" ,"32012119810717291X");
			//签发机关
			doc.setFileAttribute("ISSUED_DEP" ,"南京市公安局江宁分局");
			//证件种类
			doc.setFileAttribute("ID_TP_CD" ,"SFZ");
			//有效证件标记
			doc.setFileAttribute("USEFLAG" ,"1");
			//修改标记
			doc.setFileAttribute("MODF" ,"0");
			//前端业务流水号
			doc.setFileAttribute("SERIAL_NO" ,"20170426001");
			//是否开户证件
			doc.setFileAttribute("OPEN_IDENT_IND" ,"0");
			//最后修改时间
			doc.setFileAttribute("LAST_MOD_TIME" ,"20170426");
			//影像创建时间
			doc.setFileAttribute("DATE" ,"20170426");
			// 必传信息，文件路径和是否进行MD5校验
			doc.setFile("D:\\0402019133360976\\Front.jpg", true);
			doc.setFileAttribute("IMG_ID_NOTE" ,"Front");
			// 结束设置
			doc.endFile();

			doc.endFilePart();
			System.out.println(doc.getDocInfo().asXML());
			System.out.println(api.add(doc));
			System.out.println("上传成功");
		} catch (SunTransEngineException e) {
			e.printStackTrace();
		}
	}

	/**
	 * 通过批次号查询批次下的所有文件
	 */
	public void queryBatchFile() {
		try {
			ClientApi api = new ClientApi(ip, port, username, password);
			ECMDoc doc = new ECMDoc(false);
			//指定要查询的批次号
			doc.setBatchID("0402040A54714357");
			//指定查询批次所属的项类型名称
			doc.setObjName(objName);
			//指定查询类型为查询批次文件
			doc.setOption(OptionKey.QUERY_BATCH_FILE);
			String string = api.queryFile(doc);
			System.out.println(string);
		} catch (SunTransEngineException e) {
			e.printStackTrace();
		}
	}

	/**
	 * 通过批次号、业务模型号删除文件
	*/
	public void deleteBatchFile() {
		try {
			ClientApi api = new ClientApi(ip, port, username, password);
			ECMDoc doc = new ECMDoc();
			//指定要查询的批次号
			doc.setBatchID("0402019133360973");
			//指定查询批次所属的项类型名称
			doc.setObjName(objName);
			//指定删除标识为逻辑删除
			doc.setOption(OptionKey.LOGICAL_DEL);
			//设置批次号，元数据对象名
			api.del(doc);
			System.out.println("删除成功");
		} catch (SunTransEngineException e) {
			e.printStackTrace();
		}
	}
	public void deleteBatchFile(String batchId) {
		try {
			ClientApi api = new ClientApi(ip, port, username, password);
			ECMDoc doc = new ECMDoc();
			//指定要查询的批次号
			doc.setBatchID(batchId);
			//指定查询批次所属的项类型名称
			doc.setObjName(objName);
			//指定删除标识为逻辑删除
			doc.setOption(OptionKey.LOGICAL_DEL);
			//设置批次号，元数据对象名
			api.del(doc);
			System.out.println("删除成功");
		} catch (SunTransEngineException e) {
			e.printStackTrace();
		}
	}

	/**
	 * 高级搜索,获取批次号
	 */
	public void heightQuery() {
		try {
			ClientApi api = new ClientApi(ip, port, username, password);
			ECMDoc doc = new ECMDoc(false);
			// 设置元数据对象名
			doc.setObjName(objName);
			//通过客户号查询批次
			doc.setBusiAttribute("CONT_ID", "000001574680");
			//指定高级搜索查询标示
			doc.setOption(OptionKey.HEIGHT_QUERY);
			String string = api.queryBatch(doc);
			System.out.println(string);
		} catch (SunTransEngineException e) {
			e.printStackTrace();
		}
	}
	/**
	 * 高级搜索,获取批次号
	 */
	public String heightQuery(String customerId) {
		try {
			ClientApi api = new ClientApi(ip, port, username, password);
			ECMDoc doc = new ECMDoc(false);
			// 设置元数据对象名
			doc.setObjName(objName);
			//通过客户号查询批次
			doc.setBusiAttribute("CONT_ID",customerId);
			//指定高级搜索查询标示
			doc.setOption(OptionKey.HEIGHT_QUERY);
			String string = api.queryBatch(doc);
			System.out.println(string);
			return string;
		} catch (SunTransEngineException e) {
			e.printStackTrace();
		}
		
		return "";
	}

	public static void main(String[] args) {
		ID_Client client = new ID_Client("10.20.146.164", "8021", "admin", "111");
		client.login();
		//上传
		//client.add();
		//查询
//		client.queryBatchFile();
		//删除
		//client.deleteBatchFile();
		//高级查询
		//client.heightQuery();
		
		//删除同客户号下所有BatchId下的图片
		//String xmlStr = "<?xml version=\"1.0\" encoding=\"UTF-8\"?> <ROOT> <FATHER_OBJECT_NAME> <OBJECT_NAME/> </FATHER_OBJECT_NAME> <BATCHS> <BATCH BATCH_STATUS=\"1\" LAST_UPDATE_ORG=\"SRCB002\" APP_NO=\"App_0002\" EXIST_BRANCH=\"SRCB001\" AMOUNT=\"3\" LAST_UPDATE_DT=\"20350930105543\" BUSI_START_TIME=\"2035-09-30\" BATCH_ID=\"0405180433743745\" CONT_ID=\"001043353709\" UPLOAD_TIME=\"20170801104328\" S_VERSION=\"1\"/> <BATCH BATCH_STATUS=\"1\" LAST_UPDATE_ORG=\"SRCB002\" APP_NO=\"App_0002\" EXIST_BRANCH=\"SRCB001\" AMOUNT=\"3\" LAST_UPDATE_DT=\"20350930111407\" BUSI_START_TIME=\"2035-09-30\" BATCH_ID=\"0405180434847634\" CONT_ID=\"001043353709\" UPLOAD_TIME=\"20170801110152\" S_VERSION=\"1\"/> </BATCHS> </ROOT>";
//		String xmlStr = client.heightQuery("001043348597");
//		List<String> list = client.paserBatchId(xmlStr);
//		System.out.println(list.size());
//		Date a = new Date();
//		for(int i = 0; i < list.size(); i++){
//			System.out.println("==>" + i + "   " + list.get(i));
//			client.deleteBatchFile(list.get(i));
//		}
//		Date a2 = new Date();
//		System.out.println(a2.getTime() - a.getTime());
		
		client.logOut();
	}
	
	
	/**
	 * 解析batch_id
	 * @param xmlStr
	 * @return
	 */
	public  List<String> paserBatchId(String xmlStr ){
		List<String> batchs = new ArrayList<String>(); 
		Document document;
		try {
			document = DocumentHelper.parseText(xmlStr);
			@SuppressWarnings("unchecked")
			List<Element> list = document.selectNodes("ROOT/BATCHS/BATCH"); 
			for (int i = 0; i < list.size(); i++) {
				org.dom4j.Element element=(org.dom4j.Element)list.get(i);
				batchs.add(element.attribute("BATCH_ID").getText());
			}
			
		} catch (DocumentException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
		
		return batchs;
	
	}

}
