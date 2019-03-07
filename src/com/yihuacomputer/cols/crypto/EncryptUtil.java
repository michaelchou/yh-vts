package com.yihuacomputer.cols.crypto;

import java.util.ArrayList;
import java.util.List;

import org.apache.log4j.Logger;

import UnionTech.JavaEsscAPI.UnionAPI;

import com.union.api.TUnionTransInfo;
import com.union.api.UnionEsscAPI;
import com.yihuacomputer.cols.database.MiscDB;
import com.yihuacomputer.cols.entity.Misc;
import com.yihuacomputer.cols.util.DataConversion;


/**
 * 与加密机交互工具类
 */
public class EncryptUtil {
	public static Logger error = Logger.getLogger("Error");
	private static UnionEsscAPI uaSM4 = null;//国密
	private static UnionAPI uaDes = null;//3Des
    private static int iTimeout = 30;//与加密机通讯超时时间
	//加密机交互处理对象
	static{
		//国密方式
		List<String> ipList = new ArrayList<String>();
		List<?> sm4IpList  = new MiscDB().getList("00001", "SM4CryptorIP");
		if(sm4IpList !=null && sm4IpList.size() > 0){
           for(int i=0; i < sm4IpList.size(); i++){
        	   Misc entity = (Misc) sm4IpList.get(i);
        	   ipList.add(i, entity.getStrValue());
           }
		}
		List<Integer> portList = new ArrayList<Integer>();
		List<?> sm4IpPort  = new MiscDB().getList("00001", "SM4CryptorPort");
		if(sm4IpPort !=null && sm4IpPort.size() > 0){
           for(int j=0; j < sm4IpPort.size(); j++){
        	   Misc entity = (Misc) sm4IpPort.get(j);
        	   portList.add(j, Integer.parseInt(entity.getStrValue()));
           }
		}
		uaSM4 = new UnionEsscAPI(ipList,portList,iTimeout*1000,"ATM","ATM");
        //Des加密方式
		String strDESCryptorIP = new MiscDB().get("00001", "DESCryptorIP", "");
		int iDESCryptorPort = new MiscDB().get("00001", "DESCryptorPort", -1);
		uaDes = new UnionAPI(strDESCryptorIP,iDESCryptorPort, iTimeout*1000, "AT");
	}

	/*
	 * SM4 MethodName:unionAPIServiceE151
	 * Function:使用指定的密钥验证
	 * Param:strZAKName ZAK密钥名称
	 * Param:strMacData MAC数据
	 * Param:strMAC 待验证的MAC值
	 * return: int 0:执行成功 <0执行失败返回的错误码
	 */
	@SuppressWarnings("static-access")
	public static int UnionVerifyMacSM4(String strZAKName,String strMacData,String strMAC){
		try{
			String strByte2Hex = new DataConversion().byte2Hex(strMacData.getBytes());
			TUnionTransInfo info = uaSM4.unionAPIServiceE151(1, strZAKName, "NULL", 1, 1, 2, strByte2Hex, strMAC);
			return info.getResponseCode();
		}catch(Exception e){
			error.error("Mac校验出错:"+e.getMessage());
			return -1;
		}
	}

	/*
	 * Des加密  MethodName:UnionVerifyMac
	 * Function:使用指定的密钥验证
	 * Param:strZAKName ZAK密钥名称
	 * Param:iLenOfMacData MAC数据的长度，以十进制表示，<=1024
	 * Param:strMacData MAC数据，长度变长，字符串，以'\0'结束
	 * Param:strMAC 待验证的MAC值
	 * return: int 0:执行成功 <0执行失败返回的错误码
	 */
	public static int UnionVerifyMacDes(String strZAKName,byte[] byteArrMd5Data,String strMAC){
		try{
			int iResult = uaDes.UnionVerifyMac(strZAKName,byteArrMd5Data.length,byteArrMd5Data, strMAC);
			return iResult;
		}catch(Exception e){
			error.error("Mac校验出错:"+e.getMessage());
			return -1;
		}
	}

	/*
	@SuppressWarnings("static-access")
	public static void main(String args[]) {
	    //国密加密方式
		EncryptUtil util = new EncryptUtil();
		DataConversion dataConversion = new DataConversion();
		String aa ="0000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000AINQ000000000000000G;6224780300571761=00001200000039159000?;00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000?7B0A0557B5F5BC63BF38AECA09E4DFE76225>72?8221;:69EOM3000850191";
		String strByte2Hex = dataConversion.byte2Hex(aa.getBytes());
	    int iResult = util.UnionVerifyMacSM4("ATM.04020191.zak",strByte2Hex,"225B31E79E23860E");
	    System.out.println("****服务代码332****函数名UnionVerifyMac**********************处理结果===="+iResult);
        //Des加密方式
		EncryptUtil util = new EncryptUtil();
		String strByte2Hex ="00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000AINQ000000000000000D;6224780300571761=00001200000039159000?;00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000?60948FA4FB5DA8366225>72?8221;:69EOM3000880191";
		int iResult = util.UnionVerifyMacDes("atmp.04020191.tak",strByte2Hex,"1AD801810B9C252A");
		System.out.println("****UnionVerifyMacDes**********************处理结果===="+iResult);
	}
*/
}
