package com.yihuacomputer.cols.database;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.SQLException;
import java.util.List;

import org.apache.log4j.Logger;
import org.hibernate.Query;
import org.hibernate.Session;

import com.yihuacomputer.cols.common.util.HibernateUtil;
import com.yihuacomputer.cols.entity.Org;

/**
 * ����������
 * �����������Թɷ����޹�˾
 * 2017-01-12
 */

public class OrgDB {

	public Logger logErr = Logger.getLogger("Error");

	/**
	 * ����id��ȡ��������Ϣֵ
	 * ����1��id
	 * ����ֵ����������
	*/
	@SuppressWarnings("rawtypes")
	public Org getOrgInfo(int orgId) {
		Org org = null;
		try {
			Session session = HibernateUtil.getSession();
			String hql = "from Org where id=:orgId";
			Query query = session.createQuery(hql);
			query.setInteger("orgId", orgId);
			// ���ò�ѯ����
			query.setCacheable(true);
			query.setCacheRegion("OrgQueries");
			List orgList = query.list();
			if (orgList != null && !orgList.isEmpty() && orgList.size() > 0)
				org = (Org) orgList.get(0);
		} catch (Exception e) {
			// ��¼��־��ˮ
			logErr.error("ȡ����ʧ��:"+e);
		} finally {
			HibernateUtil.closeSession();
		}
		return org;
	}
	
	/**
	 * ����id��ȡ��������Ϣֵ
	 * ����1��id
	 * ����ֵ����������
	 */
	@SuppressWarnings("rawtypes")
	public Org getOrgInfoNoCache(int orgId) {
		Org org = null;
		try {
			Session session = HibernateUtil.getSession();
			String hql = "from Org where id=:orgId";
			Query query = session.createQuery(hql);
			query.setInteger("orgId", orgId);
			List orgList = query.list();
			if (orgList != null && !orgList.isEmpty() && orgList.size() > 0)
				org = (Org) orgList.get(0);
		} catch (Exception e) {
			// ��¼��־��ˮ
			logErr.error("ȡ����ʧ��:"+e);
		} finally {
			HibernateUtil.closeSession();
		}
		return org;
	}

	/**
	   * ͬ��������Ϣ
	   * ������������Ϣ
	   * ������  true=�ɹ�  false=ʧ��
	*/
	public boolean save(Org entity) {
		boolean bRet = false;
		PreparedStatement pst =null;
		Session session = HibernateUtil.getSession();
		Connection dbm = session.connection();
		HibernateUtil.beginTransaction();
	    String sql = "insert into Org(id,strParentOrgCode,strOrgNum,strOrgName) values (?,?,?,?)";
	    try
	    {
	        pst = dbm.prepareStatement(sql);
	        pst.setInt(1, entity.getId());
	        pst.setString(2, entity.getStrParentOrgCode());
	        pst.setString(3, entity.getStrOrgNum());
	        pst.setString(4, entity.getStrOrgName());
	        pst.addBatch();
	        pst.executeBatch();
	        HibernateUtil.commitTransaction();
	        bRet = true;
	    }
	    catch (SQLException e)
	    {
	    	e.printStackTrace();
		    // ��¼��־��ˮ
		    logErr.error("���»�����Ϣʧ��:"+e);
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
	public boolean Update(Org entity)
    {
		boolean bRet = false;
  	    PreparedStatement pre =null;
        String sql = "update Org set strParentOrgCode =?, strOrgNum =?, strOrgName =? where id=?";
        Session session = HibernateUtil.getSession();
        Connection dbm = session.connection();
        HibernateUtil.beginTransaction();
        try
        {
            pre = dbm.prepareStatement(sql);
            pre.setString(1, entity.getStrParentOrgCode());
            pre.setString(2, entity.getStrOrgNum());
            pre.setString(3, entity.getStrOrgName());
            pre.setInt(4, entity.getId());
            pre.execute();
            HibernateUtil.commitTransaction();
            bRet = true;
        }
        catch (SQLException err)
        {
    	   logErr.error("���Ļ�����Ϣʧ��:"+err);
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
	    Org deleteBean = this.getOrgInfoNoCache(id);
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
	   * ���ݻ���idˢ�»���
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
	      String hql = "from Org where id=:id"; //�����󶨣�����sqlע��
	      Query query = session.createQuery(hql);
	      query.setInteger("id", id);
	      query.list();
	      bRet = true;
	    }
	    catch (Exception e)
	    {
	      // ��¼��־��ˮ
	      logErr.error("���ݻ���idˢ�»���ʧ��:"+e);
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
		//��ʧЧ��ѯ���棬��ʧЧ�������棬��֤�����ݿ�������ͬ��
	    boolean bRet = HibernateUtil.evictSessionFactoryQueries("OrgQueries");
	    if (bRet == false)
	      return false;
	    return HibernateUtil.evictSessionFactory("com.yihuacomputer.cols.entity.Org");
	}
}
