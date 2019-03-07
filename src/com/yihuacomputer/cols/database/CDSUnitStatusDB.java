package com.yihuacomputer.cols.database;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.SQLException;
import java.util.List;

import org.apache.log4j.Logger;
import org.hibernate.Query;
import org.hibernate.Session;

import com.yihuacomputer.cols.common.util.HibernateUtil;
import com.yihuacomputer.cols.entity.CDSUnitStatus;

/**
 * 存单箱表处理类
 * 深圳怡化电脑股份有限公司
 * 2017-05-03
 */

public class CDSUnitStatusDB {

	public Logger logErr = Logger.getLogger("Error");

	/**
	   * 根据终端编号编号,参数所有存单箱信息</p>
	   * strTerminalNum String 终端编号
	   * list List  存单箱信息
	*/
	public List<?> getCDSUnitList(String strTerminalNum)
	{
	    List<?> list = null;
	    try
	    {
	      Session session = HibernateUtil.getSession();
	      String hql =
	              "from CDSUnitStatus where strTerminalNum=:strTerminalNum order by cuNum asc"; //参数绑定，避免sql注入
	      Query query = session.createQuery(hql);
	      query.setString("strTerminalNum", strTerminalNum);

	      list = query.list();
	      if (list == null || list.isEmpty())
	    	  list = null;
	    }
	    catch (Exception e)
	    {
	      // 记录日志流水
		  logErr.error("取存单箱列表失败:"+e);
	    }
	    finally
	    {
	      HibernateUtil.closeSession();
	    }
	    return list;
	}

	/**
	 * 根据终端编号以及OCR号，取出存单箱信息
	 * 参数1：终端编号
	 * 参数2：卡bin
	 * 返回值：参数对象
	*/
	@SuppressWarnings("rawtypes")
	public CDSUnitStatus getCDSTrackEntity(String strTerminalNum,String strCDSTrack) {
		CDSUnitStatus cds = null;
		try {
			Session session = HibernateUtil.getSession();
			String hql = "from CDSUnitStatus where strTerminalNum=:strTerminalNum and cast(strCdsTrackStart as integer) <=:strCDSTrack and cast(strCdsTrackEnd as integer) >=:strCDSTrack";
			Query query = session.createQuery(hql);
			query.setString("strTerminalNum", strTerminalNum);
			query.setString("strCDSTrack", strCDSTrack);
			List cdsList = query.list();
			if (cdsList != null && !cdsList.isEmpty() && cdsList.size() > 0)
				cds = (CDSUnitStatus) cdsList.get(0);
		} catch (Exception e) {
			// 记录日志流水
			logErr.error("按存单OCR取存单箱表信息失败:"+e);
		} finally {
			HibernateUtil.closeSession();
		}
		return cds;
	}

	/**
	 * 根据终端编号以及存单箱序列号，取出存单箱信息
	 * 参数1：终端编号
	 * 参数2：卡箱序列号
	 * 返回值：参数对象
	*/
	@SuppressWarnings("rawtypes")
	public CDSUnitStatus getCardEntity(String strTerminalNum,int cuNum) {
		CDSUnitStatus entity = null;
		try {
			Session session = HibernateUtil.getSession();
			String hql = "from CDSUnitStatus where strTerminalNum=:strTerminalNum and cuNum=:cuNum";
			Query query = session.createQuery(hql);
			query.setString("strTerminalNum", strTerminalNum);
			query.setInteger("cuNum", cuNum);
			List cardList = query.list();
			if (cardList != null && !cardList.isEmpty() && cardList.size() > 0)
				entity = (CDSUnitStatus) cardList.get(0);
		} catch (Exception e) {
			// 记录日志流水
			logErr.error("取存单箱表信息失败:"+e);
		} finally {
			HibernateUtil.closeSession();
		}
		return entity;
	}

	/**
	 * 记录 存单箱信息
	 * 参数1：卡箱对象
	 * 返回值：true=成功 false=失败
	 */
	public boolean save(CDSUnitStatus entity)
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
			logErr.error("记录存单箱信息失败:"+e);
			HibernateUtil.rollbackTransaction();
		} finally
		{
			HibernateUtil.closeSession();
		}
		return bRet;
	}

	/**
	 * 更新存单箱信息
	 * 参数1：卡箱对象
	 * 返回值：true=成功 false=失败
	 */
	public boolean update(CDSUnitStatus entity)
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
			logErr.error("更新存单箱信息失败:"+e);
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
	public boolean insert(List<CDSUnitStatus> cardList)
	{
		  boolean ret = false;
	      if (cardList != null && cardList.size() > 0)
	      {
	        for (int i = 0; i < cardList.size(); i++)
	        {
	        	CDSUnitStatus entity = (CDSUnitStatus) cardList.get(i);
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
	    String sql = "delete from CDSUnitStatus where strTerminalNum=?";
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
	    	logErr.error("删除存单箱信息失败:"+err.getMessage());
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
