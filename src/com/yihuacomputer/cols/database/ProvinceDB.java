package com.yihuacomputer.cols.database;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.SQLException;
import java.util.List;

import org.apache.log4j.Logger;
import org.hibernate.Query;
import org.hibernate.Session;

import com.yihuacomputer.cols.common.util.HibernateUtil;
import com.yihuacomputer.cols.entity.Province;


/**
 * ʡ����Ϣ������
 * �����������Թɷ����޹�˾
 * 2017-06-08
 */

public class ProvinceDB {

	public Logger logErr = Logger.getLogger("Error");

	/**
	 * ����ID��ȡ��ʡ����Ϣ
	 * ����1��id��
	 * ����ֵ��ʡ�ݶ���
	*/
	@SuppressWarnings("rawtypes")
	public Province getProvinceById(int id) {
		Province province = null;
		try {
			Session session = HibernateUtil.getSession();
			String hql = "from Province where id=:id";
			Query query = session.createQuery(hql);
			query.setInteger("id", id);
			// ���ò�ѯ����
			query.setCacheable(true);
			query.setCacheRegion("ProvinceQueries");
			List provinceList = query.list();
			if (provinceList != null && !provinceList.isEmpty() && provinceList.size() > 0)
				province = (Province) provinceList.get(0);
		} catch (Exception e) {
			// ��¼��־��ˮ
			logErr.error("ȡʡ����Ϣʧ��:"+e);
		} finally {
			HibernateUtil.closeSession();
		}
		return province;
	}
	/**
	 * ����ID��ȡ��ʡ����Ϣ
	 * ����1��id��
	 * ����ֵ��ʡ�ݶ���
	 */
	@SuppressWarnings("rawtypes")
	public Province getProvinceByIdNoCache(int id) {
		Province province = null;
		try {
			Session session = HibernateUtil.getSession();
			String hql = "from Province where id=:id";
			Query query = session.createQuery(hql);
			query.setInteger("id", id);
			List provinceList = query.list();
			if (provinceList != null && !provinceList.isEmpty() && provinceList.size() > 0)
				province = (Province) provinceList.get(0);
		} catch (Exception e) {
			// ��¼��־��ˮ
			logErr.error("ȡʡ����Ϣʧ��:"+e);
		} finally {
			HibernateUtil.closeSession();
		}
		return province;
	}

	/**
	   * ȡ�����е�ʡ������</p>
	   * list List  ������Ϣ
	*/
	public List<?> getProvinceList()
	{
	    List<?> list = null;
	    try
	    {
	      Session session = HibernateUtil.getSession();
	      String hql =
	              "from Province order by strProvinceName asc"; //�����󶨣�����sqlע��
	      Query query = session.createQuery(hql);
	      //���ò�ѯ����
	      query.setCacheable(true);
	      query.setCacheRegion("ProvinceQueries");

	      list = query.list();
	      if (list == null || list.isEmpty())
	    	  list = null;
	    }
	    catch (Exception e)
	    {
	      // ��¼��־��ˮ
		  logErr.error("ȡʡ���б�ʧ��:"+e);
	    }
	    finally
	    {
	      HibernateUtil.closeSession();
	    }
	    return list;
	}

	/**
	   * ͬ��ʡ����Ϣ
	   * ������ʡ����Ϣ
	   * ������  true=�ɹ�  false=ʧ��
	*/
	public boolean save(Province entity) {
		boolean bRet = false;
		PreparedStatement pst =null;
		Session session = HibernateUtil.getSession();
		Connection dbm = session.connection();
		HibernateUtil.beginTransaction();
	    String sql = "insert into Province(id,strProvinceCode,strProvinceName) values (?,?,?)";
	    try
	    {
	        pst = dbm.prepareStatement(sql);
	        pst.setInt(1, entity.getId());
	        pst.setString(2, entity.getStrProvinceCode());
	        pst.setString(3, entity.getStrProvinceName());
	        pst.addBatch();
	        pst.executeBatch();
	        HibernateUtil.commitTransaction();
	        bRet = true;
	    }
	    catch (SQLException e)
	    {
		    // ��¼��־��ˮ
		    logErr.error("����ʡ����Ϣʧ��:"+e);
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
	  * ͬ��ʡ����Ϣ
	  * ������ʡ����Ϣ
	  * ������  true=�ɹ�  false=ʧ��
	*/
	public boolean Update(Province entity)
    {
		boolean bRet = false;
	    PreparedStatement pre =null;
        String sql = "update Province set strProvinceCode =?, strProvinceName =? where id=?";
        Session session = HibernateUtil.getSession();
        Connection dbm = session.connection();
        HibernateUtil.beginTransaction();
        try
        {
            pre = dbm.prepareStatement(sql);
            pre.setString(1, entity.getStrProvinceCode());
            pre.setString(2, entity.getStrProvinceName());
            pre.setInt(3, entity.getId());
            pre.execute();
            HibernateUtil.commitTransaction();
            bRet = true;
        }
        catch (SQLException err)
        {
  	        logErr.error("����ʡ����Ϣʧ��:"+err);
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
    	Province deleteBean = this.getProvinceByIdNoCache(id);
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
	       logErr.error("ɾ��ʡ����Ϣʧ��:"+e);
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
	   * ����ģ��idˢ�»���
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
	      String hql = "from Province where id=:id"; //�����󶨣�����sqlע��
	      Query query = session.createQuery(hql);
	      query.setInteger("id", id);
	      query.list();
	      bRet = true;
	    }
	    catch (Exception e)
	    {
	      // ��¼��־��ˮ
	      logErr.error("����ʡ��idˢ�»���ʧ��:"+e);
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
		boolean bRet = HibernateUtil.evictSessionFactoryQueries("ProvinceQueries");
		if (bRet == false)
			return false;
		return HibernateUtil.evictSessionFactory("com.yihuacomputer.cols.entity.Province");
	}
}