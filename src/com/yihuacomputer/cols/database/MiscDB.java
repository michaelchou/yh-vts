package com.yihuacomputer.cols.database;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.SQLException;
import java.util.List;

import org.apache.log4j.Logger;
import org.hibernate.Query;
import org.hibernate.Session;

import com.yihuacomputer.cols.common.util.HibernateUtil;
import com.yihuacomputer.cols.entity.Misc;
import com.yihuacomputer.cols.util.DataConversion;


/**
 * 参数信息处理类
 * 深圳怡化电脑股份有限公司
 * 2017-06-08
 */

public class MiscDB {

	public Logger logErr = Logger.getLogger("Error");

	/**
	 * 根据ID号取出参数信息
	 * 参数1：id号
	 * 返回值：参数对象
	*/
	@SuppressWarnings("rawtypes")
	public Misc getMiscById(int id) {
		Misc misc = null;
		try {
			Session session = HibernateUtil.getSession();
			String hql = "from Misc where id=:id";
			Query query = session.createQuery(hql);
			query.setInteger("id", id);
			// 设置查询缓存
			query.setCacheable(true);
			query.setCacheRegion("MiscQueries");
			List miscList = query.list();
			if (miscList != null && !miscList.isEmpty() && miscList.size() > 0)
				misc = (Misc) miscList.get(0);
		} catch (Exception e) {
			// 记录日志流水
			logErr.error("取参数信息失败:"+e);
		} finally {
			HibernateUtil.closeSession();
		}
		return misc;
	}
	
	/**
	 * 根据ID号取出参数信息
	 * 参数1：id号
	 * 返回值：参数对象
	 */
	@SuppressWarnings("rawtypes")
	public Misc getMiscByIdNoCache(int id) {
		Misc misc = null;
		try {
			Session session = HibernateUtil.getSession();
			String hql = "from Misc where id=:id";
			Query query = session.createQuery(hql);
			query.setInteger("id", id);
			List miscList = query.list();
			if (miscList != null && !miscList.isEmpty() && miscList.size() > 0)
				misc = (Misc) miscList.get(0);
		} catch (Exception e) {
			// 记录日志流水
			logErr.error("取参数信息失败:"+e);
		} finally {
			HibernateUtil.closeSession();
		}
		return misc;
	}

	/**
	 * 根据机构编号以及参数名称，取出参数值
	 * 参数1：机构名称
	 * 参数2：参数名称
	 * 返回值：参数对象
	*/
	@SuppressWarnings("rawtypes")
	public Misc getEntity(String strOrgNum, String strName) {
		Misc misc = null;
		try {
			Session session = HibernateUtil.getSession();
			String hql = "from Misc where strOrgNum=:strOrgNum and strName=:strName";
			Query query = session.createQuery(hql);
			query.setString("strName", strName);
			query.setString("strOrgNum", strOrgNum);
			// 设置查询缓存
			query.setCacheable(true);
			query.setCacheRegion("MiscQueries");
			List miscList = query.list();
			if (miscList != null && !miscList.isEmpty() && miscList.size() > 0)
				misc = (Misc) miscList.get(0);
		} catch (Exception e) {
			// 记录日志流水
			logErr.error("取参数失败:"+e);
		} finally {
			HibernateUtil.closeSession();
		}
		return misc;
	}

	/**
	 * 根据机构编号以及参数名称，取出参数值
	 * 参数1：机构名称
	 * 参数2：参数名称
	 * 返回值：参数对象
	*/
	@SuppressWarnings("rawtypes")
	public Misc getEntityNoCache(String strOrgNum, String strName) {
		Misc misc = null;
		try {
			Session session = HibernateUtil.getSession();
			String hql = "from Misc where strOrgNum=:strOrgNum and strName=:strName";
			Query query = session.createQuery(hql);
			query.setString("strName", strName);
			query.setString("strOrgNum", strOrgNum);
			List miscList = query.list();
			if (miscList != null && !miscList.isEmpty() && miscList.size() > 0)
				misc = (Misc) miscList.get(0);
		} catch (Exception e) {
			// 记录日志流水
			logErr.error("取参数失败:"+e);
		} finally {
			HibernateUtil.closeSession();
		}
		return misc;
	}

	/**
	 * 根据机构编号以及参数名称，取出参数值
	 * 参数1：机构名称
	 * 参数2：参数名称
	 * 参数3：参数值
	 * 返回值：参数描述
	*/
	public String getDesc(String strOrgNum, String strName, String strValue) {
		String strDesc = null;
		try {
			Session session = HibernateUtil.getSession();
			String hql = "from Misc where strOrgNum=:strOrgNum and strName=:strName and strValue=:strValue";
			Query query = session.createQuery(hql);
			query.setString("strName", strName);
			query.setString("strOrgNum", strOrgNum);
			query.setString("strValue", strValue);
			//设置查询缓存
		    query.setCacheable(true);
		    query.setCacheRegion("MiscQueries");
			List<?> miscList = query.list();
			if (miscList != null && !miscList.isEmpty() && miscList.size() > 0)
				strDesc = ((Misc) miscList.get(0)).getStrDesc();
		} catch (Exception e) {
			// 记录日志流水
			logErr.error("取参数描述失败:"+e);
		} finally {
			HibernateUtil.closeSession();
		}
		return strDesc;
	}

