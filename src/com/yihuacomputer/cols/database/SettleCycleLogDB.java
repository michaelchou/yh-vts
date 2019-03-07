package com.yihuacomputer.cols.database;

import java.math.BigDecimal;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.SQLException;
import java.util.List;

import org.apache.log4j.Logger;
import org.hibernate.Query;
import org.hibernate.Session;

import com.yihuacomputer.cols.common.util.HibernateUtil;
import com.yihuacomputer.cols.entity.CardSettleCycleLog;
import com.yihuacomputer.cols.entity.SettleCycleLog;
import com.yihuacomputer.cols.entity.TransLogWithdrawal;
import com.yihuacomputer.cols.util.DateCtrl;

public class SettleCycleLogDB {
	public Logger logErr = Logger.getLogger("Error");

	/**
	 * �����ն˱�Ų�ѯ�����״̬��ѯ�ӳ���¼
	 * @param terminalId
	 * @param status
	 * @return
	 */
	public SettleCycleLog getEntityByTermianl(String terminalId){
		SettleCycleLog entity = null;
		try {
			Session session = HibernateUtil.getSession();
			String hql = "from SettleCycleLog  where strTerminalNum=:terminalId and isStatus=0";
			Query query = session.createQuery(hql);
			query.setString("terminalId", terminalId);
			entity = (SettleCycleLog) query.uniqueResult();
		}
		catch (Exception e) {
			// ��¼��־��ˮ
			logErr.error("�����ն˱�Ų�ѯδ�����¼ʧ��:"+e.getMessage());
		} finally {
			HibernateUtil.closeSession();
		}
		return entity;
	}
	/**
	 * ��ȡ�ӳ����κ�
	 * @param terminalId
	 * @param status
	 * @return
	 */
	public int getSettleCycle(String terminalId){
		SettleCycleLog entity = null;
		int settleCycleId = 1;
		try {
			Session session = HibernateUtil.getSession();
			String hql = "from SettleCycleLog  where strTerminalNum=:terminalId order by id desc ";
			Query query = session.createQuery(hql);
			query.setString("terminalId", terminalId);
			List list = query.list();
			if (list != null && !list.isEmpty() && list.size() > 0){
				entity = (SettleCycleLog) list.get(0);
				settleCycleId = entity.getIsettlecycle() + 1;
			}
		}
		catch (Exception e) {
			// ��¼��־��ˮ
			logErr.error("��ȡ�ӳ����κ�ʧ��:"+e.getMessage());
		} finally {
			HibernateUtil.closeSession();
		}
		return settleCycleId;
	}

	/**
	 * �����ӳ���¼
	 * @param settleCycleLog
	 * @return
	 */
	public boolean sava(SettleCycleLog settleCycleLog){
		boolean bRet = false;
		try
		{
			Session session = HibernateUtil.getSession();
			HibernateUtil.beginTransaction();
			session.save(settleCycleLog);
			HibernateUtil.commitTransaction();
			bRet = true;
		}
		catch (Exception e)
		{
			// ��¼��־��ˮ
			logErr.error("����ӳ���¼ʧ��:"+e.getMessage() );
			logErr.error(e);
			HibernateUtil.rollbackTransaction();
		}
		finally
		{
			HibernateUtil.closeSession();
		}
		return bRet;
	}

	/**
	 * ���ʱ���¼ӳ���¼���״̬
	 * @param settleCycleLog
	 * @return
	 */
	public boolean update(SettleCycleLog settleCycleLog){
		boolean bRet = false;
		try {
			Session session = HibernateUtil.getSession();
			HibernateUtil.beginTransaction();
			session.update(settleCycleLog);
			HibernateUtil.commitTransaction();
			bRet = true;
		} catch (Exception e) {
			// ��¼��־��ˮ
			logErr.error("���¼ӳ���¼���״̬:"+e.getMessage());
			HibernateUtil.rollbackTransaction();
		} finally {
			HibernateUtil.closeSession();
		}
		return bRet;
	}

	/**
	 * ����ȡ����ʣ��ȡ����
	 * @param settleCycleLog
	 * @return
	 */
	public boolean updateSettleCycleLogDcdm(SettleCycleLog bean){
		boolean bRet = false;
		try {
			Session session = HibernateUtil.getSession();
			HibernateUtil.beginTransaction();
			String hql =
					 "update SettleCycleLog set dcdmSurplusAmt=:LeftdcdmSurplusAmt where strTerminalNum=:terminalId and isStatus=0";
			Query queryUpdate = session.createQuery(hql);
			queryUpdate.setString("terminalId", bean.getStrTerminalNum());
			queryUpdate.setBigDecimal("LeftdcdmSurplusAmt", bean.getDcdmSurplusAmt());
			queryUpdate.executeUpdate();
			HibernateUtil.commitTransaction();
			bRet = true;
		} catch (Exception e) {
			// ��¼��־��ˮ
			logErr.error("����ȡ����ʣ��ȡ����ʧ��:"+e.getMessage());
			HibernateUtil.rollbackTransaction();
		} finally {
			HibernateUtil.closeSession();
		}
		return bRet;
	}

	/**
	 * ���´����ʣ������
	 * @param settleCycleLog
	 * @return
	 */
	public boolean updateSettleCycleLogDcim(SettleCycleLog bean){
		boolean bRet = false;
		try {
			Session session = HibernateUtil.getSession();
			HibernateUtil.beginTransaction();
			String hql =
					 "update SettleCycleLog set dcimSurplusAmt=:LeftdcimSurplusAmt where strTerminalNum=:terminalId and isStatus=0";
			Query queryUpdate = session.createQuery(hql);
			queryUpdate.setString("terminalId", bean.getStrTerminalNum());
			queryUpdate.setBigDecimal("LeftdcimSurplusAmt", bean.getDcimSurplusAmt());
			queryUpdate.executeUpdate();
			HibernateUtil.commitTransaction();
			bRet = true;
		} catch (Exception e) {
			// ��¼��־��ˮ
			logErr.error("���´����ʣ������ʧ��:"+e.getMessage());
			HibernateUtil.rollbackTransaction();
		} finally {
			HibernateUtil.closeSession();
		}
		return bRet;
	}

	/**
	 * �ӳ�
	 * @param terminalNum
	 * @param totalAmount
	 * @return  boolean
	 */
	public boolean addCash(String terminalNum, BigDecimal totalAmount){
		SettleCycleLogDB settleCycleLogDB = new SettleCycleLogDB();
		SettleCycleLog settleCycleLog = new SettleCycleLog();
		settleCycleLog.setStrTerminalNum(terminalNum);
		settleCycleLog.setIsettlecycle(settleCycleLogDB.getSettleCycle(terminalNum));
		settleCycleLog.setDtStart(new DateCtrl().getTimestamp());
		settleCycleLog.setDcdmAddAmt(totalAmount);
		settleCycleLog.setDcdmSurplusAmt(totalAmount);
		settleCycleLog.setDcimSurplusAmt(new BigDecimal(0));
		settleCycleLog.setIsStatus(0);
		settleCycleLog.setStrExInfo1("");
		settleCycleLog.setStrExInfo2("");

		return settleCycleLogDB.sava(settleCycleLog);
	}

}
