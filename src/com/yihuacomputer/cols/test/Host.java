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
 * ��������̨ͨѶ��
 * ���������̨��ʱʱ����� iHostTimeout
 */

public class Host {
	public Logger error = Logger.getLogger("Error");
	public Logger info = Logger.getLogger("Info");
	// ȱʡ���ӳ�ʱ������
	protected int DEF_CONNECT_TIMEOUT_MS = 60*1000;
	protected int MAX_READ_BUF_LEN = 1024 * 1024 * 10;
	protected String strHostUrl;
	protected String strJournal = "";
	protected byte[] strRes = null;
	private String  strRecDate= "";//��Ӧ����

	/**
	 * ���캯��
	 * ����:strHostIP ����IP��ַ
	 * ����:iHostPort �����˿ں�
	 */
	public Host(String strHostUrl) {
		this.strHostUrl = strHostUrl;
	}
	/**
	 * ��ͨ�÷�����ƽ̨��������һ�ν���
	 * ����:byteArrRequest ����������
	 * ����:iReqLen ����ĳ���
	 * ����ֵ:�����Ļ�Ӧ��ʧ�ܷ���null
	 */
	public boolean dialogueWithHost(String strOrgNum,String reqData, ReponseMessage BQ) throws ISOCommException {
		boolean bRet = false;
		byte[] byteArrRet = null;
		InputStream input = null;
		HttpClient httpClient = new DefaultHttpClient();
		httpClient.getParams().setIntParameter(CoreConnectionPNames.SO_TIMEOUT, DEF_CONNECT_TIMEOUT_MS);
		httpClient.getParams().setIntParameter(CoreConnectionPNames.CONNECTION_TIMEOUT, DEF_CONNECT_TIMEOUT_MS);
		//���������л�ȡ�������ͱ�ʶ���Լ����״�����
		Document reqDataDoc = XmlHelper.parseStr2Dom(reqData);
		String strNodeF0 = XmlHelper.getSingleNodeValue(reqDataDoc, "its/F0", "");//�������ͱ�ʶ��
		String strNodeF3= XmlHelper.getSingleNodeValue(reqDataDoc, "its/F3", "");//���״�����
		if(strNodeF0 == null || strNodeF0.equals("") || strNodeF3 == null || strNodeF3.equals("")){
			return false;
		}
		strHostUrl = strHostUrl+"?f0="+strNodeF0+"&f3="+strNodeF3;
		HttpPost httpPost = new HttpPost(strHostUrl);
		try {
			// �������������,���뷽ʽΪutf-8
			StringEntity entity = new StringEntity(reqData, "UTF-8");
			// ��������ͷ��Ϣ
			Header header = new BasicHeader("Content-Type","application/xml;charset=UTF-8");
			entity.setContentType(header);
			httpPost.setEntity(entity);
			// ��������
			HttpResponse response = httpClient.execute(httpPost);
			StatusLine statusLine = response.getStatusLine();
			if(statusLine.getStatusCode() == 200){
				HttpEntity receiveEntity = response.getEntity();//�õ�entity
				if (receiveEntity != null) {
					 input = receiveEntity.getContent();//�õ��ӷ������˷��ص�������
		             long length = receiveEntity.getContentLength();
					 if(length<=0){
						 releaseRes(httpClient,input);
						 throw new ISOCommException(ISOCommException.TYPE_RECEIVE_TIMEOUT);
					 }
					 int len = (int)length;
					 byte[] byteArrResponse= new byte[len];
					 int readCount = 0;
					 //�����·�ʽ��inputStreamΪb��ֵ
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
					 info.info("��Ӧ����:"+"\r\n"+strRecDate);
					 releaseRes(httpClient,input);
				}else{
					error.error("��������������ʧ��:"+strHostUrl+"\r\n"+ reqData +"\r\n");
					releaseRes(httpClient,input);
					throw new ISOCommException(ISOCommException.TYPE_RECEIVE_TIMEOUT);
				}
			}else{
				error.error("��������������ʧ��:"+"["+statusLine.getStatusCode()+"]"+strHostUrl+"\r\n"+ reqData + "\r\n");
				releaseRes(httpClient,input);
				throw new ISOCommException(ISOCommException.TYPE_RECEIVE_TIMEOUT);
			}
		} catch (Exception e) {
			error.error("��������������ʧ��:"+strHostUrl+"\r\n"+ reqData + " ������Ϣ:"+e.getMessage()+"\r\n");
			releaseRes(httpClient,input);
			throw new ISOCommException(ISOCommException.TYPE_RECEIVE_TIMEOUT);
		}
		return bRet;
	}

	//�ر�������
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