	/**
	 * 根据机构编号以及参数名称，取出参数值(字符串)
	 * 参数1：机构名称
	 * 参数2：参数名称
	 * 参数3：默认值
	 * 返回值：参数对象
	*/
	public String get(String strOrgNum, String strName, String strValDef) {
		String strValue = strValDef;
		Misc misc = getEntity(strOrgNum, strName);
		if (misc != null)
			strValue = misc.getStrValue().trim();
		return strValue;
	}

	/**
	 * 根据机构编号以及参数名称，取出参数值(整型)
	 * 参数1：机构名称
	 * 参数2：参数名称
	 * 参数3：默认值
	 * 返回值：参数对象
	*/
	public int get(String strOrgNum, String strName, int iValDef) {
	    int iValue = iValDef;
		Misc misc = getEntity(strOrgNum, strName);
		if (misc != null)
			iValue = DataConversion.str2Int(misc.getStrValue().trim(), iValDef);
		return iValue;
	}

	/**
	   * 根据机构编号,参数名取参数</p>
	   * strName String 参数名
	   * strOrgNum String 分行编号
	   * list List  参数信息
	*/
	public List<?> getList(String strOrgNum, String strName)
	{
	    List<?> list = null;
	    try
	    {
	      Session session = HibernateUtil.getSession();
	      String hql =
	              "from Misc where strName like :strName and strOrgNum=:strOrgNum order by length(strValue) desc"; //参数绑定，避免sql注入
	      Query query = session.createQuery(hql);
	      query.setString("strName", strName + "%");
	      query.setString("strOrgNum", strOrgNum);
	      //设置查询缓存
	      query.setCacheable(true);
	      query.setCacheRegion("MiscQueries");

	      list = query.list();
	      if (list == null || list.isEmpty())
	    	  list = null;
	    }
	    catch (Exception e)
	    {
	      // 记录日志流水
		  logErr.error("取参数列表失败:"+e);
	    }
	    finally
	    {
	      HibernateUtil.closeSession();
	    }
	    return list;
	}

	/**
	   * 根据机构编号,参数名取参数</p>
	   * strOrgNum String 分行编号
	   * list List  参数列表信息
	*/
	public List<?> getAll(String strOrgNum)
	{
	    List<?> list = null;
	    try
	    {
	      Session session = HibernateUtil.getSession();
	      String hql =
	              "from Misc where strOrgNum=:strOrgNum order by id "; //参数绑定，避免sql注入
	      Query query = session.createQuery(hql);
	      query.setString("strOrgNum", strOrgNum);
	      //设置查询缓存
	      query.setCacheable(true);
	      query.setCacheRegion("MiscQueries");

	      list = query.list();
	      if (list == null || list.isEmpty())
	    	  list = null;
	    }
	    catch (Exception e)
	    {
	      // 记录日志流水
		  logErr.error("取参数列表失败:"+e);
	    }
	    finally
	    {
	      HibernateUtil.closeSession();
	    }
	    return list;
	}

	/**
	   * 同步参数信息
	   * 参数：参数信息
	   * 处理结果  true=成功  false=失败
	*/
	public boolean save(Misc entity) {
		boolean bRet = false;
		PreparedStatement pst =null;
		Session session = HibernateUtil.getSession();
		Connection dbm = session.connection();
		HibernateUtil.beginTransaction();
	    String sql = "insert into Misc(id,strName,strValue,strDesc,strOrgNum) values (?,?,?,?,?)";
	    try
	    {
	        pst = dbm.prepareStatement(sql);
	        pst.setInt(1, entity.getId());
	        pst.setString(2, entity.getStrName());
	        pst.setString(3, entity.getStrValue());
	        pst.setString(4, entity.getStrDesc());
	        pst.setString(5, entity.getStrOrgNum());
	        pst.addBatch();
	        pst.executeBatch();
	        HibernateUtil.commitTransaction();
	        bRet = true;
	    }
	    catch (SQLException e)
	    {
		    // 记录日志流水
		    logErr.error("更新参数信息失败:"+e);
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
	  * 同步参数信息
	  * 参数：参数信息
	  * 处理结果  true=成功  false=失败
	*/
	public boolean Update(Misc entity)
    {
		boolean bRet = false;
	    PreparedStatement pre =null;
        String sql = "update Misc set strName =?,strValue =?,strDesc =?,strOrgNum =? where id=?";
        Session session = HibernateUtil.getSession();
        Connection dbm = session.connection();
        HibernateUtil.beginTransaction();
        try
        {
            pre = dbm.prepareStatement(sql);
            pre.setString(1, entity.getStrName());
            pre.setString(2, entity.getStrValue());
            pre.setString(3, entity.getStrDesc());
            pre.setString(4, entity.getStrOrgNum());
            pre.setInt(5, entity.getId());
            pre.execute();
            HibernateUtil.commitTransaction();
            bRet = true;
        }
        catch (SQLException err)
        {
  	        logErr.error("更改参数信息失败:"+err);
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
    	Misc deleteBean = this.getMiscByIdNoCache(id);
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
	       logErr.error("删除参数信息失败:"+e);
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
	   * 根据参数id刷新缓存
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
	      String hql = "from Misc where id=:id"; //参数绑定，避免sql注入
	      Query query = session.createQuery(hql);
	      query.setInteger("id", id);
	      query.list();
	      bRet = true;
	    }
	    catch (Exception e)
	    {
	      // 记录日志流水
	      logErr.error("根据参数id刷新缓存失败:"+e);
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
		boolean bRet = HibernateUtil.evictSessionFactoryQueries("MiscQueries");
		if (bRet == false)
			return false;
		return HibernateUtil.evictSessionFactory("com.yihuacomputer.cols.entity.Misc");
	}
}