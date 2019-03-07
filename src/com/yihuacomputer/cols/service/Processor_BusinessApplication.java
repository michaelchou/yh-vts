package com.yihuacomputer.cols.service;


import gui.ava.html.image.generator.HtmlImageGenerator;

import java.io.BufferedReader;
import java.io.File;
import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.io.FileReader;
import java.io.FileWriter;
import java.io.IOException;
import java.io.InputStreamReader;
import java.io.UnsupportedEncodingException;
//import java.net.InetAddress;
//import java.net.UnknownHostException;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;

import org.apache.log4j.Logger;
import org.dom4j.Attribute;
//import org.dom4j.Document;
//import org.dom4j.DocumentException;
//import org.dom4j.DocumentHelper;



import com.yihuacomputer.cols.crypto.Base64;
//import com.yihuacomputer.cols.crypto.VideoPlatFormID;
import com.yihuacomputer.cols.crypto.VideoPlatFormZNGY;
import com.yihuacomputer.cols.database.MiscDB;
import com.yihuacomputer.cols.database.TerminalDB;
import com.yihuacomputer.cols.database.TrialDB;
import com.yihuacomputer.cols.entity.Terminal;
import com.yihuacomputer.cols.entity.Trial;
import com.yihuacomputer.cols.entity.VideoPlat;
import com.yihuacomputer.cols.util.DateCtrl;
import com.yihuacomputer.cols.util.MsgXmlDom;

public class Processor_BusinessApplication extends Processor {

	public Logger error = Logger.getLogger("Error");
	public Logger info = Logger.getLogger("Info");

	public boolean isFooter = true;//是否要显示表尾的图片信息

	// 终端实体对象
    protected Terminal terminal = null;

	public Processor_BusinessApplication() {
		super();
	}

