package com.yihuacomputer.cols.database;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.SQLException;
import java.util.List;

import org.apache.log4j.Logger;
import org.hibernate.Query;
import org.hibernate.Session;

import com.yihuacomputer.cols.common.util.HibernateUtil;
import com.yihuacomputer.cols.entity.TemplateMenuRelation;


/**
 * 菜单与模板的关联表处理类
 * 深圳怡化电脑股份有限公司
 * 2017-06-08
 */

public class TemplateMenuRelationDB {

	public Logger logErr = Logger.getLogger("Error");


	/**
     * 根据模板的Id取该模块所对应的所有菜单详细信息
     * 参数：模板id
     * 返回值：该模块所对应的详细信息
   */
	@SuppressWarnings("rawtypes")
	public List getTerminalServiceMenuList(int terminalId)
    {
    	List templateList = new TerminalServiceDB().getTemplateList(terminalId);
        if (null == templateList)
        {
            return null;
        }
        List menuList = null;
        try
        {
        	Session session = HibernateUtil.getSession();
        	String hql = "select serviceMenuId from TemplateMenuRelation where templateId in (:templateId)";
            Query query = session.createQuery(hql);
            query.setParameterList("templateId", templateList);
            //设置查询缓存
            query.setCacheable(true);
            query.setCacheRegion("TemplateMenuRelationQueries");
            menuList = query.list();
            //未找到
            if (menuList==null||menuList.isEmpty())
            	menuList = null;
          }
          catch (Exception e)
          {
             // 记录日志流水
       	  logErr.error("取菜单与模板的关联失败:"+e);
          }
          finally
          {
             HibernateUtil.closeSession();
          }
          return menuList;
      }

	/**
	 * 根据ID号取出菜单与模板的关联信息
	 * 参数1：id号
	 * 返回值：菜单与模板的关联对象
	*/
	@SuppressWarnings("rawtypes")
	public TemplateMenuRelation getTemplateMenuRelationById(int id) {
		TemplateMenuRelation templateMenuRelation = null;
		try {
			Session session = HibernateUtil.getSession();
			String hql = "from TemplateMenuRelation where id=:id";
			Query query = session.createQuery(hql);
			query.setInteger("id", id);
			// 设置查询缓存
			query.setCacheable(true);
			query.setCacheRegion("TemplateMenuRelationQueries");
			List templateMenuRelationList = query.list();
			if (templateMenuRelationList != null && !templateMenuRelationList.isEmpty() && templateMenuRelationList.size() > 0)
				templateMenuRelation = (TemplateMenuRelation) templateMenuRelationList.get(0);
		} catch (Exception e) {
			// 记录日志流水
			logErr.error("取菜单与模板的关联信息失败:"+e);
		} finally {
			HibernateUtil.closeSession();
		}
		return templateMenuRelation;
	}
	
	/**
	 * 根据ID号取出菜单与模板的关联信息
	 * 参数1：id号
	 * 返回值：菜单与模板的关联对象
	 */
	@SuppressWarnings("rawtypes")
	public TemplateMenuRelation getTemplateMenuRelationByIdNoCache(int id) {
		TemplateMenuRelation templateMenuRelation = null;
		try {
			Session session = HibernateUtil.getSession();
			String hql = "from TemplateMenuRelation where id=:id";
			Query query = session.createQuery(hql);
			query.setInteger("id", id);
			List templateMenuRelationList = query.list();
			if (templateMenuRelationList != null && !templateMenuRelationList.isEmpty() && templateMenuRelationList.size() > 0)
				templateMenuRelation = (TemplateMenuRelation) templateMenuRelationList.get(0);
		} catch (Exception e) {
			// 记录日志流水
			logErr.error("取菜单与模板的关联信息失败:"+e);
		} finally {
			HibernateUtil.closeSession();
		}
		return templateMenuRelation;
	}

	/**
	   * 同步菜单与模板的关联信息
	   * 参数：菜单与模板的关联信息
	   * 处理结果  true=成功  false=失败
	*/
	public boolean save(TemplateMenuRelation entity) {
		boolean bRet = false;
		PreparedStatement pst =null;
		Session session = HibernateUtil.getSession();
		Connection dbm = session.connection();
		HibernateUtil.beginTransaction();
	    String sql = "insert into TemplateMenuRelation(id,iTemplateId,iServiceMenuId) values (?,?,?)";
	    try
	    {
	        pst = dbm.prepareStatement(sql);
	        pst.setInt(1, entity.getId());
	        pst.setInt(2, entity.getTemplateId());
	        pst.setInt(3, entity.getServiceMenuId());
	        pst.addBatch();
	        pst.executeBatch();
	        HibernateUtil.commitTransaction();
	        bRet = true;
	    }
	    catch (SQLException e)
	    {
		    // 记录日志流水
		    logErr.error("更新菜单与模板的关联信息失败:"+e);
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
	  * 同步菜单与模板的关联信息
	  * 参数：菜单与模板的关联信息
	  * 处理结果  true=成功  false=失败
	*/
	public boolean Update(TemplateMenuRelation entity)
    {
		boolean bRet = false;
	    PreparedStatement pre =null;
        String sql = "update TemplateMenuRelation set iTemplateId =? ,iServiceMenuId =? where id=?";
        Session session = HibernateUtil.getSession();
        Connection dbm = session.connection();
        HibernateUtil.beginTransaction();
        try
        {
            pre = dbm.prepareStatement(sql);
            pre.setInt(1, entity.getTemplateId());
            pre.setInt(2, entity.getServiceMenuId());
            pre.setInt(3, entity.getId());
            pre.execute();
            HibernateUtil.commitTransaction();
            bRet = true;
        }
        catch (SQLException err)
        {
  	        logErr.error("更改菜单与模板的关联信息失败:"+err);
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
    	TemplateMenuRelation deleteBean = this.getTemplateMenuRelationByIdNoCache(id);
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
	      logErr.error("删除菜单与模板的关联信息失败:"+e);
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
	   * 根据菜单与模板的关联id刷新缓存
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
	      String hql = "from TemplateMenuRelation where id=:id"; //参数绑定，避免sql注入
	      Query query = session.createQuery(hql);
	      query.setInteger("id", id);
	      query.list();
	      bRet = true;
	    }
	    catch (Exception e)
	    {
	      // 记录日志流水
	      logErr.error("根据菜单与模板的关联id刷新缓存失败:"+e);
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
		boolean bRet = HibernateUtil.evictSessionFactoryQueries("TemplateMenuRelationQueries");
		if (bRet == false)
			return false;
		return HibernateUtil.evictSessionFactory("com.yihuacomputer.cols.entity.TemplateMenuRelation");
	}
}
