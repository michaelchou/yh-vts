package com.yihuacomputer.cols.database;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.SQLException;
import java.util.List;

import org.apache.log4j.Logger;
import org.hibernate.Query;
import org.hibernate.Session;

import com.yihuacomputer.cols.common.util.HibernateUtil;
import com.yihuacomputer.cols.entity.DevType;


/**
 * �豸���ͱ�����
 * �����������Թɷ����޹�˾
 * 2017-06-08
 */

public class DevTypeDB {

	public Logger logErr = Logger.getLogger("Error");

	/**
	 * ����ID��ȡ���豸������Ϣ
	 * ����1��id��
	 * ����ֵ���豸���Ͷ���
	*/
	@SuppressWarnings("rawtypes")
	public DevType getDevTypeById(int id) {
		DevType devType = null;
		try {
			Session session = HibernateUtil.getSession();
			String hql = "from DevType where id=:id";
			Query query = session.createQuery(hql);
			query.setInteger("id", id);
			// ���ò�ѯ����
			query.setCacheable(true);
			query.setCacheRegion("DevTypeQueries");
			List devTypeList = query.list();
			if (devTypeList != null && !devTypeList.isEmpty() && devTypeList.size() > 0)
				devType = (DevType) devTypeList.get(0);
		} catch (Exception e) {
			// ��¼��־��ˮ
			logErr.error("ȡ�豸������Ϣʧ��:"+e);
		} finally {
			HibernateUtil.closeSession();
		}
		return devType;
	}
	/**
	 * ����ID��ȡ���豸������Ϣ
	 * ����1��id��
	 * ����ֵ���豸���Ͷ���
	 */
	@SuppressWarnings("rawtypes")
	public DevType getDevTypeByIdNoCache(int id) {
		DevType devType = null;
		try {
			Session session = HibernateUtil.getSession();
			String hql = "from DevType where id=:id";
			Query query = session.createQuery(hql);
			query.setInteger("id", id);
			List devTypeList = query.list();
			if (devTypeList != null && !devTypeList.isEmpty() && devTypeList.size() > 0)
				devType = (DevType) devTypeList.get(0);
		} catch (Exception e) {
			// ��¼��־��ˮ
			logErr.error("ȡ�豸������Ϣʧ��:"+e);
		} finally {
			HibernateUtil.closeSession();
		}
		return devType;
	}

	/**
	   * ͬ���豸������Ϣ
	   * �������豸������Ϣ
	   * ������  true=�ɹ�  false=ʧ��
	*/
	public boolean save(DevType entity) {
		boolean bRet = false;
		PreparedStatement pst =null;
		Session session = HibernateUtil.getSession();
		Connection dbm = session.connection();
		HibernateUtil.beginTransaction();
	    String sql = "insert into DevType(id,strDevTypeName) values (?,?)";
	    try
	    {
	        pst = dbm.prepareStatement(sql);
	        pst.setInt(1, entity.getId());
	        pst.setString(2, entity.getStrDevTypeName());
	        pst.addBatch();
	        pst.executeBatch();
	        HibernateUtil.commitTransaction();
	        bRet = true;
	    }
	    catch (SQLException e)
	    {
		    // ��¼��־��ˮ
		    logErr.error("�����豸������Ϣʧ��:"+e);
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
	  * ͬ���豸������Ϣ
	  * �������豸������Ϣ
	  * ������  true=�ɹ�  false=ʧ��
	*/
	public boolean Update(DevType entity)
    {
		boolean bRet = false;
	    PreparedStatement pre =null;
        String sql = "update DevType set strDevTypeName =? where id=?";
        Session session = HibernateUtil.getSession();
        Connection dbm = session.connection();
        HibernateUtil.beginTransaction();
        try
        {
            pre = dbm.prepareStatement(sql);
            pre.setString(1, entity.getStrDevTypeName());
            pre.setInt(2, entity.getId());
            pre.execute();
            HibernateUtil.commitTransaction();
            bRet = true;
        }
        catch (SQLException err)
        {
  	        logErr.error("�����豸������Ϣʧ��:"+err);
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
    	DevType deleteBean = this.getDevTypeByIdNoCache(id);
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
	      logErr.error("ɾ���豸������Ϣʧ��:"+e);
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
	   * �����豸����idˢ�»���
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
	      String hql = "from DevType where id=:id"; //�����󶨣�����sqlע��
	      Query query = session.createQuery(hql);
	      query.setInteger("id", id);
	      query.list();
	      bRet = true;
	    }
	    catch (Exception e)
	    {
	      // ��¼��־��ˮ
	      logErr.error("�����豸����idˢ�»���ʧ��:"+e);
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
		boolean bRet = HibernateUtil.evictSessionFactoryQueries("DevTypeQueries");
		if (bRet == false)
			return false;
		return HibernateUtil.evictSessionFactory("com.yihuacomputer.cols.entity.DevType");
	}
}
