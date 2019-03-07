package com.yihuacomputer.cols.database;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.SQLException;
import java.util.List;

import org.apache.log4j.Logger;
import org.hibernate.Query;
import org.hibernate.Session;

import com.yihuacomputer.cols.common.util.HibernateUtil;
import com.yihuacomputer.cols.entity.Trial;

/**
 * �����豸������
 * �����������Թɷ����޹�˾
 * 2017-03-31
 */

public class TrialDB {

	public Logger logErr = Logger.getLogger("Error");

	/**
	 * ����ID��ȡ���豸������Ϣ
	 * ����1��id��
	 * ����ֵ���豸���ö���
	*/
	@SuppressWarnings("rawtypes")
	public Trial getTrialInfo(int id) {
		Trial trial = null;
		try {
			Session session = HibernateUtil.getSession();
			String hql = "from Trial where id=:id";
			Query query = session.createQuery(hql);
			query.setInteger("id", id);
			// ���ò�ѯ����
			query.setCacheable(true);
			query.setCacheRegion("TrialQueries");
			List trialList = query.list();
			if (trialList != null && !trialList.isEmpty() && trialList.size() > 0)
				trial = (Trial) trialList.get(0);
		} catch (Exception e) {
			// ��¼��־��ˮ
			logErr.error("ȡ�豸������Ϣʧ��:"+e);
		} finally {
			HibernateUtil.closeSession();
		}
		return trial;
	}
	/**
	 * ����ID��ȡ���豸������Ϣ
	 * ����1��id��
	 * ����ֵ���豸���ö���
	 */
	@SuppressWarnings("rawtypes")
	public Trial getTrialInfoNoCache(int id) {
		Trial trial = null;
		try {
			Session session = HibernateUtil.getSession();
			String hql = "from Trial where id=:id";
			Query query = session.createQuery(hql);
			query.setInteger("id", id);
			List trialList = query.list();
			if (trialList != null && !trialList.isEmpty() && trialList.size() > 0)
				trial = (Trial) trialList.get(0);
		} catch (Exception e) {
			// ��¼��־��ˮ
			logErr.error("ȡ�豸������Ϣʧ��:"+e);
		} finally {
			HibernateUtil.closeSession();
		}
		return trial;
	}

	/**
	 * �����ն˱�ţ�ȡ�������豸����
	 * ����1���ն˱��
	 * ����ֵ�������豸����
	*/
	@SuppressWarnings("rawtypes")
	public Trial getTrial(String strTerminalNum) {
		Trial entity = null;
		try {
			Session session = HibernateUtil.getSession();
			String hql = "from Trial where strTerminalNum=:strTerminalNum";
			Query query = session.createQuery(hql);
			query.setString("strTerminalNum", strTerminalNum);
			List trialList = query.list();
			if (trialList != null && !trialList.isEmpty() && trialList.size() > 0)
				entity = (Trial) trialList.get(0);
		} catch (Exception e) {
			// ��¼��־��ˮ
			logErr.error("ȡ�����豸ʧ��:"+e);
		} finally {
			HibernateUtil.closeSession();
		}
		return entity;
	}
	/**
	   * ɾ������
	   * @param  id : ����ʵ���ID��
	*/
    public boolean delete(int id)
	{
    	boolean bRet = false;
    	Trial deleteBean = this.getTrialInfoNoCache(id);
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
	   * ͬ���豸������Ϣ
	   * �������豸������Ϣ
	   * ������  true=�ɹ�  false=ʧ��
	*/
	public boolean save(Trial entity) {
		boolean bRet = false;
		PreparedStatement pst =null;
		Session session = HibernateUtil.getSession();
		Connection dbm = session.connection();
		HibernateUtil.beginTransaction();
	    String sql = "insert into Trial(id,strTerminalNum) values (?,?)";
	    try
	    {
	        pst = dbm.prepareStatement(sql);
	        pst.setInt(1, entity.getId());
	        pst.setString(2, entity.getStrTerminalNum());
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
	public boolean Update(Trial entity)
    {
		boolean bRet = false;
 	    PreparedStatement pre =null;
        String sql = "update Trial set strTerminalNum =? where id=?";
        Session session = HibernateUtil.getSession();
        Connection dbm = session.connection();
        HibernateUtil.beginTransaction();
        try
        {
           pre = dbm.prepareStatement(sql);
           pre.setString(1, entity.getStrTerminalNum());
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
	   * �����豸����idˢ�»���
	   * @param id
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
	      String hql = "from Trial where id=:id"; //�����󶨣�����sqlע��
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
		//��ʧЧ��ѯ���棬��ʧЧ�������棬��֤�����ݿ�������ͬ��
	    boolean bRet = HibernateUtil.evictSessionFactoryQueries("TrialQueries");
	    if (bRet == false)
	      return false;
	    return HibernateUtil.evictSessionFactory("com.yihuacomputer.cols.entity.Trial");
   }
}
