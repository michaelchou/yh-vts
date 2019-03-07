package com.yihuacomputer.cols.database;

import java.util.List;

import org.apache.log4j.Logger;
import org.hibernate.Query;
import org.hibernate.Session;

import com.yihuacomputer.cols.common.util.HibernateUtil;
import com.yihuacomputer.cols.entity.PadCheck;
import com.yihuacomputer.cols.service.FlushCache;

/**
 * PAD审核状态查询表的处理类
 */
public class PadCheckDB
{
	public Logger logErr = Logger.getLogger("Error");

	public PadCheckDB()
    {
    }

    /**
     * 根据审核交易流水号取对应的审批信息
     * null 未找到
     */
    @SuppressWarnings("rawtypes")
    public PadCheck getEntity(String strCheckSerialNo)
    {
       PadCheck padCheck = null;
       try
       {
          Session session = HibernateUtil.getSession();
          String hql = "from PadCheck where strCheckSerialNo=:strCheckSerialNo "; //参数绑定，避免sql注入
          Query query = session.createQuery(hql);
          query.setString("strCheckSerialNo", strCheckSerialNo);
          //设置查询缓存
          query.setCacheable(true);
          query.setCacheRegion("PadCheckQueries");

          List padCheckList = query.list();
          if (padCheckList != null &&!padCheckList.isEmpty()&& padCheckList.size() > 0)
        	  padCheck = (PadCheck) padCheckList.get(0);
        }
        catch (Exception e)
        {
			// 记录日志流水
			logErr.error("取PAD审批信息失败:"+e);
        }
        finally
        {
           HibernateUtil.closeSession();
        }
        return padCheck;
     }

    /**
     * 记录审批信息
     * 参数1：流水内容
     * 处理结果  true=成功  false=失败
     */
    public boolean save(PadCheck entity)
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
            logErr.error("插入PAD审批信息失败:"+e.getMessage());
            HibernateUtil.rollbackTransaction();
         }
         finally
         {
            HibernateUtil.closeSession();
         }
         if (bRet != true){
		      return false;
		 }
		 //因为系统部署在集群环境中，当更新数据时，除了失效本节点的缓存，还需通知其它节点
	     new FlushCache().broadcastFlushSessionAsync("MsgType=RefreshBuf&strTableName=PadCheck&strKey=&strValue=");
		 return true;
      }

    /**
	 * 更新审批信息
	 * 参数1：卡箱对象
	 * 返回值：true=成功 false=失败
	 */
	public boolean update(PadCheck entity)
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
			// 记录日志流水
			logErr.error("更新PAD审批信息失败:"+e.getMessage());
			HibernateUtil.rollbackTransaction();
		} finally
		{
			HibernateUtil.closeSession();
		}
		if (bRet != true){
		      return false;
		}
		//因为系统部署在集群环境中，当更新数据时，除了失效本节点的缓存，还需通知其它节点
	    new FlushCache().broadcastFlushSessionAsync("MsgType=RefreshBuf&strTableName=PadCheck&strKey=id&strValue="+entity.getStrCheckSerialNo());
		return true;
	}

	/**
	   * 根据审核交易流水号刷新缓存
	   * @param id 返回码id
	   * @return bRet boolean 处理结果
	   * true=成功
	   * false=失败
	*/
	public boolean FlushSession(String  strCheckSerialNo)
	{
	    boolean bRet = false;
	    try
	    {
	      Session session = HibernateUtil.getSession();
	      String hql = "from PadCheck where strCheckSerialNo=:strCheckSerialNo"; //参数绑定，避免sql注入
	      Query query = session.createQuery(hql);
	      query.setString("strCheckSerialNo", strCheckSerialNo);
	      query.list();
	      bRet = true;
	    }
	    catch (Exception e)
	    {
	       // 记录日志流水
	       logErr.error("根据交易流水号刷新缓存失败:"+e);
	    }
	    finally
	    {
	      HibernateUtil.closeSession();
	    }
	    return bRet;
	}

      /**
       * 刷新缓存
       * @return bRet boolean 处理结果
       * true=成功
       * false=失败
      */
      public boolean FlushSession()
      {
        //先失效查询缓存，再失效二级缓存，保证与数据库中数据同步
        boolean bRet = HibernateUtil.evictSessionFactoryQueries("PadCheckQueries");
        if (bRet == false)
           return false;
        return HibernateUtil.evictSessionFactory("com.yihuacomputer.cols.entity.PadCheck");
      }
}
