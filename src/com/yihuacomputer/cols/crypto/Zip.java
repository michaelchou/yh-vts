package com.yihuacomputer.cols.crypto;

import java.io.File;
import java.io.FileInputStream;
import java.io.FileOutputStream;
import java.io.IOException;
import java.util.zip.ZipEntry;
import java.util.zip.ZipOutputStream;

import org.apache.log4j.Logger;

import com.yihuacomputer.cols.database.MiscDB;
import com.yihuacomputer.cols.util.DateCtrl;

/**
 * 电子流水文件压缩
 */
public class Zip
{
   private Logger error = Logger.getLogger("Error");
   private Logger info = Logger.getLogger("Info");

   public boolean zip() {
	   info.info("压缩电子流水文件开始");
	   //获取日志目录
	   String strLogPath = new MiscDB().get("00001", "LogParent","/logs/");
	   //文件后缀
	   String suffix = ".zip";
	   //trial节点睡眠5分钟，让formal先执行
	   if(getClass().getResource("").getFile().toString().indexOf("trial") > -1 ){
		   try {
			Thread.sleep(5*1000);
		   } catch (InterruptedException e) {
				error.error("sleep异常", e);
		   }
	   }
	   //判断保存历史文件目录是否存在，不存在则创建
	   File tempF = new File(strLogPath  + "history");
	   if(!tempF.exists()){
		   tempF.mkdir();
	   }
	   //生成压缩文件名,并判断该文件是否已存在，若已存在则不再执行
	   String zipFileName = strLogPath  + "history" + File.separator + new DateCtrl().getDateStrSimpleYestoday() + suffix;
	   File zipFile = new File(zipFileName);
	   if(!zipFile.exists()){
		   try {
			   zipFile.createNewFile();
		   } catch (IOException e) {
				error.error("创建文件异常", e);
		   }
	   }else{
		   info.info("压缩文件已存在");
		   return true;
	   }

	   //压缩历史文件
	   File inputFile = new File(strLogPath);
	   try {
		   //创建文件输出对象out,提示:注意中文支持
		   FileOutputStream out = new FileOutputStream(new String(zipFileName.getBytes("UTF-8")));
		   //將文件輸出ZIP输出流接起来
		   ZipOutputStream zOut = new ZipOutputStream(out);
		   zip(zOut, inputFile, "");
		   zOut.close();
		   info.info("压缩电子流水文件成功结束");
		   return true;
	    } catch (Exception e) {
	       error.error("压缩电子流水文件失败:"+e.getMessage()+"\r\n");
	       return false;
		}
   }


   public boolean zip(ZipOutputStream zOut, File file, String base) {
		try {
		   // 如果文件句柄是目录
		   if (file.isDirectory()) {
		       //获取目录下的文件
		       File[] listFiles = file.listFiles();
		       // 建立ZIP条目
		       zOut.putNextEntry(new ZipEntry(base + "/"));
		       base =( base.length() == 0 ? "" : base + "/" );
		       /*
		        * 遍历目录下文件   压缩并删除历史日志，排除info.log  info_trial.log  error.log  error_trial.log  debug.log debug_error.log
		        *
		        */
		       for (int i = 0; i < listFiles.length; i++) {
		    	   if(listFiles[i].isFile() && (listFiles[i].getName() != null && !listFiles[i].getName().equals("")
		    			   && listFiles[i].getName().lastIndexOf(".log") > 11)
		    			  ){
		               // 递归进入本方法
		    		   boolean ret = zip(zOut, listFiles[i], base + listFiles[i].getName());
		    		   if(!ret){
		    			   error.error("压缩电子流水文件失败:"+ ret +"\r\n");
		            	   return false;
		               }
		    		   //删除文件
		    		   deleteFile(listFiles[i]);
		    	   }
		       }
		   }
		   // 如果文件句柄是文件
		   else {
		      if (base == "") {
		          base = file.getName();
		      }
		      // 填入文件句柄
		      zOut.putNextEntry(new ZipEntry(base));
		      // 开始压缩
		      // 从文件入流读,写入ZIP 出流
		      writeFile(zOut,file);
		    }
		    return true;
		} catch (Exception e) {
			error.error("压缩电子流水文件失败:"+e.getMessage()+"\r\n");
			return false;
		}
   }

