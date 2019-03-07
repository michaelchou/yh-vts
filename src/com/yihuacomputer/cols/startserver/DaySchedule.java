package com.yihuacomputer.cols.startserver;

import java.io.BufferedReader;
import java.io.File;
import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.io.FileWriter;
import java.io.IOException;
import java.io.InputStreamReader;
import java.io.UnsupportedEncodingException;
import java.sql.CallableStatement;
import java.sql.Connection;
import java.sql.Types;
import java.util.ArrayList;
import java.util.Calendar;
import java.util.Date;
import java.util.List;
import java.util.Random;

import org.apache.log4j.Logger;
import org.hibernate.Session;

import com.yihuacomputer.cols.common.util.HibernateUtil;
import com.yihuacomputer.cols.crypto.Zip;
import com.yihuacomputer.cols.database.BranchMapDB;
import com.yihuacomputer.cols.database.MiscDB;
import com.yihuacomputer.cols.database.RouteBankDB;
import com.yihuacomputer.cols.entity.BranchMap;
import com.yihuacomputer.cols.entity.Misc;
import com.yihuacomputer.cols.entity.RouteBank;
import com.yihuacomputer.cols.util.DateCtrl;

/**
 * ÿ�յ��ȴ�����
 * �����������Թɷ����޹�˾
 * 2017-07-12
 * 22:00:00  ִ��Ӱ���ļ�ɾ��
 * 00:30:00  ִ����־ѹ��
 * 02:00:00  ִ���������ݿ�����Ǩ��
 * 03:00:00  ����CD����ת�˻�·�ļ������־
 * 04:00:00  CD����ִ�п���ת�˻�·�ļ�����ʼ
 *
 *
 */
