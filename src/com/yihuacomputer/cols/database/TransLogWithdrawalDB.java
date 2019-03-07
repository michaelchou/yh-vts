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
	 * 获取轧账数据  主机返回状态为0：交易成功， 终端状态不为1：已送钞 ，排除对公取款 的记录
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
			// 记录日志流水
			logErr.error("获取轧账取款流水数据  失败:"+e.getMessage());
		} finally {
			HibernateUtil.closeSession();
		}
		return list;
	}
	/**
	 * 对公取款
	 * 获取轧账数据  终端交易状态不为1，未送钞的的记录
	 * @return
	 */
	/*
	 *  itermTransStatus 终端交易状态 0:未动作  1:已送钞    2:出钞失败 3:结果不确定
	    ihostTransStatus  //主机交易状态  0 交易成功 ， 1 交易失败 其他未知
	    isettleCycleStatus  //是否清机 0 未清机 ，1 已清机
	*/
	public List<?> getGZrecord(String terminalId,String transCode){
		 List<?> list = null;
		try {
			Session session = HibernateUtil.getSession();
			String hql = "from TransLogWithdrawal  where strTerminalNum=:terminalId and"
					+ " itermTransStatus!=1 and iSettleCycleStatus=0 and transCode='909017'";//记录所有未送钞的状态
			Query query = session.createQuery(hql);
			query.setString("terminalId", terminalId);
			list = query.list();
		}
		catch (Exception e) {
			// 记录日志流水
			logErr.error("获取轧账取款流水数据  失败:"+e.getMessage());
		} finally {
			HibernateUtil.closeSession();
		}
		return list;
	}




	/**
	 * 增加存款交易流水日志
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
		  // 记录日志流水
		  logErr.error("插入取款交易流水记录失败:"+e.getMessage());
		  HibernateUtil.rollbackTransaction();
		}
		finally
		{
		  HibernateUtil.closeSession();
		}
		return bRet;
	}

	/**
	 * 更新存款交易记录
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
			// 记录日志流水
			logErr.error("更新取款交易记录失败:"+e.getMessage());
			HibernateUtil.rollbackTransaction();
		} finally {
			HibernateUtil.closeSession();
		}
		return bRet;
	}

	/**
	 * 更新存款交易记录
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
			// 记录日志流水
			logErr.error("部分更新取款交易记录失败:"+e.getMessage());
			HibernateUtil.rollbackTransaction();
		} finally {
			HibernateUtil.closeSession();
		}
		return bRet;
	}
}
