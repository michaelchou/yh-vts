package com.yihuacomputer.cols.database;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.SQLException;
import java.util.List;

import org.apache.log4j.Logger;
import org.hibernate.Query;
import org.hibernate.Session;

import com.yihuacomputer.cols.common.util.HibernateUtil;
import com.yihuacomputer.cols.entity.CardUnitStatus;

/**
 * 卡箱表表处理类
 * 深圳怡化电脑股份有限公司
 * 2017-01-17
 */

public class CardUnitStatusDB {

	public Logger logErr = Logger.getLogger("Error");

	/**
	   * 根据终端编号编号,参数所有卡箱信息</p>
	   * strTerminalNum String 终端编号
	   * list List  卡箱信息
	*/
	public List<?> getCardUnitList(String strTerminalNum)
	{
	    List<?> list = null;
	    try
	    {
	      Session session = HibernateUtil.getSession();
	      String hql =
	              "from CardUnitStatus where strTerminalNum=:strTerminalNum order by cuNum asc"; //参数绑定，避免sql注入
	      Query query = session.createQuery(hql);
	      query.setString("strTerminalNum", strTerminalNum);

	      list = query.list();
	      if (list == null || list.isEmpty())
	    	  list = null;
	    }
	    catch (Exception e)
	    {
	      // 记录日志流水
		  logErr.error("取卡箱列表失败:"+e);
	    }
	    finally
	    {
	      HibernateUtil.closeSession();
	    }
	    return list;
	}


	/**
	 * 根据终端编号以及卡bin，取出卡箱信息
	 * 参数1：终端编号
	 * 参数2：卡bin
	 * 返回值：参数对象
	*/
	@SuppressWarnings("rawtypes")
	public CardUnitStatus getCardTrackEntity(String strTerminalNum,String strCardTrack) {
		CardUnitStatus card = null;
		try {
			Session session = HibernateUtil.getSession();
//			String hql = "from CardUnitStatus where strTerminalNum=:strTerminalNum and cast(strCardTrackStart as integer) <=:strCardTrack and cast(strCardTrackEnd as integer) >=:strCardTrack";
			String hql = "from CardUnitStatus where strTerminalNum=:strTerminalNum and (:strCardTrack between strCardTrackStart and strCardTrackEnd)";
			
			Query query = session.createQuery(hql);
			query.setString("strTerminalNum", strTerminalNum);
			query.setString("strCardTrack", strCardTrack);
			List cardList = query.list();
			if (cardList != null && !cardList.isEmpty() && cardList.size() > 0)
				card = (CardUnitStatus) cardList.get(0);
		} catch (Exception e) {
			// 记录日志流水
			logErr.error("按卡bin取卡箱表信息失败:"+e);
		} finally {
			HibernateUtil.closeSession();
		}
		return card;
	}
	/**
	 * 根据终端编号以及卡bin，取出卡箱信息
	 * 参数1：终端编号
	 * 参数2：卡类型
	 * 参数3：卡号中的段
	 * 返回值：参数对象
	*/
	@SuppressWarnings("rawtypes")
	public CardUnitStatus getCardUnitStatusBySegment(String strTerminalNum,String strCardType,String strCardTrack) {
		CardUnitStatus card = null;
		try {
			Session session = HibernateUtil.getSession();
		//	String hql = "from CardUnitStatus where strTerminalNum=:strTerminalNum and strCardType=:strCardType and cast(strCardTrackStart as integer) <=:strCardTrack and cast(strCardTrackEnd as integer) >=:strCardTrack";
			String hql = "from CardUnitStatus where strTerminalNum=:strTerminalNum and strCardType=:strCardType and  (:strCardTrack between strCardTrackStart and strCardTrackEnd)";
			
			Query query = session.createQuery(hql);
			query.setString("strTerminalNum", strTerminalNum);
			query.setString("strCardType", strCardType);
			query.setString("strCardTrack", strCardTrack);
			List cardList = query.list();
//			System.out.println("aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa");
//			System.out.println("strCardType="+strCardType);
//			System.out.println("strCardTrack="+strCardTrack);
//			System.out.println("size="+cardList.size());
			if (cardList != null && !cardList.isEmpty() && cardList.size() > 0)
				card = (CardUnitStatus) cardList.get(0);
		} catch (Exception e) {
			// 记录日志流水
			e.printStackTrace();
			logErr.error("按卡段取卡箱表信息失败:"+e);
		} finally {
			HibernateUtil.closeSession();
		}
		return card;
	}
	/**
	 * 根据终端编号以及卡箱序列号，取出卡箱信息
	 * 参数1：终端编号
	 * 参数2：卡箱序列号
	 * 返回值：参数对象
	*/
	@SuppressWarnings("rawtypes")
	public CardUnitStatus getCardEntity(String strTerminalNum,int cuNum) {
		CardUnitStatus card = null;
		try {
			Session session = HibernateUtil.getSession();
			String hql = "from CardUnitStatus where strTerminalNum=:strTerminalNum and cuNum=:cuNum";
			Query query = session.createQuery(hql);
			query.setString("strTerminalNum", strTerminalNum);
			query.setInteger("cuNum", cuNum);
			List cardList = query.list();
			if (cardList != null && !cardList.isEmpty() && cardList.size() > 0)
				card = (CardUnitStatus) cardList.get(0);
		} catch (Exception e) {
			// 记录日志流水
			logErr.error("取卡箱表信息失败:"+e);
		} finally {
			HibernateUtil.closeSession();
		}
		return card;
	}

	/**
	 * 记录 卡箱信息
	 * 参数1：卡箱对象
	 * 返回值：true=成功 false=失败
	 */
	public boolean save(CardUnitStatus entity)
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
			logErr.error("记录卡箱信息失败:"+e);
			HibernateUtil.rollbackTransaction();
		} finally
		{
			HibernateUtil.closeSession();
		}
		return bRet;
	}

	/**
	 * 更新卡箱信息
	 * 参数1：卡箱对象
	 * 返回值：true=成功 false=失败
	 */
	public boolean update(CardUnitStatus entity)
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
			logErr.error("更新卡箱信息失败:"+e);
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
	public boolean insert(List<CardUnitStatus> cardList)
	{
		  boolean ret = false;
	      if (cardList != null && cardList.size() > 0)
	      {
	        for (int i = 0; i < cardList.size(); i++)
	        {
	        	CardUnitStatus entity = (CardUnitStatus) cardList.get(i);
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
	    String sql = "delete from CardUnitStatus where strTerminalNum=?";
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
	    	logErr.error("删除卡箱信息失败:"+err.getMessage());
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
