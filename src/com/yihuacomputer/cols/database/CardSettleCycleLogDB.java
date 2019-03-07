package com.yihuacomputer.cols.database;

import java.util.List;

import org.apache.log4j.Logger;
import org.hibernate.Query;
import org.hibernate.Session;

import com.yihuacomputer.cols.common.util.HibernateUtil;
import com.yihuacomputer.cols.entity.CardSettleCycleLog;

/**
 * ����������
 * �����������Թɷ����޹�˾
 * 2017-01-17
 */

public class CardSettleCycleLogDB {

	public Logger logErr = Logger.getLogger("Error");

	/**
	 * �����ն˱�ţ�ȡ����Ӧ���κ��µ���Ϣ
	 * ����1���ն˱��
	 * ����2�����κ�
	 * ����ֵ����������
	*/
	@SuppressWarnings("rawtypes")
	public CardSettleCycleLog getEntity(String strTerminalNum) {
		CardSettleCycleLog cardSettleCycleLog = null;
		try {
			Session session = HibernateUtil.getSession();
			String hql = "from CardSettleCycleLog where strTerminalNum=:strTerminalNum order by id desc";
			Query query = session.createQuery(hql);
			query.setString("strTerminalNum", strTerminalNum);
			List list = query.list();
			if (list != null && !list.isEmpty() && list.size() > 0)
				cardSettleCycleLog = (CardSettleCycleLog) list.get(0);
		} catch (Exception e) {
			// ��¼��־��ˮ
			logErr.error("ȡ�������Ϣʧ��:"+e);
		} finally {
			HibernateUtil.closeSession();
		}
		return cardSettleCycleLog;
	}

	/**
	 * �����ն˱���Լ�״̬��ȡ����Ӧ��������Ϣ
	 * ����1���ն˱��
	 * ����2�����κ�
	 * ����ֵ����������
	*/
	public CardSettleCycleLog getCurBatchNoEntity(String strTerminalNum,int status) {
		CardSettleCycleLog cardSettleCycleLog = null;
		try {
			Session session = HibernateUtil.getSession();
			String hql = "from CardSettleCycleLog where strTerminalNum=:strTerminalNum and status=:status";
			Query query = session.createQuery(hql);
			query.setString("strTerminalNum", strTerminalNum);
			query.setInteger("status", status);
			List<?> list = query.list();
			if (list != null && !list.isEmpty() && list.size() > 0)
				cardSettleCycleLog = (CardSettleCycleLog) list.get(0);
		} catch (Exception e) {
			// ��¼��־��ˮ
			logErr.error("ȡ�������Ϣʧ��:"+e);
		} finally {
			HibernateUtil.closeSession();
		}
		return cardSettleCycleLog;
	}

	/**
	 * ��¼ ������Ϣ
	 * ����1���������
	 * ����ֵ��true=�ɹ� false=ʧ��
	 */
	public boolean save(CardSettleCycleLog entity)
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
			logErr.error("��¼ ������Ϣʧ��:"+e);
			HibernateUtil.rollbackTransaction();
		} finally
		{
			HibernateUtil.closeSession();
		}
		return bRet;
	}

	/**
	 * ���¿�����Ϣ
	 * ����1���������
	 * ����ֵ��true=�ɹ� false=ʧ��
	 */
	public boolean update(CardSettleCycleLog entity)
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
			logErr.error("���¿�����Ϣʧ��:"+e);
			HibernateUtil.rollbackTransaction();
		} finally
		{
			HibernateUtil.closeSession();
		}
		return bRet;
	}
}