public class DaySchedule
{
  public static Logger info = Logger.getLogger("Info");
  public static Logger error = Logger.getLogger("Error");
  public static DaySchedule daySchedule = new DaySchedule();
  public static String strRouteFilePath = "/home/its/RouteFile";//ת�˻�·�ļ�Ĭ�ϴ洢��ַ
  public static final int MAXRS_PERLIST = 200000;//��������ŵļ�¼����
  /**
   * <p>���Ƚ������</p>
   */
  public void main()
  {
	  info.info("===========����ת�˻�·�ļ�������===========");
      Thread thread = new Thread()
      {
         public void run()
         {
    	     try{super.sleep(1000);} catch (Exception e){}
             // ÿ����һ��ʱ��
             int PERIOD = 1000;
             while (true)
             {
                try
                {
                   Calendar cal = Calendar.getInstance();
                   cal.setTime(new Date());
                   if(cal.get(Calendar.HOUR_OF_DAY) == 22 && (cal.get(Calendar.MINUTE)==0) && (cal.get(Calendar.SECOND)==0)){//��ǰ��ʱ��Ϊ22:00:00���ʱ��ִ��
                	   //�������մ���洢����
            		   info.info("===========Ӱ���ļ����մ���ʼ===========");
                	   boolean iRet = doDeleteImage();
                	   if(iRet){
                		   info.info("===========Ӱ���ļ����մ���ɹ�===========");
                	   }
                	   else{
                		   error.error("===========Ӱ���ļ����մ���ʧ��===========");
                	   }
                	   //����Ӱ���ļ�������ʾ
                	   boolean iEndRet = doCreateEndFile();
                	   if(iEndRet){
                		   info.info("===========Ӱ���ļ����մ������ɽ�����ʾ�ļ��ɹ�===========");
                	   }
                	   else{
                		   error.error("===========Ӱ���ļ����մ������ɽ�����ʾ�ļ�ʧ��===========");
                	   }
                   }
                   //else if(cal.get(Calendar.HOUR_OF_DAY) == 23 && (cal.get(Calendar.MINUTE)==59) && (cal.get(Calendar.SECOND)==59)){//��ǰ��ʱ��Ϊ23:59:59��ʱ��ִ��
            	   else if(cal.get(Calendar.HOUR_OF_DAY) == 00 && (cal.get(Calendar.MINUTE)==30) && (cal.get(Calendar.SECOND)==0)){//��ǰ��ʱ��Ϊ00:30:00��ʱ��ִ��
                	   //int i = random(1800);//��ֹ��ڵ��м��໥��ͻ�������һ�����������ֹ���ڵ�ͬʱ���и�����
                	   //super.sleep(i*1000);
            		   info.info("===========��־���մ���ʼ===========");
                	   //���õ�����ˮ���ݹ���
                	   boolean iRet = new Zip().zip();
                	   if(!iRet){
                		   error.error("===========ѹ��������ˮʧ��===========");
                	   }
                	   //ѹ��ɾ��TransLog��־
                	   iRet = new Zip().zipJournalLog();
                	   if(!iRet){
                		   error.error("===========ѹ��������ˮʧ��===========");
                	   }
                	   info.info("===========��־���մ������===========");
                   }
                   else if(cal.get(Calendar.HOUR_OF_DAY) == 2 && (cal.get(Calendar.MINUTE)==0) && (cal.get(Calendar.SECOND)==0)){//��ǰ��ʱ��Ϊ2���ʱ��ִ��
                	   //�������մ���洢����
            		   info.info("===========���մ���ʼ===========");
                	   boolean iRet = doMoveDate();
                	   if(iRet){
                		   info.info("===========���մ���ɹ�===========");
                	   }
                	   else{
                		   error.error("===========���մ���ʧ��===========");
                	   }
                   }
                   else if(cal.get(Calendar.HOUR_OF_DAY) == 3 && (cal.get(Calendar.MINUTE)==0) && (cal.get(Calendar.SECOND)==0)){//��ǰ��ʱ��Ϊ3���ʱ��ִ��
                	   Misc misc = new MiscDB().getEntityNoCache("00001","DayScheduleFlag");
                	   if(misc == null ){
                		   Misc bean = new Misc();
                		   bean.setId(99999999);
                		   bean.setStrName("DayScheduleFlag");
                		   bean.setStrValue("0");//0:δ����   1�����ڴ���  2���Ѿ��������
                		   bean.setStrDesc("ת�˻�·�ļ������ʶ");
                		   bean.setStrOrgNum("00001");
                		   new MiscDB().save(bean);
                	   }
                	   else{
                		   misc.setStrValue("0");//0:δ����   1�����ڴ���  2���Ѿ��������
                		   new MiscDB().Update(misc);
                	   }
                   }
                   else if(cal.get(Calendar.HOUR_OF_DAY) == 4 && (cal.get(Calendar.MINUTE)==0) && (cal.get(Calendar.SECOND)==0)){//��ǰ��ʱ��Ϊ4���ʱ��ִ��
                	   int i = random();//��ֹ��Ⱥ�м��໥��ͻ�������һ�����������ֹ���ڵ�ͬʱ���и�����
                	   super.sleep(i*1000);
                	   //�ȴ����ݿ���ȡ�����Ƿ��нڵ��Ѿ������и�����
                	   Misc misc = new MiscDB().getEntityNoCache("00001","DayScheduleFlag");
                	   if(misc != null && misc.getStrValue().equals("0")){//δ����
                		   misc.setStrValue("1");//0:δ����   1�����ڴ���  2���Ѿ��������
                		   new MiscDB().Update(misc);
                		   System.out.println("*******ִ�����մ���**********");
                		   doSchedule();
                	   }
                	   else{
                		   System.out.println("*******ִ�����մ����Ѿ�ִ�У�������ִ��**********");
                	   }
                   }
                   Thread.sleep(PERIOD);
                } catch (Exception e){
                	error.error("ת�˻�·�ļ�����ʧ��:"+e.getMessage());
                }
             }
          }
       };
       thread.start();
  }
  /**
   * ִ�е��ȴ���
  */
  protected static void doSchedule()
  {
      Thread thread = new Thread()
      {
        @SuppressWarnings({ "resource", "rawtypes", "unchecked" })
		public void run()
         {
        	 int count=0;//����
        	 String encoding="GBK";
             List list  = new ArrayList();
        	 //ȡ��ת�˻�·�ļ��洢��·��
        	 Misc misc = new MiscDB().getEntity("00001","RouteFilePath");
        	 if(misc != null ){
        		 strRouteFilePath =  misc.getStrValue();
        	 }
        	 //ȡ����ǰ������,��ȡ�ļ���ʱ����Ҫ���ݵ�ǰ������ƴ�ɶ�Ӧ���ļ�������
        	 String strCurDate = new DateCtrl().getTransDateToView();

        	 info.info("===========����ת�˻�·�ļ�����ʼ===========");
             //��ȡ��һ��ת�˵Ļ�·�ļ�
             File file=new File(strRouteFilePath + File.separator + "MBS_HVPBankInfo_"+strCurDate+".bat");
             if(file.isFile() && file.exists()){ //�ж��ļ��Ƿ����
            	 boolean ret = new RouteBankDB().delete();
                 if(!ret){
                	 error.error("===========ɾ������ת�˻�·����Ϣʧ��===========");
                 }else{
                	 info.info("===========ɾ������ת�˻�·����Ϣ�ɹ�===========");
                }
            	info.info("===========��С��ת�˻�·�ļ�����ʼ===========");
                InputStreamReader read = null;
				try {
					count = 0;
					read = new InputStreamReader(new FileInputStream(file),encoding);//���ǵ������ʽ
	                BufferedReader bufferedReader = new BufferedReader(read);
	                String lineTxt = null;
                    while((lineTxt = bufferedReader.readLine()) != null){
						if(lineTxt != null && !lineTxt.equals("") && lineTxt.indexOf("|") != -1){
							RouteBank bean = new RouteBank();
                            String[] strs=lineTxt.split("\\|");
							bean.setStrRouteCode(strs[0].toString());
							bean.setStrBankCode(strs[1].toString());
							bean.setStrBankName(strs[2].toString());
							bean.setStrBankType(strs[3].toString());
							bean.setStrBankTypeCode(strs[4].toString());
							bean.setStrSettleBankCode(strs[5].toString());
							bean.setStrCCPCCode(strs[6].toString());
							bean.setStrSizeMark(strs[7].toString());
							list.add(bean);
							count++;
							// �����б��е�����¼����
					    	if (list.size() >= MAXRS_PERLIST)
					    	{
					    		insert(list);
					    		list  = new ArrayList();
					    	}
                        }
                    }
                    info.info("��ȡ��С��ת�˻�·�ļ�����:"+count);
				} catch (UnsupportedEncodingException e) {
					error.error("�����С��ת�˻�·�ļ���Ϣʧ��:"+e.getMessage());
				} catch (FileNotFoundException e) {
					error.error("�����С��ת�˻�·�ļ���Ϣʧ��:"+e.getMessage());
				} catch (IOException e) {
					error.error("�����С��ת�˻�·�ļ���Ϣʧ��:"+e.getMessage());
				} finally{
				    if(read != null){
				    	try {
							read.close();
						} catch (IOException e) {
						    error.error("�����С��ת�˻�·�ļ���Ϣʧ��:"+e.getMessage());
						}
				    }
				}
             }
             else{
            	 error.error("�����С��ת�˻�·�ļ���Ϣʧ��:"+"MBS_HVPBankInfo_"+strCurDate+".bat �ļ�������");
             }
             info.info("===========ͬ��ת�˻�·�ļ�����ʼ===========");
             //��ȡ�ڶ���ת�˻�·�ļ�
             File file2=new File(strRouteFilePath + File.separator + "MBS_HTCBankInfo_"+strCurDate+".bat");
             if(file2.isFile() && file2.exists()){ //�ж��ļ��Ƿ����
                InputStreamReader read = null;
				try {
					count = 0;
					read = new InputStreamReader(new FileInputStream(file2),encoding);//���ǵ������ʽ
	                BufferedReader bufferedReader = new BufferedReader(read);
	                String lineTxt = null;
                    while((lineTxt = bufferedReader.readLine()) != null){
                    	if(lineTxt != null && !lineTxt.equals("") && lineTxt.indexOf("|") != -1){
							RouteBank bean = new RouteBank();
	                        String[] strs=lineTxt.split("\\|");
							bean.setStrRouteCode(strs[0].toString());
							bean.setStrBankCode(strs[1].toString());
							bean.setStrBankName(strs[2].toString());
							bean.setStrBankType(strs[3].toString());
							bean.setStrCCPCCode(strs[5].toString());
							list.add(bean);
							count++;
							// �����б��е�����¼����
					    	if (list.size() >= MAXRS_PERLIST)
					    	{
					    		insert(list);
					    		list  = new ArrayList();
					    	}
                    	}
                    }
                    info.info("��ȡͬ��ת�˻�·�ļ�����:"+count);
				} catch (UnsupportedEncodingException e) {
					error.error("����ͬ��ת�˻�·�ļ���Ϣʧ��:"+e.getMessage());
				} catch (FileNotFoundException e) {
					error.error("����ͬ��ת�˻�·�ļ���Ϣʧ��:"+e.getMessage());
				} catch (IOException e) {
					error.error("����ͬ��ת�˻�·�ļ���Ϣʧ��:"+e.getMessage());
				} finally{
				    if(read != null){
				    	try {
							read.close();
						} catch (IOException e) {
						    error.error("����ͬ��ת�˻�·�ļ���Ϣʧ��:"+e.getMessage());
						}
				    }
				}
             }
             else{
            	 error.error("����ͬ��ת�˻�·�ļ���Ϣʧ��:"+"MBS_HTCBankInfo_"+strCurDate+".bat �ļ�������");
             }

             info.info("===========ũ����ת�˻�·�ļ�����ʼ===========");
             //��ȡ�������ļ�
             File file3=new File(strRouteFilePath + File.separator + "MBS_RCCBankInfo_"+strCurDate+".bat");
             if(file3.isFile() && file3.exists()){ //�ж��ļ��Ƿ����
                InputStreamReader read = null;
				try {
					count = 0;
					read = new InputStreamReader(new FileInputStream(file3),encoding);//���ǵ������ʽ
	                BufferedReader bufferedReader = new BufferedReader(read);
	                String lineTxt = null;
                    while((lineTxt = bufferedReader.readLine()) != null){
                    	if(lineTxt != null && !lineTxt.equals("") && lineTxt.indexOf("|") != -1){
							RouteBank bean = new RouteBank();
	                        String[] strs=lineTxt.split("\\|");
							bean.setStrRouteCode(strs[0].toString());
							bean.setStrBankCode(strs[1].toString());
							bean.setStrBankName(strs[2].toString());
							list.add(bean);
							count++;
							// �����б��е�����¼����
					    	if (list.size() >= MAXRS_PERLIST)
					    	{
					    		insert(list);
					    		list  = new ArrayList();
					    	}
                    	}
                    }
                    info.info("��ȡũ����ת�˻�·�ļ�����:"+count);
				} catch (UnsupportedEncodingException e) {
					error.error("����ũ����ת�˻�·�ļ���Ϣʧ��:"+e.getMessage());
				} catch (FileNotFoundException e) {
					error.error("����ũ����ת�˻�·�ļ���Ϣʧ��:"+e.getMessage());
				} catch (IOException e) {
					error.error("����ũ����ת�˻�·�ļ���Ϣʧ��:"+e.getMessage());
				} finally{
				    if(read != null){
				    	try {
							read.close();
						} catch (IOException e) {
						    error.error("����ũ����ת�˻�·�ļ���Ϣʧ��:"+e.getMessage());
						}
				    }
				}
             }
             else{
            	 error.error("����ũ����ת�˻�·�ļ���Ϣʧ��:"+"MBS_RCCBankInfo_"+strCurDate+".bat �ļ�������");
             }
             insert(list);
             info.info("===========����ת�˻�·�ļ��������===========");


             info.info("===========����ת�˻�·�ļ�����ʼ===========");
             list  = new ArrayList();//�������³�ʼ��
             //��ȡ��һ��ת�˵Ļ�·�ļ�
             File file4=new File(strRouteFilePath + File.separator + "MBS_BranchMap_"+strCurDate+".bat");
             if(file4.isFile() && file4.exists()){ //�ж��ļ��Ƿ����
            	 boolean ret = new BranchMapDB().delete();
                 if(!ret){
                	 error.error("===========ɾ������ת�˻�·����Ϣʧ��===========");
                 }else{
                	 info.info("===========ɾ������ת�˻�·����Ϣ�ɹ�===========");
                }
                InputStreamReader read = null;
				try {
					count = 0;
					read = new InputStreamReader(new FileInputStream(file4),encoding);//���ǵ������ʽ
	                BufferedReader bufferedReader = new BufferedReader(read);
	                String lineTxt = null;
                    while((lineTxt = bufferedReader.readLine()) != null){
						if(lineTxt != null && !lineTxt.equals("") && lineTxt.indexOf("|") != -1){
							BranchMap bean = new BranchMap();
                            String[] strs=lineTxt.split("\\|");
							bean.setStrLocalRouteCode(strs[0].toString());
							bean.setStrLocalBankCode(strs[1].toString());
							list.add(bean);
							count++;
							// �����б��е�����¼����
					    	if (list.size() >= MAXRS_PERLIST)
					    	{
					    		insert_local(list);
					    		list  = new ArrayList();
					    	}
                        }
                    }
                    info.info("��ȡ����ת�˻�·�ļ�����:"+count);
				} catch (UnsupportedEncodingException e) {
					error.error("������ת�˻�·�ļ���Ϣʧ��:"+e.getMessage());
				} catch (FileNotFoundException e) {
					error.error("������ת�˻�·�ļ���Ϣʧ��:"+e.getMessage());
				} catch (IOException e) {
					error.error("������ת�˻�·�ļ���Ϣʧ��:"+e.getMessage());
				} finally{
				    if(read != null){
				    	try {
							read.close();
						} catch (IOException e) {
						    error.error("������ת�˻�·�ļ���Ϣʧ��:"+e.getMessage());
						}
				    }
				}
             }
             else{
            	 error.error("������ת�˻�·�ļ���Ϣʧ��:"+"MBS_BranchMap_"+strCurDate+".bat �ļ�������");
             }
             insert_local(list);
             info.info("===========����ת�˻�·�ļ��������===========");
             //�����ݿ���ȡ�����޸ĳ��Ѵ���״̬
             Misc bean = new MiscDB().getEntityNoCache("00001","DayScheduleFlag");
      	     if(bean != null){//�Ѿ��������
      	    	bean.setStrValue("2");//0:δ����   1�����ڴ���  2���Ѿ��������
      		    new MiscDB().Update(bean);
      	     }
             info.info("===========ת�˻�·�ļ��������===========");
             info.info("===========ɾ��ת�˻�·�ļ���ʼ===========");
             try {
                 delAllFile(strRouteFilePath); //ɾ����������������
                 info.info("===========ɾ��ת�˻�·�ļ��ɹ�===========");
              } catch (Exception e) {
                error.error("ɾ��ת�˻�·�ļ�ʧ��:"+e.getMessage());
              }
             info.info("===========ɾ��ת�˻�·�ļ�����===========");
         }
      };
      thread.start();
  }