   /**
    *压缩按设备记录日志的日志
    * @return
    */
   public boolean zipJournalLog(){
	   info.info("压缩trans文件开始");
	   String strLogPath = new MiscDB().get("00001", "LogParent","/logs/");
	   //TransLog日志压缩文件保存路径
	   File tranLogHisPath = new File(strLogPath  + "TransLogHis");
	   if(!tranLogHisPath.exists()){
		   tranLogHisPath.mkdir();
	   }
	   if(getClass().getResource("").getFile().toString().indexOf("trial") > -1 ){
		   try {
			Thread.sleep(5*1000);
		   } catch (InterruptedException e) {
				error.error("sleep异常", e);
		   }
	   }
	   //TransLog日志压缩文件名
	   String tranLogZipName =  tranLogHisPath + File.separator + new DateCtrl().getDateStrSimpleYestoday() + ".zip";
	   File tranLogZipFile = new File(tranLogZipName);
	   //判断文件是否存在，避免多节点执行
	   if(tranLogZipFile.exists()){
		   info.info("压缩trans文件已存在");
		   return true;
	   }else{
		   	try {
		   		tranLogZipFile.createNewFile();
			} catch (IOException e) {
				error.error("创建压缩trans文件失败:"+e.getMessage()+"\r\n");
			}
	   }
	   //transLog日志路径
	   File inputFile = new File(strLogPath+"TransLog");
	   try {
		   //创建文件输出对象out,提示:注意中文支持
		   FileOutputStream out = new FileOutputStream(new String(tranLogZipName.getBytes("UTF-8")));
		   //將文件輸出ZIP输出流接起来
		   ZipOutputStream zOut = new ZipOutputStream(out);
		   zipJournalLog(zOut, inputFile, "");
		   zOut.close();
		   info.info("压缩trans文件成功结束");
		   return true;
	    } catch (Exception e) {
	       error.error("压缩trans流水文件失败:"+e.getMessage()+"\r\n");
	       return false;
		}
   }

   /**
    * 压缩按设备生成日志的日志
    * @param zOut
    * @param file
    * @param base
    * @return
    */
   public boolean zipJournalLog(ZipOutputStream zOut, File file, String base) {
		try {
		   // 如果文件句柄是目录
		   if (file.isDirectory()) {
		       //获取目录下的文件
		       File[] listFiles = file.listFiles();
		       // 建立ZIP条目
		       zOut.putNextEntry(new ZipEntry(base + "/"));
		       base =( base.length() == 0 ? "" : base + "/" );
		       /*
		        * 遍历目录下文件   压缩并删除历史日志，
		        *
		        */
		       for (int i = 0; i < listFiles.length; i++) {
		    	   if(listFiles[i].isDirectory()
		    			   || (listFiles[i].isFile() && new DateCtrl().getDateStrSimple().compareTo(listFiles[i].getName().substring(0, 10)) > 0 )){
		               // 递归进入本方法
		    		   boolean ret = zipJournalLog(zOut, listFiles[i], base + listFiles[i].getName());
		    		   if(!ret){
		    			   error.error("压缩trans流水文件失败:"+ ret +"\r\n");
		            	   return false;
		               }else if(listFiles[i].isFile()){
		            	   deleteFile(listFiles[i]);
		               }
		    	   }
		       }
		   }
		   // 如果文件句柄是文件
		   else {
		      if (base == "") {
		          base = file.getName();
		      }
		      // 填入文件句柄
		      zOut.putNextEntry(new ZipEntry(base));
		      // 开始压缩
		      // 从文件入流读,写入ZIP 出流
		      writeFile(zOut,file);
		    }
		    return true;
		} catch (Exception e) {
			error.error("压缩trans流水文件失败:"+e.getMessage()+"\r\n");
			return false;
		}
  }

   public void writeFile(ZipOutputStream zOut,File file) throws IOException{
		FileInputStream in = new FileInputStream(file);
		int len;
		while ((len = in.read()) != -1)
		   zOut.write(len);
		in.close();
   }

   /**
    * 删除历史未压缩的文件，该方法暂不再使用。
    * @return
    */
   public boolean deleteHisLog(){//File file, String base
	   String strLogPath = new MiscDB().get("00001", "LogParent","/logs");
	   File file = new File(strLogPath);
	   // 如果文件句柄是目录
	   if (file.isDirectory()) {
	       //获取目录下的文件
	       File[] listFiles = file.listFiles();
	       /*
	        * 遍历目录下文件   删除历史日志，排除info.log  info_trial.log  error.log  error_trial.log  debug.log debug_error.log
	        *
	        */
	       for (int i = 0; i < listFiles.length; i++) {
	    	   if(listFiles[i].isFile() && (listFiles[i].getName() != null && !listFiles[i].getName().equals("")
	    			   && listFiles[i].getName().lastIndexOf(".log") > 11)
	    			  ){
	               deleteFile(strLogPath + listFiles[i].getName());
	    	   }
	       }
	   }else{
		   error.error("LogParent is not Directory :" + strLogPath + "\r\n");
		   return false;
	   }
	   return true;
   }

   /**
    *删除文件
    * @param fileName
    * @return
    */
   public boolean deleteFile(String fileName) {
        File file = new File(fileName);
        return deleteFile(file);

    }

   /**
    * 删除文件
    * @param file
    * @return
    */
   public boolean deleteFile(File file) {
	// 如果文件路径所对应的文件存在，并且是一个文件，则直接删除
       if (file.exists() && file.isFile()) {
           if (file.delete()) {
               return true;
           } else {
           	error.error("删除电子流水文件 " + file.getName() + "失败！\r\n");
               return false;
           }
       } else {
       	error.error("删除电子流水文件失败  " + file.getName() + "不存在！\r\n");
           return false;
       }
   }
}
