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
 * �����б�����
 * �����������Թɷ����޹�˾
 * 2017-06-08
 */

public class CityDB {

	public Logger logErr = Logger.getLogger("Error");

	/**
	 * ����ID��ȡ��������Ϣ
	 * ����1��id��
	 * ����ֵ�����ж���
	*/
	@SuppressWarnings("rawtypes")
	public City getCityById(int id) {
		City city = null;
		try {
			Session session = HibernateUtil.getSession();
			String hql = "from City where id=:id";
			Query query = session.createQuery(hql);
			query.setInteger("id", id);
			// ���ò�ѯ����
			query.setCacheable(true);
			query.setCacheRegion("CityQueries");
			List cityList = query.list();
			if (cityList != null && !cityList.isEmpty() && cityList.size() > 0)
				city = (City) cityList.get(0);
		} catch (Exception e) {
			// ��¼��־��ˮ
			logErr.error("ȡ������Ϣʧ��:"+e);
		} finally {
			HibernateUtil.closeSession();
		}
		return city;
	}
	/**
	 * ����ID��ȡ��������Ϣ
	 * ����1��id��
	 * ����ֵ�����ж���
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
			// ��¼��־��ˮ
			logErr.error("ȡ������Ϣʧ��:"+e);
		} finally {
			HibernateUtil.closeSession();
		}
		return city;
	}

	/**
	   * ȡ�����еĳ�������</p>
	   * list List  ������Ϣ
	*/
	public List<?> getCityList()
	{
	    List<?> list = null;
	    try
	    {
	      Session session = HibernateUtil.getSession();
	      String hql =
	              "from City order by strCityName asc"; //�����󶨣�����sqlע��
	      Query query = session.createQuery(hql);
	      //���ò�ѯ����
	      query.setCacheable(true);
	      query.setCacheRegion("CityQueries");

	      list = query.list();
	      if (list == null || list.isEmpty())
	    	  list = null;
	    }
	    catch (Exception e)
	    {
	      // ��¼��־��ˮ
		  logErr.error("ȡ�����б�ʧ��:"+e);
	    }
	    finally
	    {
	      HibernateUtil.closeSession();
	    }
	    return list;
	}

	/**
	   * ͬ��������Ϣ
	   * ������������Ϣ
	   * ������  true=�ɹ�  false=ʧ��
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
		    // ��¼��־��ˮ
		    logErr.error("���³�����Ϣʧ��:"+e);
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
	  * ͬ��������Ϣ
	  * ������������Ϣ
	  * ������  true=�ɹ�  false=ʧ��
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
  	        logErr.error("���ĳ�����Ϣʧ��:"+err);
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
	   * ɾ������
	   * @param  id : ����ʵ���ID��
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
	      logErr.error("ɾ��������Ϣʧ��:"+e);
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
	   * ���ݳ���idˢ�»���
	   * @param id ����id
	   * @return bRet boolean ������
	   * true=�ɹ�
	   * false=ʧ��
	*/
	public boolean FlushSession(int id)
	{
	    boolean bRet = false;
	    try
	    {
	      Session session = HibernateUtil.getSession();
	      String hql = "from City where id=:id"; //�����󶨣�����sqlע��
	      Query query = session.createQuery(hql);
	      query.setInteger("id", id);
	      query.list();
	      bRet = true;
	    }
	    catch (Exception e)
	    {
	      // ��¼��־��ˮ
	      logErr.error("���ݳ���idˢ�»���ʧ��:"+e);
	    }
	    finally
	    {
	      HibernateUtil.closeSession();
	    }
	    return bRet;
	}

	/**
	 * ˢ�»���
	*/
	public boolean FlushSession() {
		// ��ʧЧ��ѯ���棬��ʧЧ�������棬��֤�����ݿ�������ͬ��
		boolean bRet = HibernateUtil.evictSessionFactoryQueries("CityQueries");
		if (bRet == false)
			return false;
		return HibernateUtil.evictSessionFactory("com.yihuacomputer.cols.entity.City");
	}
}