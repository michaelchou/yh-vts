package com.yihuacomputer.cols.database;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.SQLException;
import java.util.List;

import org.apache.log4j.Logger;
import org.hibernate.Query;
import org.hibernate.Session;

import com.yihuacomputer.cols.common.util.HibernateUtil;
import com.yihuacomputer.cols.entity.TerminalService;

/**
 * �ն˷���˵�����
 * �����������Թɷ����޹�˾
 * 2016-10-24
 */
public class TerminalServiceDB
{
	public Logger logErr = Logger.getLogger("Error");

    public static String TERMINALSERVICEDB_LOCK = "TERMINALSERVICEDB_LOCK";

    public TerminalServiceDB()
    {
    }

    /**
	 * ����ID��ȡ���ն˷�����Ϣ
	 * ����1��id��
	 * ����ֵ���ն˷������
	*/
	@SuppressWarnings("rawtypes")
	public TerminalService getTerminalServiceById(int id) {
		TerminalService terminalService = null;
		try {
			Session session = HibernateUtil.getSession();
			String hql = "from TerminalService where id=:id";
			Query query = session.createQuery(hql);
			query.setInteger("id", id);
			// ���ò�ѯ����
			query.setCacheable(true);
			query.setCacheRegion("TerminalServiceQueries");
			List terminalServiceList = query.list();
			if (terminalServiceList != null && !terminalServiceList.isEmpty() && terminalServiceList.size() > 0)
				terminalService = (TerminalService) terminalServiceList.get(0);
		} catch (Exception e) {
			// ��¼��־��ˮ
			logErr.error("ȡ�ն˷�����Ϣʧ��:"+e);
		} finally {
			HibernateUtil.closeSession();
		}
		return terminalService;
	}
	
	/**
	 * ����ID��ȡ���ն˷�����Ϣ
	 * ����1��id��
	 * ����ֵ���ն˷������
	 */
	@SuppressWarnings("rawtypes")
	public TerminalService getTerminalServiceByIdNoCache(int id) {
		TerminalService terminalService = null;
		try {
			Session session = HibernateUtil.getSession();
			String hql = "from TerminalService where id=:id";
			Query query = session.createQuery(hql);
			query.setInteger("id", id);
			List terminalServiceList = query.list();
			if (terminalServiceList != null && !terminalServiceList.isEmpty() && terminalServiceList.size() > 0)
				terminalService = (TerminalService) terminalServiceList.get(0);
		} catch (Exception e) {
			// ��¼��־��ˮ
			logErr.error("ȡ�ն˷�����Ϣʧ��:"+e);
		} finally {
			HibernateUtil.closeSession();
		}
		return terminalService;
	}

    /**
     * <p>�����ն�Idȡ����õķ���˵�</p>
   */
    @SuppressWarnings("rawtypes")
	public List getTemplateList(int terminalId)
    {
      synchronized (TERMINALSERVICEDB_LOCK)
      {
        List templateList = null;
        try
        {
           Session session = HibernateUtil.getSession();
           String hql = "select templateId from TerminalService where terminalId=:terminalId"; //�����󶨣�����sqlע��
           Query query = session.createQuery(hql);
           query.setInteger("terminalId", terminalId);
           //���ò�ѯ����
           query.setCacheable(true);
           query.setCacheRegion("TerminalServiceQueries");

           templateList = query.list();
           if (null == templateList || templateList.isEmpty())
        	   templateList = null;
        }
        catch (Exception e)
        {
			// ��¼��־��ˮ
			logErr.error("ȡ�ն���˵�ģ���ϵ�б�ʧ��:"+e);
        }
        finally
        {
          HibernateUtil.closeSession();
        }
        return templateList;
      }
    }

    /**
	   * ͬ���ն˷�����Ϣ
	   * �������ն˷�����Ϣ
	   * ������  true=�ɹ�  false=ʧ��
	*/
	public boolean save(TerminalService entity) {
		boolean bRet = false;
		PreparedStatement pst =null;
		Session session = HibernateUtil.getSession();
		Connection dbm = session.connection();
		HibernateUtil.beginTransaction();
	    String sql = "insert into TerminalService(id,iTerminalId,iTemplateId) values (?,?,?)";
	    try
	    {
	        pst = dbm.prepareStatement(sql);
	        pst.setInt(1, entity.getId());
	        pst.setInt(2, entity.getTerminalId());
	        pst.setInt(3, entity.getTemplateId());
	        pst.addBatch();
	        pst.executeBatch();
	        HibernateUtil.commitTransaction();
	        bRet = true;
	    }
	    catch (SQLException e)
	    {
		    // ��¼��־��ˮ
		    logErr.error("�����ն˷�����Ϣʧ��:"+e);
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
	  * ͬ���ն˷�����Ϣ
	  * �������ն˷�����Ϣ
	  * ������  true=�ɹ�  false=ʧ��
	*/
    public boolean Update(TerminalService entity)
    {
    	boolean bRet = false;
	    PreparedStatement pre =null;
        String sql = "update TerminalService set iTerminalId =? ,iTemplateId =? where id=?";
        Session session = HibernateUtil.getSession();
        Connection dbm = session.connection();
        HibernateUtil.beginTransaction();
        try
        {
            pre = dbm.prepareStatement(sql);
            pre.setInt(1, entity.getTerminalId());
            pre.setInt(2, entity.getTemplateId());
            pre.setInt(3, entity.getId());
            pre.execute();
            HibernateUtil.commitTransaction();
            bRet = true;
        }
        catch (SQLException err)
        {
	        logErr.error("���ն˷�����Ϣʧ��:"+err);
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
    	TerminalService deleteBean = this.getTerminalServiceByIdNoCache(id);
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
	      logErr.error("ɾ���ն˷�����Ϣʧ��:"+e);
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
	   * �����ն˷���idˢ�»���
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
	      String hql = "from TerminalService where id=:id"; //�����󶨣�����sqlע��
	      Query query = session.createQuery(hql);
	      query.setInteger("id", id);
	      query.list();
	      bRet = true;
	    }
	    catch (Exception e)
	    {
	      // ��¼��־��ˮ
	      logErr.error("�����ն˷���idˢ�»���ʧ��:"+e);
	    }
	    finally
	    {
	      HibernateUtil.closeSession();
	    }
	    return bRet;
   }

  /**
   * �����ն�Idˢ�»���
   */
	public boolean FlushSession() {
		// ��ʧЧ��ѯ���棬��ʧЧ�������棬��֤�����ݿ�������ͬ��
		boolean bRet = HibernateUtil.evictSessionFactoryQueries("TerminalServiceQueries");
		if (bRet == false)
			return false;
		return HibernateUtil.evictSessionFactory("com.yihuacomputer.cols.entity.TerminalService");
	}
}
