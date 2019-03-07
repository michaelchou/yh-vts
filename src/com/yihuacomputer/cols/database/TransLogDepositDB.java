package com.yihuacomputer.cols.database;

import java.util.List;

import org.apache.log4j.Logger;
import org.hibernate.Query;
import org.hibernate.Session;

import com.yihuacomputer.cols.common.util.HibernateUtil;
import com.yihuacomputer.cols.entity.TerminalModule;
import com.yihuacomputer.cols.entity.TransLogDeposit;
import com.yihuacomputer.cols.entity.UKeyTransLog;

public class TransLogDepositDB {
	public Logger logErr = Logger.getLogger("Error");

	/**
	 * 获取轧账数据  主机返回状态不为0：交易成功  的记录
	 * @return
	 */
	public List<?> getGZrecord(String terminalId){
		 List<?> list = null;
		try {
			Session session = HibernateUtil.getSession();
			String hql = "from TransLogDeposit  where strTerminalNum=:terminalId and iHostTransStatus!=0 and iSettleCycleStatus=0 "
					+ "and strTransCode in ('909005','909008','909020','909120')";
			Query query = session.createQuery(hql);
			query.setString("terminalId", terminalId);
			list = query.list();
		}
		catch (Exception e) {
			// 记录日志流水
			logErr.error("获取轧账存款流水数据  失败:"+e.getMessage());
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
	public boolean sava(TransLogDeposit transLogDeposit){
		boolean bRet = false;
		try
		{
		  Session session = HibernateUtil.getSession();
		  HibernateUtil.beginTransaction();
		  session.save(transLogDeposit);
		  HibernateUtil.commitTransaction();
		  bRet = true;
		}
		catch (Exception e)
		{
		  // 记录日志流水
		  logErr.error("插入存款交易流水记录失败:"+e.getMessage());
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
	public boolean update(TransLogDeposit transLogDeposit){
		boolean bRet = false;
		try {
			Session session = HibernateUtil.getSession();
			HibernateUtil.beginTransaction();
			session.update(transLogDeposit);
			HibernateUtil.commitTransaction();
			bRet = true;
		} catch (Exception e) {
			// 记录日志流水
			logErr.error("更新存款交易记录失败:"+e.getMessage());
			HibernateUtil.rollbackTransaction();
		} finally {
			HibernateUtil.closeSession();
		}
		return bRet;
	}
	/**
	 * 查询原存款交易记录
	 * @param transLogDeposit
	 * @return
	 */
	public TransLogDeposit getOldTransLog(String strOldOrgTsns,String strTransCode){
		TransLogDeposit strTransLogDeposit = null;
		try {
			Session session = HibernateUtil.getSession();
			String hql = "from TransLogDeposit where strTermSerialNo=:strTermSerialNo and strtransCode=:strtransCode";
			Query query = session.createQuery(hql);
			query.setString("strTermSerialNo", strOldOrgTsns);
			query.setString("strtransCode", strTransCode);

			List strTransLogList = query.list();
			if (strTransLogList != null && !strTransLogList.isEmpty() && strTransLogList.size() > 0)
				strTransLogDeposit = (TransLogDeposit) strTransLogList.get(0);
		} catch (Exception e) {
			// 记录日志流水
			logErr.error("获取原存款信息失败:"+e);
		} finally {
			HibernateUtil.closeSession();
		}
		return strTransLogDeposit;
	}
	/**
	 * 更新原存款交易记录
	 * @param transLogDeposit
	 * @return
	 */
	public boolean updateOldDepositTrans(TransLogDeposit transLogDeposit){
		boolean bRet = update(transLogDeposit);
		 logErr.error("按流水更新原存款信息:"+bRet);
		return bRet;
	}
	/**
     * 根据随机数和交易码获取所有转入内部账信息</p>
     * strSingleBusinessNum String 批次号
     * hostTxStatus	int	主机交易状态
     * termTxStatus	int	终端交易状态
     * strSuccessful                是否成功true/false
     * list List  受理存单交易信息
	*/
	public List<?> getTransOutList(String strTransRandom,String strTransCode)
	{
	    List<?> list = null;
	    try
	    {
	      Session session = HibernateUtil.getSession();
	      String hql ="from TransLogDeposit where strSingleBusinessNum=:strSingleBusinessNum and ihostTransStatus=0 "
	      		+ "and strtransCode=:strtransCode" ;
	      Query query = session.createQuery(hql);
	      query.setString("strSingleBusinessNum", strTransRandom);
	      query.setString("strtransCode", strTransCode);

	      list = query.list();
	      if (list == null || list.isEmpty())
	    	  list = null;
	    }
	    catch (Exception e)
	    {
	      // 记录日志流水
		  logErr.error("查询内部账存款信息失败:"+e);
	    }
	    finally
	    {
	      HibernateUtil.closeSession();
	    }
	    return list;
	}
}
