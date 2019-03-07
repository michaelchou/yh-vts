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

	public boolean isFooter = true;//�Ƿ�Ҫ��ʾ��β��ͼƬ��Ϣ

	// �ն�ʵ�����
    protected Terminal terminal = null;

	public Processor_BusinessApplication() {
		super();
	}

    protected String getTransName()
	{
		return "����ҵ�����뵥";
	}
	/**
	 * <p>
	 * ������
	 * </p>
	 */
	@SuppressWarnings("static-access")
	public void process() throws ProcessorException {
		info.info("��ʼ����ҵ�����뵥"+"\r\n");
		String strHostUrl ="";//������ַ
		Base64 base64 = new Base64();
		String strTerminalNum = MsgXmlDom.getElementValue(domReq,"strTerminalNum");
		this.terminal = new TerminalDB().getEntityByTerminal(strTerminalNum);
		String strHtmlContent = MsgXmlDom.getElementValue(domReq,"htmlstr");//��Ҫ��ҵ�����뵥����ʾ������
		String strBatchId = MsgXmlDom.getElementValue(domReq,"strBatchId");//��ѯ�����κ�
		if(strBatchId == null || strBatchId.equals("")){//Ϊʲô������������Ϊ�еĽ��׸����Ͳ���Ҫ�ϴ�Ӱ���ļ������Ƿ�Ҫ���������뵥
			isFooter = false;
			strBatchId = getTerminalTsn();
		}else{
			isFooter = true;
			//try {
				//InetAddress address = InetAddress.getLocalHost();
				Trial trial = new TrialDB().getTrial(strTerminalNum);
				if (trial != null)//���ð汾
			    {
					strHostUrl = "http://127.0.0.1:17001/trial/File/"+strBatchId+"/";
				}else{//��ʽ�汾
				    strHostUrl = "http://127.0.0.1:17001/formal/File/"+strBatchId+"/";
				}
		    //} catch (UnknownHostException e) {
		    	//error.error("����ҵ�����뵥ʧ��(������Ϣ����):"+ strHostUrl + "\r\n");
		    	//throw new ProcessorException(TERMRETCODE_INNERR,TERMRETDESC_INNERR, TERMRETDESCEN_INNERR);
			//}
				info.info("����ҵ�����뵥·��:"+ strHostUrl + "\r\n");
		}
		String filePath = (getClass().getProtectionDomain().getCodeSource().getLocation().getPath()).substring(1, (getClass().getProtectionDomain().getCodeSource().getLocation().getPath()).indexOf("WEB-INF"));//��ȡ����·��
		filePath = File.separator + filePath + "File" ;//�����ı���·��
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
			error.error("����ҵ�����뵥ʧ��(ҵ����Ϣ����Ϊ��):"+"\r\n");
			throw new ProcessorException(TERMRETCODE_INNERR,TERMRETDESC_INNERR, TERMRETDESCEN_INNERR);
		}
		try {
			strHtmlContent = new String(base64.decode(strHtmlContent),"UTF-8");
		} catch (UnsupportedEncodingException e) {
			error.error("����ҵ�����뵥ʧ��(�ļ�����ת��ʧ��):"+"\r\n");
			throw new ProcessorException(TERMRETCODE_INNERR,"�ϳ�ҵ�����뵥����", TERMRETDESCEN_INNERR);
		}
        String strTable  = "";//�������
        //��һ��:��װ���ı�ͷ����
        strTable = strTable + "<table width=\"1280\" bgcolor=\"#FFFFFF\" border=\"0\">"
	                            +"<tr>"
                                  +"<td colspan=\"4\" width=\"100%\" height=\"120\" align=\"center\"><div style=\"font-size:48px\">�Ϻ�ũ�����и���ҵ�����������</div></td>"
                                +"</tr>"
                                +"<tr height=\"30\">"
                                  +"<td colspan=\"4\"></td>"
                                +"</tr>"
                                +"<tr height=\"30\">"
                                 +"<td colspan=\"4\"></td>"
                                +"</tr>";
        //�ڶ���:��װҵ��������ݲ���
        strTable = strTable + strHtmlContent.replaceAll("<table", "<table style=\"font-size:25px;\"").replaceAll("<TABLE", "<table style=\"font-size:25px;\"");
        //������:��װ���ƾ֤��ʾ����
		String strFooter = "";		//ҵ�����뵥β��ͼƬ����
		if(isFooter){
			strFooter  = "<tr>"
					      +"<td width=\"100%\" colspan=\"4\">"
					       +"<table width=\"100%\" bgcolor=\"#FFFFFF\" border=\"0\">";
			                  File sigFile=new File(filePath+"Signature.jpg");
			                  if(sigFile.exists())
			                  {
	                             strFooter = strFooter+"<tr>"
                                                         +"<td width=\"100%\" colspan=\"4\"><font size=\"25\">�ͻ���дǩ��:</font></td>"
                                                      +"</tr>"
                                                      +"<tr>"
                                                         +"<td width=\"100%\" colspan=\"4\"><img src=\""+strHostUrl+"Signature.jpg\" width=\"1280\" height=\"270\"/></td>"
                                                     +"</tr>";
			                  }
			                  File fingerFile=new File(filePath+"Finger.jpg");
			                  if(fingerFile.exists())
			                  {
	                             strFooter = strFooter+"<tr>"
                                                         +"<td width=\"100%\" colspan=\"4\"><font size=\"25\">�ֳ�ָ����Ƭ:</font></td>"
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
                                                      +"<td width=\"100%\" colspan=\"2\"><font size=\"25\">���֤��ӡ������:</font></td>"
                                                      +"<td width=\"100%\" colspan=\"2\"><font size=\"25\">���֤��ӡ������:</font></td>"
                                                   +"</tr>"
                                                   +"<tr>"
                                                      +"<td width=\"100%\" colspan=\"2\"><img src=\""+strHostUrl+"Front.jpg\" width=\"620\" height=\"400\"/></td>"
                                                      +"<td width=\"100%\" colspan=\"2\"><img src=\""+strHostUrl+"back.jpg\" width=\"620\" height=\"400\"/></td>"
                                                   +"</tr>"
                                                   +"<tr>"
                                                      +"<td width=\"100%\" colspan=\"2\"><font size=\"25\">�����˲���Ƭ:</font></td>"
                                                      +"<td width=\"100%\" colspan=\"2\"><font size=\"25\">�ֳ������Ƭ:</font></td>"
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
                                                      +"<td width=\"100%\" colspan=\"4\" align=\"right\"><font size=\"25\"><strong>��������:</font>"+new DateCtrl().getDateStrSimple()+"</td>"
                                                   +"</tr>"
		                                           +"<tr height=\"30\">"
                                                      +"<td colspan=\"4\"></td>"
                                                   +"</tr>"
                                               +"</table>"
	                                       +"</td>"
	                                  +"</tr>";
		}
		else{//����Ҫ�ϴ�Ӱ���ļ�ʱ,��������
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
                                      +"<td width=\"100%\" colspan=\"4\" align=\"right\"><font size=\"5\"><strong>��������:</font>"+new DateCtrl().getDateStrSimple()+"</td>"
                                   +"</tr>"
                                   +"<tr height=\"30\">"
                                      +"<td colspan=\"4\"></td>"
                                   +"</tr>"
                                 +"</table>"
                               +"</td>"
                            +"</tr>";
		}
		strTable = strTable + strFooter +"</table>";
		//����ʱ�������ҵ�����
		String strtm = "" + new Date().getTime();
		String strSavePath = filePath+"business_"+strtm.substring(strtm.length() - 8, strtm.length())+".png";

		HtmlImageGenerator imageGenerator = new HtmlImageGenerator();
		imageGenerator.loadHtml(strTable);
		imageGenerator.getBufferedImage();
		imageGenerator.saveAsImage(strSavePath);
        //������ɺ���Ҫ�����ϴ���Ӱ��ƽ̨
		info.info("ҵ�����뵥��ʼ�ϴ�"+"\r\n");
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
			error.error("����ҵ�����뵥ʧ��(�Ҳ�����Ӧ��ҵ������ļ�):"+ e.getMessage() + "\r\n");
			throw new ProcessorException(TERMRETCODE_INNERR,TERMRETDESC_INNERR, TERMRETDESCEN_INNERR);
		} catch (IOException e) {
			error.error("����ҵ�����뵥ʧ��(ҵ������ļ�����):"+ e.getMessage() + "\r\n");
			throw new ProcessorException(TERMRETCODE_INNERR,TERMRETDESC_INNERR, TERMRETDESCEN_INNERR);
		}
  	    imageInfoList.add(bean);
  	    VideoPlat entity = new VideoPlat();
  	    String strBusiStartTime = dtCur.getTransDateToView();//ҵ�����ʱ��
		entity.setStrBatchId(strBatchId);//���κ�
		entity.setStrBusiStartTime(strBusiStartTime);
		boolean ret = vpf.videoPlatUpload(entity,imageInfoList);
		if(!ret){
  	      error.error("ҵ������ļ��ϴ�Ӱ��ƽ̨(���ܹ�Ա)ʧ��:"+"\r\n");
  	      throw new ProcessorException(TERMRETCODE_UPLOADFILE,TERMRETDESC_UPLOADFILE, TERMRETDESCEN_UPLOADFILE);
        }
		//д�������ļ�
		boolean bRet =
				// �¼����(Ψһ����)
				writeFile("\"109-" + new DateCtrl().getDateTimeStrSimple3() + "-" + strBatchId + "\","
				// ǰ̨����ϵͳ���
				+ "\"109\","
				// ϵͳ����
				+ "\"ZNGY\","
				// ǰ̨����ϵͳ��ˮ��
				+ "\"" + strBatchId + "\","
				// ��������ϵͳ��ˮ��
				+ ","
				// ǰ̨����ϵͳ���״���
				+ ","
				// ǰ̨����ϵͳ��������
				+ ","
				// ǰ̨����ϵͳ������
				+ "\"" + this.terminal.getStrOrgNum() + "\","
				// ǰ̨����ϵͳ������Ա
				+ "\"" + strTerminalNum + "\","
				// ǰ̨����ϵͳ��Ȩ��Ա
				+ "\"" + strTerminalNum + "\","
				// ת���˻��˺�
				+ ","
				// ת���˻�����
				+ ","
				// ת���˻��˺�
				+ ","
				// ת���˻�����
				+ ","
				// ���׽��
				+ ","
				// ��������
				+ "\"" + new DateCtrl().getDateStrSimple() + "\","
				// ����ʱ��
				+ "\"" + new DateCtrl().getTimeStrSimple() + "\","
				// ƾ֤����
				+ ","
				// ƾ֤����
				+ ","
				// ժҪ
				+ ","
				// ��Ĩ�˱�ʶ
				+ ","
				// ԭ���Ľ�����ˮ��
				+ ","
				// �������ұ�־
				+ ","
				// Ӱ��ƽ̨ID
				+ "\"" + strBatchId + "\"",
				strBatchId);
		if(!bRet){
			error.error("Ӱ���ļ�д���ļ�ʧ��:"+ "\r\n");
		}
		//��ѯ��Ӱ��ƽ̨�����ļ��������ɶ�Ӧ���ļ�����̨
