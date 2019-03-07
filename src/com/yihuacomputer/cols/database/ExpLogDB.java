package com.yihuacomputer.cols.database;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.SQLException;
import java.util.List;

import org.apache.log4j.Logger;
import org.hibernate.Query;
import org.hibernate.Session;

import com.yihuacomputer.cols.common.util.HibernateUtil;
import com.yihuacomputer.cols.entity.ExpLog;

/**
 * 异常处理表处理类
 * 深圳怡化电脑股份有限公司
 * 2017-06-12
 */

public class ExpLogDB
{
	public Logger logErr = Logger.getLogger("Error");

    public ExpLogDB()
    {
    }


   /**
    * 记录交易过程中出现的异常</p>
    * 参数1：tl   流水内容
    * 返回值: bRet boolean 处理结果  true=成功  false=失败
    */
   public boolean save(ExpLog tl)
   {
      boolean bRet = false;
      try
      {
         Session session = HibernateUtil.getSession();
         HibernateUtil.beginTransaction();
         session.save(tl);
         HibernateUtil.commitTransaction();
         bRet = true;
      }
      catch (Exception e)
      {
        // 记录日志流水
        logErr.error("处理异常信息失败:"+e);
        HibernateUtil.rollbackTransaction();
        bRet = false;
      }
      finally
      {
        HibernateUtil.closeSession();
      }
      return bRet;
    }
   
   /**
	   * 根据终端编号,异常处理码查询异常处理记录</p>
	   * strTerminalNum String  //终端编号
	   * strExpCode String 异常处理码
	   * list List  异常处理记录
	*/
	public List<?> getList(String strTerminalNum, String strExpCode)
	{
	    List<?> list = null;
	    try
	    {
	      Session session = HibernateUtil.getSession();
	      String hql =
	              "from ExpLog where strTerminalNum = :strTerminalNum and strExpCode=:strExpCode order by dtOccur "; //参数绑定，避免sql注入
	      Query query = session.createQuery(hql);
	      query.setString("strTerminalNum", strTerminalNum );
	      query.setString("strExpCode", strExpCode);
	      //设置查询缓存
	     

	      list = query.list();
	      if (list == null || list.isEmpty())
	    	  list = null;
	    }
	    catch (Exception e)
	    {
	      // 记录日志流水
		  logErr.error("取异常列表失败:"+e);
	    }
	    finally
	    {
	      HibernateUtil.closeSession();
	    }
	    return list;
	}
	
	  /**
	   * 根据终端编号,异常处理码查询异常处理记录</p>
	   * strTerminalNum String  //终端编号
	   *
	   * list List  异常处理记录
	*/
	public List<?> getCardList(String strTerminalNum)
	{
	    List<?> list = null;
	    try
	    {
	      Session session = HibernateUtil.getSession();
	      String hql =
	              "from ExpLog where strTerminalNum = :strTerminalNum and strExpCode in ('Exp01001','Exp01002')  order by dtOccur "; //参数绑定，避免sql注入
	      Query query = session.createQuery(hql);
	      query.setString("strTerminalNum", strTerminalNum );

	
	      //设置查询缓存
	     

	      list = query.list();
	      if (list == null || list.isEmpty())
	    	  list = null;
	    }
	    catch (Exception e)
	    {
	      // 记录日志流水
	    	e.printStackTrace();
		  logErr.error("取异常列表失败:"+e);
	    }
	    finally
	    {
	      HibernateUtil.closeSession();
	    }
	    return list;
	}
	
	public List<?> getDispenserCardList(String strTerminalNum)
	{
	    List<?> list = null;
	    try
	    {
	      Session session = HibernateUtil.getSession();
	      String hql =
	              "from ExpLog where strTerminalNum = :strTerminalNum and strExpCode = 'Exp01002'  order by dtOccur "; //参数绑定，避免sql注入
	      Query query = session.createQuery(hql);
	      query.setString("strTerminalNum", strTerminalNum );

	
	      //设置查询缓存
	     

	      list = query.list();
	      if (list == null || list.isEmpty())
	    	  list = null;
	    }
	    catch (Exception e)
	    {
	      // 记录日志流水
	    	e.printStackTrace();
		  logErr.error("取异常列表失败:"+e);
	    }
	    finally
	    {
	      HibernateUtil.closeSession();
	    }
	    return list;
	}
	
	public List<?> getDispenserKeyList(String strTerminalNum)
	{
	    List<?> list = null;
	    try
	    {
	      Session session = HibernateUtil.getSession();
	      String hql =
	              "from ExpLog where strTerminalNum = :strTerminalNum and strExpCode = 'Exp01003'  order by dtOccur "; //参数绑定，避免sql注入
	      Query query = session.createQuery(hql);
	      query.setString("strTerminalNum", strTerminalNum );

	
	      //设置查询缓存
	     

	      list = query.list();
	      if (list == null || list.isEmpty())
	    	  list = null;
	    }
	    catch (Exception e)
	    {
	      // 记录日志流水
	    	e.printStackTrace();
		  logErr.error("取异常列表失败:"+e);
	    }
	    finally
	    {
	      HibernateUtil.closeSession();
	    }
	    return list;
	}
	
	  /**
	   * 根据终端编号,删除吞卡明细记录</p>
	   * strTerminalNum String  //终端编号
	   *
	*/
	public boolean  removeCardExpLog(String strTerminalNum)
 {
		boolean ret = false;
	    String sql = "delete from ExpLog where strTerminalNum=? and strExpCode in ('Exp01001','Exp01002') ";
	    Session session = HibernateUtil.getSession();
	    Connection dbm = session.connection();
		HibernateUtil.beginTransaction();
	    try
	    {
	      PreparedStatement pre = dbm.prepareStatement(sql);
	      pre.setString(1, strTerminalNum);
	      pre.execute();
	      HibernateUtil.commitTransaction();
	      ret = true;
	    }
	    catch (SQLException err)
	    {
	    	logErr.error("删除吞卡明细记录失败:"+err.getMessage());
	        HibernateUtil.rollbackTransaction();
	        ret = false;
	    }
	    finally
	    {
	    	HibernateUtil.closeSession();
	    }
	    return ret;
	}
	
	  /**
	   * 根据终端编号,删除吞UKEY明细记录</p>
	   * strTerminalNum String  //终端编号
	   *
	*/
	public boolean  removeUkeyExpLog(String strTerminalNum)
{
		boolean ret = false;
	    String sql = "delete from ExpLog where strTerminalNum=? and strExpCode in ('Exp01003') ";
	    Session session = HibernateUtil.getSession();
	    Connection dbm = session.connection();
		HibernateUtil.beginTransaction();
	    try
	    {
	      PreparedStatement pre = dbm.prepareStatement(sql);
	      pre.setString(1, strTerminalNum);
	      pre.execute();
	      HibernateUtil.commitTransaction();
	      ret = true;
	    }
	    catch (SQLException err)
	    {
	    	logErr.error("删除吞UKEY明细记录失败:"+err.getMessage());
	        HibernateUtil.rollbackTransaction();
	        ret = false;
	    }
	    finally
	    {
	    	HibernateUtil.closeSession();
	    }
	    return ret;
	}
}
