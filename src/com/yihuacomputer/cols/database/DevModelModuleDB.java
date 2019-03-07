package com.yihuacomputer.cols.database;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.SQLException;
import java.util.List;

import org.apache.log4j.Logger;
import org.hibernate.Query;
import org.hibernate.Session;

import com.yihuacomputer.cols.common.util.HibernateUtil;
import com.yihuacomputer.cols.entity.DevModelModule;


/**
 * �ͺ�ģ�����������
 * �����������Թɷ����޹�˾
 * 2017-06-08
 */

public class DevModelModuleDB {

	public Logger logErr = Logger.getLogger("Error");

	/**
	 * ����ID��ȡ���ͺ�ģ�������Ϣ
	 * ����1��id��
	 * ����ֵ���ͺ�ģ���������
	*/
	@SuppressWarnings("rawtypes")
	public DevModelModule getDevModelModuleById(int id) {
		DevModelModule devModelModule = null;
		try {
			Session session = HibernateUtil.getSession();
			String hql = "from DevModelModule where id=:id";
			Query query = session.createQuery(hql);
			query.setInteger("id", id);
			// ���ò�ѯ����
			query.setCacheable(true);
			query.setCacheRegion("DevModelModuleQueries");
			List devModelModuleList = query.list();
			if (devModelModuleList != null && !devModelModuleList.isEmpty() && devModelModuleList.size() > 0)
				devModelModule = (DevModelModule) devModelModuleList.get(0);
		} catch (Exception e) {
			// ��¼��־��ˮ
			logErr.error("ȡ�ͺ�ģ�������Ϣʧ��:"+e);
		} finally {
			HibernateUtil.closeSession();
		}
		return devModelModule;
	}
	/**
	 * ����ID��ȡ���ͺ�ģ�������Ϣ
	 * ����1��id��
	 * ����ֵ���ͺ�ģ���������
	 */
	@SuppressWarnings("rawtypes")
	public DevModelModule getDevModelModuleByIdNoCache(int id) {
		DevModelModule devModelModule = null;
		try {
			Session session = HibernateUtil.getSession();
			String hql = "from DevModelModule where id=:id";
			Query query = session.createQuery(hql);
			query.setInteger("id", id);
			List devModelModuleList = query.list();
			if (devModelModuleList != null && !devModelModuleList.isEmpty() && devModelModuleList.size() > 0)
				devModelModule = (DevModelModule) devModelModuleList.get(0);
		} catch (Exception e) {
			// ��¼��־��ˮ
			logErr.error("ȡ�ͺ�ģ�������Ϣʧ��:"+e);
		} finally {
			HibernateUtil.closeSession();
		}
		return devModelModule;
	}

	/**
	   * ͬ���ͺ�ģ�������Ϣ
	   * �������ͺ�ģ�������Ϣ
	   * ������  true=�ɹ�  false=ʧ��
	*/
	public boolean save(DevModelModule entity) {
		boolean bRet = false;
		PreparedStatement pst =null;
		Session session = HibernateUtil.getSession();
		Connection dbm = session.connection();
		HibernateUtil.beginTransaction();
	    String sql = "insert into DevModelModule(id,iDevModelId,iModuleId) values (?,?,?)";
	    try
	    {
	        pst = dbm.prepareStatement(sql);
	        pst.setInt(1, entity.getId());
	        pst.setInt(2, entity.getDevModelId());
	        pst.setInt(3, entity.getModuleId());
	        pst.addBatch();
	        pst.executeBatch();
	        HibernateUtil.commitTransaction();
	        bRet = true;
	    }
	    catch (SQLException e)
	    {
		    // ��¼��־��ˮ
		    logErr.error("�����ͺ�ģ�������Ϣʧ��:"+e);
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
	  * ͬ���ͺ�ģ�������Ϣ
	  * �������ͺ�ģ�������Ϣ
	  * ������  true=�ɹ�  false=ʧ��
	*/
	public boolean Update(DevModelModule entity)
    {
		boolean bRet = false;
	    PreparedStatement pre =null;
        String sql = "update DevModelModule set iDevModelId =? ,iModuleId =? where id=?";
        Session session = HibernateUtil.getSession();
        Connection dbm = session.connection();
        HibernateUtil.beginTransaction();
        try
        {
            pre = dbm.prepareStatement(sql);
            pre.setInt(1, entity.getDevModelId());
            pre.setInt(2, entity.getModuleId());
            pre.setInt(3, entity.getId());
            pre.execute();
            HibernateUtil.commitTransaction();
            bRet = true;
        }
        catch (SQLException err)
        {
  	        logErr.error("�����ͺ�ģ�������Ϣʧ��:"+err);
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
    	DevModelModule deleteBean = this.getDevModelModuleByIdNoCache(id);
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
	      logErr.error("ɾ���ͺ�ģ�������Ϣʧ��:"+e);
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
	   * �����ͺ�ģ�����idˢ�»���
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
	      String hql = "from DevModelModule where id=:id"; //�����󶨣�����sqlע��
	      Query query = session.createQuery(hql);
	      query.setInteger("id", id);
	      query.list();
	      bRet = true;
	    }
	    catch (Exception e)
	    {
	      // ��¼��־��ˮ
	      logErr.error("�����ͺ�ģ�����idˢ�»���ʧ��:"+e);
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
		boolean bRet = HibernateUtil.evictSessionFactoryQueries("DevModelModuleQueries");
		if (bRet == false)
			return false;
		return HibernateUtil.evictSessionFactory("com.yihuacomputer.cols.entity.DevModelModule");
	}
}
