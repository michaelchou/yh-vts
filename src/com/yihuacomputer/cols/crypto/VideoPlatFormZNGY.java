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
    //��������������
	private String objName = "ZNGY_DOC";
	//�����ĵ���������
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
	 * ��¼
	 *
	 * @return
	 * @throws SunTransEngineException
	 * @throws IOException
	 */
	public boolean login() {
		ClientApi api = new ClientApi(this.ip, this.port, this.username, this.password);
		try {
			System.out.println("��ʼ��¼(���ܹ�ԱӰ��ƽ̨)");
			api.login();
			System.out.println("��¼�ɹ�(���ܹ�ԱӰ��ƽ̨)");
			return true;
		} catch (SunTransEngineException e) {
			error.error("Ӱ��ƽ̨ϵͳ(���ܹ�Ա)��¼ʧ��:"+"\r\n"+e.getMessage()+"\r\n");
			return false;
		}
	}

	/**
	 * �ǳ�
	 *
	 * @throws SunTransEngineException
	 * @throws IOException
	 */
	public void logOut() {
		ClientApi api = new ClientApi(ip, port, username);
		try {
			api.logout();
			System.out.println("�ǳ��ɹ�(���ܹ�ԱӰ��ƽ̨)");
		} catch (SunTransEngineException e) {
			error.error("Ӱ��ƽ̨ϵͳ(���ܹ�Ա)�ǳ�ʧ��:"+"\r\n"+e.getMessage()+"\r\n");
		}
	}

	/**
	 * �ϴ�
	 */

	public boolean add(VideoPlat bean, List<?> imageInfoList) {
		ClientApi api = new ClientApi(ip, port, username, password);
		try {
			// �������Ϊtrue��ʾ���ļ�����ѹ��
			ECMDoc doc = new ECMDoc();
			//�ش��ֶΣ�����ID��ȷ������Ψһ�ֶΣ��翨��Ψһ�������Ϳ��ţ�
			doc.setBatchID(bean.getStrBatchId());
			//�ش��ֶΣ�����������
			doc.setObjName(objName);
			//�ش��ֶΣ������ļ�����
			if(imageInfoList !=null && imageInfoList.size() > 0){
				doc.setBusiAttribute(DocKey.AMOUNT, String.valueOf(imageInfoList.size()));
			}else{
				doc.setBusiAttribute(DocKey.AMOUNT, "0");
			}
			//�ش��ֶΣ�ҵ�����ʱ��
			doc.setBusiAttribute(DocKey.BUSI_START_TIME, bean.getStrBusiStartTime());

			//�ش��ֶΣ��ĵ���������
			doc.beginFilePart(partName);
			if(imageInfoList !=null && imageInfoList.size() > 0){
				for(int i=0; i<imageInfoList.size(); i++ ){
					VideoPlat entity = (VideoPlat) imageInfoList.get(i);
					// ��ʼ ���õ�һ��Ӱ����Ϣ
					doc.beginFile();
					// �ش��ֶΣ��ļ���ʽ
					doc.setFileAttribute(DocPartKey.FILE_FORMAT, entity.getStrFilePath().substring(entity.getStrFilePath().lastIndexOf('.')+1, entity.getStrFilePath().length()));
					// �ش��ֶΣ��ļ���С����λ�ֽ�
					doc.setFileAttribute(DocPartKey.FILE_SIZE, entity.getStrFileSize());
					// ��ѡ�ֶΣ�ҳ��
					doc.setFileAttribute("BUSI_FILE_PAGENUM", "1");
					// �ش���Ϣ���ļ�·�����Ƿ����MD5У��
					doc.setFile(entity.getStrFilePath(), true);
					//��ȡ�ϴ����ļ�����
					doc.setFileAttribute("BUSI_FILE_TYPE" ,entity.getStrFilePath().substring(entity.getStrFilePath().lastIndexOf('/')+1, entity.getStrFilePath().lastIndexOf('.')));
					// ��������
					doc.endFile();
				}
            }
			doc.endFilePart();
			System.out.println(doc.getDocInfo().asXML());
			System.out.println(api.add(doc));
			System.out.println("�ϴ��ɹ�");
			return true;
		} catch (SunTransEngineException e) {
			error.error("Ӱ��ƽ̨ϵͳ(���ܹ�Ա)�ϴ��ļ�ʧ��:"+"\r\n"+e.getMessage()+"\r\n");
			return false;
		}
	}

	/**
	 * �����ļ�
	 */
	public boolean update(VideoPlat bean, List<?> imageInfoList) {
		ClientApi api = new ClientApi(ip, port, username, password);
		// �������Ϊtrue��ʾ���ļ�����ѹ��
		ECMDoc doc = new ECMDoc();
		try {
			//�ش��ֶΣ�����ID��ȷ������Ψһ�ֶΣ��翨��Ψһ�������Ϳ��ţ�
			doc.setBatchID(bean.getStrBatchId());
			//�ش��ֶΣ�����������
			doc.setObjName(objName);
			//�ش��ֶΣ������ļ�����
			if(imageInfoList !=null && imageInfoList.size() > 0){
				doc.setBusiAttribute(DocKey.AMOUNT, String.valueOf(imageInfoList.size()));
			}else{
				doc.setBusiAttribute(DocKey.AMOUNT, "0");
			}
			//�ش��ֶΣ�ҵ�����ʱ��
			doc.setBusiAttribute(DocKey.BUSI_START_TIME, bean.getStrBusiStartTime());

			//�ش��ֶΣ��ĵ���������
			doc.beginFilePart(partName);
			if(imageInfoList !=null && imageInfoList.size() > 0){
				for(int i=0; i<imageInfoList.size(); i++ ){
					VideoPlat entity = (VideoPlat) imageInfoList.get(i);
					// ��ʼ ���õ�һ��Ӱ����Ϣ
					doc.beginFile();
					// �ش��ֶΣ��ļ���ʽ
					doc.setFileAttribute(DocPartKey.FILE_FORMAT, entity.getStrFilePath().substring(entity.getStrFilePath().lastIndexOf('.')+1, entity.getStrFilePath().length()));
					// �ش��ֶΣ��ļ���С����λ�ֽ�
					doc.setFileAttribute(DocPartKey.FILE_SIZE, entity.getStrFileSize());
					// ��ѡ�ֶΣ�ҳ��
					doc.setFileAttribute("BUSI_FILE_PAGENUM", "1");
					// �ش���Ϣ���ļ�·�����Ƿ����MD5У��
					doc.setFile(entity.getStrFilePath(), true);
					//���±�ʶ
					doc.setUpdateFlag(OptionKey.U_ADD);
					//��ȡ�ϴ����ļ�����
					doc.setFileAttribute("BUSI_FILE_TYPE" ,entity.getStrFilePath().substring(entity.getStrFilePath().lastIndexOf('/')+1, entity.getStrFilePath().lastIndexOf('.')));
					// ��������
					doc.endFile();
				}
            }
			doc.endFilePart();
			//�����Զ�������
//			doc.setUpdateCheckOutAndIn(true, "admin");
			info.info("Ӱ�����");
			api.checkout(doc);
			api.update(doc);
			System.out.println("���³ɹ�");
			return true;
		} catch (SunTransEngineException e) {
			error.error("Ӱ��ƽ̨ϵͳ(���ܹ�Ա)�ϴ��ļ�ʧ��:"+"\r\n"+e.getMessage()+"\r\n");
			return false;
		}finally{
			try {
				info.info("Ӱ����");
				api.checkin(doc);
			} catch (SunTransEngineException e) {
				error.error("Ӱ��ƽ̨ϵͳ(���ܹ�Ա)���ʧ��:"+"\r\n"+e.getMessage()+"\r\n");
			}
		}
	}

	/**
	 * ͨ�����κŲ�ѯ�����µ������ļ�
	 */
	public String queryBatchFile(VideoPlat bean) {
		String strXml ="";
		try {
			ClientApi api = new ClientApi(ip, port, username, password);
			ECMDoc doc = new ECMDoc(false);
			//ָ��Ҫ��ѯ�����κ�
			doc.setBatchID(bean.getStrBatchId());
			//ָ����ѯ��������������������
			doc.setObjName(objName);
			//ָ����ѯ����Ϊ��ѯ�����ļ�
			doc.setOption(OptionKey.QUERY_BATCH_FILE);
			strXml = api.queryFile(doc);
			System.out.println(strXml);
		} catch (SunTransEngineException e) {
			error.error("Ӱ��ƽ̨ϵͳ(���ܹ�Ա)��ѯʧ��:"+"\r\n"+e.getMessage()+"\r\n");
		}
		return strXml;
	}

	/**
	 * Ӱ��ƽ̨�ļ��ϴ�
	 * @param bean
	 * @param imageInfoList
	 * @return
	 */
	public boolean videoPlatUpload(VideoPlat bean, List<?> imageInfoList)
	{
		boolean ret = login();
		if(ret){
			//�Ȳ�ѯһ�£�������ݴ��ڣ�����ø��½ӿ�
			String strQuertDate = queryBatchFile(bean);
			if(strQuertDate != null && !strQuertDate.equals("") && strQuertDate.length() > 50){
			   System.out.println("�����ļ�");
			   //�����ļ�
			   ret = update(bean,imageInfoList);
			}else{
		       //�ϴ��ļ�
				System.out.println("�ϴ��ļ�");
			   ret = add(bean,imageInfoList);
			}
		}
		logOut();
		return ret;
	}

	/**
	 * Ӱ��ƽ̨�ļ���ѯ
	 * @param bean
	 * @param imageInfoList
	 * @return
	 */
	public String videoPlatQuery(VideoPlat bean)
	{
		String strUrlDate ="";
		boolean ret = login();
		if(ret){
		    //�ϴ��ļ�
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
  	    entity.setStrBatchId("0402019133360976");//���κ�
		entity.setStrBusiStartTime("20170607");
		boolean ret = client.videoPlatUpload(entity,imageInfoList);
		if(!ret){
			System.out.println("���ɹ�");
		}
		else{
			System.out.println("�ɹ�");
		}
	}
	public static void main(String[] args) {
		test1();
		//test2();
	}
}
