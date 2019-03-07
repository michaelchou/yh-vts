package com.yihuacomputer.cols.database;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.SQLException;
import java.util.List;

import org.apache.log4j.Logger;
import org.hibernate.Query;
import org.hibernate.Session;

import com.yihuacomputer.cols.common.util.HibernateUtil;
import com.yihuacomputer.cols.entity.TemplateMenu;


/**
 * �˵�ģ�������
 * �����������Թɷ����޹�˾
 * 2017-06-08
 */

public class TemplateMenuDB {

	public Logger logErr = Logger.getLogger("Error");

	/**
	 * ����ID��ȡ���˵�ģ����Ϣ
	 * ����1��id��
	 * ����ֵ���˵�ģ�����
	*/
	@SuppressWarnings("rawtypes")
	public TemplateMenu getTemplateMenuById(int id) {
		TemplateMenu templateMenu = null;
		try {
			Session session = HibernateUtil.getSession();
			String hql = "from TemplateMenu where id=:id";
			Query query = session.createQuery(hql);
			query.setInteger("id", id);
			// ���ò�ѯ����
			query.setCacheable(true);
			query.setCacheRegion("TemplateMenuQueries");
			List templateMenuList = query.list();
			if (templateMenuList != null && !templateMenuList.isEmpty() && templateMenuList.size() > 0)
				templateMenu = (TemplateMenu) templateMenuList.get(0);
		} catch (Exception e) {
			// ��¼��־��ˮ
			logErr.error("ȡ�˵�ģ����Ϣʧ��:"+e);
		} finally {
			HibernateUtil.closeSession();
		}
		return templateMenu;
	}
	/**
	 * ����ID��ȡ���˵�ģ����Ϣ
	 * ����1��id��
	 * ����ֵ���˵�ģ�����
	 */
	@SuppressWarnings("rawtypes")
	public TemplateMenu getTemplateMenuByIdNoCache(int id) {
		TemplateMenu templateMenu = null;
		try {
			Session session = HibernateUtil.getSession();
			String hql = "from TemplateMenu where id=:id";
			Query query = session.createQuery(hql);
			query.setInteger("id", id);
			List templateMenuList = query.list();
			if (templateMenuList != null && !templateMenuList.isEmpty() && templateMenuList.size() > 0)
				templateMenu = (TemplateMenu) templateMenuList.get(0);
		} catch (Exception e) {
			// ��¼��־��ˮ
			logErr.error("ȡ�˵�ģ����Ϣʧ��:"+e);
		} finally {
			HibernateUtil.closeSession();
		}
		return templateMenu;
	}

	/**
	   * ͬ���˵�ģ����Ϣ
	   * �������˵�ģ����Ϣ
	   * ������  true=�ɹ�  false=ʧ��
	*/
	public boolean save(TemplateMenu entity) {
		boolean bRet = false;
		PreparedStatement pst =null;
		Session session = HibernateUtil.getSession();
		Connection dbm = session.connection();
		HibernateUtil.beginTransaction();
	    String sql = "insert into TemplateMenu(id,strTemplateName,strDescription) values (?,?,?)";
	    try
	    {
	        pst = dbm.prepareStatement(sql);
	        pst.setInt(1, entity.getId());
	        pst.setString(2, entity.getStrTemplateName());
	        pst.setString(3, entity.getStrDescription());
	        pst.addBatch();
	        pst.executeBatch();
	        HibernateUtil.commitTransaction();
	        bRet = true;
	    }
	    catch (SQLException e)
	    {
		    // ��¼��־��ˮ
		    logErr.error("���²˵�ģ����Ϣʧ��:"+e);
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
	  * ͬ���˵�ģ����Ϣ
	  * �������˵�ģ����Ϣ
	  * ������  true=�ɹ�  false=ʧ��
	*/
	public boolean Update(TemplateMenu entity)
    {
		boolean bRet = false;
	    PreparedStatement pre =null;
        String sql = "update TemplateMenu set strTemplateName =? ,strDescription =? where id=?";
        Session session = HibernateUtil.getSession();
        Connection dbm = session.connection();
        HibernateUtil.beginTransaction();
        try
        {
            pre = dbm.prepareStatement(sql);
            pre.setString(1, entity.getStrTemplateName());
            pre.setString(2, entity.getStrDescription());
            pre.setInt(3, entity.getId());
            pre.execute();
            HibernateUtil.commitTransaction();
            bRet = true;
        }
        catch (SQLException err)
        {
  	        logErr.error("���Ĳ˵�ģ����Ϣʧ��:"+err);
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
    	TemplateMenu deleteBean = this.getTemplateMenuByIdNoCache(id);
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
	      logErr.error("ɾ���˵�ģ����Ϣʧ��:"+e);
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
	   * ���ݲ˵�ģ��idˢ�»���
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
	      String hql = "from TemplateMenu where id=:id"; //�����󶨣�����sqlע��
	      Query query = session.createQuery(hql);
	      query.setInteger("id", id);
	      query.list();
	      bRet = true;
	    }
	    catch (Exception e)
	    {
	      // ��¼��־��ˮ
	      logErr.error("���ݲ˵�ģ��idˢ�»���ʧ��:"+e);
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
		boolean bRet = HibernateUtil.evictSessionFactoryQueries("TemplateMenuQueries");
		if (bRet == false)
			return false;
		return HibernateUtil.evictSessionFactory("com.yihuacomputer.cols.entity.TemplateMenu");
	}
}
