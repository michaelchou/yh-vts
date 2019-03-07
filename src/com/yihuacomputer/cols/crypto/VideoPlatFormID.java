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
    //���֤����������
	private String objName = "ID_DOC";
	//���֤�ĵ���������
	private String partName = "ID_PART";

	private Logger error = Logger.getLogger("Error");

	public VideoPlatFormID(String ip, String port, String username, String password) {
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
			System.out.println("��ʼ��¼(���Ӱ��ƽ̨)");
			api.login();
			System.out.println("��¼�ɹ�(���Ӱ��ƽ̨)");
			return true;
		} catch (SunTransEngineException e) {
			error.error("Ӱ��ƽ̨ϵͳ��¼ʧ��:"+"\r\n"+e.getMessage()+"\r\n");
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
			System.out.println("�ǳ��ɹ�(���Ӱ��ƽ̨)");
		} catch (SunTransEngineException e) {
			error.error("Ӱ��ƽ̨ϵͳ�ǳ�ʧ��:"+"\r\n"+e.getMessage()+"\r\n");
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
			//�ش��ֶ�,Ӧ�ú����֤�̶�ΪApp_0002
			doc.setBusiAttribute("APP_NO", "App_0002");
			//�ش��ֶΣ��ͻ��ţ����֤Ӱ���Ψһ����
			doc.setBusiAttribute("CONT_ID", bean.getStrCustomerId());
			//�ش��ֶΣ������ļ�����
			if(imageInfoList !=null && imageInfoList.size() > 0){
				doc.setBusiAttribute(DocKey.AMOUNT, String.valueOf(imageInfoList.size()));
			}else{
				doc.setBusiAttribute(DocKey.AMOUNT, "0");
			}
			//�ش��ֶΣ�ҵ�����ʱ��
			doc.setBusiAttribute(DocKey.BUSI_START_TIME, bean.getStrBusiStartTime());
            //�״��������֤��Ӱ������
			doc.setBusiAttribute("EXIST_BRANCH", "SRCB001");
			//�����»���
			doc.setBusiAttribute("LAST_UPDATE_ORG", "SRCB002");
			//������ʱ��
			doc.setBusiAttribute("LAST_UPDATE_DT", bean.getStrLastUpdateTime());

			//�ش��ֶΣ��ĵ���������
			doc.beginFilePart(partName);
			if(imageInfoList !=null && imageInfoList.size() > 0){
				for(int i=0; i<imageInfoList.size(); i++ ){
					VideoPlat entity = (VideoPlat) imageInfoList.get(i);
					String strPicName = entity.getStrFilePath().substring(entity.getStrFilePath().lastIndexOf('/')+1, entity.getStrFilePath().lastIndexOf('.'));
					if(null != strPicName && "" != strPicName && "Card".equals(strPicName)) {
						continue;
					}
					// ��ʼ ���õ�һ��Ӱ����Ϣ
					doc.beginFile();
					// �ش��ֶΣ��ļ���ʽ
					doc.setFileAttribute(DocPartKey.FILE_FORMAT, entity.getStrFilePath().substring(entity.getStrFilePath().lastIndexOf('.')+1, entity.getStrFilePath().length()));
					// �ش��ֶΣ��ļ���С����λ�ֽ�
					doc.setFileAttribute(DocPartKey.FILE_SIZE, entity.getStrFileSize());
					// ��ѡ�ֶΣ�ҳ��
					doc.setFileAttribute("BUSI_FILE_PAGENUM", "1");
					//�ͻ���
					doc.setFileAttribute("CUS_ID" ,bean.getStrCustomerId());
					//֤������
					doc.setFileAttribute("REF_NO" ,bean.getStrIDCardNum());
					//ǩ������
					doc.setFileAttribute("ISSUED_DEP" ,"");//��������ʱʹ��UTF-8���룬��̨����ʹ��GBK����ֹ�������룬Ӱ�����鲻����
					//֤������
					doc.setFileAttribute("ID_TP_CD" ,"SFZ");
					//��Ч֤�����
					doc.setFileAttribute("USEFLAG" ,"0");
					//�޸ı��
					doc.setFileAttribute("MODF" ,"0");
					//ǰ��ҵ����ˮ��
					doc.setFileAttribute("SERIAL_NO" ,bean.getStrSerialNo());
					//�Ƿ񿪻�֤��
					doc.setFileAttribute("OPEN_IDENT_IND" ,"0");
					//����޸�ʱ��
					doc.setFileAttribute("LAST_MOD_TIME" ,bean.getStrLastModTime());
					//Ӱ�񴴽�ʱ��
					doc.setFileAttribute("DATE" ,bean.getStrDate());
					// �ش���Ϣ���ļ�·�����Ƿ����MD5У��
					doc.setFile(entity.getStrFilePath(), true);
					//��ȡ�ϴ����ļ�����
					doc.setFileAttribute("IMG_ID_NOTE" ,entity.getStrFilePath().substring(entity.getStrFilePath().lastIndexOf('/')+1, entity.getStrFilePath().lastIndexOf('.')));
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
			error.error("Ӱ��ƽ̨ϵͳ�ϴ��ļ�ʧ��:"+"\r\n"+e.getMessage()+"\r\n");
			return false;
		}
	}

	/**
	 * ͨ�����κš�ҵ��ģ�ͺ�ɾ���ļ�
	*/
	public boolean deleteBatchFile(VideoPlat bean) {
		try {
			ClientApi api = new ClientApi(ip, port, username, password);
			ECMDoc doc = new ECMDoc();
			//ָ��Ҫ��ѯ�����κ�
			doc.setBatchID(bean.getStrBatchId());
			//ָ����ѯ��������������������
			doc.setObjName(objName);
			//ָ��ɾ����ʶΪ�߼�ɾ��
			doc.setOption(OptionKey.LOGICAL_DEL);
			//�������κţ�Ԫ���ݶ�����
			api.del(doc);
			System.out.println("ɾ���ɹ�");
			return true;
		} catch (SunTransEngineException e) {
			error.error("Ӱ��ƽ̨ϵͳɾ��ʧ��:"+"\r\n"+e.getMessage()+"\r\n");
			return false;
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
			error.error("Ӱ��ƽ̨ϵͳ��ѯʧ��:"+"\r\n"+e.getMessage()+"\r\n");
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
			//�ϴ�֮ǰ������ѯ
			String strQuertDate = queryBatchFile(bean);
			if(strQuertDate != null && !strQuertDate.equals("") && strQuertDate.length() > 50){
                //����ɾ�����ϴ�
				ret = deleteBatchFile(bean);
				if(ret){
				   //�ϴ��ļ�
				   ret = add(bean,imageInfoList);
				}
			}else{//û��ֱ���ϴ�
				//�ϴ��ļ�
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
}
