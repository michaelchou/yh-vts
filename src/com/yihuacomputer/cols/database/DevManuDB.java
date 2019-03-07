package com.yihuacomputer.cols.database;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.SQLException;
import java.util.List;

import org.apache.log4j.Logger;
import org.hibernate.Query;
import org.hibernate.Session;

import com.yihuacomputer.cols.common.util.HibernateUtil;
import com.yihuacomputer.cols.entity.DevManu;


/**
 * 设备品牌表处理类
 * 深圳怡化电脑股份有限公司
 * 2017-06-08
 */

public class DevManuDB {

	public Logger logErr = Logger.getLogger("Error");

	/**
	 * 根据ID号取出设备品牌信息
	 * 参数1：id号
	 * 返回值：设备试用对象
	*/
	@SuppressWarnings("rawtypes")
	public DevManu getDevManuById(int id) {
		DevManu devManu = null;
		try {
			Session session = HibernateUtil.getSession();
			String hql = "from DevManu where id=:id";
			Query query = session.createQuery(hql);
			query.setInteger("id", id);
			// 设置查询缓存
			query.setCacheable(true);
			query.setCacheRegion("DevManuQueries");
			List devManuList = query.list();
			if (devManuList != null && !devManuList.isEmpty() && devManuList.size() > 0)
				devManu = (DevManu) devManuList.get(0);
		} catch (Exception e) {
			// 记录日志流水
			logErr.error("取设备品牌信息失败:"+e);
		} finally {
			HibernateUtil.closeSession();
		}
		return devManu;
	}
	/**
	 * 根据ID号取出设备品牌信息
	 * 参数1：id号
	 * 返回值：设备试用对象
	 */
	@SuppressWarnings("rawtypes")
	public DevManu getDevManuByIdNoCache(int id) {
		DevManu devManu = null;
		try {
			Session session = HibernateUtil.getSession();
			String hql = "from DevManu where id=:id";
			Query query = session.createQuery(hql);
			query.setInteger("id", id);
			List devManuList = query.list();
			if (devManuList != null && !devManuList.isEmpty() && devManuList.size() > 0)
				devManu = (DevManu) devManuList.get(0);
		} catch (Exception e) {
			// 记录日志流水
			logErr.error("取设备品牌信息失败:"+e);
		} finally {
			HibernateUtil.closeSession();
		}
		return devManu;
	}

	/**
	   * 同步设备品牌信息
	   * 参数：设备品牌信息
	   * 处理结果  true=成功  false=失败
	*/
	public boolean save(DevManu entity) {
		boolean bRet = false;
		PreparedStatement pst =null;
		Session session = HibernateUtil.getSession();
		Connection dbm = session.connection();
		HibernateUtil.beginTransaction();
	    String sql = "insert into DevManu(id,strDevManuName) values (?,?)";
	    try
	    {
	        pst = dbm.prepareStatement(sql);
	        pst.setInt(1, entity.getId());
	        pst.setString(2, entity.getStrDevManuName());
	        pst.addBatch();
	        pst.executeBatch();
	        HibernateUtil.commitTransaction();
	        bRet = true;
	    }
	    catch (SQLException e)
	    {
		    // 记录日志流水
		    logErr.error("更新设备品牌信息失败:"+e);
	        HibernateUtil.rollbackTransaction();
	        bRet = false;
	    }
	    finally
	    {
	    	try{
				if(pst!=null){
					pst.close();
			    }
			}catch(Exception e){
			}
	    	HibernateUtil.closeSession();
	    }
	    return bRet;
	}

	/**
	  * 同步设备品牌信息
	  * 参数：设备品牌信息
	  * 处理结果  true=成功  false=失败
	*/
	public boolean Update(DevManu entity)
    {
		boolean bRet = false;
	    PreparedStatement pre =null;
        String sql = "update DevManu set strDevManuName =? where id=?";
        Session session = HibernateUtil.getSession();
        Connection dbm = session.connection();
        HibernateUtil.beginTransaction();
        try
        {
            pre = dbm.prepareStatement(sql);
            pre.setString(1, entity.getStrDevManuName());
            pre.setInt(2, entity.getId());
            pre.execute();
            HibernateUtil.commitTransaction();
            bRet = true;
        }
        catch (SQLException err)
        {
  	        logErr.error("更改设备品牌信息失败:"+err);
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
	   * 删除数据
	   * @param  id : 数据实体的ID号
	*/
    public boolean delete(int id)
	{
    	boolean bRet = false;
    	DevManu deleteBean = this.getDevManuByIdNoCache(id);
    	if(deleteBean == null ){
    	   return true;
    	}
	    Session session = HibernateUtil.getSession();
	    HibernateUtil.beginTransaction();
	    try
	    {
	      session.delete(deleteBean);
	      HibernateUtil.commitTransaction();
	      bRet = true;
	    }
	    catch (Exception e)
	    {
	      logErr.error("删除设备品牌信息失败:"+e);
	      HibernateUtil.rollbackTransaction();
	      bRet = false;
	    }
	    finally
	    {
	      HibernateUtil.closeSession();
	    }
	    return bRet;
	}

	/**
	   * 根据模块id刷新缓存
	   * @param id 参数id
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
	      String hql = "from DevManu where id=:id"; //参数绑定，避免sql注入
	      Query query = session.createQuery(hql);
	      query.setInteger("id", id);
	      query.list();
	      bRet = true;
	    }
	    catch (Exception e)
	    {
	      // 记录日志流水
	      logErr.error("根据设备品牌id刷新缓存失败:"+e);
	    }
	    finally
	    {
	      HibernateUtil.closeSession();
	    }
	    return bRet;
	}

	/**
	 * 刷新缓存
	*/
	public boolean FlushSession() {
		// 先失效查询缓存，再失效二级缓存，保证与数据库中数据同步
		boolean bRet = HibernateUtil.evictSessionFactoryQueries("DevManuQueries");
		if (bRet == false)
			return false;
		return HibernateUtil.evictSessionFactory("com.yihuacomputer.cols.entity.DevManu");
	}
}
