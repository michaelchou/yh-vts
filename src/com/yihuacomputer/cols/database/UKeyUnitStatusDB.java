package com.yihuacomputer.cols.database;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.SQLException;
import java.util.List;

import org.apache.log4j.Logger;
import org.hibernate.Query;
import org.hibernate.Session;

import com.yihuacomputer.cols.common.util.HibernateUtil;
import com.yihuacomputer.cols.entity.UKeyUnitStatus;

/**
 * UKey箱表处理类
 * 深圳怡化电脑股份有限公司
 * 2017-05-03
 */

public class UKeyUnitStatusDB {

	public Logger logErr = Logger.getLogger("Error");

	/**
	   * 根据终端编号编号,参数所有UKey箱信息</p>
	   * strTerminalNum String 终端编号
	   * list List  卡箱信息
	*/
	public List<?> getUKeyUnitList(String strTerminalNum)
	{
	    List<?> list = null;
	    try
	    {
	      Session session = HibernateUtil.getSession();
	      String hql =
	              "from UKeyUnitStatus where strTerminalNum=:strTerminalNum order by cuNum asc"; //参数绑定，避免sql注入
	      Query query = session.createQuery(hql);
	      query.setString("strTerminalNum", strTerminalNum);

	      list = query.list();
	      if (list == null || list.isEmpty())
	    	  list = null;
	    }
	    catch (Exception e)
	    {
	      // 记录日志流水
		  logErr.error("取UKey箱列表失败:"+e);
	    }
	    finally
	    {
	      HibernateUtil.closeSession();
	    }
	    return list;
	}

	/**
	 * 根据终端编号以及UKey箱序列号，取出UKey箱信息
	 * 参数1：终端编号
	 * 参数2：UKey箱序列号
	 * 返回值：参数对象
	*/
	@SuppressWarnings("rawtypes")
	public UKeyUnitStatus getUKeyEntity(String strTerminalNum,int cuNum) {
		UKeyUnitStatus card = null;
		try {
			Session session = HibernateUtil.getSession();
			String hql = "from UKeyUnitStatus where strTerminalNum=:strTerminalNum and cuNum=:cuNum";
			Query query = session.createQuery(hql);
			query.setString("strTerminalNum", strTerminalNum);
			query.setInteger("cuNum", cuNum);
			List ukeyList = query.list();
			if (ukeyList != null && !ukeyList.isEmpty() && ukeyList.size() > 0)
				card = (UKeyUnitStatus) ukeyList.get(0);
		} catch (Exception e) {
			// 记录日志流水
			logErr.error("取UKey箱表信息失败:"+e);
		} finally {
			HibernateUtil.closeSession();
		}
		return card;
	}

	/**
	 * 记录 UKey箱信息
	 * 参数1：卡箱对象
	 * 返回值：true=成功 false=失败
	 */
	public boolean save(UKeyUnitStatus entity)
	{
		boolean bRet = false;
		try
		{
			Session session = HibernateUtil.getSession();
			HibernateUtil.beginTransaction();
			session.save(entity);
			HibernateUtil.commitTransaction();
			bRet = true;
		} catch (Exception e)
		{
			// 记录日志流水
			logErr.error("记录UKey箱信息失败:"+e);
			HibernateUtil.rollbackTransaction();
		} finally
		{
			HibernateUtil.closeSession();
		}
		return bRet;
	}

	/**
	 * 更新UKey箱信息
	 * 参数1：UKey箱对象
	 * 返回值：true=成功 false=失败
	 */
	public boolean update(UKeyUnitStatus entity)
	{
		boolean bRet = false;
		try
		{
			Session session = HibernateUtil.getSession();
			HibernateUtil.beginTransaction();
			session.update(entity);
			HibernateUtil.commitTransaction();
			bRet = true;
		} catch (Exception e)
		{
			// 记录日志流水
			logErr.error("更新UKey箱信息失败:"+e);
			HibernateUtil.rollbackTransaction();
		} finally
		{
			HibernateUtil.closeSession();
		}
		return bRet;
	}

	/**
	  * 插入新数据
	*/
	public boolean insert(List<UKeyUnitStatus> ukeyList)
	{
		  boolean ret = false;
	      if (ukeyList != null && ukeyList.size() > 0)
	      {
	        for (int i = 0; i < ukeyList.size(); i++)
	        {
	        	UKeyUnitStatus entity = (UKeyUnitStatus) ukeyList.get(i);
	        	ret = save(entity);
	        }
	      }
	      return ret;
   }

	/**
	  * 按终端编号删除数据
    */
	public boolean delete(String strTerminalNum)
	{
		boolean ret = false;
	    String sql = "delete from UKeyUnitStatus where strTerminalNum=?";
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
	    	logErr.error("删除UKey箱信息失败:"+err.getMessage());
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
	 * 根据终端编号以及UKey的卡bin，取出UKey箱信息
	 * 参数1：终端编号
	 * 参数2：卡bin
	 * 返回值：参数对象
	*/
	@SuppressWarnings("rawtypes")
	public UKeyUnitStatus getUKeyTrackEntity(String strTerminalNum,String strUKeyTrack) {
		UKeyUnitStatus ukey = null;
		try {
			Session session = HibernateUtil.getSession();
			String hql = "from UKeyUnitStatus where strTerminalNum=:strTerminalNum and cast(strUKeyTrackStart as integer) <=:strUKeyTrack and cast(strUKeyTrackEnd as integer) >=:strUKeyTrack";
			Query query = session.createQuery(hql);
			query.setString("strTerminalNum", strTerminalNum);
			query.setString("strUKeyTrack", strUKeyTrack);
			List ukeyList = query.list();
			if (ukeyList != null && !ukeyList.isEmpty() && ukeyList.size() > 0)
				ukey = (UKeyUnitStatus) ukeyList.get(0);
		} catch (Exception e) {
			// 记录日志流水
			logErr.error("按UKey的卡bin取UKey箱表信息失败:"+e);
		} finally {
			HibernateUtil.closeSession();
		}
		return ukey;
	}
}
