package com.yihuacomputer.cols.database;

import java.util.List;

import org.apache.log4j.Logger;
import org.hibernate.Query;
import org.hibernate.Session;

import com.yihuacomputer.cols.common.util.HibernateUtil;
import com.yihuacomputer.cols.entity.UKeySettleCycleLog;

/**
 * UKey��������
 * �����������Թɷ����޹�˾
 * 2017-05-03
 */

public class UKeySettleCycleLogDB {

	public Logger logErr = Logger.getLogger("Error");

	/**
	 * �����ն˱�ţ�ȡ����Ӧ���κ��µ���Ϣ
	 * ����1���ն˱��
	 * ����2�����κ�
	 * ����ֵ����������
	*/
	@SuppressWarnings("rawtypes")
	public UKeySettleCycleLog getEntity(String strTerminalNum) {
		UKeySettleCycleLog ukeySettleCycleLog = null;
		try {
			Session session = HibernateUtil.getSession();
			String hql = "from UKeySettleCycleLog where strTerminalNum=:strTerminalNum order by id desc";
			Query query = session.createQuery(hql);
			query.setString("strTerminalNum", strTerminalNum);
			List list = query.list();
			if (list != null && !list.isEmpty() && list.size() > 0)
				ukeySettleCycleLog = (UKeySettleCycleLog) list.get(0);
		} catch (Exception e) {
			// ��¼��־��ˮ
			logErr.error("ȡUKey�����Ϣʧ��:"+e);
		} finally {
			HibernateUtil.closeSession();
		}
		return ukeySettleCycleLog;
	}

	/**
	 * �����ն˱���Լ�״̬��ȡ����Ӧ��������Ϣ
	 * ����1���ն˱��
	 * ����2�����κ�
	 * ����ֵ����������
	*/
	public UKeySettleCycleLog getCurBatchNoEntity(String strTerminalNum,int status) {
		UKeySettleCycleLog ukeySettleCycleLog = null;
		try {
			Session session = HibernateUtil.getSession();
			String hql = "from UKeySettleCycleLog where strTerminalNum=:strTerminalNum and status=:status";
			Query query = session.createQuery(hql);
			query.setString("strTerminalNum", strTerminalNum);
			query.setInteger("status", status);
			List<?> list = query.list();
			if (list != null && !list.isEmpty() && list.size() > 0)
				ukeySettleCycleLog = (UKeySettleCycleLog) list.get(0);
		} catch (Exception e) {
			// ��¼��־��ˮ
			logErr.error("ȡ�������Ϣʧ��:"+e);
		} finally {
			HibernateUtil.closeSession();
		}
		return ukeySettleCycleLog;
	}

	/**
	 * ��¼ ������Ϣ
	 * ����1���������
	 * ����ֵ��true=�ɹ� false=ʧ��
	 */
	public boolean save(UKeySettleCycleLog entity)
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
			// ��¼��־��ˮ
			logErr.error("��¼ UKey����Ϣʧ��:"+e);
			HibernateUtil.rollbackTransaction();
		} finally
		{
			HibernateUtil.closeSession();
		}
		return bRet;
	}

	/**
	 * ����UKey����Ϣ
	 * ����1���������
	 * ����ֵ��true=�ɹ� false=ʧ��
	 */
	public boolean update(UKeySettleCycleLog entity)
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
			// ��¼��־��ˮ
			logErr.error("����UKey����Ϣʧ��:"+e);
			HibernateUtil.rollbackTransaction();
		} finally
		{
			HibernateUtil.closeSession();
		}
		return bRet;
	}
}
