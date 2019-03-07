package com.yihuacomputer.cols.database;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.SQLException;
import java.util.List;

import org.apache.log4j.Logger;
import org.hibernate.Query;
import org.hibernate.Session;

import com.yihuacomputer.cols.common.util.HibernateUtil;
import com.yihuacomputer.cols.entity.TerminalModule;

/**
 * 终端支持的硬件模块处理类
 * 深圳怡化电脑股份有限公司
 * 2016-10-25
*/

public class TerminalModuleDB
{

	public Logger logErr = Logger.getLogger("Error");

    public TerminalModuleDB()
    {
    }

    /**
	 * 根据ID号取出设备模块关联信息
	 * 参数1：id号
	 * 返回值：设备模块关联对象
	*/
	@SuppressWarnings("rawtypes")
	public TerminalModule getTerminalModuleById(int id) {
		TerminalModule terminalModule = null;
		try {
			Session session = HibernateUtil.getSession();
			String hql = "from TerminalModule where id=:id";
			Query query = session.createQuery(hql);
			query.setInteger("id", id);
			// 设置查询缓存
			query.setCacheable(true);
			query.setCacheRegion("TerminalModuleQueries");
			List terminalModuleList = query.list();
			if (terminalModuleList != null && !terminalModuleList.isEmpty() && terminalModuleList.size() > 0)
				terminalModule = (TerminalModule) terminalModuleList.get(0);
		} catch (Exception e) {
			// 记录日志流水
			logErr.error("取设备模块关联信息失败:"+e);
		} finally {
			HibernateUtil.closeSession();
		}
		return terminalModule;
	}
	
	/**
	 * 根据ID号取出设备模块关联信息
	 * 参数1：id号
	 * 返回值：设备模块关联对象
	 */
	@SuppressWarnings("rawtypes")
	public TerminalModule getTerminalModuleByIdNoCache(int id) {
		TerminalModule terminalModule = null;
		try {
			Session session = HibernateUtil.getSession();
			String hql = "from TerminalModule where id=:id";
			Query query = session.createQuery(hql);
			query.setInteger("id", id);
			List terminalModuleList = query.list();
			if (terminalModuleList != null && !terminalModuleList.isEmpty() && terminalModuleList.size() > 0)
				terminalModule = (TerminalModule) terminalModuleList.get(0);
		} catch (Exception e) {
			// 记录日志流水
			logErr.error("取设备模块关联信息失败:"+e);
		} finally {
			HibernateUtil.closeSession();
		}
		return terminalModule;
	}

    /**
     * 根据终端Id取该设备支持的模块列表
     * 参数：终端的序列号
     * 返回值：终端支持的模块列表
    */
    @SuppressWarnings("rawtypes")
	public List getTerminalModuleList(int terminalId,int moduleFlag)
    {
        List terminalModuleList = null;
        try
        {
           Session session = HibernateUtil.getSession();
           String hql = "select moduleId from TerminalModule where terminalId=:terminalId and moduleFlag=:moduleFlag"; //参数绑定，避免sql注入
           Query query = session.createQuery(hql);
           query.setInteger("terminalId", terminalId);
           query.setInteger("moduleFlag", moduleFlag);
           //设置查询缓存
           query.setCacheable(true);
           query.setCacheRegion("TerminalModuleQueries");
           terminalModuleList = query.list();
           if (terminalModuleList==null||terminalModuleList.isEmpty())
        	   terminalModuleList = null;
         }
         catch (Exception e)
         {
            // 记录日志流水
            logErr.error("取设备支持的模块列表失败:"+e);
         }
         finally
         {
            HibernateUtil.closeSession();
         }
         return terminalModuleList;
     }

    /**
     * 根据终端对应的型号取该设备支持的模块列表
     * 参数：终端的序列号
     * 返回值：终端支持的模块列表
    */
    @SuppressWarnings("rawtypes")
	public List getDevModelModuleList(int devModelId)
    {
        List devModelModuleList = null;
        try
        {
           Session session = HibernateUtil.getSession();
           String hql = "select moduleId from DevModelModule where devModelId=:devModelId"; //参数绑定，避免sql注入
           Query query = session.createQuery(hql);
           query.setInteger("devModelId", devModelId);
           //设置查询缓存
           query.setCacheable(true);
           query.setCacheRegion("DevModelModuleQueries");
           devModelModuleList = query.list();
           if (devModelModuleList==null||devModelModuleList.isEmpty())
        	   devModelModuleList = null;
         }
         catch (Exception e)
         {
            // 记录日志流水
            logErr.error("根据设备型号取设备支持的模块列表失败:"+e);
         }
         finally
         {
            HibernateUtil.closeSession();
         }
         return devModelModuleList;
     }

