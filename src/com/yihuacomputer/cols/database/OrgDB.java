package com.yihuacomputer.cols.database;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.SQLException;
import java.util.List;

import org.apache.log4j.Logger;
import org.hibernate.Query;
import org.hibernate.Session;

import com.yihuacomputer.cols.common.util.HibernateUtil;
import com.yihuacomputer.cols.entity.Org;

/**
 * 机构表处理类
 * 深圳怡化电脑股份有限公司
 * 2017-01-12
 */

public class OrgDB {

	public Logger logErr = Logger.getLogger("Error");

	/**
	 * 根据id号取出机构信息值
	 * 参数1：id
	 * 返回值：机构对象
	*/
	@SuppressWarnings("rawtypes")
	public Org getOrgInfo(int orgId) {
		Org org = null;
		try {
			Session session = HibernateUtil.getSession();
			String hql = "from Org where id=:orgId";
			Query query = session.createQuery(hql);
			query.setInteger("orgId", orgId);
			// 设置查询缓存
			query.setCacheable(true);
			query.setCacheRegion("OrgQueries");
			List orgList = query.list();
			if (orgList != null && !orgList.isEmpty() && orgList.size() > 0)
				org = (Org) orgList.get(0);
		} catch (Exception e) {
			// 记录日志流水
			logErr.error("取机构失败:"+e);
		} finally {
			HibernateUtil.closeSession();
		}
		return org;
	}
	
	/**
	 * 根据id号取出机构信息值
	 * 参数1：id
	 * 返回值：机构对象
	 */
	@SuppressWarnings("rawtypes")
	public Org getOrgInfoNoCache(int orgId) {
		Org org = null;
		try {
			Session session = HibernateUtil.getSession();
			String hql = "from Org where id=:orgId";
			Query query = session.createQuery(hql);
			query.setInteger("orgId", orgId);
			List orgList = query.list();
			if (orgList != null && !orgList.isEmpty() && orgList.size() > 0)
				org = (Org) orgList.get(0);
		} catch (Exception e) {
			// 记录日志流水
			logErr.error("取机构失败:"+e);
		} finally {
			HibernateUtil.closeSession();
		}
		return org;
	}

	/**
	   * 同步机构信息
	   * 参数：机构信息
	   * 处理结果  true=成功  false=失败
	*/
	public boolean save(Org entity) {
		boolean bRet = false;
		PreparedStatement pst =null;
		Session session = HibernateUtil.getSession();
		Connection dbm = session.connection();
		HibernateUtil.beginTransaction();
	    String sql = "insert into Org(id,strParentOrgCode,strOrgNum,strOrgName) values (?,?,?,?)";
	    try
	    {
	        pst = dbm.prepareStatement(sql);
	        pst.setInt(1, entity.getId());
	        pst.setString(2, entity.getStrParentOrgCode());
	        pst.setString(3, entity.getStrOrgNum());
	        pst.setString(4, entity.getStrOrgName());
	        pst.addBatch();
	        pst.executeBatch();
	        HibernateUtil.commitTransaction();
	        bRet = true;
	    }
	    catch (SQLException e)
	    {
	    	e.printStackTrace();
		    // 记录日志流水
		    logErr.error("更新机构信息失败:"+e);
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
	  * 同步机构信息
	  * 参数：机构信息
	  * 处理结果  true=成功  false=失败
	*/
	public boolean Update(Org entity)
    {
		boolean bRet = false;
  	    PreparedStatement pre =null;
        String sql = "update Org set strParentOrgCode =?, strOrgNum =?, strOrgName =? where id=?";
        Session session = HibernateUtil.getSession();
        Connection dbm = session.connection();
        HibernateUtil.beginTransaction();
        try
        {
            pre = dbm.prepareStatement(sql);
            pre.setString(1, entity.getStrParentOrgCode());
            pre.setString(2, entity.getStrOrgNum());
            pre.setString(3, entity.getStrOrgName());
            pre.setInt(4, entity.getId());
            pre.execute();
            HibernateUtil.commitTransaction();
            bRet = true;
        }
        catch (SQLException err)
        {
    	   logErr.error("更改机构信息失败:"+err);
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
	    Org deleteBean = this.getOrgInfoNoCache(id);
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
	      logErr.error("删除机构信息失败:"+e);
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
	   * 根据机构id刷新缓存
	   * @param id 机构id
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
	      String hql = "from Org where id=:id"; //参数绑定，避免sql注入
	      Query query = session.createQuery(hql);
	      query.setInteger("id", id);
	      query.list();
	      bRet = true;
	    }
	    catch (Exception e)
	    {
	      // 记录日志流水
	      logErr.error("根据机构id刷新缓存失败:"+e);
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
		//先失效查询缓存，再失效二级缓存，保证与数据库中数据同步
	    boolean bRet = HibernateUtil.evictSessionFactoryQueries("OrgQueries");
	    if (bRet == false)
	      return false;
	    return HibernateUtil.evictSessionFactory("com.yihuacomputer.cols.entity.Org");
	}
}
