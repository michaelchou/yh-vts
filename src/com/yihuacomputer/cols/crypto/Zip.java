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
 * ������ˮ�ļ�ѹ��
 */
public class Zip
{
   private Logger error = Logger.getLogger("Error");
   private Logger info = Logger.getLogger("Info");

   public boolean zip() {
	   info.info("ѹ��������ˮ�ļ���ʼ");
	   //��ȡ��־Ŀ¼
	   String strLogPath = new MiscDB().get("00001", "LogParent","/logs/");
	   //�ļ���׺
	   String suffix = ".zip";
	   //trial�ڵ�˯��5���ӣ���formal��ִ��
	   if(getClass().getResource("").getFile().toString().indexOf("trial") > -1 ){
		   try {
			Thread.sleep(5*1000);
		   } catch (InterruptedException e) {
				error.error("sleep�쳣", e);
		   }
	   }
	   //�жϱ�����ʷ�ļ�Ŀ¼�Ƿ���ڣ��������򴴽�
	   File tempF = new File(strLogPath  + "history");
	   if(!tempF.exists()){
		   tempF.mkdir();
	   }
	   //����ѹ���ļ���,���жϸ��ļ��Ƿ��Ѵ��ڣ����Ѵ�������ִ��
	   String zipFileName = strLogPath  + "history" + File.separator + new DateCtrl().getDateStrSimpleYestoday() + suffix;
	   File zipFile = new File(zipFileName);
	   if(!zipFile.exists()){
		   try {
			   zipFile.createNewFile();
		   } catch (IOException e) {
				error.error("�����ļ��쳣", e);
		   }
	   }else{
		   info.info("ѹ���ļ��Ѵ���");
		   return true;
	   }

	   //ѹ����ʷ�ļ�
	   File inputFile = new File(strLogPath);
	   try {
		   //�����ļ��������out,��ʾ:ע������֧��
		   FileOutputStream out = new FileOutputStream(new String(zipFileName.getBytes("UTF-8")));
		   //���ļ�ݔ��ZIP�����������
		   ZipOutputStream zOut = new ZipOutputStream(out);
		   zip(zOut, inputFile, "");
		   zOut.close();
		   info.info("ѹ��������ˮ�ļ��ɹ�����");
		   return true;
	    } catch (Exception e) {
	       error.error("ѹ��������ˮ�ļ�ʧ��:"+e.getMessage()+"\r\n");
	       return false;
		}
   }


   public boolean zip(ZipOutputStream zOut, File file, String base) {
		try {
		   // ����ļ������Ŀ¼
		   if (file.isDirectory()) {
		       //��ȡĿ¼�µ��ļ�
		       File[] listFiles = file.listFiles();
		       // ����ZIP��Ŀ
		       zOut.putNextEntry(new ZipEntry(base + "/"));
		       base =( base.length() == 0 ? "" : base + "/" );
		       /*
		        * ����Ŀ¼���ļ�   ѹ����ɾ����ʷ��־���ų�info.log  info_trial.log  error.log  error_trial.log  debug.log debug_error.log
		        *
		        */
		       for (int i = 0; i < listFiles.length; i++) {
		    	   if(listFiles[i].isFile() && (listFiles[i].getName() != null && !listFiles[i].getName().equals("")
		    			   && listFiles[i].getName().lastIndexOf(".log") > 11)
		    			  ){
		               // �ݹ���뱾����
		    		   boolean ret = zip(zOut, listFiles[i], base + listFiles[i].getName());
		    		   if(!ret){
		    			   error.error("ѹ��������ˮ�ļ�ʧ��:"+ ret +"\r\n");
		            	   return false;
		               }
		    		   //ɾ���ļ�
		    		   deleteFile(listFiles[i]);
		    	   }
		       }
		   }
		   // ����ļ�������ļ�
		   else {
		      if (base == "") {
		          base = file.getName();
		      }
		      // �����ļ����
		      zOut.putNextEntry(new ZipEntry(base));
		      // ��ʼѹ��
		      // ���ļ�������,д��ZIP ����
		      writeFile(zOut,file);
		    }
		    return true;
		} catch (Exception e) {
			error.error("ѹ��������ˮ�ļ�ʧ��:"+e.getMessage()+"\r\n");
			return false;
		}
   }

