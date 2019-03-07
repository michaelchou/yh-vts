package com.yihuacomputer.cols.test;

import java.io.InputStream;

import org.apache.http.Header;
import org.apache.http.HttpEntity;
import org.apache.http.HttpResponse;
import org.apache.http.StatusLine;
import org.apache.http.client.HttpClient;
import org.apache.http.client.methods.HttpPost;
import org.apache.http.entity.StringEntity;
import org.apache.http.impl.client.DefaultHttpClient;
import org.apache.http.message.BasicHeader;
import org.apache.http.params.CoreConnectionPNames;
import org.apache.log4j.Logger;
import org.jdom.Document;

import com.yihuacomputer.cols.service.ISOCommException;
import com.yihuacomputer.cols.service.ReponseMessage;
import com.yihuacomputer.cols.util.XmlHelper;

/**
 * 与主机后台通讯类
 * 增加了与后台超时时间参数 iHostTimeout
 */

public class Host {
	public Logger error = Logger.getLogger("Error");
	public Logger info = Logger.getLogger("Info");
	// 缺省连接超时毫秒数
	protected int DEF_CONNECT_TIMEOUT_MS = 60*1000;
	protected int MAX_READ_BUF_LEN = 1024 * 1024 * 10;
	protected String strHostUrl;
	protected String strJournal = "";
	protected byte[] strRes = null;
	private String  strRecDate= "";//响应报文

	/**
	 * 构造函数
	 * 参数:strHostIP 主机IP地址
	 * 参数:iHostPort 主机端口号
	 */
	public Host(String strHostUrl) {
		this.strHostUrl = strHostUrl;
	}
	/**
	 * 与通用服务器平台主机进行一次交互
	 * 参数:byteArrRequest 交互的请求
	 * 参数:iReqLen 请求的长度
	 * 返回值:交互的回应，失败返回null
	 */
	public boolean dialogueWithHost(String strOrgNum,String reqData, ReponseMessage BQ) throws ISOCommException {
		boolean bRet = false;
		byte[] byteArrRet = null;
		InputStream input = null;
		HttpClient httpClient = new DefaultHttpClient();
		httpClient.getParams().setIntParameter(CoreConnectionPNames.SO_TIMEOUT, DEF_CONNECT_TIMEOUT_MS);
		httpClient.getParams().setIntParameter(CoreConnectionPNames.CONNECTION_TIMEOUT, DEF_CONNECT_TIMEOUT_MS);
		//从请求报文中获取报文类型标识符以及交易处理码
		Document reqDataDoc = XmlHelper.parseStr2Dom(reqData);
		String strNodeF0 = XmlHelper.getSingleNodeValue(reqDataDoc, "its/F0", "");//报文类型标识符
		String strNodeF3= XmlHelper.getSingleNodeValue(reqDataDoc, "its/F3", "");//交易处理码
		if(strNodeF0 == null || strNodeF0.equals("") || strNodeF3 == null || strNodeF3.equals("")){
			return false;
		}
		strHostUrl = strHostUrl+"?f0="+strNodeF0+"&f3="+strNodeF3;
		HttpPost httpPost = new HttpPost(strHostUrl);
		try {
			// 设置请求体参数,编码方式为utf-8
			StringEntity entity = new StringEntity(reqData, "UTF-8");
			// 设置请求头信息
			Header header = new BasicHeader("Content-Type","application/xml;charset=UTF-8");
			entity.setContentType(header);
			httpPost.setEntity(entity);
			// 发送请求
			HttpResponse response = httpClient.execute(httpPost);
			StatusLine statusLine = response.getStatusLine();
			if(statusLine.getStatusCode() == 200){
				HttpEntity receiveEntity = response.getEntity();//得到entity
				if (receiveEntity != null) {
					 input = receiveEntity.getContent();//得到从服务器端返回的数据流
		             long length = receiveEntity.getContentLength();
					 if(length<=0){
						 releaseRes(httpClient,input);
						 throw new ISOCommException(ISOCommException.TYPE_RECEIVE_TIMEOUT);
					 }
					 int len = (int)length;
					 byte[] byteArrResponse= new byte[len];
					 int readCount = 0;
					 //用以下方式读inputStream为b赋值
					 while (readCount < len) {
					    readCount += input.read(byteArrResponse, readCount, len - readCount);
					 }
					 byteArrRet = byteArrResponse;
					 String s = new String(byteArrRet, "UTF-8");
					 Document recDoc = XmlHelper.parseStr2Dom(s);
					 if (byteArrRet != null && BQ.parse(recDoc) > 0){
						bRet = true;
					 }
					 strRecDate= XmlHelper.transformDom2Str(recDoc, "UTF-8");
					 info.info("响应报文:"+"\r\n"+strRecDate);
					 releaseRes(httpClient,input);
				}else{
					error.error("向主机发送请求失败:"+strHostUrl+"\r\n"+ reqData +"\r\n");
					releaseRes(httpClient,input);
					throw new ISOCommException(ISOCommException.TYPE_RECEIVE_TIMEOUT);
				}
			}else{
				error.error("向主机发送请求失败:"+"["+statusLine.getStatusCode()+"]"+strHostUrl+"\r\n"+ reqData + "\r\n");
				releaseRes(httpClient,input);
				throw new ISOCommException(ISOCommException.TYPE_RECEIVE_TIMEOUT);
			}
		} catch (Exception e) {
			error.error("向主机发送请求失败:"+strHostUrl+"\r\n"+ reqData + " 错误信息:"+e.getMessage()+"\r\n");
			releaseRes(httpClient,input);
			throw new ISOCommException(ISOCommException.TYPE_RECEIVE_TIMEOUT);
		}
		return bRet;
	}

	//关闭数据流
	private void releaseRes(HttpClient httpClient,InputStream is) {
		if (is != null)
			try {
				is.close();
			} catch (Exception e) {
			}
		if (httpClient != null)
			try {
				httpClient.getConnectionManager().shutdown();
			} catch (Exception e) {
			}
	}

	public String  getRecDate()
	{
		return strRecDate;
	}
}
