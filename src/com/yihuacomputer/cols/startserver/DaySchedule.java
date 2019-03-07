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
 * 每日调度处理类
 * 深圳怡化电脑股份有限公司
 * 2017-07-12
 * 22:00:00  执行影像文件删除
 * 00:30:00  执行日志压缩
 * 02:00:00  执行日终数据库数据迁移
 * 03:00:00  重置CD跨行转账汇路文件处理标志
 * 04:00:00  CD任务执行跨行转账汇路文件处理开始
 *
 *
 */
public class DaySchedule
{
  public static Logger info = Logger.getLogger("Info");
  public static Logger error = Logger.getLogger("Error");
  public static DaySchedule daySchedule = new DaySchedule();
  public static String strRouteFilePath = "/home/its/RouteFile";//转账汇路文件默认存储地址
  public static final int MAXRS_PERLIST = 200000;//数组最大存放的记录条数
  /**
   * <p>调度进程入口</p>
   */
  public void main()
  {
	  info.info("===========启动转账汇路文件批处理===========");
      Thread thread = new Thread()
      {
         public void run()
         {
    	     try{super.sleep(1000);} catch (Exception e){}
             // 每秒检测一次时间
             int PERIOD = 1000;
             while (true)
             {
                try
                {
                   Calendar cal = Calendar.getInstance();
                   cal.setTime(new Date());
                   if(cal.get(Calendar.HOUR_OF_DAY) == 22 && (cal.get(Calendar.MINUTE)==0) && (cal.get(Calendar.SECOND)==0)){//当前的时间为22:00:00点的时候执行
                	   //调用日终处理存储过程
            		   info.info("===========影像文件日终处理开始===========");
                	   boolean iRet = doDeleteImage();
                	   if(iRet){
                		   info.info("===========影像文件日终处理成功===========");
                	   }
                	   else{
                		   error.error("===========影像文件日终处理失败===========");
                	   }
                	   //生成影像文件结束标示
                	   boolean iEndRet = doCreateEndFile();
                	   if(iEndRet){
                		   info.info("===========影像文件日终处理生成结束标示文件成功===========");
                	   }
                	   else{
                		   error.error("===========影像文件日终处理生成结束标示文件失败===========");
                	   }
                   }
                   //else if(cal.get(Calendar.HOUR_OF_DAY) == 23 && (cal.get(Calendar.MINUTE)==59) && (cal.get(Calendar.SECOND)==59)){//当前的时间为23:59:59的时候执行
            	   else if(cal.get(Calendar.HOUR_OF_DAY) == 00 && (cal.get(Calendar.MINUTE)==30) && (cal.get(Calendar.SECOND)==0)){//当前的时间为00:30:00的时候执行
                	   //int i = random(1800);//防止多节点中间相互冲突，这边用一个随机数。防止各节点同时运行该任务
                	   //super.sleep(i*1000);
            		   info.info("===========日志日终处理开始===========");
                	   //调用电子流水备份功能
                	   boolean iRet = new Zip().zip();
                	   if(!iRet){
                		   error.error("===========压缩电子流水失败===========");
                	   }
                	   //压缩删除TransLog日志
                	   iRet = new Zip().zipJournalLog();
                	   if(!iRet){
                		   error.error("===========压缩电子流水失败===========");
                	   }
                	   info.info("===========日志日终处理结束===========");
                   }
                   else if(cal.get(Calendar.HOUR_OF_DAY) == 2 && (cal.get(Calendar.MINUTE)==0) && (cal.get(Calendar.SECOND)==0)){//当前的时间为2点的时候执行
                	   //调用日终处理存储过程
            		   info.info("===========日终处理开始===========");
                	   boolean iRet = doMoveDate();
                	   if(iRet){
                		   info.info("===========日终处理成功===========");
                	   }
                	   else{
                		   error.error("===========日终处理失败===========");
                	   }
                   }
                   else if(cal.get(Calendar.HOUR_OF_DAY) == 3 && (cal.get(Calendar.MINUTE)==0) && (cal.get(Calendar.SECOND)==0)){//当前的时间为3点的时候执行
                	   Misc misc = new MiscDB().getEntityNoCache("00001","DayScheduleFlag");
                	   if(misc == null ){
                		   Misc bean = new Misc();
                		   bean.setId(99999999);
                		   bean.setStrName("DayScheduleFlag");
                		   bean.setStrValue("0");//0:未处理   1：正在处理  2：已经处理完成
                		   bean.setStrDesc("转账汇路文件处理标识");
                		   bean.setStrOrgNum("00001");
                		   new MiscDB().save(bean);
                	   }
                	   else{
                		   misc.setStrValue("0");//0:未处理   1：正在处理  2：已经处理完成
                		   new MiscDB().Update(misc);
                	   }
                   }
                   else if(cal.get(Calendar.HOUR_OF_DAY) == 4 && (cal.get(Calendar.MINUTE)==0) && (cal.get(Calendar.SECOND)==0)){//当前的时间为4点的时候执行
                	   int i = random();//防止集群中间相互冲突，这边用一个随机数。防止各节点同时运行该任务
                	   super.sleep(i*1000);
                	   //先从数据库中取出，是否有节点已经在运行该任务
                	   Misc misc = new MiscDB().getEntityNoCache("00001","DayScheduleFlag");
                	   if(misc != null && misc.getStrValue().equals("0")){//未处理
                		   misc.setStrValue("1");//0:未处理   1：正在处理  2：已经处理完成
                		   new MiscDB().Update(misc);
                		   System.out.println("*******执行日终处理**********");
                		   doSchedule();
                	   }
                	   else{
                		   System.out.println("*******执行日终处理已经执行，无需再执行**********");
                	   }
                   }
                   Thread.sleep(PERIOD);
                } catch (Exception e){
                	error.error("转账汇路文件处理失败:"+e.getMessage());
                }
             }
          }
       };
       thread.start();
  }
  /**
   * 执行调度处理
  */
  protected static void doSchedule()
  {
      Thread thread = new Thread()
      {
        @SuppressWarnings({ "resource", "rawtypes", "unchecked" })
		public void run()
         {
        	 int count=0;//条数
        	 String encoding="GBK";
             List list  = new ArrayList();
        	 //取出转账汇路文件存储的路劲
        	 Misc misc = new MiscDB().getEntity("00001","RouteFilePath");
        	 if(misc != null ){
        		 strRouteFilePath =  misc.getStrValue();
        	 }
        	 //取出当前的日期,读取文件的时候，需要根据当前的日期拼成对应的文件夹名称
        	 String strCurDate = new DateCtrl().getTransDateToView();

        	 info.info("===========跨行转账汇路文件处理开始===========");
             //读取第一个转账的汇路文件
             File file=new File(strRouteFilePath + File.separator + "MBS_HVPBankInfo_"+strCurDate+".bat");
             if(file.isFile() && file.exists()){ //判断文件是否存在
            	 boolean ret = new RouteBankDB().delete();
                 if(!ret){
                	 error.error("===========删除跨行转账汇路表信息失败===========");
                 }else{
                	 info.info("===========删除跨行转账汇路表信息成功===========");
                }
            	info.info("===========大小额转账汇路文件处理开始===========");
                InputStreamReader read = null;
				try {
					count = 0;
					read = new InputStreamReader(new FileInputStream(file),encoding);//考虑到编码格式
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
							// 限制列表中的最大记录条数
					    	if (list.size() >= MAXRS_PERLIST)
					    	{
					    		insert(list);
					    		list  = new ArrayList();
					    	}
                        }
                    }
                    info.info("读取大小额转账汇路文件条数:"+count);
				} catch (UnsupportedEncodingException e) {
					error.error("处理大小额转账汇路文件信息失败:"+e.getMessage());
				} catch (FileNotFoundException e) {
					error.error("处理大小额转账汇路文件信息失败:"+e.getMessage());
				} catch (IOException e) {
					error.error("处理大小额转账汇路文件信息失败:"+e.getMessage());
				} finally{
				    if(read != null){
				    	try {
							read.close();
						} catch (IOException e) {
						    error.error("处理大小额转账汇路文件信息失败:"+e.getMessage());
						}
				    }
				}
             }
             else{
            	 error.error("处理大小额转账汇路文件信息失败:"+"MBS_HVPBankInfo_"+strCurDate+".bat 文件不存在");
             }
             info.info("===========同城转账汇路文件处理开始===========");
             //读取第二个转账汇路文件
             File file2=new File(strRouteFilePath + File.separator + "MBS_HTCBankInfo_"+strCurDate+".bat");
             if(file2.isFile() && file2.exists()){ //判断文件是否存在
                InputStreamReader read = null;
				try {
					count = 0;
					read = new InputStreamReader(new FileInputStream(file2),encoding);//考虑到编码格式
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
							// 限制列表中的最大记录条数
					    	if (list.size() >= MAXRS_PERLIST)
					    	{
					    		insert(list);
					    		list  = new ArrayList();
					    	}
                    	}
                    }
                    info.info("读取同城转账汇路文件条数:"+count);
				} catch (UnsupportedEncodingException e) {
					error.error("处理同城转账汇路文件信息失败:"+e.getMessage());
				} catch (FileNotFoundException e) {
					error.error("处理同城转账汇路文件信息失败:"+e.getMessage());
				} catch (IOException e) {
					error.error("处理同城转账汇路文件信息失败:"+e.getMessage());
				} finally{
				    if(read != null){
				    	try {
							read.close();
						} catch (IOException e) {
						    error.error("处理同城转账汇路文件信息失败:"+e.getMessage());
						}
				    }
				}
             }
             else{
            	 error.error("处理同城转账汇路文件信息失败:"+"MBS_HTCBankInfo_"+strCurDate+".bat 文件不存在");
             }

             info.info("===========农信银转账汇路文件处理开始===========");
             //读取第三个文件
             File file3=new File(strRouteFilePath + File.separator + "MBS_RCCBankInfo_"+strCurDate+".bat");
             if(file3.isFile() && file3.exists()){ //判断文件是否存在
                InputStreamReader read = null;
				try {
					count = 0;
					read = new InputStreamReader(new FileInputStream(file3),encoding);//考虑到编码格式
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
							// 限制列表中的最大记录条数
					    	if (list.size() >= MAXRS_PERLIST)
					    	{
					    		insert(list);
					    		list  = new ArrayList();
					    	}
                    	}
                    }
                    info.info("读取农信银转账汇路文件条数:"+count);
				} catch (UnsupportedEncodingException e) {
					error.error("处理农信银转账汇路文件信息失败:"+e.getMessage());
				} catch (FileNotFoundException e) {
					error.error("处理农信银转账汇路文件信息失败:"+e.getMessage());
				} catch (IOException e) {
					error.error("处理农信银转账汇路文件信息失败:"+e.getMessage());
				} finally{
				    if(read != null){
				    	try {
							read.close();
						} catch (IOException e) {
						    error.error("处理农信银转账汇路文件信息失败:"+e.getMessage());
						}
				    }
				}
             }
             else{
            	 error.error("处理农信银转账汇路文件信息失败:"+"MBS_RCCBankInfo_"+strCurDate+".bat 文件不存在");
             }
             insert(list);
             info.info("===========跨行转账汇路文件处理结束===========");


             info.info("===========本行转账汇路文件处理开始===========");
             list  = new ArrayList();//数组重新初始化
             //读取第一个转账的汇路文件
             File file4=new File(strRouteFilePath + File.separator + "MBS_BranchMap_"+strCurDate+".bat");
             if(file4.isFile() && file4.exists()){ //判断文件是否存在
            	 boolean ret = new BranchMapDB().delete();
                 if(!ret){
                	 error.error("===========删除本行转账汇路表信息失败===========");
                 }else{
                	 info.info("===========删除本行转账汇路表信息成功===========");
                }
                InputStreamReader read = null;
				try {
					count = 0;
					read = new InputStreamReader(new FileInputStream(file4),encoding);//考虑到编码格式
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
							// 限制列表中的最大记录条数
					    	if (list.size() >= MAXRS_PERLIST)
					    	{
					    		insert_local(list);
					    		list  = new ArrayList();
					    	}
                        }
                    }
                    info.info("读取本行转账汇路文件条数:"+count);
				} catch (UnsupportedEncodingException e) {
					error.error("处理本行转账汇路文件信息失败:"+e.getMessage());
				} catch (FileNotFoundException e) {
					error.error("处理本行转账汇路文件信息失败:"+e.getMessage());
				} catch (IOException e) {
					error.error("处理本行转账汇路文件信息失败:"+e.getMessage());
				} finally{
				    if(read != null){
				    	try {
							read.close();
						} catch (IOException e) {
						    error.error("处理本行转账汇路文件信息失败:"+e.getMessage());
						}
				    }
				}
             }
             else{
            	 error.error("处理本行转账汇路文件信息失败:"+"MBS_BranchMap_"+strCurDate+".bat 文件不存在");
             }
             insert_local(list);
             info.info("===========本行转账汇路文件处理结束===========");
             //从数据库中取出，修改成已处理状态
             Misc bean = new MiscDB().getEntityNoCache("00001","DayScheduleFlag");
      	     if(bean != null){//已经处理完成
      	    	bean.setStrValue("2");//0:未处理   1：正在处理  2：已经处理完成
      		    new MiscDB().Update(bean);
      	     }
             info.info("===========转账汇路文件处理结束===========");
             info.info("===========删除转账汇路文件开始===========");
             try {
                 delAllFile(strRouteFilePath); //删除完里面所有内容
                 info.info("===========删除转账汇路文件成功===========");
              } catch (Exception e) {
                error.error("删除转账汇路文件失败:"+e.getMessage());
              }
             info.info("===========删除转账汇路文件结束===========");
         }
      };
      thread.start();
  }

  //清空汇路文件方法
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
   *影像文件删除
  */
  public boolean doDeleteImage()
  {
    boolean bRet = false;
    String path = (getClass().getProtectionDomain().getCodeSource().getLocation().getPath()).substring(1, (getClass().getProtectionDomain().getCodeSource().getLocation().getPath()).indexOf("WEB-INF"));//获取工程路径
	String strDirPath= File.separator + path + "File";
	try {
		File dir = new File(strDirPath);
	    if(dir.exists()) {
	    	removeDir(dir);
	    	bRet = true;
	    }else {
	    	// 记录日志流水
        	error.error("影像文件日终处理失败:无影像文件");
    		bRet = false;
	    }
	}catch(Exception e) {
		// 记录日志流水
    	error.error("影像文件日终处理失败:"+ e.getMessage());
    	bRet = false;
	}
    return bRet;
  }

  /**
   *影像文件删除完毕标示
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
		// 记录日志流水
    	error.error("影像文件日终处理生成标示文件失败:"+ e.getMessage());
    	bRet = false;
	}
    return bRet;
  }

  /**
   * 遍历所有文件
  */
  public static void removeDir(File file)
  {
	  File[] files = file.listFiles();
	  for(File f:files) {
		  if(f.isDirectory()) {
			  //删除影像文件，保留DaySchedule文件夹
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
   *调用存储过程
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
        //无异常且存储过程的返回值为0或为100
        if (cstmt.getInt(1) == 0||cstmt.getInt(1) ==100)
        {
           bRet = true;
        }
    }
    catch (Exception e)
    {
       // 记录日志流水
    	error.error("日终处理失败:"+e.getMessage());
       bRet = false;
    }
    finally
    {
    	HibernateUtil.closeSession();
    }
    return bRet;
  }

  /**
   * 随机数
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
   * 把数据插入数据库
  */
  @SuppressWarnings("rawtypes")
  public static void insert(List list){
	  if (list !=null && list.size() > 0){
		 //向数据库里面插入新数据
     	 boolean ret = new RouteBankDB().insert(list);
     	 if(!ret){
     		error.error("更新跨行转账汇路文件失败");
     	 }
	  }
  }

  /**
   * 把数据插入数据库
  */
  @SuppressWarnings("rawtypes")
  public static void insert_local(List list){
	  if (list !=null && list.size() > 0){
		 //向数据库里面插入新数据
     	 boolean ret = new BranchMapDB().insert(list);
     	 if(!ret){
     		error.error("更新本行转账汇路文件失败");
     	 }
	  }
  }
}