     /**
      * 根据模块的Id取该模块所对应的详细信息
      * 参数：模块id
      * 返回值：该模块所对应的详细信息
    */
     @SuppressWarnings({ "rawtypes", "unchecked", "unused" })
	 public List getModuleList(int terminalId,int devModelId)
     {
    	 //先取出不启用的模块
         List terminalModuleRomoveList = getTerminalModuleList(terminalId,-1);
         //再取出启用的模块
         List terminalModuleList = getTerminalModuleList(terminalId,1);
         //型号对应的模板
         List devModelModuleList = getDevModelModuleList(devModelId);
         //先根据型号对应的模板与不启用的模块取出差集
         if(terminalModuleRomoveList != null && terminalModuleRomoveList.size() >0){
            devModelModuleList.removeAll(terminalModuleRomoveList);
         }
         if(terminalModuleList == null && devModelModuleList != null){
        	 terminalModuleList = devModelModuleList;
         }
         else if(terminalModuleList == null && devModelModuleList == null){
        	 return null;
         }
         else{
        	 if(devModelModuleList !=null && devModelModuleList.size()>0){
                //求出并集,即为该机器最终支持的模块
                terminalModuleList.removeAll(devModelModuleList);
                terminalModuleList.addAll(devModelModuleList);
        	 }
         }
         if (null == terminalModuleList)
         {
             return null;
         }
         List moduleList = null;
         try
         {
             Session session = HibernateUtil.getSession();
             String hql = "from Module where id in (:id)";
             Query query = session.createQuery(hql);
             query.setParameterList("id", terminalModuleList);
             //设置查询缓存
             query.setCacheable(true);
             query.setCacheRegion("ModuleQueries");
             moduleList = query.list();
             //未找到
             if (moduleList==null||moduleList.isEmpty())
            	 moduleList = null;
           }
           catch (Exception e)
           {
              // 记录日志流水
        	  logErr.error("取模块详细信息失败:"+e);
           }
           finally
           {
              HibernateUtil.closeSession();
           }
           return moduleList;
       }

     /**
	   * 同步设备模块关联信息
	   * 参数：设备模块关联信息
	   * 处理结果  true=成功  false=失败
	*/
	public boolean save(TerminalModule entity) {
		boolean bRet = false;
		PreparedStatement pst =null;
		Session session = HibernateUtil.getSession();
		Connection dbm = session.connection();
		HibernateUtil.beginTransaction();
	    String sql = "insert into TerminalModule(id,iTerminalId,iModuleId,iModuleFlag) values (?,?,?,?)";
	    try
	    {
	        pst = dbm.prepareStatement(sql);
	        pst.setInt(1, entity.getId());
	        pst.setInt(2, entity.getTerminalId());
	        pst.setInt(3, entity.getModuleId());
	        pst.setInt(4, entity.getModuleFlag());
	        pst.addBatch();
	        pst.executeBatch();
	        HibernateUtil.commitTransaction();
	        bRet = true;
	    }
	    catch (SQLException e)
	    {
		    // 记录日志流水
		    logErr.error("更新设备模块关联信息失败:"+e);
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
	  * 同步设备模块关联信息
	  * 参数：型号模块关联信息
	  * 处理结果  true=成功  false=失败
	*/
	public boolean Update(TerminalModule entity)
    {
		boolean bRet = false;
	    PreparedStatement pre =null;
        String sql = "update TerminalModule set iTerminalId =? ,iModuleId =? ,strModuleFlag =? where id=?";
        Session session = HibernateUtil.getSession();
        Connection dbm = session.connection();
        HibernateUtil.beginTransaction();
        try
        {
           pre = dbm.prepareStatement(sql);
           pre.setInt(1, entity.getTerminalId());
           pre.setInt(2, entity.getModuleId());
           pre.setInt(3, entity.getModuleFlag());
           pre.setInt(4, entity.getId());
           pre.execute();
           HibernateUtil.commitTransaction();
           bRet = true;
        }
        catch (SQLException err)
        {
 	       logErr.error("更改设备模块关联信息失败:"+err);
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
    	TerminalModule deleteBean = this.getTerminalModuleByIdNoCache(id);
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
	      logErr.error("删除设备模块关联信息失败:"+e);
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
	   * 根据设备模块关联id刷新缓存
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
	      String hql = "from TerminalModule where id=:id"; //参数绑定，避免sql注入
	      Query query = session.createQuery(hql);
	      query.setInteger("id", id);
	      query.list();
	      bRet = true;
	    }
	    catch (Exception e)
	    {
	      // 记录日志流水
	      logErr.error("根据设备模块关联id刷新缓存失败:"+e);
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
 		boolean bRet = HibernateUtil.evictSessionFactoryQueries("TerminalModuleQueries");
 		if (bRet == false)
 		   return false;
 		return HibernateUtil.evictSessionFactory("com.yihuacomputer.cols.entity.TerminalModule");
 	}
 }
