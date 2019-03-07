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
		return "电子密码锁交易";
	}
    public void doProcess(DateCtrl dtCur, String strReq, Document domReq){
    	String strEleLockMsg = MsgXmlDom.getElementValue(domReq,"strEleLock");
    	Document dom = XmlHelper.parseStr2Dom("<strEleLock>" + strEleLockMsg + "</strEleLock>");
    	String strEleLockTrCode = MsgXmlDom.getElementValue(dom,"/strEleLock/Ex_TrCode");
		if (!"4000".equals(strEleLockTrCode)) {
			//非在线应急开锁直接发往P端
			super.doProcess(dtCur, strReq, domReq);
		}else{
			byte[] keyBytes;
			byte[] keyBytes1;
			byte[] byteMasterKey;
			byte[] byteOperAPwd;
			byte[] byteOperBPwd;
			try {
				//获取配置文件路径
				String path = getPath("config/eleLock.properties");
				//获取加密后的主密钥(从配置文件读取)
				Properties prop = new Properties();
				FileInputStream in = new FileInputStream(path);
				prop.load(in);
				String strCrypKey = prop.getProperty("eleLockCrypKey");	
				in.close();
				//用于解密主密钥密文的密钥
				String strCrypData = "31415926535897932384626433832795";
				//解密主密钥
				keyBytes = KeyBox.hexStr2Str(strCrypData);	//十六进制字符串转换成byte[]
				byteMasterKey = KeyBox.decrypt(strCrypKey, keyBytes);
				keyBytes1 = KeyBox.hexStr2Str(KeyBox.byte2HexStr(byteMasterKey));
				//获取加钞员密码(经过Base64加密后的数据)
				String strOperAPwd = MsgXmlDom.getElementValue(dom,"/strEleLock/Ex_OperAPwd");
				String strOperBPwd = MsgXmlDom.getElementValue(dom,"/strEleLock/Ex_OperBPwd");
				//Base64解码后转为十六进制字符串
				strOperAPwd = new String(Base64.decode(strOperAPwd),"UTF-8");
				strOperBPwd = new String(Base64.decode(strOperBPwd),"UTF-8");
				info.info("strOperAPwd=" + strOperAPwd + "---strOperBPwd=" + strOperBPwd + "\r\n");
				//加密加钞员A密码
				byteOperAPwd = KeyBox.hexStr2Str(strOperAPwd);	//十六进制字符串转换成byte[]
				strOperAPwd = KeyBox.encrypt(byteOperAPwd, keyBytes1);	//密码加密
				//加密加钞员B密码
				byteOperBPwd = KeyBox.hexStr2Str(strOperBPwd);	//十六进制字符串转换成byte[]
				strOperBPwd = KeyBox.encrypt(byteOperBPwd, keyBytes1);	//密码加密
				//设置加钞员密码字段
				strOperAPwd = strOperAPwd.substring(0, 32);
				MsgXmlDom.setElementValue(dom, "/strEleLock/Ex_OperAPwd", strOperAPwd);
				strOperBPwd = strOperBPwd.substring(0, 32);
				MsgXmlDom.setElementValue(dom, "/strEleLock/Ex_OperBPwd", strOperBPwd);
				
				//strEleLockMsg = XmlHelper.transformDom2Str(dom,"UTF-8");
				//重新设置strEleLock值，并计算长度
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
				//转到父类中doProcess处理
				super.doProcess(dtCur, strReq, domReq);
			} catch (Exception e) {
				error.error("加钞员密码加密异常:" + e);
				setSimpleRespDom(TERMRETCODE_INNERR, TERMRETDESC_INNERR, TERMRETDESCEN_INNERR);
			}
		}
    }
    
    /*
     * 获取文件路径
     * 参数		String 相对路径
     * return	String 文件路径字符串
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
