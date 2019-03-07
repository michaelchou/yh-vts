package com.yihuacomputer.cols.database;

import java.util.List;

import org.apache.log4j.Logger;
import org.hibernate.Query;
import org.hibernate.Session;

import com.yihuacomputer.cols.common.util.HibernateUtil;
import com.yihuacomputer.cols.entity.CDSSettleCycleLog;

/**
 * 存单箱表处理类
 * 深圳怡化电脑股份有限公司
 * 2017-05-03
 */

public class CDSSettleCycleLogDB {

	public Logger logErr = Logger.getLogger("Error");

	/**
	 * 根据终端编号，取出相应批次号下的信息
	 * 参数1：终端编号
	 * 参数2：批次号
	 * 返回值：参数对象
	*/
	@SuppressWarnings("rawtypes")
	public CDSSettleCycleLog getEntity(String strTerminalNum) {
		CDSSettleCycleLog entity = null;
		try {
			Session session = HibernateUtil.getSession();
			String hql = "from CDSSettleCycleLog where strTerminalNum=:strTerminalNum order by id desc";
			Query query = session.createQuery(hql);
			query.setString("strTerminalNum", strTerminalNum);
			List list = query.list();
			if (list != null && !list.isEmpty() && list.size() > 0)
				entity = (CDSSettleCycleLog) list.get(0);
		} catch (Exception e) {
			// 记录日志流水
			logErr.error("取存单箱表信息失败:"+e);
		} finally {
			HibernateUtil.closeSession();
		}
		return entity;
	}

	/**
	 * 根据终端编号以及状态，取出相应的批次信息
	 * 参数1：终端编号
	 * 参数2：批次号
	 * 返回值：参数对象
	*/
	public CDSSettleCycleLog getCurBatchNoEntity(String strTerminalNum,int status) {
		CDSSettleCycleLog entity = null;
		try {
			Session session = HibernateUtil.getSession();
			String hql = "from CDSSettleCycleLog where strTerminalNum=:strTerminalNum and status=:status";
			Query query = session.createQuery(hql);
			query.setString("strTerminalNum", strTerminalNum);
			query.setInteger("status", status);
			List<?> list = query.list();
			if (list != null && !list.isEmpty() && list.size() > 0)
				entity = (CDSSettleCycleLog) list.get(0);
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
	public boolean save(CDSSettleCycleLog entity)
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
	public boolean update(CDSSettleCycleLog entity)
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
}
