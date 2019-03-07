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
    //���֤����������
	private String objName = "ID_DOC";
	//���֤�ĵ���������
	private String partName = "ID_PART";

	public ID_Client(String ip, String port, String username, String password) {
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
	public void login() {
		ClientApi api = new ClientApi(ip, port, username, password);
		try {
			api.login();
			System.out.println("��¼�ɹ�");
		} catch (SunTransEngineException e) {
			e.printStackTrace();
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
			System.out.println("�ǳ��ɹ�");
		} catch (SunTransEngineException e) {
			e.printStackTrace();
		}
	}

	/**
	 * �ϴ�
	 */

	public void add() {
		ClientApi api = new ClientApi(ip, port, username, password);
		try {
			// �������Ϊtrue��ʾ���ļ�����ѹ��
			ECMDoc doc = new ECMDoc();
			doc.setBatchID("0402019133360976");
			//�ش��ֶΣ�����������
			doc.setObjName(objName);
			//�ش��ֶ�,Ӧ�ú����֤�̶�ΪApp_0002
			doc.setBusiAttribute("APP_NO", "App_0002");
			//�ش��ֶΣ��ͻ��ţ����֤Ӱ���Ψһ����
			doc.setBusiAttribute("CONT_ID", "001042529368");
			//�ش��ֶΣ������ļ�����
			doc.setBusiAttribute(DocKey.AMOUNT, "1");
			//�ش��ֶΣ�ҵ�����ʱ��
			doc.setBusiAttribute(DocKey.BUSI_START_TIME, "20170426");
            //�״��������֤��Ӱ������
			doc.setBusiAttribute("EXIST_BRANCH", "SRCB001");
			//�����»���
			doc.setBusiAttribute("LAST_UPDATE_ORG", "SRCB002");
			//������ʱ��
			doc.setBusiAttribute("LAST_UPDATE_DT", "20170426185615");

			//�ش��ֶΣ��ĵ���������
			doc.beginFilePart(partName);

			// ��ʼ ���õ�һ��Ӱ����Ϣ
			doc.beginFile();
			// �ش��ֶΣ��ļ���ʽ
			doc.setFileAttribute(DocPartKey.FILE_FORMAT, "jpg");
			// �ش��ֶΣ��ļ���С����λ�ֽ�
			doc.setFileAttribute(DocPartKey.FILE_SIZE, "1332383");
			// ��ѡ�ֶΣ�ҳ��
			doc.setFileAttribute("BUSI_FILE_PAGENUM", "1");
			//�ͻ���
			doc.setFileAttribute("CUS_ID" ,"001042529368");
			//֤������
			doc.setFileAttribute("REF_NO" ,"32012119810717291X");
			//ǩ������
			doc.setFileAttribute("ISSUED_DEP" ,"�Ͼ��й����ֽ����־�");
			//֤������
			doc.setFileAttribute("ID_TP_CD" ,"SFZ");
			//��Ч֤�����
			doc.setFileAttribute("USEFLAG" ,"1");
			//�޸ı��
			doc.setFileAttribute("MODF" ,"0");
			//ǰ��ҵ����ˮ��
			doc.setFileAttribute("SERIAL_NO" ,"20170426001");
			//�Ƿ񿪻�֤��
			doc.setFileAttribute("OPEN_IDENT_IND" ,"0");
			//����޸�ʱ��
			doc.setFileAttribute("LAST_MOD_TIME" ,"20170426");
			//Ӱ�񴴽�ʱ��
			doc.setFileAttribute("DATE" ,"20170426");
			// �ش���Ϣ���ļ�·�����Ƿ����MD5У��
			doc.setFile("D:\\0402019133360976\\Card.jpg", true);
			doc.setFileAttribute("IMG_ID_NOTE" ,"Card");
			// ��������
			doc.endFile();

			// ��ʼ ���õ�һ��Ӱ����Ϣ
			doc.beginFile();
			// �ش��ֶΣ��ļ���ʽ
			doc.setFileAttribute(DocPartKey.FILE_FORMAT, "bmp");
			// �ش��ֶΣ��ļ���С����λ�ֽ�
			doc.setFileAttribute(DocPartKey.FILE_SIZE, "1332383");
			// ��ѡ�ֶΣ�ҳ��
			doc.setFileAttribute("BUSI_FILE_PAGENUM", "1");
			//�ͻ���
			doc.setFileAttribute("CUS_ID" ,"001042529368");
			//֤������
			doc.setFileAttribute("REF_NO" ,"32012119810717291X");
			//ǩ������
			doc.setFileAttribute("ISSUED_DEP" ,"�Ͼ��й����ֽ����־�");
			//֤������
			doc.setFileAttribute("ID_TP_CD" ,"SFZ");
			//��Ч֤�����
			doc.setFileAttribute("USEFLAG" ,"1");
			//�޸ı��
			doc.setFileAttribute("MODF" ,"0");
			//ǰ��ҵ����ˮ��
			doc.setFileAttribute("SERIAL_NO" ,"20170426001");
			//�Ƿ񿪻�֤��
			doc.setFileAttribute("OPEN_IDENT_IND" ,"0");
			//����޸�ʱ��
			doc.setFileAttribute("LAST_MOD_TIME" ,"20170426");
			//Ӱ�񴴽�ʱ��
			doc.setFileAttribute("DATE" ,"20170426");
			// �ش���Ϣ���ļ�·�����Ƿ����MD5У��
			doc.setFile("D:\\0402019133360976\\back.jpg", true);
			doc.setFileAttribute("IMG_ID_NOTE" ,"back");
			// ��������
			doc.endFile();

			// ��ʼ ���õ�һ��Ӱ����Ϣ
			doc.beginFile();
			// �ش��ֶΣ��ļ���ʽ
			doc.setFileAttribute(DocPartKey.FILE_FORMAT, "bmp");
			// �ش��ֶΣ��ļ���С����λ�ֽ�
			doc.setFileAttribute(DocPartKey.FILE_SIZE, "1332383");
			// ��ѡ�ֶΣ�ҳ��
			doc.setFileAttribute("BUSI_FILE_PAGENUM", "1");
			//�ͻ���
			doc.setFileAttribute("CUS_ID" ,"001042529368");
			//֤������
			doc.setFileAttribute("REF_NO" ,"32012119810717291X");
			//ǩ������
			doc.setFileAttribute("ISSUED_DEP" ,"�Ͼ��й����ֽ����־�");
			//֤������
			doc.setFileAttribute("ID_TP_CD" ,"SFZ");
			//��Ч֤�����
			doc.setFileAttribute("USEFLAG" ,"1");
			//�޸ı��
			doc.setFileAttribute("MODF" ,"0");
			//ǰ��ҵ����ˮ��
			doc.setFileAttribute("SERIAL_NO" ,"20170426001");
			//�Ƿ񿪻�֤��
			doc.setFileAttribute("OPEN_IDENT_IND" ,"0");
			//����޸�ʱ��
			doc.setFileAttribute("LAST_MOD_TIME" ,"20170426");
			//Ӱ�񴴽�ʱ��
			doc.setFileAttribute("DATE" ,"20170426");
			// �ش���Ϣ���ļ�·�����Ƿ����MD5У��
			doc.setFile("D:\\0402019133360976\\Front.jpg", true);
			doc.setFileAttribute("IMG_ID_NOTE" ,"Front");
			// ��������
			doc.endFile();

			doc.endFilePart();
			System.out.println(doc.getDocInfo().asXML());
			System.out.println(api.add(doc));
			System.out.println("�ϴ��ɹ�");
		} catch (SunTransEngineException e) {
			e.printStackTrace();
		}
	}

	/**
	 * ͨ�����κŲ�ѯ�����µ������ļ�
	 */
	public void queryBatchFile() {
		try {
			ClientApi api = new ClientApi(ip, port, username, password);
			ECMDoc doc = new ECMDoc(false);
			//ָ��Ҫ��ѯ�����κ�
			doc.setBatchID("0402040A54714357");
			//ָ����ѯ��������������������
			doc.setObjName(objName);
			//ָ����ѯ����Ϊ��ѯ�����ļ�
			doc.setOption(OptionKey.QUERY_BATCH_FILE);
			String string = api.queryFile(doc);
			System.out.println(string);
		} catch (SunTransEngineException e) {
			e.printStackTrace();
		}
	}

	/**
	 * ͨ�����κš�ҵ��ģ�ͺ�ɾ���ļ�
	*/
	public void deleteBatchFile() {
		try {
			ClientApi api = new ClientApi(ip, port, username, password);
			ECMDoc doc = new ECMDoc();
			//ָ��Ҫ��ѯ�����κ�
			doc.setBatchID("0402019133360973");
			//ָ����ѯ��������������������
			doc.setObjName(objName);
			//ָ��ɾ����ʶΪ�߼�ɾ��
			doc.setOption(OptionKey.LOGICAL_DEL);
			//�������κţ�Ԫ���ݶ�����
			api.del(doc);
			System.out.println("ɾ���ɹ�");
		} catch (SunTransEngineException e) {
			e.printStackTrace();
		}
	}
	public void deleteBatchFile(String batchId) {
		try {
			ClientApi api = new ClientApi(ip, port, username, password);
			ECMDoc doc = new ECMDoc();
			//ָ��Ҫ��ѯ�����κ�
			doc.setBatchID(batchId);
			//ָ����ѯ��������������������
			doc.setObjName(objName);
			//ָ��ɾ����ʶΪ�߼�ɾ��
			doc.setOption(OptionKey.LOGICAL_DEL);
			//�������κţ�Ԫ���ݶ�����
			api.del(doc);
			System.out.println("ɾ���ɹ�");
		} catch (SunTransEngineException e) {
			e.printStackTrace();
		}
	}

	/**
	 * �߼�����,��ȡ���κ�
	 */
	public void heightQuery() {
		try {
			ClientApi api = new ClientApi(ip, port, username, password);
			ECMDoc doc = new ECMDoc(false);
			// ����Ԫ���ݶ�����
			doc.setObjName(objName);
			//ͨ���ͻ��Ų�ѯ����
			doc.setBusiAttribute("CONT_ID", "000001574680");
			//ָ���߼�������ѯ��ʾ
			doc.setOption(OptionKey.HEIGHT_QUERY);
			String string = api.queryBatch(doc);
			System.out.println(string);
		} catch (SunTransEngineException e) {
			e.printStackTrace();
		}
	}
	/**
	 * �߼�����,��ȡ���κ�
	 */
	public String heightQuery(String customerId) {
		try {
			ClientApi api = new ClientApi(ip, port, username, password);
			ECMDoc doc = new ECMDoc(false);
			// ����Ԫ���ݶ�����
			doc.setObjName(objName);
			//ͨ���ͻ��Ų�ѯ����
			doc.setBusiAttribute("CONT_ID",customerId);
			//ָ���߼�������ѯ��ʾ
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
		//�ϴ�
		//client.add();
		//��ѯ
//		client.queryBatchFile();
		//ɾ��
		//client.deleteBatchFile();
		//�߼���ѯ
		//client.heightQuery();
		
		//ɾ��ͬ�ͻ���������BatchId�µ�ͼƬ
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
	 * ����batch_id
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
