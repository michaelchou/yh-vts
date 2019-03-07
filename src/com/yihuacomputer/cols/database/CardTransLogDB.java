package com.yihuacomputer.cols.database;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.SQLException;
import java.util.List;

import org.apache.log4j.Logger;
import org.hibernate.Query;
import org.hibernate.Session;

import com.yihuacomputer.cols.common.util.HibernateUtil;
import com.yihuacomputer.cols.entity.CardSettleCycleLog;
import com.yihuacomputer.cols.entity.CardTransLog;

/**
 * 开卡交易流水表
 * 深圳怡化电脑股份有限公司
 * 2017-05-05
 */
public class CardTransLogDB
{
  public Logger logErr = Logger.getLogger("Error");

  public CardTransLogDB()
  {
  }

  /**
   * 记录开卡交易流水
   * 参数1：流水内容
   * 处理结果  true=成功  false=失败
   */
  public boolean save(CardTransLog entity)
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
      logErr.error("插入开卡交易流水失败:"+e.getMessage());
      HibernateUtil.rollbackTransaction();
    }
    finally
    {
      HibernateUtil.closeSession();
    }
    return bRet;
  }

  /**
	 * 更新发卡交易流水
	 * @return bRet boolean 处理结果 true=成功 false=失败
   */
	public boolean update(CardTransLog entity) {
		boolean bRet = false;
		try {

			Session session = HibernateUtil.getSession();
			HibernateUtil.beginTransaction();
			session.update(entity);
			HibernateUtil.commitTransaction();
			bRet = true;
		} catch (Exception e) {
			// 记录日志流水
		    logErr.error("按流水id更改开卡交易流水信息失败:"+e.getMessage());
		    HibernateUtil.rollbackTransaction();
		} finally {
			HibernateUtil.closeSession();
		}
		return bRet;
	}

	/**
	  * 修改开卡交易流水表清卡状态信息
	  * 参数：清卡信息
	  * 处理结果  true=成功  false=失败
    */
	public boolean updateStatus(CardTransLog entity)
    {
		boolean bRet = false;
 	    PreparedStatement pre =null;
        String sql = "update CardTransLog set iSettleCycleStatus =? where strTerminalNum=?";
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
   	        logErr.error("更改清卡流水状态信息失败:"+err);
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
	 * 发卡交易成功后,终端发卡成功,更新数据库流水状态
	 * 参数1：流水id
	 * 参数2：终端交易状态
	 * @return boolean 是否成功
   */
   public boolean update4CardPresented(int id, int status) {
		CardTransLog cardTransLog = getEntity(id);
		if (cardTransLog == null) {
			return false;
		}
		cardTransLog.setTermTxStatus(status);
		boolean bRet = update(cardTransLog);
		return bRet;
	}
   /**
	 * 根据id号取流水信息
	 * 参数1：id
	 */
	public CardTransLog getEntity(int id) {
		CardTransLog entity = null;
		try {
			Session session = HibernateUtil.getSession();
			String hql = "from CardTransLog  where id=:id";
			Query query = session.createQuery(hql);
			query.setInteger("id", id);
			entity = (CardTransLog) query.uniqueResult();
		}
		catch (Exception e) {
			// 记录日志流水
		    logErr.error("按流水id查询开卡交易流水信息失败:"+e.getMessage());
		    HibernateUtil.rollbackTransaction();
		} finally {
			HibernateUtil.closeSession();
		}
		return entity;
	}

	/**
     * 根据终端编号,查询所有发卡交易信息</p>
     * strTerminalNum String 终端编号

     * list List  发卡交易信息
	*/
	public List<?> getList(String strTerminalNum)
	{
	    List<?> list = null;
	    try
	    {
	      Session session = HibernateUtil.getSession();
	      String hql ="from CardTransLog where strTerminalNum=:strTerminalNum " ;
	      Query query = session.createQuery(hql);
	      query.setString("strTerminalNum", strTerminalNum);

	      list = query.list();
	      if (list == null || list.isEmpty()){
	    	  list = null;
	      }
	    }
	    catch (Exception e)
	    {
	      // 记录日志流水
		  logErr.error("查询所有发卡交易信息失败:"+e);
	    }
	    finally
	    {
	      HibernateUtil.closeSession();
	    }
	    return list;
	}

	/**
     * 根据终端编号,查询当前周期所有发卡交易信息</p>
     * strTerminalNum String 终端编号

     * list List  当前批次发卡交易信息
	*/
	public List<?> getBatchList(String strTerminalNum)
	{
	    List<?> list = null;

	    CardSettleCycleLogDB cardSettleCycleLogDB = new CardSettleCycleLogDB();
	    CardSettleCycleLog  entity = cardSettleCycleLogDB.getCurBatchNoEntity(strTerminalNum, 0);//0位未清存单状态
			if(entity==null)
				return null;

	    try
	    {
	      Session session = HibernateUtil.getSession();
	      String hql ="from CardTransLog where strTerminalNum=:strTerminalNum  and termBatchNo=:termBatchNo " ;
			hql+=" order by dtOccur asc"; //参数绑定，避免sql注入
	      Query query = session.createQuery(hql);
	      query.setString("strTerminalNum", strTerminalNum);
	      query.setInteger("termBatchNo", entity.getTermBatchNo());

	      list = query.list();
	      if (list == null || list.isEmpty()){
	    	  list = null;
	      }
	    }
	    catch (Exception e)
	    {
	      // 记录日志流水
	    	e.printStackTrace();
		  logErr.error("查询所有发卡交易信息失败:"+e);
	    }
	    finally
	    {
	      HibernateUtil.closeSession();
	    }

	    return list;
	}
}