   /**
    *ѹ�����豸��¼��־����־
    * @return
    */
   public boolean zipJournalLog(){
	   info.info("ѹ��trans�ļ���ʼ");
	   String strLogPath = new MiscDB().get("00001", "LogParent","/logs/");
	   //TransLog��־ѹ���ļ�����·��
	   File tranLogHisPath = new File(strLogPath  + "TransLogHis");
	   if(!tranLogHisPath.exists()){
		   tranLogHisPath.mkdir();
	   }
	   if(getClass().getResource("").getFile().toString().indexOf("trial") > -1 ){
		   try {
			Thread.sleep(5*1000);
		   } catch (InterruptedException e) {
				error.error("sleep�쳣", e);
		   }
	   }
	   //TransLog��־ѹ���ļ���
	   String tranLogZipName =  tranLogHisPath + File.separator + new DateCtrl().getDateStrSimpleYestoday() + ".zip";
	   File tranLogZipFile = new File(tranLogZipName);
	   //�ж��ļ��Ƿ���ڣ������ڵ�ִ��
	   if(tranLogZipFile.exists()){
		   info.info("ѹ��trans�ļ��Ѵ���");
		   return true;
	   }else{
		   	try {
		   		tranLogZipFile.createNewFile();
			} catch (IOException e) {
				error.error("����ѹ��trans�ļ�ʧ��:"+e.getMessage()+"\r\n");
			}
	   }
	   //transLog��־·��
	   File inputFile = new File(strLogPath+"TransLog");
	   try {
		   //�����ļ��������out,��ʾ:ע������֧��
		   FileOutputStream out = new FileOutputStream(new String(tranLogZipName.getBytes("UTF-8")));
		   //���ļ�ݔ��ZIP�����������
		   ZipOutputStream zOut = new ZipOutputStream(out);
		   zipJournalLog(zOut, inputFile, "");
		   zOut.close();
		   info.info("ѹ��trans�ļ��ɹ�����");
		   return true;
	    } catch (Exception e) {
	       error.error("ѹ��trans��ˮ�ļ�ʧ��:"+e.getMessage()+"\r\n");
	       return false;
		}
   }

   /**
    * ѹ�����豸������־����־
    * @param zOut
    * @param file
    * @param base
    * @return
    */
   public boolean zipJournalLog(ZipOutputStream zOut, File file, String base) {
		try {
		   // ����ļ������Ŀ¼
		   if (file.isDirectory()) {
		       //��ȡĿ¼�µ��ļ�
		       File[] listFiles = file.listFiles();
		       // ����ZIP��Ŀ
		       zOut.putNextEntry(new ZipEntry(base + "/"));
		       base =( base.length() == 0 ? "" : base + "/" );
		       /*
		        * ����Ŀ¼���ļ�   ѹ����ɾ����ʷ��־��
		        *
		        */
		       for (int i = 0; i < listFiles.length; i++) {
		    	   if(listFiles[i].isDirectory()
		    			   || (listFiles[i].isFile() && new DateCtrl().getDateStrSimple().compareTo(listFiles[i].getName().substring(0, 10)) > 0 )){
		               // �ݹ���뱾����
		    		   boolean ret = zipJournalLog(zOut, listFiles[i], base + listFiles[i].getName());
		    		   if(!ret){
		    			   error.error("ѹ��trans��ˮ�ļ�ʧ��:"+ ret +"\r\n");
		            	   return false;
		               }else if(listFiles[i].isFile()){
		            	   deleteFile(listFiles[i]);
		               }
		    	   }
		       }
		   }
		   // ����ļ�������ļ�
		   else {
		      if (base == "") {
		          base = file.getName();
		      }
		      // �����ļ����
		      zOut.putNextEntry(new ZipEntry(base));
		      // ��ʼѹ��
		      // ���ļ�������,д��ZIP ����
		      writeFile(zOut,file);
		    }
		    return true;
		} catch (Exception e) {
			error.error("ѹ��trans��ˮ�ļ�ʧ��:"+e.getMessage()+"\r\n");
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
    * ɾ����ʷδѹ�����ļ����÷����ݲ���ʹ�á�
    * @return
    */
   public boolean deleteHisLog(){//File file, String base
	   String strLogPath = new MiscDB().get("00001", "LogParent","/logs");
	   File file = new File(strLogPath);
	   // ����ļ������Ŀ¼
	   if (file.isDirectory()) {
	       //��ȡĿ¼�µ��ļ�
	       File[] listFiles = file.listFiles();
	       /*
	        * ����Ŀ¼���ļ�   ɾ����ʷ��־���ų�info.log  info_trial.log  error.log  error_trial.log  debug.log debug_error.log
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
    *ɾ���ļ�
    * @param fileName
    * @return
    */
   public boolean deleteFile(String fileName) {
        File file = new File(fileName);
        return deleteFile(file);

    }

   /**
    * ɾ���ļ�
    * @param file
    * @return
    */
   public boolean deleteFile(File file) {
	// ����ļ�·������Ӧ���ļ����ڣ�������һ���ļ�����ֱ��ɾ��
       if (file.exists() && file.isFile()) {
           if (file.delete()) {
               return true;
           } else {
           	error.error("ɾ��������ˮ�ļ� " + file.getName() + "ʧ�ܣ�\r\n");
               return false;
           }
       } else {
       	error.error("ɾ��������ˮ�ļ�ʧ��  " + file.getName() + "�����ڣ�\r\n");
           return false;
       }
   }
}