//		VideoPlat videoPlat= new VideoPlat();
//		videoPlat.setStrBatchId(strBatchId);
//		//�ȴ����Ӱ��ƽ̨ȡ�������Ϣ
//		VideoPlatFormID idvpf = new VideoPlatFormID(strVideoPlatIP,strVideoPlatPort,strVideoPlatUser,strVideoPlatPwd);
//		String strQuertDate = idvpf.videoPlatQuery(videoPlat);
//		if(strQuertDate != null && !strQuertDate.equals("") && strQuertDate.length() > 50){
//			try {
//				Document document = DocumentHelper.parseText(strQuertDate);
//				String strNode = "/ROOT/IMAGES/IMAGE";
//				readUrl(strBatchId,document,strNode);
//			} catch (DocumentException e) {
//				error.error("Ӱ���ļ���ѯʧ��:"+ e.getMessage() + "\r\n");
//			}
//		}
//		//�ٴ����ܹ�ԱӰ��ƽ̨ȡ��������Ϣ
// 		VideoPlatFormZNGY  zngyvpf = new VideoPlatFormZNGY(strVideoPlatIP,strVideoPlatPort,strVideoPlatUser,strVideoPlatPwd);
//		strQuertDate = zngyvpf.videoPlatQuery(videoPlat);
//		if(strQuertDate != null && !strQuertDate.equals("") && strQuertDate.length() > 50){
//			try {
//				Document document = DocumentHelper.parseText(strQuertDate);
//				String strNode = "/ROOT/IMAGES/IMAGE";
//				readUrl(strBatchId,document,strNode);
//			} catch (DocumentException e) {
//				error.error("Ӱ���ļ���ѯʧ��(���ܹ�Ա):"+ e.getMessage() + "\r\n");
//			}
//		}
		info.info("ҵ�����뵥��ʼ�ϴ��ɹ�"+"\r\n");
		//���óɹ���Ϣ
		setSucceedRespDom();
	}

	/**
	 * �������κ�ȡ����Ӧ���ļ�·��
	 * @return  �ļ��洢·��
	 */
    public String filePath(String strBatchId)
    {
    	String path = (getClass().getProtectionDomain().getCodeSource().getLocation().getPath()).substring(1, (getClass().getProtectionDomain().getCodeSource().getLocation().getPath()).indexOf("WEB-INF"));//��ȡ����·��
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
	 * ����XML�ļ�
	 * @param name
	 * @param text
	 * @return
	 */
	@SuppressWarnings({ "unchecked", "static-access"})
	public void readUrl(String strBatchId,org.dom4j.Document document,String strNode)
	{
		List<org.dom4j.Element> list = document.selectNodes(strNode); //strNode �ڵ㣬��/ROOT/IMAGES/IMAGE
		for (int i = 0; i < list.size(); i++) {
			org.dom4j.Element element=list.get(i);
			List<org.dom4j.Attribute> listAttr=element.attributes();//��ǰ�ڵ���������Ե�list
			for(Attribute attr:listAttr){//������ǰ�ڵ����������
			     String strName=attr.getName();//��������
				 String strValue=attr.getValue();//���Ե�ֵ
			     if(strName != null && !strName.equals("") && strName.equals("URL")){//���õ������������Ҫ��ʱ�����޸�
			    	 //������д�뵽�ļ���
			    	 boolean bRet = writeFile(strBatchId + "," + new MsgXmlDom().decodeXml(strValue), strBatchId);
			    	 if(!bRet){
			    		 error.error("Ӱ���ļ�д���ļ�ʧ��:"+ "\r\n");
			    	 }
			     }
			}
		}
	}
    /**
	 * д�ļ�
	 * @return
	 */
	public boolean writeFile(String strContent, String strImageID)
	{
//		 String path = (getClass().getProtectionDomain().getCodeSource().getLocation().getPath()).substring(1, (getClass().getProtectionDomain().getCodeSource().getLocation().getPath()).indexOf("WEB-INF"));//��ȡ����·��
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
	  		  error.error("Ӱ���ļ�д���ļ�ʧ��:"+ e.getMessage() + "\r\n");
	  	 }
	  	 return false;
	 }
}