  //��ջ�·�ļ�����
  public static boolean delAllFile(String path) {

	  boolean flag = false;
      File fileDelete = new File(path);
      File temp = null;
      String[] tempList = fileDelete.list();
      for (int i = 0; i < tempList.length; i++) {
    	  temp = new File(path + File.separator + tempList[i]);
         if (temp.isFile()) {
            temp.delete();
            flag = true;
         }
      }
      return flag;
    }

  /**
   *Ӱ���ļ�ɾ��
  */
  public boolean doDeleteImage()
  {
    boolean bRet = false;
    String path = (getClass().getProtectionDomain().getCodeSource().getLocation().getPath()).substring(1, (getClass().getProtectionDomain().getCodeSource().getLocation().getPath()).indexOf("WEB-INF"));//��ȡ����·��
	String strDirPath= File.separator + path + "File";
	try {
		File dir = new File(strDirPath);
	    if(dir.exists()) {
	    	removeDir(dir);
	    	bRet = true;
	    }else {
	    	// ��¼��־��ˮ
        	error.error("Ӱ���ļ����մ���ʧ��:��Ӱ���ļ�");
    		bRet = false;
	    }
	}catch(Exception e) {
		// ��¼��־��ˮ
    	error.error("Ӱ���ļ����մ���ʧ��:"+ e.getMessage());
    	bRet = false;
	}
    return bRet;
  }

