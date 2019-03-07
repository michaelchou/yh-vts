package com.yihuacomputer.cols.database;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.SQLException;
import java.util.List;

import org.apache.log4j.Logger;
import org.hibernate.Query;
import org.hibernate.Session;

import com.yihuacomputer.cols.common.util.HibernateUtil;
import com.yihuacomputer.cols.entity.Module;


/**
 * �豸ģ�������
 * �����������Թɷ����޹�˾
 * 2017-06-07
 */

public class ModuleDB {

	public Logger logErr = Logger.getLogger("Error");

	/**
	 * ����ID��ȡ���豸ģ����Ϣ
	 * ����1��id��
	 * ����ֵ���豸���ö���
	*/
	@SuppressWarnings("rawtypes")
	public Module getModuleInfo(int id) {
		Module module = null;
		try {
			Session session = HibernateUtil.getSession();
			String hql = "from Module where id=:id";
			Query query = session.createQuery(hql);
			query.setInteger("id", id);
			// ���ò�ѯ����
			query.setCacheable(true);
			query.setCacheRegion("ModuleQueries");
			List moduleList = query.list();
			if (moduleList != null && !moduleList.isEmpty() && moduleList.size() > 0)
				module = (Module) moduleList.get(0);
		} catch (Exception e) {
			// ��¼��־��ˮ
			logErr.error("ȡģ����Ϣʧ��:"+e);
		} finally {
			HibernateUtil.closeSession();
		}
		return module;
	}
	/**
	 * ����ID��ȡ���豸ģ����Ϣ
	 * ����1��id��
	 * ����ֵ���豸���ö���
	 */
	@SuppressWarnings("rawtypes")
	public Module getModuleInfoNoCache(int id) {
		Module module = null;
		try {
			Session session = HibernateUtil.getSession();
			String hql = "from Module where id=:id";
			Query query = session.createQuery(hql);
			query.setInteger("id", id);
			List moduleList = query.list();
			if (moduleList != null && !moduleList.isEmpty() && moduleList.size() > 0)
				module = (Module) moduleList.get(0);
		} catch (Exception e) {
			// ��¼��־��ˮ
			logErr.error("ȡģ����Ϣʧ��:"+e);
		} finally {
			HibernateUtil.closeSession();
		}
		return module;
	}

	/**
	   * ͬ��ģ����Ϣ
	   * ������ģ����Ϣ
	   * ������  true=�ɹ�  false=ʧ��
	*/
	public boolean save(Module entity) {
		boolean bRet = false;
		PreparedStatement pst =null;
		Session session = HibernateUtil.getSession();
		Connection dbm = session.connection();
		HibernateUtil.beginTransaction();
	    String sql = "insert into Module(id,strModuleName,strModuleClsid,strModuleDesc) values (?,?,?,?)";
	    try
	    {
	        pst = dbm.prepareStatement(sql);
	        pst.setInt(1, entity.getId());
	        pst.setString(2, entity.getStrModuleName());
	        pst.setString(3, entity.getStrModuleClsid());
	        pst.setString(4, entity.getStrModuleDesc());
	        pst.addBatch();
	        pst.executeBatch();
	        HibernateUtil.commitTransaction();
	        bRet = true;
	    }
	    catch (SQLException e)
	    {
		    // ��¼��־��ˮ
		    logErr.error("����ģ����Ϣʧ��:"+e);
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
	  * ͬ��ģ����Ϣ
	  * ������ģ����Ϣ
	  * ������  true=�ɹ�  false=ʧ��
	*/
	public boolean Update(Module entity)
    {
		boolean bRet = false;
	    PreparedStatement pre =null;
        String sql = "update Module set strModuleName =?,strModuleClsid =?,strModuleDesc =? where id=?";
        Session session = HibernateUtil.getSession();
        Connection dbm = session.connection();
        HibernateUtil.beginTransaction();
        try
        {
            pre = dbm.prepareStatement(sql);
            pre.setString(1, entity.getStrModuleName());
            pre.setString(2, entity.getStrModuleClsid());
            pre.setString(3, entity.getStrModuleDesc());
            pre.setInt(4, entity.getId());
            pre.execute();
            HibernateUtil.commitTransaction();
            bRet = true;
        }
        catch (SQLException err)
        {
  	        logErr.error("����ģ����Ϣʧ��:"+err);
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
    	Module deleteBean = this.getModuleInfoNoCache(id);
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
	      logErr.error("ɾ��ģ����Ϣʧ��:"+e);
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
	      String hql = "from Module where id=:id"; //�����󶨣�����sqlע��
	      Query query = session.createQuery(hql);
	      query.setInteger("id", id);
	      query.list();
	      bRet = true;
	    }
	    catch (Exception e)
	    {
	      // ��¼��־��ˮ
	      logErr.error("����ģ��idˢ�»���ʧ��:"+e);
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
		boolean bRet = HibernateUtil.evictSessionFactoryQueries("ModuleQueries");
		if (bRet == false)
			return false;
		return HibernateUtil.evictSessionFactory("com.yihuacomputer.cols.entity.Module");
	}
}
