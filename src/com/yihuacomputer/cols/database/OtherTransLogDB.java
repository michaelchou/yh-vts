package com.yihuacomputer.cols.database;

import java.util.List;

import org.apache.log4j.Logger;
import org.hibernate.Query;
import org.hibernate.Session;

import com.yihuacomputer.cols.common.util.HibernateUtil;
import com.yihuacomputer.cols.entity.OtherTransLog;

/**
 * 其他交易流水表(除存单、发卡、发UKEY)
 * 深圳怡化电脑股份有限公司
 * 2017-05-05
 */
public class OtherTransLogDB
{
  public Logger logErr = Logger.getLogger("Error");

  public OtherTransLogDB()
  {
  }
  /**
	* 根据交易流水号查询流水信息
	* 参数1：终端流水号
  */
  public OtherTransLog getEntity(String strOrgTsn) {
	OtherTransLog entity = null;
	try {
		Session session = HibernateUtil.getSession();
		String hql = "from OtherTransLog  where strTermSerialNo=:strTermSerialNo";
		Query query = session.createQuery(hql);
		query.setString("strTermSerialNo", strOrgTsn);
		entity = (OtherTransLog) query.uniqueResult();
	}
	catch (Exception e) {
		// 记录日志流水
		logErr.error("按原交易流水号查询交易流水信息失败:"+e.getMessage());
		HibernateUtil.rollbackTransaction();
	} finally {
		HibernateUtil.closeSession();
	}
	return entity;
  }
  /**
   * 记录交易流水
   * 参数1：流水内容
   * 处理结果  true=成功  false=失败
   */
  public boolean save(OtherTransLog entity)
  {
    boolean bRet = false;
    try
    {
      Session session = HibernateUtil.getSession();
      HibernateUtil.beginTransaction();
      session.save(entity);
      HibernateUtil.commitTransaction();
      bRet = true;
    }
    catch (Exception e)
    {
	  // 记录日志流水
      logErr.error("插入交易流水失败:"+e.getMessage());
      HibernateUtil.rollbackTransaction();
    }
    finally
    {
      HibernateUtil.closeSession();
    }
    return bRet;
  }
  /**
	* 更新交易流水信息
	* @return bRet boolean 处理结果 true=成功 false=失败
   */
  public boolean update(OtherTransLog entity) {
	boolean bRet = false;
	try {
		Session session = HibernateUtil.getSession();
		HibernateUtil.beginTransaction();
		session.update(entity);
		HibernateUtil.commitTransaction();
		bRet = true;
	} catch (Exception e) {
		// 记录日志流水
		logErr.error("更新交易流水信息失败:"+e.getMessage());
		HibernateUtil.rollbackTransaction();
	} finally {
		HibernateUtil.closeSession();
	}
	return bRet;
  }
  
	/**
   * 根据批次号、终端号、交易码获取所有转账信息</p>
   * strSingleBusinessNum String 批次号
   * hostTxStatus	int	主机交易状态
   * termTxStatus	int	终端交易状态	
   * strSuccessful                是否成功true/false
   * list List  内部账转账交易信息
	*/
	public List<?> getTransList(String strTransRandom,String strTerminalNum,String strOldTransCode)
	{
	    List<?> list = null;
	    try
	    {
	      Session session = HibernateUtil.getSession();
	      String hql ="from OtherTransLog  where strTerminalNum=:strTerminalNum and strExInfo2=:strExInfo2 "
	      		+ "and transCode=:transCode and hostTxStatus=0";
	      Query query = session.createQuery(hql);
	      query.setString("strTerminalNum", strTerminalNum);
	      query.setString("transCode", strOldTransCode);
	      query.setString("strExInfo2", strTransRandom);
	      
	      list = query.list();
	      if (list == null || list.isEmpty())
	    	  list = null;
	    }
	    catch (Exception e)
	    {
	      // 记录日志流水
		  logErr.error("查询转账信息失败:"+e);
	    }
	    finally
	    {
	      HibernateUtil.closeSession();
	    }
	    return list;
	}
}