  /**
   *Ӱ���ļ�ɾ����ϱ�ʾ
  */
  public boolean doCreateEndFile()
  {
    boolean bRet = false;
	String strImagePath= File.separator + "home" + File.separator + "its" + File.separator + "ImageDaySchedule";
	String strEndFilePath = strImagePath + File.separator + "transflow_ai_" + new DateCtrl().getTransDateToView() + ".end";
	String strNewFilePath = strImagePath + File.separator + "transflow_ai_" + new DateCtrl().getDateStrSimpleTomorrow() + ".del";
	try {
		File dir = new File(strImagePath);
		if (dir.isDirectory() || dir.mkdir())
		{
			FileWriter fw = new FileWriter(strEndFilePath, true);
			fw.write("End Success" + "\r\n");
			fw.close();
			FileWriter fw1 = new FileWriter(strNewFilePath, true);
			fw1.write("");
			fw1.close();
			bRet = true;
		}
	}catch(Exception e) {
		// ��¼��־��ˮ
    	error.error("Ӱ���ļ����մ������ɱ�ʾ�ļ�ʧ��:"+ e.getMessage());
    	bRet = false;
	}
    return bRet;
  }

  /**
   * ���������ļ�
  */
  public static void removeDir(File file)
  {
	  File[] files = file.listFiles();
	  for(File f:files) {
		  if(f.isDirectory()) {
			  //ɾ��Ӱ���ļ�������DaySchedule�ļ���
			  if(f.getName().indexOf("DaySchedule") == -1) {
				  removeDir(f);
			  }
		  }else {
			  f.delete();
		  }
	  }
	  file.delete();
  }

/**
   *���ô洢����
  */
  public boolean doMoveDate()
 {
    boolean bRet = false;
    CallableStatement cstmt = null;
    String procedure = "{call DayProcess(?)}";
    try
    {
        Session session = HibernateUtil.getSession();
        Connection conn = session.connection();
        cstmt = conn.prepareCall(procedure);
        cstmt.registerOutParameter(1, Types.INTEGER);
        cstmt.execute();
        //���쳣�Ҵ洢���̵ķ���ֵΪ0��Ϊ100
        if (cstmt.getInt(1) == 0||cstmt.getInt(1) ==100)
        {
           bRet = true;
        }
    }
    catch (Exception e)
    {
       // ��¼��־��ˮ
    	error.error("���մ���ʧ��:"+e.getMessage());
       bRet = false;
    }
    finally
    {
    	HibernateUtil.closeSession();
    }
    return bRet;
  }

  /**
   * �����
  */
  public static int random(){
	  return random(3600);
  }

  public static int random(int max){
      int min=1;
      if(max < min){
    	  max = min;
      }
      Random random = new Random();
      int s = random.nextInt(max)%(max-min+1) + min;
      return s;
  }

  /**
   * �����ݲ������ݿ�
  */
  @SuppressWarnings("rawtypes")
  public static void insert(List list){
	  if (list !=null && list.size() > 0){
		 //�����ݿ��������������
     	 boolean ret = new RouteBankDB().insert(list);
     	 if(!ret){
     		error.error("���¿���ת�˻�·�ļ�ʧ��");
     	 }
	  }
  }

  /**
   * �����ݲ������ݿ�
  */
  @SuppressWarnings("rawtypes")
  public static void insert_local(List list){
	  if (list !=null && list.size() > 0){
		 //�����ݿ��������������
     	 boolean ret = new BranchMapDB().insert(list);
     	 if(!ret){
     		error.error("���±���ת�˻�·�ļ�ʧ��");
     	 }
	  }
  }
}
