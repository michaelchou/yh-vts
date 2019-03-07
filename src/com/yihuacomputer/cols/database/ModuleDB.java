package com.yihuacomputer.cols.database;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.SQLException;
import java.util.List;

import org.apache.log4j.Logger;
import org.hibernate.Query;
import org.hibernate.Session;

import com.yihuacomputer.cols.common.util.HibernateUtil;
import com.yihuacomputer.cols.entity.Module;


/**
 * 设备模块表处理类
 * 深圳怡化电脑股份有限公司
 * 2017-06-07
 */

public class ModuleDB {

	public Logger logErr = Logger.getLogger("Error");

	/**
	 * 根据ID号取出设备模块信息
	 * 参数1：id号
	 * 返回值：设备试用对象
	*/
	@SuppressWarnings("rawtypes")
	public Module getModuleInfo(int id) {
		Module module = null;
		try {
			Session session = HibernateUtil.getSession();
			String hql = "from Module where id=:id";
			Query query = session.createQuery(hql);
			query.setInteger("id", id);
			// 设置查询缓存
			query.setCacheable(true);
			query.setCacheRegion("ModuleQueries");
			List moduleList = query.list();
			if (moduleList != null && !moduleList.isEmpty() && moduleList.size() > 0)
				module = (Module) moduleList.get(0);
		} catch (Exception e) {
			// 记录日志流水
			logErr.error("取模块信息失败:"+e);
		} finally {
			HibernateUtil.closeSession();
		}
		return module;
	}
	/**
	 * 根据ID号取出设备模块信息
	 * 参数1：id号
	 * 返回值：设备试用对象
	 */
	@SuppressWarnings("rawtypes")
	public Module getModuleInfoNoCache(int id) {
		Module module = null;
		try {
			Session session = HibernateUtil.getSession();
			String hql = "from Module where id=:id";
			Query query = session.createQuery(hql);
			query.setInteger("id", id);
			List moduleList = query.list();
			if (moduleList != null && !moduleList.isEmpty() && moduleList.size() > 0)
				module = (Module) moduleList.get(0);
		} catch (Exception e) {
			// 记录日志流水
			logErr.error("取模块信息失败:"+e);
		} finally {
			HibernateUtil.closeSession();
		}
		return module;
	}

	/**
	   * 同步模块信息
	   * 参数：模块信息
	   * 处理结果  true=成功  false=失败
	*/
	public boolean save(Module entity) {
		boolean bRet = false;
		PreparedStatement pst =null;
		Session session = HibernateUtil.getSession();
		Connection dbm = session.connection();
		HibernateUtil.beginTransaction();
	    String sql = "insert into Module(id,strModuleName,strModuleClsid,strModuleDesc) values (?,?,?,?)";
	    try
	    {
	        pst = dbm.prepareStatement(sql);
	        pst.setInt(1, entity.getId());
	        pst.setString(2, entity.getStrModuleName());
	        pst.setString(3, entity.getStrModuleClsid());
	        pst.setString(4, entity.getStrModuleDesc());
	        pst.addBatch();
	        pst.executeBatch();
	        HibernateUtil.commitTransaction();
	        bRet = true;
	    }
	    catch (SQLException e)
	    {
		    // 记录日志流水
		    logErr.error("更新模块信息失败:"+e);
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
	  * 同步模块信息
	  * 参数：模块信息
	  * 处理结果  true=成功  false=失败
	*/
	public boolean Update(Module entity)
    {
		boolean bRet = false;
	    PreparedStatement pre =null;
        String sql = "update Module set strModuleName =?,strModuleClsid =?,strModuleDesc =? where id=?";
        Session session = HibernateUtil.getSession();
        Connection dbm = session.connection();
        HibernateUtil.beginTransaction();
        try
        {
            pre = dbm.prepareStatement(sql);
            pre.setString(1, entity.getStrModuleName());
            pre.setString(2, entity.getStrModuleClsid());
            pre.setString(3, entity.getStrModuleDesc());
            pre.setInt(4, entity.getId());
            pre.execute();
            HibernateUtil.commitTransaction();
            bRet = true;
        }
        catch (SQLException err)
        {
  	        logErr.error("更改模块信息失败:"+err);
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
    	Module deleteBean = this.getModuleInfoNoCache(id);
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
	      logErr.error("删除模块信息失败:"+e);
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
	      String hql = "from Module where id=:id"; //参数绑定，避免sql注入
	      Query query = session.createQuery(hql);
	      query.setInteger("id", id);
	      query.list();
	      bRet = true;
	    }
	    catch (Exception e)
	    {
	      // 记录日志流水
	      logErr.error("根据模块id刷新缓存失败:"+e);
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
		boolean bRet = HibernateUtil.evictSessionFactoryQueries("ModuleQueries");
		if (bRet == false)
			return false;
		return HibernateUtil.evictSessionFactory("com.yihuacomputer.cols.entity.Module");
	}
}
