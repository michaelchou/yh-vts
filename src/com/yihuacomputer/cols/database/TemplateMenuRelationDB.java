package com.yihuacomputer.cols.database;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.SQLException;
import java.util.List;

import org.apache.log4j.Logger;
import org.hibernate.Query;
import org.hibernate.Session;

import com.yihuacomputer.cols.common.util.HibernateUtil;
import com.yihuacomputer.cols.entity.TemplateMenuRelation;


/**
 * �˵���ģ��Ĺ���������
 * �����������Թɷ����޹�˾
 * 2017-06-08
 */

public class TemplateMenuRelationDB {

	public Logger logErr = Logger.getLogger("Error");


	/**
     * ����ģ���Idȡ��ģ������Ӧ�����в˵���ϸ��Ϣ
     * ������ģ��id
     * ����ֵ����ģ������Ӧ����ϸ��Ϣ
   */
	@SuppressWarnings("rawtypes")
	public List getTerminalServiceMenuList(int terminalId)
    {
    	List templateList = new TerminalServiceDB().getTemplateList(terminalId);
        if (null == templateList)
        {
            return null;
        }
        List menuList = null;
        try
        {
        	Session session = HibernateUtil.getSession();
        	String hql = "select serviceMenuId from TemplateMenuRelation where templateId in (:templateId)";
            Query query = session.createQuery(hql);
            query.setParameterList("templateId", templateList);
            //���ò�ѯ����
            query.setCacheable(true);
            query.setCacheRegion("TemplateMenuRelationQueries");
            menuList = query.list();
            //δ�ҵ�
            if (menuList==null||menuList.isEmpty())
            	menuList = null;
          }
          catch (Exception e)
          {
             // ��¼��־��ˮ
       	  logErr.error("ȡ�˵���ģ��Ĺ���ʧ��:"+e);
          }
          finally
          {
             HibernateUtil.closeSession();
          }
          return menuList;
      }

	/**
	 * ����ID��ȡ���˵���ģ��Ĺ�����Ϣ
	 * ����1��id��
	 * ����ֵ���˵���ģ��Ĺ�������
	*/
	@SuppressWarnings("rawtypes")
	public TemplateMenuRelation getTemplateMenuRelationById(int id) {
		TemplateMenuRelation templateMenuRelation = null;
		try {
			Session session = HibernateUtil.getSession();
			String hql = "from TemplateMenuRelation where id=:id";
			Query query = session.createQuery(hql);
			query.setInteger("id", id);
			// ���ò�ѯ����
			query.setCacheable(true);
			query.setCacheRegion("TemplateMenuRelationQueries");
			List templateMenuRelationList = query.list();
			if (templateMenuRelationList != null && !templateMenuRelationList.isEmpty() && templateMenuRelationList.size() > 0)
				templateMenuRelation = (TemplateMenuRelation) templateMenuRelationList.get(0);
		} catch (Exception e) {
			// ��¼��־��ˮ
			logErr.error("ȡ�˵���ģ��Ĺ�����Ϣʧ��:"+e);
		} finally {
			HibernateUtil.closeSession();
		}
		return templateMenuRelation;
	}
	
	/**
	 * ����ID��ȡ���˵���ģ��Ĺ�����Ϣ
	 * ����1��id��
	 * ����ֵ���˵���ģ��Ĺ�������
	 */
	@SuppressWarnings("rawtypes")
	public TemplateMenuRelation getTemplateMenuRelationByIdNoCache(int id) {
		TemplateMenuRelation templateMenuRelation = null;
		try {
			Session session = HibernateUtil.getSession();
			String hql = "from TemplateMenuRelation where id=:id";
			Query query = session.createQuery(hql);
			query.setInteger("id", id);
			List templateMenuRelationList = query.list();
			if (templateMenuRelationList != null && !templateMenuRelationList.isEmpty() && templateMenuRelationList.size() > 0)
				templateMenuRelation = (TemplateMenuRelation) templateMenuRelationList.get(0);
		} catch (Exception e) {
			// ��¼��־��ˮ
			logErr.error("ȡ�˵���ģ��Ĺ�����Ϣʧ��:"+e);
		} finally {
			HibernateUtil.closeSession();
		}
		return templateMenuRelation;
	}

	/**
	   * ͬ���˵���ģ��Ĺ�����Ϣ
	   * �������˵���ģ��Ĺ�����Ϣ
	   * ������  true=�ɹ�  false=ʧ��
	*/
	public boolean save(TemplateMenuRelation entity) {
		boolean bRet = false;
		PreparedStatement pst =null;
		Session session = HibernateUtil.getSession();
		Connection dbm = session.connection();
		HibernateUtil.beginTransaction();
	    String sql = "insert into TemplateMenuRelation(id,iTemplateId,iServiceMenuId) values (?,?,?)";
	    try
	    {
	        pst = dbm.prepareStatement(sql);
	        pst.setInt(1, entity.getId());
	        pst.setInt(2, entity.getTemplateId());
	        pst.setInt(3, entity.getServiceMenuId());
	        pst.addBatch();
	        pst.executeBatch();
	        HibernateUtil.commitTransaction();
	        bRet = true;
	    }
	    catch (SQLException e)
	    {
		    // ��¼��־��ˮ
		    logErr.error("���²˵���ģ��Ĺ�����Ϣʧ��:"+e);
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
	  * ͬ���˵���ģ��Ĺ�����Ϣ
	  * �������˵���ģ��Ĺ�����Ϣ
	  * ������  true=�ɹ�  false=ʧ��
	*/
	public boolean Update(TemplateMenuRelation entity)
    {
		boolean bRet = false;
	    PreparedStatement pre =null;
        String sql = "update TemplateMenuRelation set iTemplateId =? ,iServiceMenuId =? where id=?";
        Session session = HibernateUtil.getSession();
        Connection dbm = session.connection();
        HibernateUtil.beginTransaction();
        try
        {
            pre = dbm.prepareStatement(sql);
            pre.setInt(1, entity.getTemplateId());
            pre.setInt(2, entity.getServiceMenuId());
            pre.setInt(3, entity.getId());
            pre.execute();
            HibernateUtil.commitTransaction();
            bRet = true;
        }
        catch (SQLException err)
        {
  	        logErr.error("���Ĳ˵���ģ��Ĺ�����Ϣʧ��:"+err);
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
    	TemplateMenuRelation deleteBean = this.getTemplateMenuRelationByIdNoCache(id);
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
	      logErr.error("ɾ���˵���ģ��Ĺ�����Ϣʧ��:"+e);
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
	   * ���ݲ˵���ģ��Ĺ���idˢ�»���
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
	      String hql = "from TemplateMenuRelation where id=:id"; //�����󶨣�����sqlע��
	      Query query = session.createQuery(hql);
	      query.setInteger("id", id);
	      query.list();
	      bRet = true;
	    }
	    catch (Exception e)
	    {
	      // ��¼��־��ˮ
	      logErr.error("���ݲ˵���ģ��Ĺ���idˢ�»���ʧ��:"+e);
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
		boolean bRet = HibernateUtil.evictSessionFactoryQueries("TemplateMenuRelationQueries");
		if (bRet == false)
			return false;
		return HibernateUtil.evictSessionFactory("com.yihuacomputer.cols.entity.TemplateMenuRelation");
	}
}
