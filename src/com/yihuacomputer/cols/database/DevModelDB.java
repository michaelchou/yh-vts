package com.yihuacomputer.cols.database;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.SQLException;
import java.util.List;

import org.apache.log4j.Logger;
import org.hibernate.Query;
import org.hibernate.Session;

import com.yihuacomputer.cols.common.util.HibernateUtil;
import com.yihuacomputer.cols.entity.DevModel;


/**
 * �豸�ͺű�����
 * �����������Թɷ����޹�˾
 * 2017-06-08
 */

public class DevModelDB {

	public Logger logErr = Logger.getLogger("Error");

	/**
	 * ����ID��ȡ���豸�ͺ���Ϣ
	 * ����1��id��
	 * ����ֵ���豸�ͺŶ���
	*/
	@SuppressWarnings("rawtypes")
	public DevModel getDevModelById(int id) {
		DevModel devModel = null;
		try {
			Session session = HibernateUtil.getSession();
			String hql = "from DevModel where id=:id";
			Query query = session.createQuery(hql);
			query.setInteger("id", id);
			// ���ò�ѯ����
			query.setCacheable(true);
			query.setCacheRegion("DevModelQueries");
			List devModelList = query.list();
			if (devModelList != null && !devModelList.isEmpty() && devModelList.size() > 0)
				devModel = (DevModel) devModelList.get(0);
		} catch (Exception e) {
			// ��¼��־��ˮ
			logErr.error("ȡ�豸�ͺ���Ϣʧ��:"+e);
		} finally {
			HibernateUtil.closeSession();
		}
		return devModel;
	}
	
	/**
	 * ����ID��ȡ���豸�ͺ���Ϣ
	 * ����1��id��
	 * ����ֵ���豸�ͺŶ���
	 */
	@SuppressWarnings("rawtypes")
	public DevModel getDevModelByIdNoCache(int id) {
		DevModel devModel = null;
		try {
			Session session = HibernateUtil.getSession();
			String hql = "from DevModel where id=:id";
			Query query = session.createQuery(hql);
			query.setInteger("id", id);
			List devModelList = query.list();
			if (devModelList != null && !devModelList.isEmpty() && devModelList.size() > 0)
				devModel = (DevModel) devModelList.get(0);
		} catch (Exception e) {
			// ��¼��־��ˮ
			logErr.error("ȡ�豸�ͺ���Ϣʧ��:"+e);
		} finally {
			HibernateUtil.closeSession();
		}
		return devModel;
	}

	/**
	   * ͬ���豸�ͺ���Ϣ
	   * �������豸�ͺ���Ϣ
	   * ������  true=�ɹ�  false=ʧ��
	*/
	public boolean save(DevModel entity) {
		boolean bRet = false;
		PreparedStatement pst =null;
		Session session = HibernateUtil.getSession();
		Connection dbm = session.connection();
		HibernateUtil.beginTransaction();
	    String sql = "insert into DevModel(id,iDevManuId,strDevModelName) values (?,?,?)";
	    try
	    {
	        pst = dbm.prepareStatement(sql);
	        pst.setInt(1, entity.getId());
	        pst.setInt(2, entity.getDevManuId());
	        pst.setString(3, entity.getStrDevModelName());
	        pst.addBatch();
	        pst.executeBatch();
	        HibernateUtil.commitTransaction();
	        bRet = true;
	    }
	    catch (SQLException e)
	    {
		    // ��¼��־��ˮ
		    logErr.error("�����豸�ͺ���Ϣʧ��:"+e);
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
	  * ͬ���豸�ͺ���Ϣ
	  * �������豸�ͺ���Ϣ
	  * ������  true=�ɹ�  false=ʧ��
	*/
	public boolean Update(DevModel entity)
    {
		boolean bRet = false;
	    PreparedStatement pre =null;
        String sql = "update DevModel set iDevManuId =? ,strDevModelName =? where id=?";
        Session session = HibernateUtil.getSession();
        Connection dbm = session.connection();
        HibernateUtil.beginTransaction();
        try
        {
            pre = dbm.prepareStatement(sql);
            pre.setInt(1, entity.getDevManuId());
            pre.setString(2, entity.getStrDevModelName());
            pre.setInt(3, entity.getId());
            pre.execute();
            HibernateUtil.commitTransaction();
            bRet = true;
        }
        catch (SQLException err)
        {
  	       logErr.error("�����豸�ͺ���Ϣʧ��:"+err);
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
    	DevModel deleteBean = this.getDevModelByIdNoCache(id);
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
	      logErr.error("ɾ���豸�ͺ���Ϣʧ��:"+e);
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
	   * �����豸�ͺ�idˢ�»���
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
	      String hql = "from DevModel where id=:id"; //�����󶨣�����sqlע��
	      Query query = session.createQuery(hql);
	      query.setInteger("id", id);
	      query.list();
	      bRet = true;
	    }
	    catch (Exception e)
	    {
	      // ��¼��־��ˮ
	      logErr.error("�����豸�ͺ�idˢ�»���ʧ��:"+e);
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
		boolean bRet = HibernateUtil.evictSessionFactoryQueries("DevModelQueries");
		if (bRet == false)
			return false;
		return HibernateUtil.evictSessionFactory("com.yihuacomputer.cols.entity.DevModel");
	}
}
