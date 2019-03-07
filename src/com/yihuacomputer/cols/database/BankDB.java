package com.yihuacomputer.cols.database;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.SQLException;
import java.util.List;

import org.apache.log4j.Logger;
import org.hibernate.Query;
import org.hibernate.Session;

import com.yihuacomputer.cols.common.util.HibernateUtil;
import com.yihuacomputer.cols.entity.Bank;


/**
 * 银行信息处理类
 * 深圳怡化电脑股份有限公司
 * 2017-06-08
 */

public class BankDB {

	public Logger logErr = Logger.getLogger("Error");

	/**
	 * 根据ID号取出银行信息
	 * 参数1：id号
	 * 返回值：银行信息对象
	*/
	@SuppressWarnings("rawtypes")
	public Bank getBankById(int id) {
		Bank bank = null;
		try {
			Session session = HibernateUtil.getSession();
			String hql = "from Bank where id=:id";
			Query query = session.createQuery(hql);
			query.setInteger("id", id);
			// 设置查询缓存
			query.setCacheable(true);
			query.setCacheRegion("BankQueries");
			List provinceList = query.list();
			if (provinceList != null && !provinceList.isEmpty() && provinceList.size() > 0)
				bank = (Bank) provinceList.get(0);
		} catch (Exception e) {
			// 记录日志流水
			logErr.error("取银行信息失败:"+e);
		} finally {
			HibernateUtil.closeSession();
		}
		return bank;
	}
	/**
	 * 根据ID号取出银行信息
	 * 参数1：id号
	 * 返回值：银行信息对象
	 */
	@SuppressWarnings("rawtypes")
	public Bank getBankByIdNoCache(int id) {
		Bank bank = null;
		try {
			Session session = HibernateUtil.getSession();
			String hql = "from Bank where id=:id";
			Query query = session.createQuery(hql);
			query.setInteger("id", id);
			List provinceList = query.list();
			if (provinceList != null && !provinceList.isEmpty() && provinceList.size() > 0)
				bank = (Bank) provinceList.get(0);
		} catch (Exception e) {
			// 记录日志流水
			logErr.error("取银行信息失败:"+e);
		} finally {
			HibernateUtil.closeSession();
		}
		return bank;
	}

	/**
	   * 取出所有的银行数据</p>
	   * list List  参数信息
	*/
	public List<?> getBankList()
	{
	    List<?> list = null;
	    try
	    {
	      Session session = HibernateUtil.getSession();
	      String hql =
	              "from Bank order by strBankName asc"; //参数绑定，避免sql注入
	      Query query = session.createQuery(hql);
	      //设置查询缓存
	      query.setCacheable(true);
	      query.setCacheRegion("BankQueries");

	      list = query.list();
	      if (list == null || list.isEmpty())
	    	  list = null;
	    }
	    catch (Exception e)
	    {
	      // 记录日志流水
		  logErr.error("取银行列表失败:"+e);
	    }
	    finally
	    {
	      HibernateUtil.closeSession();
	    }
	    return list;
	}

	/**
	   * 同步银行信息
	   * 参数：银行信息
	   * 处理结果  true=成功  false=失败
	*/
	public boolean save(Bank entity) {
		boolean bRet = false;
		PreparedStatement pst =null;
		Session session = HibernateUtil.getSession();
		Connection dbm = session.connection();
		HibernateUtil.beginTransaction();
	    String sql = "insert into Bank(id,strBankCode,strBankName) values (?,?,?)";
	    try
	    {
	        pst = dbm.prepareStatement(sql);
	        pst.setInt(1, entity.getId());
	        pst.setString(2, entity.getStrBankCode());
	        pst.setString(3, entity.getStrBankName());
	        pst.addBatch();
	        pst.executeBatch();
	        HibernateUtil.commitTransaction();
	        bRet = true;
	    }
	    catch (SQLException e)
	    {
		    // 记录日志流水
		    logErr.error("更新银行信息失败:"+e);
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
	  * 同步银行信息
	  * 参数：银行信息
	  * 处理结果  true=成功  false=失败
	*/
	public boolean Update(Bank entity)
    {
		boolean bRet = false;
	    PreparedStatement pre =null;
        String sql = "update Bank set strBankCode =?, strBankName =? where id=?";
        Session session = HibernateUtil.getSession();
        Connection dbm = session.connection();
        HibernateUtil.beginTransaction();
        try
        {
            pre = dbm.prepareStatement(sql);
            pre.setString(1, entity.getStrBankCode());
            pre.setString(2, entity.getStrBankName());
            pre.setInt(3, entity.getId());
            pre.execute();
            HibernateUtil.commitTransaction();
            bRet = true;
        }
        catch (SQLException err)
        {
  	        logErr.error("更改银行信息失败:"+err);
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
    	Bank deleteBean = this.getBankByIdNoCache(id);
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
	       logErr.error("删除银行信息失败:"+e);
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
	   * 根据银行id刷新缓存
	   * @param id 银行id
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
	      String hql = "from Bank where id=:id"; //参数绑定，避免sql注入
	      Query query = session.createQuery(hql);
	      query.setInteger("id", id);
	      query.list();
	      bRet = true;
	    }
	    catch (Exception e)
	    {
	      // 记录日志流水
	      logErr.error("根据银行id刷新缓存失败:"+e);
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
		boolean bRet = HibernateUtil.evictSessionFactoryQueries("BankQueries");
		if (bRet == false)
			return false;
		return HibernateUtil.evictSessionFactory("com.yihuacomputer.cols.entity.Bank");
	}
}