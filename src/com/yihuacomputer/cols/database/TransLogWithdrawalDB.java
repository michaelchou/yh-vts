package com.yihuacomputer.cols.database;

import java.util.List;

import org.apache.log4j.Logger;
import org.hibernate.Query;
import org.hibernate.Session;
import org.hibernate.Transaction;

import com.yihuacomputer.cols.common.util.HibernateUtil;
import com.yihuacomputer.cols.entity.SettleCycleLog;
import com.yihuacomputer.cols.entity.TransLogWithdrawal;

public class TransLogWithdrawalDB {
	public Logger logErr = Logger.getLogger("Error");

	/**
	 * ��ȡ��������  ��������״̬Ϊ0�����׳ɹ��� �ն�״̬��Ϊ1�����ͳ� ���ų��Թ�ȡ�� �ļ�¼
	 * @return
	 */
	public List<?> getGZrecord(String terminalId){
		 List<?> list = null;
		try {
			Session session = HibernateUtil.getSession();
			String hql = "from TransLogWithdrawal  where strTerminalNum=:terminalId and"
					+ " iHostTransStatus=0 and iTermTransStatus!=1 and iSettleCycleStatus=0 and transCode!='909017'";
			Query query = session.createQuery(hql);
			query.setString("terminalId", terminalId);
			list = query.list();
		}
		catch (Exception e) {
			// ��¼��־��ˮ
			logErr.error("��ȡ����ȡ����ˮ����  ʧ��:"+e.getMessage());
		} finally {
			HibernateUtil.closeSession();
		}
		return list;
	}
	/**
	 * �Թ�ȡ��
	 * ��ȡ��������  �ն˽���״̬��Ϊ1��δ�ͳ��ĵļ�¼
	 * @return
	 */
	/*
	 *  itermTransStatus �ն˽���״̬ 0:δ����  1:���ͳ�    2:����ʧ�� 3:�����ȷ��
	    ihostTransStatus  //��������״̬  0 ���׳ɹ� �� 1 ����ʧ�� ����δ֪
	    isettleCycleStatus  //�Ƿ���� 0 δ��� ��1 �����
	*/
	public List<?> getGZrecord(String terminalId,String transCode){
		 List<?> list = null;
		try {
			Session session = HibernateUtil.getSession();
			String hql = "from TransLogWithdrawal  where strTerminalNum=:terminalId and"
					+ " itermTransStatus!=1 and iSettleCycleStatus=0 and transCode='909017'";//��¼����δ�ͳ���״̬
			Query query = session.createQuery(hql);
			query.setString("terminalId", terminalId);
			list = query.list();
		}
		catch (Exception e) {
			// ��¼��־��ˮ
			logErr.error("��ȡ����ȡ����ˮ����  ʧ��:"+e.getMessage());
		} finally {
			HibernateUtil.closeSession();
		}
		return list;
	}




	/**
	 * ���Ӵ�����ˮ��־
	 * @param transLogDeposit
	 * @return
	 */
	public boolean sava(TransLogWithdrawal transLogWithdrawal){
		boolean bRet = false;
		try
		{
		  Session session = HibernateUtil.getSession();
		  HibernateUtil.beginTransaction();
		  session.save(transLogWithdrawal);
		  HibernateUtil.commitTransaction();
		  bRet = true;
		}
		catch (Exception e)
		{
		  // ��¼��־��ˮ
		  logErr.error("����ȡ�����ˮ��¼ʧ��:"+e.getMessage());
		  HibernateUtil.rollbackTransaction();
		}
		finally
		{
		  HibernateUtil.closeSession();
		}
		return bRet;
	}

	/**
	 * ���´��׼�¼
	 * @param transLogDeposit
	 * @return
	 */
	public boolean update(TransLogWithdrawal transLogWithdrawal){
		boolean bRet = false;
		try {
			Session session = HibernateUtil.getSession();
			HibernateUtil.beginTransaction();
			session.update(transLogWithdrawal);
			HibernateUtil.commitTransaction();
			bRet = true;
		} catch (Exception e) {
			// ��¼��־��ˮ
			logErr.error("����ȡ��׼�¼ʧ��:"+e.getMessage());
			HibernateUtil.rollbackTransaction();
		} finally {
			HibernateUtil.closeSession();
		}
		return bRet;
	}

	/**
	 * ���´��׼�¼
	 * @param transLogWithdraw
	 * @return
	 */
	public boolean updateDraw(TransLogWithdrawal bean){
		boolean bRet = false;
		try {
			Session session = HibernateUtil.getSession();
			HibernateUtil.beginTransaction();
			String hql =
					 "update TransLogWithdrawal set itermTransStatus=:itermTransStatus,iReverSeenTryStatus=:iReverSeenTryStatus where strTermSerialNo=:strTermSerialNo";
			Query queryUpdate = session.createQuery(hql);
			queryUpdate.setInteger("itermTransStatus", bean.getItermTransStatus());
			queryUpdate.setInteger("iReverSeenTryStatus", bean.getiReverSeenTryStatus());
			queryUpdate.setString("strTermSerialNo", bean.getStrTermSerialNo());
			queryUpdate.executeUpdate();
			HibernateUtil.commitTransaction();
			bRet = true;
		} catch (Exception e) {
			// ��¼��־��ˮ
			logErr.error("���ָ���ȡ��׼�¼ʧ��:"+e.getMessage());
			HibernateUtil.rollbackTransaction();
		} finally {
			HibernateUtil.closeSession();
		}
		return bRet;
	}
}