    protected String getTransName()
	{
		return "生成业务申请单";
	}
	/**
	 * <p>
	 * 服务处理
	 * </p>
	 */
	@SuppressWarnings("static-access")
	public void process() throws ProcessorException {
		info.info("开始生成业务申请单"+"\r\n");
		String strHostUrl ="";//主机地址
		Base64 base64 = new Base64();
		String strTerminalNum = MsgXmlDom.getElementValue(domReq,"strTerminalNum");
		this.terminal = new TerminalDB().getEntityByTerminal(strTerminalNum);
		String strHtmlContent = MsgXmlDom.getElementValue(domReq,"htmlstr");//需要在业务申请单中显示的内容
		String strBatchId = MsgXmlDom.getElementValue(domReq,"strBatchId");//查询的批次号
		if(strBatchId == null || strBatchId.equals("")){//为什么这样做？是因为有的交易根本就不需要上传影像文件，但是非要生成月申请单
			isFooter = false;
			strBatchId = getTerminalTsn();
		}else{
			isFooter = true;
			//try {
				//InetAddress address = InetAddress.getLocalHost();
				Trial trial = new TrialDB().getTrial(strTerminalNum);
				if (trial != null)//试用版本
			    {
					strHostUrl = "http://127.0.0.1:17001/trial/File/"+strBatchId+"/";
				}else{//正式版本
				    strHostUrl = "http://127.0.0.1:17001/formal/File/"+strBatchId+"/";
				}
		    //} catch (UnknownHostException e) {
		    	//error.error("生成业务申请单失败(主机信息有误):"+ strHostUrl + "\r\n");
		    	//throw new ProcessorException(TERMRETCODE_INNERR,TERMRETDESC_INNERR, TERMRETDESCEN_INNERR);
			//}
				info.info("生成业务申请单路径:"+ strHostUrl + "\r\n");
		}
		String filePath = (getClass().getProtectionDomain().getCodeSource().getLocation().getPath()).substring(1, (getClass().getProtectionDomain().getCodeSource().getLocation().getPath()).indexOf("WEB-INF"));//获取工程路径
		filePath = File.separator + filePath + "File" ;//完整的保存路径
        File dir = new File(filePath);
        if (!dir.exists()) {
        	dir.mkdir();
        }
        filePath = filePath + File.separator + strBatchId + File.separator;
		dir = new File(filePath);
        if (!dir.exists()) {
        	dir.mkdir();
        }
		if(strHtmlContent == null || strHtmlContent.equals("")){
			error.error("生成业务申请单失败(业务信息不能为空):"+"\r\n");
			throw new ProcessorException(TERMRETCODE_INNERR,TERMRETDESC_INNERR, TERMRETDESCEN_INNERR);
		}
		try {
			strHtmlContent = new String(base64.decode(strHtmlContent),"UTF-8");
		} catch (UnsupportedEncodingException e) {
			error.error("生成业务申请单失败(文件编码转换失败):"+"\r\n");
			throw new ProcessorException(TERMRETCODE_INNERR,"合成业务申请单错误！", TERMRETDESCEN_INNERR);
		}
        String strTable  = "";//表格内容
        //第一步:组装表格的表头部分
        strTable = strTable + "<table width=\"1280\" bgcolor=\"#FFFFFF\" border=\"0\">"
	                            +"<tr>"
                                  +"<td colspan=\"4\" width=\"100%\" height=\"120\" align=\"center\"><div style=\"font-size:48px\">上海农商银行个人业务电子申请书</div></td>"
                                +"</tr>"
                                +"<tr height=\"30\">"
                                  +"<td colspan=\"4\"></td>"
                                +"</tr>"
                                +"<tr height=\"30\">"
                                 +"<td colspan=\"4\"></td>"
                                +"</tr>";
        //第二步:组装业务办理内容部分
        strTable = strTable + strHtmlContent.replaceAll("<table", "<table style=\"font-size:25px;\"").replaceAll("<TABLE", "<table style=\"font-size:25px;\"");
        //第三步:组装相关凭证显示部分
		String strFooter = "";		//业务申请单尾部图片部分
		if(isFooter){
			strFooter  = "<tr>"
					      +"<td width=\"100%\" colspan=\"4\">"
					       +"<table width=\"100%\" bgcolor=\"#FFFFFF\" border=\"0\">";
			                  File sigFile=new File(filePath+"Signature.jpg");
			                  if(sigFile.exists())
			                  {
	                             strFooter = strFooter+"<tr>"
                                                         +"<td width=\"100%\" colspan=\"4\"><font size=\"25\">客户手写签名:</font></td>"
                                                      +"</tr>"
                                                      +"<tr>"
                                                         +"<td width=\"100%\" colspan=\"4\"><img src=\""+strHostUrl+"Signature.jpg\" width=\"1280\" height=\"270\"/></td>"
                                                     +"</tr>";
			                  }
			                  File fingerFile=new File(filePath+"Finger.jpg");
			                  if(fingerFile.exists())
			                  {
	                             strFooter = strFooter+"<tr>"
                                                         +"<td width=\"100%\" colspan=\"4\"><font size=\"25\">现场指纹照片:</font></td>"
                                                      +"</tr>"
                                                      +"<tr>"
                                                         +"<td width=\"100%\" colspan=\"4\">&nbsp;&nbsp;<img src=\""+strHostUrl+"Finger.jpg\" width=\"182\" height=\"250\"/></td>"
                                                      +"</tr>";
			                  }
			                  File frontFile=new File(filePath+"Front.jpg");
			                  if(frontFile.exists())
			                  {
	                             strFooter = strFooter+"<tr height=\"30\">"
                                                      +"<td colspan=\"4\"><hr></td>"
                                                   +"</tr>"
                                                   +"<tr>"
                                                      +"<td width=\"100%\" colspan=\"2\"><font size=\"25\">身份证复印件正面:</font></td>"
                                                      +"<td width=\"100%\" colspan=\"2\"><font size=\"25\">身份证复印件反面:</font></td>"
                                                   +"</tr>"
                                                   +"<tr>"
                                                      +"<td width=\"100%\" colspan=\"2\"><img src=\""+strHostUrl+"Front.jpg\" width=\"620\" height=\"400\"/></td>"
                                                      +"<td width=\"100%\" colspan=\"2\"><img src=\""+strHostUrl+"back.jpg\" width=\"620\" height=\"400\"/></td>"
                                                   +"</tr>"
                                                   +"<tr>"
                                                      +"<td width=\"100%\" colspan=\"2\"><font size=\"25\">联网核查照片:</font></td>"
                                                      +"<td width=\"100%\" colspan=\"2\"><font size=\"25\">现场审核照片:</font></td>"
                                                   +"</tr>"
                                                   +"<tr>"
                                                      +"<td width=\"100%\" colspan=\"2\"><img src=\""+strHostUrl+"check.jpg\" width=\"338\" height=\"400\"/></td>"
                                                      +"<td width=\"100%\" colspan=\"2\"><img src=\""+strHostUrl+"cameras.jpg\" width=\"620\" height=\"400\"/></td>"
                                                   +"</tr>";
			                  }
			                  strFooter = strFooter+"<tr height=\"30\">"
                                                      +"<td colspan=\"4\"><hr></td>"
                                                   +"</tr>"
                                                   +"<tr>"
                                                      +"<td width=\"100%\" colspan=\"4\" align=\"right\"><font size=\"25\"><strong>办理日期:</font>"+new DateCtrl().getDateStrSimple()+"</td>"
                                                   +"</tr>"
		                                           +"<tr height=\"30\">"
                                                      +"<td colspan=\"4\"></td>"
                                                   +"</tr>"
                                               +"</table>"
	                                       +"</td>"
	                                  +"</tr>";
		}
		else{//不需要上传影像文件时,单独处理
				strFooter  = "<tr>"
						      +"<td width=\"100%\" colspan=\"4\">"
						        +"<table width=\"1024\" bgcolor=\"#FFFFFF\" border=\"0\">"
                                   +"<tr height=\"30\">"
                                      +"<td colspan=\"4\"></td>"
                                   +"</tr>"
                                   +"<tr height=\"30\">"
                                      +"<td colspan=\"4\"><hr></td>"
                                   +"</tr>"
                                   +"<tr>"
                                      +"<td width=\"100%\" colspan=\"4\" align=\"right\"><font size=\"5\"><strong>办理日期:</font>"+new DateCtrl().getDateStrSimple()+"</td>"
                                   +"</tr>"
                                   +"<tr height=\"30\">"
                                      +"<td colspan=\"4\"></td>"
                                   +"</tr>"
                                 +"</table>"
                               +"</td>"
                            +"</tr>";
		}
		strTable = strTable + strFooter +"</table>";
		//根据时间戳生成业务办理单
		String strtm = "" + new Date().getTime();
		String strSavePath = filePath+"business_"+strtm.substring(strtm.length() - 8, strtm.length())+".png";

		HtmlImageGenerator imageGenerator = new HtmlImageGenerator();
		imageGenerator.loadHtml(strTable);
		imageGenerator.getBufferedImage();
		imageGenerator.saveAsImage(strSavePath);
        //生产完成后，需要进行上传至影像平台
		info.info("业务申请单开始上传"+"\r\n");
		String strVideoPlatIP = new MiscDB().get("00001", "VideoPlatIP", "");
		String strVideoPlatPort = new MiscDB().get("00001", "VideoPlatPort", "");
		String strVideoPlatUser = new MiscDB().get("00001", "VideoPlatUser", "");
		String strVideoPlatPwd = new MiscDB().get("00001", "VideoPlatPwd", "");
		VideoPlatFormZNGY vpf = new VideoPlatFormZNGY(strVideoPlatIP,strVideoPlatPort,strVideoPlatUser,strVideoPlatPwd);
		List<VideoPlat> imageInfoList = new ArrayList<VideoPlat>();
		VideoPlat bean = new VideoPlat();
  	    bean.setStrFilePath(strSavePath);
  	    try {
  	    	bean.setStrFileSize(String.valueOf(new FileInputStream(new File(strSavePath)).available()));
		} catch (FileNotFoundException e) {
			error.error("生成业务申请单失败(找不到对应的业务电子文件):"+ e.getMessage() + "\r\n");
			throw new ProcessorException(TERMRETCODE_INNERR,TERMRETDESC_INNERR, TERMRETDESCEN_INNERR);
		} catch (IOException e) {
			error.error("生成业务申请单失败(业务电子文件错误):"+ e.getMessage() + "\r\n");
			throw new ProcessorException(TERMRETCODE_INNERR,TERMRETDESC_INNERR, TERMRETDESCEN_INNERR);
		}
  	    imageInfoList.add(bean);
  	    VideoPlat entity = new VideoPlat();
  	    String strBusiStartTime = dtCur.getTransDateToView();//业务产生时间
		entity.setStrBatchId(strBatchId);//批次号
		entity.setStrBusiStartTime(strBusiStartTime);
		boolean ret = vpf.videoPlatUpload(entity,imageInfoList);
		if(!ret){
  	      error.error("业务电子文件上传影像平台(智能柜员)失败:"+"\r\n");
  	      throw new ProcessorException(TERMRETCODE_UPLOADFILE,TERMRETDESC_UPLOADFILE, TERMRETDESCEN_UPLOADFILE);
        }
		//写入日终文件
		boolean bRet =
				// 事件编号(唯一索引)
				writeFile("\"109-" + new DateCtrl().getDateTimeStrSimple3() + "-" + strBatchId + "\","
				// 前台操作系统编号
				+ "\"109\","
				// 系统名称
				+ "\"ZNGY\","
				// 前台操作系统流水号
				+ "\"" + strBatchId + "\","
				// 核心账务系统流水号
				+ ","
				// 前台操作系统交易代码
				+ ","
				// 前台操作系统交易名称
				+ ","
				// 前台操作系统机构号
				+ "\"" + this.terminal.getStrOrgNum() + "\","
				// 前台操作系统操作柜员
				+ "\"" + strTerminalNum + "\","
				// 前台操作系统授权柜员
				+ "\"" + strTerminalNum + "\","
				// 转出账户账号
				+ ","
				// 转出账户户名
				+ ","
				// 转入账户账号
				+ ","
				// 转入账户户名
				+ ","
				// 交易金额
				+ ","
				// 交易日期
				+ "\"" + new DateCtrl().getDateStrSimple() + "\","
				// 交易时间
				+ "\"" + new DateCtrl().getTimeStrSimple() + "\","
				// 凭证种类
				+ ","
				// 凭证号码
				+ ","
				// 摘要
				+ ","
				// 冲抹账标识
				+ ","
				// 原核心交易流水号
				+ ","
				// 附件勾兑标志
				+ ","
				// 影像平台ID
				+ "\"" + strBatchId + "\"",
				strBatchId);
		if(!bRet){
			error.error("影像文件写入文件失败:"+ "\r\n");
		}
		//查询出影像平台所有文件，并生成对应的文件给中台
//		VideoPlat videoPlat= new VideoPlat();
//		videoPlat.setStrBatchId(strBatchId);
//		//先从身份影像平台取出身份信息
//		VideoPlatFormID idvpf = new VideoPlatFormID(strVideoPlatIP,strVideoPlatPort,strVideoPlatUser,strVideoPlatPwd);
//		String strQuertDate = idvpf.videoPlatQuery(videoPlat);
//		if(strQuertDate != null && !strQuertDate.equals("") && strQuertDate.length() > 50){
//			try {
//				Document document = DocumentHelper.parseText(strQuertDate);
//				String strNode = "/ROOT/IMAGES/IMAGE";
//				readUrl(strBatchId,document,strNode);
//			} catch (DocumentException e) {
//				error.error("影像文件查询失败:"+ e.getMessage() + "\r\n");
//			}
//		}
//		//再从智能柜员影像平台取出其他信息
// 		VideoPlatFormZNGY  zngyvpf = new VideoPlatFormZNGY(strVideoPlatIP,strVideoPlatPort,strVideoPlatUser,strVideoPlatPwd);
//		strQuertDate = zngyvpf.videoPlatQuery(videoPlat);
//		if(strQuertDate != null && !strQuertDate.equals("") && strQuertDate.length() > 50){
//			try {
//				Document document = DocumentHelper.parseText(strQuertDate);
//				String strNode = "/ROOT/IMAGES/IMAGE";
//				readUrl(strBatchId,document,strNode);
//			} catch (DocumentException e) {
//				error.error("影像文件查询失败(智能柜员):"+ e.getMessage() + "\r\n");
//			}
//		}
		info.info("业务申请单开始上传成功"+"\r\n");
		//设置成功信息
		setSucceedRespDom();
	}

