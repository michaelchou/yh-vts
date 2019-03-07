package com.yihuacomputer.cols.database;

import java.util.List;

import org.apache.log4j.Logger;
import org.hibernate.Query;
import org.hibernate.Session;

import com.yihuacomputer.cols.common.util.HibernateUtil;
import com.yihuacomputer.cols.entity.CDSSettleCycleLog;

/**
 * �浥�������
 * �����������Թɷ����޹�˾
 * 2017-05-03
 */

public class CDSSettleCycleLogDB {

	public Logger logErr = Logger.getLogger("Error");

	/**
	 * �����ն˱�ţ�ȡ����Ӧ���κ��µ���Ϣ
	 * ����1���ն˱��
	 * ����2�����κ�
	 * ����ֵ����������
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
			// ��¼��־��ˮ
			logErr.error("ȡ�浥�����Ϣʧ��:"+e);
		} finally {
			HibernateUtil.closeSession();
		}
		return entity;
	}

	/**
	 * �����ն˱���Լ�״̬��ȡ����Ӧ��������Ϣ
	 * ����1���ն˱��
	 * ����2�����κ�
	 * ����ֵ����������
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
			// ��¼��־��ˮ
			logErr.error("ȡ�浥�����Ϣʧ��:"+e);
		} finally {
			HibernateUtil.closeSession();
		}
		return entity;
	}

	/**
	 * ��¼ �浥����Ϣ
	 * ����1���������
	 * ����ֵ��true=�ɹ� false=ʧ��
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
			// ��¼��־��ˮ
			logErr.error("��¼�浥����Ϣʧ��:"+e);
			HibernateUtil.rollbackTransaction();
		} finally
		{
			HibernateUtil.closeSession();
		}
		return bRet;
	}

	/**
	 * ���´浥����Ϣ
	 * ����1���������
	 * ����ֵ��true=�ɹ� false=ʧ��
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
			// ��¼��־��ˮ
			logErr.error("���´浥����Ϣʧ��:"+e);
			HibernateUtil.rollbackTransaction();
		} finally
		{
			HibernateUtil.closeSession();
		}
		return bRet;
	}
}
