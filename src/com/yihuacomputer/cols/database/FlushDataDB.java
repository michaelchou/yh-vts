package com.yihuacomputer.cols.database;

import java.lang.reflect.Field;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

import org.apache.log4j.Logger;
import org.hibernate.Query;
import org.hibernate.Session;

import com.yihuacomputer.cols.common.util.HibernateUtil;
import com.yihuacomputer.cols.entity.FlushData;

/**
 * 存储冲正数据表的处理类
 */
public class FlushDataDB
{
	public Logger error = Logger.getLogger("Error");

	public FlushDataDB()
    {
    }
	/**
     * 根据id号取对应的冲正信息
     * null 未找到
     */
    @SuppressWarnings("rawtypes")
    public FlushData getEntity(int id)
    {
       FlushData flushData = null;
       try
       {
          Session session = HibernateUtil.getSession();
          String hql = "from FlushData  where id=:id "; //参数绑定，避免sql注入
          Query query = session.createQuery(hql);
          query.setInteger("id", id);
          List flushDataList = query.list();
          if (flushDataList != null &&!flushDataList.isEmpty()&& flushDataList.size() > 0)
        	  flushData = (FlushData) flushDataList.get(0);
        }
        catch (Exception e)
        {
			// 记录日志流水
			error.error("取冲正数据信息失败:"+e);
        }
        finally
        {
           HibernateUtil.closeSession();
        }
        return flushData;
     }
	/**
	 * 按照冲正次数查询冲正数据
	 * 参数1 iFLUSHTIMES 冲正次数
	 * @return 冲正数据封装对象
	*/
	@SuppressWarnings("rawtypes")
	public List getFlushDataList(int flushTimes) {
		List resultList = new ArrayList();
		try {
			Session session = HibernateUtil.getSession();
			String hql = "from FlushData where flushTimes=:flushTimes";
			Query query = session.createQuery(hql);
			query.setInteger("flushTimes", flushTimes);
			query.setFirstResult(0);
			query.setMaxResults(1024);
			resultList = query.list();
		} catch (Exception e) {
			// 记录日志流水
			error.error("取冲正数据信息失败:"+e.getMessage());
		} finally {
			HibernateUtil.closeSession();
		}
		return resultList;
	}

	/**
	 * 根据当前冲正次数，删除冲正数据
	 */
	public boolean deleteFlushDataByFlushTimes(String strTransFlushNum) {
		boolean ret = false;
	    String sql = "delete from FlushData where iFlushTimes=?";
	    Session session = HibernateUtil.getSession();
	    Connection dbm = session.connection();
		HibernateUtil.beginTransaction();
	    try
	    {
	      PreparedStatement pre = dbm.prepareStatement(sql);
	      pre.setInt(1, Integer.parseInt(strTransFlushNum));
	      pre.execute();
	      HibernateUtil.commitTransaction();
	      ret = true;
	    }
	    catch (SQLException err)
	    {
	    	error.error("删除冲正信息失败:"+err.getMessage());
	        HibernateUtil.rollbackTransaction();
	        ret = false;
	    }
	    finally
	    {
	    	HibernateUtil.closeSession();
	    }
	    return ret;
	}

	/**
	 * 根据id，删除冲正数据
	 */
	public boolean deleteFlushDataByID(int id) {
		boolean ret = false;
	    String sql = "delete from FlushData where id=?";
	    Session session = HibernateUtil.getSession();
	    Connection dbm = session.connection();
		HibernateUtil.beginTransaction();
	    try
	    {
	      PreparedStatement pre = dbm.prepareStatement(sql);
	      pre.setInt(1, id);
	      pre.execute();
	      HibernateUtil.commitTransaction();
	      ret = true;
	    }
	    catch (SQLException err)
	    {
	    	error.error("删除冲正信息失败:"+err.getMessage());
	        HibernateUtil.rollbackTransaction();
	        ret = false;
	    }
	    finally
	    {
	    	HibernateUtil.closeSession();
	    }
	    return ret;
	}
    /**
     * 存储冲正数据信息
     * 参数1：冲正数据
     * 处理结果  true=成功  false=失败
     */
    public boolean save(FlushData entity)
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
        	error.error("记录冲正数据信息失败:"+e.getMessage());
            HibernateUtil.rollbackTransaction();
         }
         finally
         {
            HibernateUtil.closeSession();
         }
         if (bRet != true){
		      return false;
		 }
		 return true;
      }

    /**
	 * 更新冲正数据信息
	 * 参数1：冲正数据对象
	 * 返回值：true=成功 false=失败
	 */
	public boolean updateFlushDataState(FlushData entity)
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
			error.error("更新冲正数据信息失败:"+e.getMessage());
			HibernateUtil.rollbackTransaction();
		} finally
		{
			HibernateUtil.closeSession();
		}
		if (bRet != true){
		      return false;
		}
		return true;
	}

	//把对象映射成MAP键值对
	public Map<String, String> getBeanToMap(Object f,Map<String, String> map) {
		Field[] fields = f.getClass().getDeclaredFields();
		for (int i = 0, len = fields.length; i < len; i++) {
			try {
				String strFieldName = fields[i].getName();
				boolean accessFlag = fields[i].isAccessible();
				fields[i].setAccessible(true);
				Object o = fields[i].get(f);
				if (o != null) {
					String strFieldValue = String.valueOf(o);
					map.put(strFieldName, strFieldValue);
				}
				fields[i].setAccessible(accessFlag);
			}
			catch (Exception e) {
				// 记录日志流水
				error.error("处理冲正数据信息失败:"+e.getMessage());
			}
		}
		return map;
	}
}