	/**
	 * 根据批次号取出对应的文件路径
	 * @return  文件存储路劲
	 */
    public String filePath(String strBatchId)
    {
    	String path = (getClass().getProtectionDomain().getCodeSource().getLocation().getPath()).substring(1, (getClass().getProtectionDomain().getCodeSource().getLocation().getPath()).indexOf("WEB-INF"));//获取工程路径
    	String classpath= File.separator + path+"File";
		StringBuffer filePath = new StringBuffer(64);
        filePath.append(classpath);
        filePath.append(File.separator);
        filePath.append(strBatchId);
        filePath.append(File.separator);
        path = filePath.toString();
        return path;
    }

    /**
	 * 解析XML文件
	 * @param name
	 * @param text
	 * @return
	 */
	@SuppressWarnings({ "unchecked", "static-access"})
	public void readUrl(String strBatchId,org.dom4j.Document document,String strNode)
	{
		List<org.dom4j.Element> list = document.selectNodes(strNode); //strNode 节点，如/ROOT/IMAGES/IMAGE
		for (int i = 0; i < list.size(); i++) {
			org.dom4j.Element element=list.get(i);
			List<org.dom4j.Attribute> listAttr=element.attributes();//当前节点的所有属性的list
			for(Attribute attr:listAttr){//遍历当前节点的所有属性
			     String strName=attr.getName();//属性名称
				 String strValue=attr.getValue();//属性的值
			     if(strName != null && !strName.equals("") && strName.equals("URL")){//先用到这个后期有需要的时候再修改
			    	 //把数据写入到文件中
			    	 boolean bRet = writeFile(strBatchId + "," + new MsgXmlDom().decodeXml(strValue), strBatchId);
			    	 if(!bRet){
			    		 error.error("影像文件写入文件失败:"+ "\r\n");
			    	 }
			     }
			}
		}
	}
    /**
	 * 写文件
	 * @return
	 */
	public boolean writeFile(String strContent, String strImageID)
	{
//		 String path = (getClass().getProtectionDomain().getCodeSource().getLocation().getPath()).substring(1, (getClass().getProtectionDomain().getCodeSource().getLocation().getPath()).indexOf("WEB-INF"));//获取工程路径
//    	 String strDirPath= File.separator + path+"File" + File.separator + "DaySchedule";
    	 String strDirPath= File.separator + "home" + File.separator + "its" + File.separator + "ImageDaySchedule";
    	 String strFilePath = strDirPath + File.separator + "transflow_ai_" + new DateCtrl().getTransDateToView() + ".del";
	  	 try
	  	 {
	  			File dir = new File(strDirPath);
	  			File file = new File(strFilePath);
	  			if (dir.isDirectory() || dir.mkdir())
	  			{
		  			if (dir.isDirectory() || dir.mkdir())
		  			{
		  				if(file.isFile() && file.exists()) {
		  					BufferedReader bufferedReader = null;
							InputStreamReader read = new InputStreamReader(new FileInputStream(file));
		  					bufferedReader = new BufferedReader(read);
		  					String lineTxt = "";
		  					while((lineTxt = bufferedReader.readLine()) != null) {
		  						if(lineTxt.indexOf(strImageID) != -1) {
		  							read.close();
		  							bufferedReader.close();
		  							return true;
		  						}
		  					}
		  					read.close();
  							bufferedReader.close();
		  					FileWriter fw = new FileWriter(strFilePath, true);
			  				fw.write(strContent+"\r\n");
			  				fw.close();
			  				return true;
		  				}else {
		  					FileWriter fw = new FileWriter(strFilePath, true);
			  				fw.write(strContent+"\r\n");
			  				fw.close();
			  				return true;
		  				}
		  			}
	  			}
	  	 }
	  	 catch (Exception e)
	  	 {
	  		  error.error("影像文件写入文件失败:"+ e.getMessage() + "\r\n");
	  	 }
	  	 return false;
	 }
}
