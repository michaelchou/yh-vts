package com.yihuacomputer.cols.crypto;

import java.io.FileInputStream;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;

import sun.misc.BASE64Decoder;
import sun.misc.BASE64Encoder;


/**
 * Base64ת����
 */
public class Base64 {
	//ͼƬת����base64�ַ���
	public String GetImageStr()
	{//��ͼƬ�ļ�ת��Ϊ�ֽ������ַ��������������Base64���봦��
	   String imgFile = "d://test.jpg";//�������ͼƬ
	   InputStream in = null;
	   byte[] data = null;
	   //��ȡͼƬ�ֽ�����
	   try
	   {
	       in = new FileInputStream(imgFile);
	       data = new byte[in.available()];
	       in.read(data);
	       in.close();
	    }
	    catch (IOException e)
	    {
	       e.printStackTrace();
	    }
	    //���ֽ�����Base64����
	    BASE64Encoder encoder = new BASE64Encoder();
	    return encoder.encode(data);//����Base64��������ֽ������ַ���
	}

	//base64�ַ���ת����ͼƬ
	public boolean GenerateImage(String imgStr,String strSavePath)
	{   //���ֽ������ַ�������Base64���벢����ͼƬ
	     if (imgStr == null) //ͼ������Ϊ��
	         return false;
	     BASE64Decoder decoder = new BASE64Decoder();
	     try
	     {
	         //Base64����
	         byte[] b = decoder.decodeBuffer(imgStr);
	         for(int i=0;i<b.length;++i)
	         {
	             if(b[i]<0)
	             {//�����쳣����
	                 b[i]+=256;
	              }
	         }
	         //����jpegͼƬ
	         OutputStream out = new FileOutputStream(strSavePath);
	         out.write(b);
	         out.flush();
	         out.close();
	         return true;
	       }
	       catch (Exception e)
	       {
	         return false;
	       }
	}

	/**
	 * ����
	 * @param bstr
	 * @return String
	*/
	public static String encode(byte[] bstr){
	   return new sun.misc.BASE64Encoder().encode(bstr);
	}
	/**
	  * ����
	  * @param str
	  * @return string
	*/
	public static byte[] decode(String str){
	   byte[] bt = null;
	   try {
	      sun.misc.BASE64Decoder decoder = new sun.misc.BASE64Decoder();
	      bt = decoder.decodeBuffer( str );
	   } catch (IOException e) {
	      e.printStackTrace();
	   }
	   return bt;
	}
}
