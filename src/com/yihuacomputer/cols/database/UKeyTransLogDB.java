package com.yihuacomputer.cols.database;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.SQLException;
import java.util.List;

import org.apache.log4j.Logger;
import org.hibernate.Query;
import org.hibernate.Session;

import com.yihuacomputer.cols.common.util.HibernateUtil;
import com.yihuacomputer.cols.entity.UKeySettleCycleLog;
import com.yihuacomputer.cols.entity.UKeyTransLog;

/**
 * UKey交易流水表
 * 深圳怡化电脑股份有限公司
 * 2017-05-10
 */
public class UKeyTransLogDB
{
  public Logger logErr = Logger.getLogger("Error");

  public UKeyTransLogDB()
  {
  }

  /**
   * 记录UKey交易流水
   * 参数1：流水内容
   * 处理结果  true=成功  false=失败
   */
  public boolean save(UKeyTransLog entity)
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
      logErr.error("插入UKey交易流水失败:"+e.getMessage());
      HibernateUtil.rollbackTransaction();
    }
    finally
    {
      HibernateUtil.closeSession();
    }
    return bRet;
  }

  /**
	 * 更新UKey交易流水
	 * @return bRet boolean 处理结果 true=成功 false=失败
   */
   public boolean update(UKeyTransLog entity) {
		boolean bRet = false;
		try {

			Session session = HibernateUtil.getSession();
			HibernateUtil.beginTransaction();
			session.update(entity);
			HibernateUtil.commitTransaction();
			bRet = true;
		} catch (Exception e) {
			// 记录日志流水
		    logErr.error("按流水id更改UKey交易流水信息失败:"+e.getMessage());
		    HibernateUtil.rollbackTransaction();
		} finally {
			HibernateUtil.closeSession();
		}
		return bRet;
   }

   /**
	  * 修改发UKey交易流水表清Ukey状态信息
	  * 参数：清卡信息
	  * 处理结果  true=成功  false=失败
   */
   public boolean updateStatus(UKeyTransLog entity)
   {
		boolean bRet = false;
	    PreparedStatement pre =null;
        String sql = "update UKeyTransLog set iSettleCycleStatus =? where strTerminalNum=?";
        Session session = HibernateUtil.getSession();
        Connection dbm = session.connection();
        HibernateUtil.beginTransaction();
        try
        {
            pre = dbm.prepareStatement(sql);
            pre.setInt(1, entity.getSettleCycleStatus());
            pre.setString(2, entity.getStrTerminalNum());
            pre.execute();
            HibernateUtil.commitTransaction();
            bRet = true;
        }
        catch (SQLException err)
        {
 	        logErr.error("更改清UKey流水状态信息失败:"+err);
            HibernateUtil.rollbackTransaction();
            bRet = false;
        }
        finally
        {
   	        try{
			    if(pre!=null){
				    pre.close();
			    }
			}catch(Exception e){

			}
   	        HibernateUtil.closeSession();
         }
         return bRet;
   }

   /**
	 * UKey交易成功后,终端发UKey成功,更新数据库流水状态
	 * 参数1：流水id
	 * 参数2：终端交易状态
	 * @return boolean 是否成功
   */
   public boolean update4UKeyPresented(int id, int status) {
	    UKeyTransLog ukeyTransLog = getEntity(id);
		if (ukeyTransLog == null) {
			return false;
		}
		ukeyTransLog.setTermTxStatus(status);
		boolean bRet = update(ukeyTransLog);
		return bRet;
	}
   /**
	 * 根据id号取流水信息
	 * 参数1：id
	 */
	public UKeyTransLog getEntity(int id) {
		UKeyTransLog entity = null;
		try {
			Session session = HibernateUtil.getSession();
			String hql = "from UKeyTransLog  where id=:id";
			Query query = session.createQuery(hql);
			query.setInteger("id", id);
			entity = (UKeyTransLog) query.uniqueResult();
		}
		catch (Exception e) {
			// 记录日志流水
		    logErr.error("按流水id查询UKey交易流水信息失败:"+e.getMessage());
		    HibernateUtil.rollbackTransaction();
		} finally {
			HibernateUtil.closeSession();
		}
		return entity;
	}

	/**
     * 根据终端编号,查询所有发Ukey交易信息</p>
     * strTerminalNum String 终端编号

     * list List  发Ukey交易信息
	*/
	public List<?> getList(String strTerminalNum)
	{
	    List<?> list = null;
	    try
	    {
	      Session session = HibernateUtil.getSession();
	      String hql ="from UKeyTransLog where strTerminalNum=:strTerminalNum " ;
	      Query query = session.createQuery(hql);
	      query.setString("strTerminalNum", strTerminalNum);

	      list = query.list();
	      if (list == null || list.isEmpty())
	    	  list = null;
	    }
	    catch (Exception e)
	    {
	      // 记录日志流水
		  logErr.error("查询所有发Ukey交易信息失败:"+e);
	    }
	    finally
	    {
	      HibernateUtil.closeSession();
	    }
	    return list;
	}

	/**
     * 根据终端编号,查询当前批次所有发Ukey交易信息</p>
     * strTerminalNum String 终端编号

     * list List 当前批次 发Ukey交易信息
	*/
	public List<?> getBatchList(String strTerminalNum)
	{
	    List<?> list = null;
	    UKeySettleCycleLogDB uKeySettleCycleLogDB = new UKeySettleCycleLogDB();
	    UKeySettleCycleLog  entity = uKeySettleCycleLogDB.getCurBatchNoEntity(strTerminalNum, 0);//0位未清存单状态
			if(entity==null)
				return null;
	    try
	    {
	      Session session = HibernateUtil.getSession();
	      String hql ="from UKeyTransLog where strTerminalNum=:strTerminalNum  and termBatchNo=:termBatchNo " ;
			hql+=" order by dtOccur asc"; //参数绑定，避免sql注入
	      Query query = session.createQuery(hql);
	      query.setString("strTerminalNum", strTerminalNum);
	      query.setInteger("termBatchNo", entity.getTermBatchNo());

	      list = query.list();
	      if (list == null || list.isEmpty())
	    	  list = null;
	    }
	    catch (Exception e)
	    {
	      // 记录日志流水
		  logErr.error("查询所有发Ukey交易信息失败:"+e);
	    }
	    finally
	    {
	      HibernateUtil.closeSession();
	    }
	    return list;
	}
}
