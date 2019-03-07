package com.yihuacomputer.cols.database;

import java.util.List;

import org.apache.log4j.Logger;
import org.hibernate.Query;
import org.hibernate.Session;

import com.yihuacomputer.cols.common.util.HibernateUtil;
import com.yihuacomputer.cols.entity.HostRetCode;
import com.yihuacomputer.cols.service.FlushCache;

/**
 * 主机返回码转换表的处理类
 */
public class HostRetCodeDB
{
	public Logger logErr = Logger.getLogger("Error");

	public HostRetCodeDB()
    {
    }

    /**
     * 根据主机返回码取对应的描述信息
     * null 未找到
     */
    @SuppressWarnings("rawtypes")
    public HostRetCode getEntity(String strHostRetCode)
    {
	   HostRetCode hostRetCode = null;
       try
       {
          Session session = HibernateUtil.getSession();
          String hql = "from HostRetCode  where strHostRetCode=:strHostRetCode "; //参数绑定，避免sql注入
          Query query = session.createQuery(hql);
          query.setString("strHostRetCode", strHostRetCode);
          //设置查询缓存
          query.setCacheable(true);
          query.setCacheRegion("HostRetCodeQueries");

          List hostRetCodeList = query.list();
          if (hostRetCodeList != null &&!hostRetCodeList.isEmpty()&& hostRetCodeList.size() > 0)
    	      hostRetCode = (HostRetCode) hostRetCodeList.get(0);
        }
        catch (Exception e)
        {
			// 记录日志流水
			logErr.error("取主机返回码信息失败:"+e);
        }
        finally
        {
           HibernateUtil.closeSession();
        }
        return hostRetCode;
     }

    /**
     * 记录主机返回码信息
     * 参数1：流水内容
     * 处理结果  true=成功  false=失败
     */
    public boolean save(HostRetCode entity)
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
            logErr.error("插入主机返回码信息失败:"+e.getMessage());
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
	     new FlushCache().broadcastFlushSessionAsync("MsgType=RefreshBuf&strTableName=HostRetCode&strKey=&strValue=");
		 return true;
      }

    /**
	 * 更新卡箱信息
	 * 参数1：卡箱对象
	 * 返回值：true=成功 false=失败
	 */
	public boolean update(HostRetCode entity)
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
			logErr.error("更新主机返回码信息失败:"+e.getMessage());
			HibernateUtil.rollbackTransaction();
		} finally
		{
			HibernateUtil.closeSession();
		}
		if (bRet != true){
		      return false;
		}
		//因为系统部署在集群环境中，当更新数据时，除了失效本节点的缓存，还需通知其它节点
	    new FlushCache().broadcastFlushSessionAsync("MsgType=RefreshBuf&strTableName=HostRetCode&strKey=id&strValue="+entity.getId());
		return true;
	}

	/**
	   * 根据返回码id刷新缓存
	   * @param id 返回码id
	   * @return bRet boolean 处理结果
	   * true=成功
	   * false=失败
	*/
	public boolean FlushSession(int id)
	{
	    boolean bRet = false;
	    try
	    {
	      Session session = HibernateUtil.getSession();
	      String hql = "from HostRetCode where id=:id"; //参数绑定，避免sql注入
	      Query query = session.createQuery(hql);
	      query.setInteger("id", id);
	      query.list();
	      bRet = true;
	    }
	    catch (Exception e)
	    {
	       // 记录日志流水
	       logErr.error("根据返回码id刷新缓存失败:"+e);
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
        boolean bRet = HibernateUtil.evictSessionFactoryQueries("HostRetCodeQueries");
        if (bRet == false)
           return false;
        return HibernateUtil.evictSessionFactory("com.yihuacomputer.cols.entity.HostRetCode");
      }
}
