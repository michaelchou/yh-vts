package com.yihuacomputer.cols.database;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.SQLException;
import java.util.List;

import org.apache.log4j.Logger;
import org.hibernate.Query;
import org.hibernate.Session;

import com.yihuacomputer.cols.common.util.HibernateUtil;
import com.yihuacomputer.cols.entity.TerminalService;

/**
 * 终端服务菜单对象
 * 深圳怡化电脑股份有限公司
 * 2016-10-24
 */
public class TerminalServiceDB
{
	public Logger logErr = Logger.getLogger("Error");

    public static String TERMINALSERVICEDB_LOCK = "TERMINALSERVICEDB_LOCK";

    public TerminalServiceDB()
    {
    }

    /**
	 * 根据ID号取出终端服务信息
	 * 参数1：id号
	 * 返回值：终端服务对象
	*/
	@SuppressWarnings("rawtypes")
	public TerminalService getTerminalServiceById(int id) {
		TerminalService terminalService = null;
		try {
			Session session = HibernateUtil.getSession();
			String hql = "from TerminalService where id=:id";
			Query query = session.createQuery(hql);
			query.setInteger("id", id);
			// 设置查询缓存
			query.setCacheable(true);
			query.setCacheRegion("TerminalServiceQueries");
			List terminalServiceList = query.list();
			if (terminalServiceList != null && !terminalServiceList.isEmpty() && terminalServiceList.size() > 0)
				terminalService = (TerminalService) terminalServiceList.get(0);
		} catch (Exception e) {
			// 记录日志流水
			logErr.error("取终端服务信息失败:"+e);
		} finally {
			HibernateUtil.closeSession();
		}
		return terminalService;
	}
	
	/**
	 * 根据ID号取出终端服务信息
	 * 参数1：id号
	 * 返回值：终端服务对象
	 */
	@SuppressWarnings("rawtypes")
	public TerminalService getTerminalServiceByIdNoCache(int id) {
		TerminalService terminalService = null;
		try {
			Session session = HibernateUtil.getSession();
			String hql = "from TerminalService where id=:id";
			Query query = session.createQuery(hql);
			query.setInteger("id", id);
			List terminalServiceList = query.list();
			if (terminalServiceList != null && !terminalServiceList.isEmpty() && terminalServiceList.size() > 0)
				terminalService = (TerminalService) terminalServiceList.get(0);
		} catch (Exception e) {
			// 记录日志流水
			logErr.error("取终端服务信息失败:"+e);
		} finally {
			HibernateUtil.closeSession();
		}
		return terminalService;
	}

    /**
     * <p>根据终端Id取所配得的服务菜单</p>
   */
    @SuppressWarnings("rawtypes")
	public List getTemplateList(int terminalId)
    {
      synchronized (TERMINALSERVICEDB_LOCK)
      {
        List templateList = null;
        try
        {
           Session session = HibernateUtil.getSession();
           String hql = "select templateId from TerminalService where terminalId=:terminalId"; //参数绑定，避免sql注入
           Query query = session.createQuery(hql);
           query.setInteger("terminalId", terminalId);
           //设置查询缓存
           query.setCacheable(true);
           query.setCacheRegion("TerminalServiceQueries");

           templateList = query.list();
           if (null == templateList || templateList.isEmpty())
        	   templateList = null;
        }
        catch (Exception e)
        {
			// 记录日志流水
			logErr.error("取终端与菜单模板关系列表失败:"+e);
        }
        finally
        {
          HibernateUtil.closeSession();
        }
        return templateList;
      }
    }

    /**
	   * 同步终端服务信息
	   * 参数：终端服务信息
	   * 处理结果  true=成功  false=失败
	*/
	public boolean save(TerminalService entity) {
		boolean bRet = false;
		PreparedStatement pst =null;
		Session session = HibernateUtil.getSession();
		Connection dbm = session.connection();
		HibernateUtil.beginTransaction();
	    String sql = "insert into TerminalService(id,iTerminalId,iTemplateId) values (?,?,?)";
	    try
	    {
	        pst = dbm.prepareStatement(sql);
	        pst.setInt(1, entity.getId());
	        pst.setInt(2, entity.getTerminalId());
	        pst.setInt(3, entity.getTemplateId());
	        pst.addBatch();
	        pst.executeBatch();
	        HibernateUtil.commitTransaction();
	        bRet = true;
	    }
	    catch (SQLException e)
	    {
		    // 记录日志流水
		    logErr.error("更新终端服务信息失败:"+e);
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
	  * 同步终端服务信息
	  * 参数：终端服务信息
	  * 处理结果  true=成功  false=失败
	*/
    public boolean Update(TerminalService entity)
    {
    	boolean bRet = false;
	    PreparedStatement pre =null;
        String sql = "update TerminalService set iTerminalId =? ,iTemplateId =? where id=?";
        Session session = HibernateUtil.getSession();
        Connection dbm = session.connection();
        HibernateUtil.beginTransaction();
        try
        {
            pre = dbm.prepareStatement(sql);
            pre.setInt(1, entity.getTerminalId());
            pre.setInt(2, entity.getTemplateId());
            pre.setInt(3, entity.getId());
            pre.execute();
            HibernateUtil.commitTransaction();
            bRet = true;
        }
        catch (SQLException err)
        {
	        logErr.error("更终端服务信息失败:"+err);
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
    	TerminalService deleteBean = this.getTerminalServiceByIdNoCache(id);
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
	      logErr.error("删除终端服务信息失败:"+e);
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
	   * 根据终端服务id刷新缓存
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
	      String hql = "from TerminalService where id=:id"; //参数绑定，避免sql注入
	      Query query = session.createQuery(hql);
	      query.setInteger("id", id);
	      query.list();
	      bRet = true;
	    }
	    catch (Exception e)
	    {
	      // 记录日志流水
	      logErr.error("根据终端服务id刷新缓存失败:"+e);
	    }
	    finally
	    {
	      HibernateUtil.closeSession();
	    }
	    return bRet;
   }

  /**
   * 根据终端Id刷新缓存
   */
	public boolean FlushSession() {
		// 先失效查询缓存，再失效二级缓存，保证与数据库中数据同步
		boolean bRet = HibernateUtil.evictSessionFactoryQueries("TerminalServiceQueries");
		if (bRet == false)
			return false;
		return HibernateUtil.evictSessionFactory("com.yihuacomputer.cols.entity.TerminalService");
	}
}
