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
 * 文件压缩，解压工具类
 * 深圳怡化电脑股份有限公司
 * 2017-11-13
 */
public class ZipUtil
{
	public Logger error = Logger.getLogger("Error");

	public List<VideoPlat> imageInfoList = new ArrayList<VideoPlat>();
	/**
	 * 解压7z文件
	 * 参数1：需要解压的文件 参数2：解压后保存的路劲
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
	            	  //保存文件的格式以及大小，后面影像上传的时候用到
	            	  VideoPlat entity = new VideoPlat();
	            	  entity.setStrFilePath(dirpath + File.separator + item.getPath().replace(".bmp", ".jpg").replace(".BMP", ".jpg"));
	            	  entity.setStrFileSize(String.valueOf(sizeArray[0]));
	            	  imageInfoList.add(entity);
	            	  FileOutputStream fos;
		              try {
		                  File dir = new File(File.separator+dirpath);
		                  if (!dir.exists()) {// 判断文件是否存在
			                 if (!dir.mkdirs()) {// 创建目录
			                	  error.error("创建文件失败" +"\r\n");
			                	  throw new Exception();
			            	 }
			               }
		                   File file = new File(File.separator + dirpath+File.separator+item.getPath());
		                   fos = new FileOutputStream(file);
		                   fos.write(baos.toByteArray());
		                   fos.close();
		              }
		              catch (Exception e) {
		                   error.error("创建文件失败" + e.getMessage() + "\r\n");
					  }
			          if (baos != null) {
			              try {
			            	  baos.close();
			              } catch (IOException e) {
			        	     error.error("关闭文件失败" + e.getMessage() + "\r\n");
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
	    	  error.error("创建文件失败" + e.getMessage() + "\r\n");
	      } finally {
	          if (inArchive != null) {
	              try {
	                 inArchive.close();
	              } catch (SevenZipException e) {
	        	     error.error("关闭压缩文件失败" + e.getMessage() + "\r\n");
	              }
	          }
	          if (randomAccessFile != null) {
	              try {
	                 randomAccessFile.close();
	              } catch (IOException e) {
	        	     error.error("关闭文件失败" + e.getMessage() + "\r\n");
	              }
	          }
	     }
		 return ret;
	}
	/**
	 * 上传的代理人影像文件的详细信息
	 * @return
	 */
	public boolean extractileAgent(File agentfile, String strAgentPath){
		if(agentfile.isFile()){
			return false;
		}
		imageInfoList.clear();
		File[] strNewFile = agentfile.listFiles();
		for(int i=0;i<strNewFile.length;i++){
      	  //保存文件的格式以及大小，后面影像上传的时候用到
      	  VideoPlat entity = new VideoPlat();
      	  entity.setStrFilePath(strAgentPath + File.separator + strNewFile[i].getName());
      	  entity.setStrFileSize(String.valueOf(strNewFile[i].length()));
      	  imageInfoList.add(entity);
		}
		return true;
	}
	
	/**
	 * 获取上传的文件的详细信息
	 * @return
	 */
	public List<VideoPlat> getImageInfoList(){
		return imageInfoList;
	}
}