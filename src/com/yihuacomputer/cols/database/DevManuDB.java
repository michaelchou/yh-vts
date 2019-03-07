package com.yihuacomputer.cols.database;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.SQLException;
import java.util.List;

import org.apache.log4j.Logger;
import org.hibernate.Query;
import org.hibernate.Session;

import com.yihuacomputer.cols.common.util.HibernateUtil;
import com.yihuacomputer.cols.entity.DevManu;


/**
 * �豸Ʒ�Ʊ�����
 * �����������Թɷ����޹�˾
 * 2017-06-08
 */

public class DevManuDB {

	public Logger logErr = Logger.getLogger("Error");

	/**
	 * ����ID��ȡ���豸Ʒ����Ϣ
	 * ����1��id��
	 * ����ֵ���豸���ö���
	*/
	@SuppressWarnings("rawtypes")
	public DevManu getDevManuById(int id) {
		DevManu devManu = null;
		try {
			Session session = HibernateUtil.getSession();
			String hql = "from DevManu where id=:id";
			Query query = session.createQuery(hql);
			query.setInteger("id", id);
			// ���ò�ѯ����
			query.setCacheable(true);
			query.setCacheRegion("DevManuQueries");
			List devManuList = query.list();
			if (devManuList != null && !devManuList.isEmpty() && devManuList.size() > 0)
				devManu = (DevManu) devManuList.get(0);
		} catch (Exception e) {
			// ��¼��־��ˮ
			logErr.error("ȡ�豸Ʒ����Ϣʧ��:"+e);
		} finally {
			HibernateUtil.closeSession();
		}
		return devManu;
	}
	/**
	 * ����ID��ȡ���豸Ʒ����Ϣ
	 * ����1��id��
	 * ����ֵ���豸���ö���
	 */
	@SuppressWarnings("rawtypes")
	public DevManu getDevManuByIdNoCache(int id) {
		DevManu devManu = null;
		try {
			Session session = HibernateUtil.getSession();
			String hql = "from DevManu where id=:id";
			Query query = session.createQuery(hql);
			query.setInteger("id", id);
			List devManuList = query.list();
			if (devManuList != null && !devManuList.isEmpty() && devManuList.size() > 0)
				devManu = (DevManu) devManuList.get(0);
		} catch (Exception e) {
			// ��¼��־��ˮ
			logErr.error("ȡ�豸Ʒ����Ϣʧ��:"+e);
		} finally {
			HibernateUtil.closeSession();
		}
		return devManu;
	}

	/**
	   * ͬ���豸Ʒ����Ϣ
	   * �������豸Ʒ����Ϣ
	   * ������  true=�ɹ�  false=ʧ��
	*/
	public boolean save(DevManu entity) {
		boolean bRet = false;
		PreparedStatement pst =null;
		Session session = HibernateUtil.getSession();
		Connection dbm = session.connection();
		HibernateUtil.beginTransaction();
	    String sql = "insert into DevManu(id,strDevManuName) values (?,?)";
	    try
	    {
	        pst = dbm.prepareStatement(sql);
	        pst.setInt(1, entity.getId());
	        pst.setString(2, entity.getStrDevManuName());
	        pst.addBatch();
	        pst.executeBatch();
	        HibernateUtil.commitTransaction();
	        bRet = true;
	    }
	    catch (SQLException e)
	    {
		    // ��¼��־��ˮ
		    logErr.error("�����豸Ʒ����Ϣʧ��:"+e);
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
	  * ͬ���豸Ʒ����Ϣ
	  * �������豸Ʒ����Ϣ
	  * ������  true=�ɹ�  false=ʧ��
	*/
	public boolean Update(DevManu entity)
    {
		boolean bRet = false;
	    PreparedStatement pre =null;
        String sql = "update DevManu set strDevManuName =? where id=?";
        Session session = HibernateUtil.getSession();
        Connection dbm = session.connection();
        HibernateUtil.beginTransaction();
        try
        {
            pre = dbm.prepareStatement(sql);
            pre.setString(1, entity.getStrDevManuName());
            pre.setInt(2, entity.getId());
            pre.execute();
            HibernateUtil.commitTransaction();
            bRet = true;
        }
        catch (SQLException err)
        {
  	        logErr.error("�����豸Ʒ����Ϣʧ��:"+err);
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
    	DevManu deleteBean = this.getDevManuByIdNoCache(id);
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
	      logErr.error("ɾ���豸Ʒ����Ϣʧ��:"+e);
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
	      String hql = "from DevManu where id=:id"; //�����󶨣�����sqlע��
	      Query query = session.createQuery(hql);
	      query.setInteger("id", id);
	      query.list();
	      bRet = true;
	    }
	    catch (Exception e)
	    {
	      // ��¼��־��ˮ
	      logErr.error("�����豸Ʒ��idˢ�»���ʧ��:"+e);
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
		boolean bRet = HibernateUtil.evictSessionFactoryQueries("DevManuQueries");
		if (bRet == false)
			return false;
		return HibernateUtil.evictSessionFactory("com.yihuacomputer.cols.entity.DevManu");
	}
}
