package com.yihuacomputer.cols.service;

import java.io.FileInputStream;
import java.util.Properties;
import org.jdom.Document;
import com.yihuacomputer.cols.crypto.Base64;
import com.yihuacomputer.cols.test.KeyBox;
import com.yihuacomputer.cols.util.DataConversion;
import com.yihuacomputer.cols.util.DateCtrl;
import com.yihuacomputer.cols.util.MsgXmlDom;
import com.yihuacomputer.cols.util.XmlHelper;

public class Processor_EleLockTrans extends Processor_Trans {

	public Processor_EleLockTrans() {
		super();
	}

    protected String getTransName()
	{
		return "��������������";
	}
    public void doProcess(DateCtrl dtCur, String strReq, Document domReq){
    	String strEleLockMsg = MsgXmlDom.getElementValue(domReq,"strEleLock");
    	Document dom = XmlHelper.parseStr2Dom("<strEleLock>" + strEleLockMsg + "</strEleLock>");
    	String strEleLockTrCode = MsgXmlDom.getElementValue(dom,"/strEleLock/Ex_TrCode");
		if (!"4000".equals(strEleLockTrCode)) {
			//������Ӧ������ֱ�ӷ���P��
			super.doProcess(dtCur, strReq, domReq);
		}else{
			byte[] keyBytes;
			byte[] keyBytes1;
			byte[] byteMasterKey;
			byte[] byteOperAPwd;
			byte[] byteOperBPwd;
			try {
				//��ȡ�����ļ�·��
				String path = getPath("config/eleLock.properties");
				//��ȡ���ܺ������Կ(�������ļ���ȡ)
				Properties prop = new Properties();
				FileInputStream in = new FileInputStream(path);
				prop.load(in);
				String strCrypKey = prop.getProperty("eleLockCrypKey");	
				in.close();
				//���ڽ�������Կ���ĵ���Կ
				String strCrypData = "31415926535897932384626433832795";
				//��������Կ
				keyBytes = KeyBox.hexStr2Str(strCrypData);	//ʮ�������ַ���ת����byte[]
				byteMasterKey = KeyBox.decrypt(strCrypKey, keyBytes);
				keyBytes1 = KeyBox.hexStr2Str(KeyBox.byte2HexStr(byteMasterKey));
				//��ȡ�ӳ�Ա����(����Base64���ܺ������)
				String strOperAPwd = MsgXmlDom.getElementValue(dom,"/strEleLock/Ex_OperAPwd");
				String strOperBPwd = MsgXmlDom.getElementValue(dom,"/strEleLock/Ex_OperBPwd");
				//Base64�����תΪʮ�������ַ���
				strOperAPwd = new String(Base64.decode(strOperAPwd),"UTF-8");
				strOperBPwd = new String(Base64.decode(strOperBPwd),"UTF-8");
				info.info("strOperAPwd=" + strOperAPwd + "---strOperBPwd=" + strOperBPwd + "\r\n");
				//���ܼӳ�ԱA����
				byteOperAPwd = KeyBox.hexStr2Str(strOperAPwd);	//ʮ�������ַ���ת����byte[]
				strOperAPwd = KeyBox.encrypt(byteOperAPwd, keyBytes1);	//�������
				//���ܼӳ�ԱB����
				byteOperBPwd = KeyBox.hexStr2Str(strOperBPwd);	//ʮ�������ַ���ת����byte[]
				strOperBPwd = KeyBox.encrypt(byteOperBPwd, keyBytes1);	//�������
				//���üӳ�Ա�����ֶ�
				strOperAPwd = strOperAPwd.substring(0, 32);
				MsgXmlDom.setElementValue(dom, "/strEleLock/Ex_OperAPwd", strOperAPwd);
				strOperBPwd = strOperBPwd.substring(0, 32);
				MsgXmlDom.setElementValue(dom, "/strEleLock/Ex_OperBPwd", strOperBPwd);
				
				//strEleLockMsg = XmlHelper.transformDom2Str(dom,"UTF-8");
				//��������strEleLockֵ�������㳤��
				strEleLockMsg = setNodeValue("Ex_TrTime",MsgXmlDom.getElementValue(dom,"/strEleLock/Ex_TrTime")) + 
						setNodeValue("Ex_SeqNo",MsgXmlDom.getElementValue(dom,"/strEleLock/Ex_SeqNo")) + 
						setNodeValue("Ex_TrCode",MsgXmlDom.getElementValue(dom,"/strEleLock/Ex_TrCode")) + 
						setNodeValue("Ex_LockSN",MsgXmlDom.getElementValue(dom,"/strEleLock/Ex_LockSN")) + 
						setNodeValue("Ex_OperAID",MsgXmlDom.getElementValue(dom,"/strEleLock/Ex_OperAID")) + 
						setNodeValue("Ex_OperAPwd",MsgXmlDom.getElementValue(dom,"/strEleLock/Ex_OperAPwd")) + 
						setNodeValue("Ex_OperBID",MsgXmlDom.getElementValue(dom,"/strEleLock/Ex_OperBID")) + 
						setNodeValue("Ex_OperBPwd",MsgXmlDom.getElementValue(dom,"/strEleLock/Ex_OperBPwd"));
				
				String strElelockXml = DataConversion.getPrefixStr(String.valueOf(strEleLockMsg.length()), ' ', 10) + strEleLockMsg;
				MsgXmlDom.setElementValue(domReq, "strEleLock", strElelockXml);
				info.info(XmlHelper.transformDom2Str(domReq, "UTF-8") + "\r\n");
				//ת��������doProcess����
				super.doProcess(dtCur, strReq, domReq);
			} catch (Exception e) {
				error.error("�ӳ�Ա��������쳣:" + e);
				setSimpleRespDom(TERMRETCODE_INNERR, TERMRETDESC_INNERR, TERMRETDESCEN_INNERR);
			}
		}
    }
    
    /*
     * ��ȡ�ļ�·��
     * ����		String ���·��
     * return	String �ļ�·���ַ���
     */
    public String getPath(String strPath)
    {
    	String path = (getClass().getProtectionDomain().getCodeSource().getLocation().getPath());
    	String configPath= path+strPath;
		StringBuffer filePath = new StringBuffer(64);
        filePath.append(configPath);
        path = filePath.toString();
        return path;
    }
    
    public String setNodeValue(String Name,String Value) {
		String retStr = "";
		if(Name.length() > 0 && Value.length() >0)
			retStr = "<" + Name + ">" + Value + "</" + Name + ">";
    	return retStr;
	}
}
