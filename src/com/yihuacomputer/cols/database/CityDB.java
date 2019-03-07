package com.yihuacomputer.cols.database;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.SQLException;
import java.util.List;

import org.apache.log4j.Logger;
import org.hibernate.Query;
import org.hibernate.Session;

import com.yihuacomputer.cols.common.util.HibernateUtil;
import com.yihuacomputer.cols.entity.City;


/**
 * 城市列表处理类
 * 深圳怡化电脑股份有限公司
 * 2017-06-08
 */

public class CityDB {

	public Logger logErr = Logger.getLogger("Error");

	/**
	 * 根据ID号取出城市信息
	 * 参数1：id号
	 * 返回值：城市对象
	*/
	@SuppressWarnings("rawtypes")
	public City getCityById(int id) {
		City city = null;
		try {
			Session session = HibernateUtil.getSession();
			String hql = "from City where id=:id";
			Query query = session.createQuery(hql);
			query.setInteger("id", id);
			// 设置查询缓存
			query.setCacheable(true);
			query.setCacheRegion("CityQueries");
			List cityList = query.list();
			if (cityList != null && !cityList.isEmpty() && cityList.size() > 0)
				city = (City) cityList.get(0);
		} catch (Exception e) {
			// 记录日志流水
			logErr.error("取城市信息失败:"+e);
		} finally {
			HibernateUtil.closeSession();
		}
		return city;
	}
	/**
	 * 根据ID号取出城市信息
	 * 参数1：id号
	 * 返回值：城市对象
	 */
	@SuppressWarnings("rawtypes")
	public City getCityByIdNoCache(int id) {
		City city = null;
		try {
			Session session = HibernateUtil.getSession();
			String hql = "from City where id=:id";
			Query query = session.createQuery(hql);
			query.setInteger("id", id);
			List cityList = query.list();
			if (cityList != null && !cityList.isEmpty() && cityList.size() > 0)
				city = (City) cityList.get(0);
		} catch (Exception e) {
			// 记录日志流水
			logErr.error("取城市信息失败:"+e);
		} finally {
			HibernateUtil.closeSession();
		}
		return city;
	}

	/**
	   * 取出所有的城市数据</p>
	   * list List  参数信息
	*/
	public List<?> getCityList()
	{
	    List<?> list = null;
	    try
	    {
	      Session session = HibernateUtil.getSession();
	      String hql =
	              "from City order by strCityName asc"; //参数绑定，避免sql注入
	      Query query = session.createQuery(hql);
	      //设置查询缓存
	      query.setCacheable(true);
	      query.setCacheRegion("CityQueries");

	      list = query.list();
	      if (list == null || list.isEmpty())
	    	  list = null;
	    }
	    catch (Exception e)
	    {
	      // 记录日志流水
		  logErr.error("取城市列表失败:"+e);
	    }
	    finally
	    {
	      HibernateUtil.closeSession();
	    }
	    return list;
	}

	/**
	   * 同步城市信息
	   * 参数：城市信息
	   * 处理结果  true=成功  false=失败
	*/
	public boolean save(City entity) {
		boolean bRet = false;
		PreparedStatement pst =null;
		Session session = HibernateUtil.getSession();
		Connection dbm = session.connection();
		HibernateUtil.beginTransaction();
	    String sql = "insert into City(id,strProvinceCode,strCityCode,strCityName) values (?,?,?,?)";
	    try
	    {
	        pst = dbm.prepareStatement(sql);
	        pst.setInt(1, entity.getId());
	        pst.setString(2, entity.getStrProvinceCode());
	        pst.setString(3, entity.getStrCityCode());
	        pst.setString(4, entity.getStrCityName());
	        pst.addBatch();
	        pst.executeBatch();
	        HibernateUtil.commitTransaction();
	        bRet = true;
	    }
	    catch (SQLException e)
	    {
		    // 记录日志流水
		    logErr.error("更新城市信息失败:"+e);
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
	  * 同步城市信息
	  * 参数：城市信息
	  * 处理结果  true=成功  false=失败
	*/
	public boolean Update(City entity)
    {
		boolean bRet = false;
	    PreparedStatement pre =null;
        String sql = "update City set strProvinceCode =?,strCityCode =?,strCityName =? where id=?";
        Session session = HibernateUtil.getSession();
        Connection dbm = session.connection();
        HibernateUtil.beginTransaction();
        try
        {
            pre = dbm.prepareStatement(sql);
            pre.setString(1, entity.getStrProvinceCode());
            pre.setString(2, entity.getStrCityCode());
            pre.setString(3, entity.getStrCityName());
            pre.setInt(4, entity.getId());
            pre.execute();
            HibernateUtil.commitTransaction();
            bRet = true;
        }
        catch (SQLException err)
        {
  	        logErr.error("更改城市信息失败:"+err);
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
    	City deleteBean = this.getCityByIdNoCache(id);
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
	      logErr.error("删除城市信息失败:"+e);
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
	   * 根据城市id刷新缓存
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
	      String hql = "from City where id=:id"; //参数绑定，避免sql注入
	      Query query = session.createQuery(hql);
	      query.setInteger("id", id);
	      query.list();
	      bRet = true;
	    }
	    catch (Exception e)
	    {
	      // 记录日志流水
	      logErr.error("根据城市id刷新缓存失败:"+e);
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
		boolean bRet = HibernateUtil.evictSessionFactoryQueries("CityQueries");
		if (bRet == false)
			return false;
		return HibernateUtil.evictSessionFactory("com.yihuacomputer.cols.entity.City");
	}
}