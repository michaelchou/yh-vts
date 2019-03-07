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
 * �洢�������ݱ�Ĵ�����
 */
public class FlushDataDB
{
	public Logger error = Logger.getLogger("Error");

	public FlushDataDB()
    {
    }
	/**
     * ����id��ȡ��Ӧ�ĳ�����Ϣ
     * null δ�ҵ�
     */
    @SuppressWarnings("rawtypes")
    public FlushData getEntity(int id)
    {
       FlushData flushData = null;
       try
       {
          Session session = HibernateUtil.getSession();
          String hql = "from FlushData  where id=:id "; //�����󶨣�����sqlע��
          Query query = session.createQuery(hql);
          query.setInteger("id", id);
          List flushDataList = query.list();
          if (flushDataList != null &&!flushDataList.isEmpty()&& flushDataList.size() > 0)
        	  flushData = (FlushData) flushDataList.get(0);
        }
        catch (Exception e)
        {
			// ��¼��־��ˮ
			error.error("ȡ����������Ϣʧ��:"+e);
        }
        finally
        {
           HibernateUtil.closeSession();
        }
        return flushData;
     }
	/**
	 * ���ճ���������ѯ��������
	 * ����1 iFLUSHTIMES ��������
	 * @return �������ݷ�װ����
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
			// ��¼��־��ˮ
			error.error("ȡ����������Ϣʧ��:"+e.getMessage());
		} finally {
			HibernateUtil.closeSession();
		}
		return resultList;
	}

	/**
	 * ���ݵ�ǰ����������ɾ����������
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
	    	error.error("ɾ��������Ϣʧ��:"+err.getMessage());
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
	 * ����id��ɾ����������
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
	    	error.error("ɾ��������Ϣʧ��:"+err.getMessage());
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
     * �洢����������Ϣ
     * ����1����������
     * ������  true=�ɹ�  false=ʧ��
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
  	        // ��¼��־��ˮ
        	error.error("��¼����������Ϣʧ��:"+e.getMessage());
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
	 * ���³���������Ϣ
	 * ����1���������ݶ���
	 * ����ֵ��true=�ɹ� false=ʧ��
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
			// ��¼��־��ˮ
			error.error("���³���������Ϣʧ��:"+e.getMessage());
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

	//�Ѷ���ӳ���MAP��ֵ��
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
				// ��¼��־��ˮ
				error.error("�������������Ϣʧ��:"+e.getMessage());
			}
		}
		return map;
	}
}
