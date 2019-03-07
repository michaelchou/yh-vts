package com.yihuacomputer.cols.util;

import java.io.ByteArrayOutputStream;
import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.RandomAccessFile;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

import net.sf.sevenzipjbinding.ExtractOperationResult;
import net.sf.sevenzipjbinding.ISequentialOutStream;
import net.sf.sevenzipjbinding.ISevenZipInArchive;
import net.sf.sevenzipjbinding.SevenZip;
import net.sf.sevenzipjbinding.SevenZipException;
import net.sf.sevenzipjbinding.impl.RandomAccessFileInStream;
import net.sf.sevenzipjbinding.simple.ISimpleInArchive;
import net.sf.sevenzipjbinding.simple.ISimpleInArchiveItem;

import org.apache.log4j.Logger;

import com.yihuacomputer.cols.entity.VideoPlat;


/**
 * �ļ�ѹ������ѹ������
 * �����������Թɷ����޹�˾
 * 2017-11-13
 */
public class ZipUtil
{
	public Logger error = Logger.getLogger("Error");

	public List<VideoPlat> imageInfoList = new ArrayList<VideoPlat>();
	/**
	 * ��ѹ7z�ļ�
	 * ����1����Ҫ��ѹ���ļ� ����2����ѹ�󱣴��·��
	 */
	public boolean extractile(String filepath, final String dirpath){
		  boolean ret = false;
		  RandomAccessFile randomAccessFile = null;
	      ISevenZipInArchive inArchive = null;
	      imageInfoList.clear();
	      try {
	        randomAccessFile = new RandomAccessFile(filepath, "r");
	        inArchive = SevenZip.openInArchive(null,new RandomAccessFileInStream(randomAccessFile));
	        ISimpleInArchive simpleInArchive = inArchive.getSimpleInterface();
	        for (final ISimpleInArchiveItem item : simpleInArchive.getArchiveItems()) {
	          final int[] hash = new int[] { 0 };
	          if (!item.isFolder()) {
	            ExtractOperationResult result;
	            final long[] sizeArray = new long[1];
	            final ByteArrayOutputStream baos=new ByteArrayOutputStream();
	            result = item.extractSlow(new ISequentialOutStream() {
	              public int write(byte[] data) throws SevenZipException {
					try {
						baos.write(data);
					} catch (IOException e1) {
					}
	                hash[0] ^= Arrays.hashCode(data); // Consume data
	                sizeArray[0] += data.length;
	                return data.length; // Return amount of consumed data
	              }
	            });
	            if (result == ExtractOperationResult.OK) {
	            	  //�����ļ��ĸ�ʽ�Լ���С������Ӱ���ϴ���ʱ���õ�
	            	  VideoPlat entity = new VideoPlat();
	            	  entity.setStrFilePath(dirpath + File.separator + item.getPath().replace(".bmp", ".jpg").replace(".BMP", ".jpg"));
	            	  entity.setStrFileSize(String.valueOf(sizeArray[0]));
	            	  imageInfoList.add(entity);
	            	  FileOutputStream fos;
		              try {
		                  File dir = new File(File.separator+dirpath);
		                  if (!dir.exists()) {// �ж��ļ��Ƿ����
			                 if (!dir.mkdirs()) {// ����Ŀ¼
			                	  error.error("�����ļ�ʧ��" +"\r\n");
			                	  throw new Exception();
			            	 }
			               }
		                   File file = new File(File.separator + dirpath+File.separator+item.getPath());
		                   fos = new FileOutputStream(file);
		                   fos.write(baos.toByteArray());
		                   fos.close();
		              }
		              catch (Exception e) {
		                   error.error("�����ļ�ʧ��" + e.getMessage() + "\r\n");
					  }
			          if (baos != null) {
			              try {
			            	  baos.close();
			              } catch (IOException e) {
			        	     error.error("�ر��ļ�ʧ��" + e.getMessage() + "\r\n");
			              }
			          }
		              ret = true;
	            } else {
	            	ret = false;
	            }
	          }
	        }
	      } catch (Exception e) {
	    	  ret = false;
	    	  e.printStackTrace();
	    	  error.error("�����ļ�ʧ��" + e.getMessage() + "\r\n");
	      } finally {
	          if (inArchive != null) {
	              try {
	                 inArchive.close();
	              } catch (SevenZipException e) {
	        	     error.error("�ر�ѹ���ļ�ʧ��" + e.getMessage() + "\r\n");
	              }
	          }
	          if (randomAccessFile != null) {
	              try {
	                 randomAccessFile.close();
	              } catch (IOException e) {
	        	     error.error("�ر��ļ�ʧ��" + e.getMessage() + "\r\n");
	              }
	          }
	     }
		 return ret;
	}
	/**
	 * �ϴ��Ĵ�����Ӱ���ļ�����ϸ��Ϣ
	 * @return
	 */
	public boolean extractileAgent(File agentfile, String strAgentPath){
		if(agentfile.isFile()){
			return false;
		}
		imageInfoList.clear();
		File[] strNewFile = agentfile.listFiles();
		for(int i=0;i<strNewFile.length;i++){
      	  //�����ļ��ĸ�ʽ�Լ���С������Ӱ���ϴ���ʱ���õ�
      	  VideoPlat entity = new VideoPlat();
      	  entity.setStrFilePath(strAgentPath + File.separator + strNewFile[i].getName());
      	  entity.setStrFileSize(String.valueOf(strNewFile[i].length()));
      	  imageInfoList.add(entity);
		}
		return true;
	}
	
	/**
	 * ��ȡ�ϴ����ļ�����ϸ��Ϣ
	 * @return
	 */
	public List<VideoPlat> getImageInfoList(){
		return imageInfoList;
	}
}