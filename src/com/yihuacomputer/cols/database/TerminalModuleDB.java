package com.yihuacomputer.cols.database;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.SQLException;
import java.util.List;

import org.apache.log4j.Logger;
import org.hibernate.Query;
import org.hibernate.Session;

import com.yihuacomputer.cols.common.util.HibernateUtil;
import com.yihuacomputer.cols.entity.TerminalModule;

/**
 * �ն�֧�ֵ�Ӳ��ģ�鴦����
 * �����������Թɷ����޹�˾
 * 2016-10-25
*/

public class TerminalModuleDB
{

	public Logger logErr = Logger.getLogger("Error");

    public TerminalModuleDB()
    {
    }

    /**
	 * ����ID��ȡ���豸ģ�������Ϣ
	 * ����1��id��
	 * ����ֵ���豸ģ���������
	*/
	@SuppressWarnings("rawtypes")
	public TerminalModule getTerminalModuleById(int id) {
		TerminalModule terminalModule = null;
		try {
			Session session = HibernateUtil.getSession();
			String hql = "from TerminalModule where id=:id";
			Query query = session.createQuery(hql);
			query.setInteger("id", id);
			// ���ò�ѯ����
			query.setCacheable(true);
			query.setCacheRegion("TerminalModuleQueries");
			List terminalModuleList = query.list();
			if (terminalModuleList != null && !terminalModuleList.isEmpty() && terminalModuleList.size() > 0)
				terminalModule = (TerminalModule) terminalModuleList.get(0);
		} catch (Exception e) {
			// ��¼��־��ˮ
			logErr.error("ȡ�豸ģ�������Ϣʧ��:"+e);
		} finally {
			HibernateUtil.closeSession();
		}
		return terminalModule;
	}
	
	/**
	 * ����ID��ȡ���豸ģ�������Ϣ
	 * ����1��id��
	 * ����ֵ���豸ģ���������
	 */
	@SuppressWarnings("rawtypes")
	public TerminalModule getTerminalModuleByIdNoCache(int id) {
		TerminalModule terminalModule = null;
		try {
			Session session = HibernateUtil.getSession();
			String hql = "from TerminalModule where id=:id";
			Query query = session.createQuery(hql);
			query.setInteger("id", id);
			List terminalModuleList = query.list();
			if (terminalModuleList != null && !terminalModuleList.isEmpty() && terminalModuleList.size() > 0)
				terminalModule = (TerminalModule) terminalModuleList.get(0);
		} catch (Exception e) {
			// ��¼��־��ˮ
			logErr.error("ȡ�豸ģ�������Ϣʧ��:"+e);
		} finally {
			HibernateUtil.closeSession();
		}
		return terminalModule;
	}

    /**
     * �����ն�Idȡ���豸֧�ֵ�ģ���б�
     * �������ն˵����к�
     * ����ֵ���ն�֧�ֵ�ģ���б�
    */
    @SuppressWarnings("rawtypes")
	public List getTerminalModuleList(int terminalId,int moduleFlag)
    {
        List terminalModuleList = null;
        try
        {
           Session session = HibernateUtil.getSession();
           String hql = "select moduleId from TerminalModule where terminalId=:terminalId and moduleFlag=:moduleFlag"; //�����󶨣�����sqlע��
           Query query = session.createQuery(hql);
           query.setInteger("terminalId", terminalId);
           query.setInteger("moduleFlag", moduleFlag);
           //���ò�ѯ����
           query.setCacheable(true);
           query.setCacheRegion("TerminalModuleQueries");
           terminalModuleList = query.list();
           if (terminalModuleList==null||terminalModuleList.isEmpty())
        	   terminalModuleList = null;
         }
         catch (Exception e)
         {
            // ��¼��־��ˮ
            logErr.error("ȡ�豸֧�ֵ�ģ���б�ʧ��:"+e);
         }
         finally
         {
            HibernateUtil.closeSession();
         }
         return terminalModuleList;
     }

    /**
     * �����ն˶�Ӧ���ͺ�ȡ���豸֧�ֵ�ģ���б�
     * �������ն˵����к�
     * ����ֵ���ն�֧�ֵ�ģ���б�
    */
    @SuppressWarnings("rawtypes")
	public List getDevModelModuleList(int devModelId)
    {
        List devModelModuleList = null;
        try
        {
           Session session = HibernateUtil.getSession();
           String hql = "select moduleId from DevModelModule where devModelId=:devModelId"; //�����󶨣�����sqlע��
           Query query = session.createQuery(hql);
           query.setInteger("devModelId", devModelId);
           //���ò�ѯ����
           query.setCacheable(true);
           query.setCacheRegion("DevModelModuleQueries");
           devModelModuleList = query.list();
           if (devModelModuleList==null||devModelModuleList.isEmpty())
        	   devModelModuleList = null;
         }
         catch (Exception e)
         {
            // ��¼��־��ˮ
            logErr.error("�����豸�ͺ�ȡ�豸֧�ֵ�ģ���б�ʧ��:"+e);
         }
         finally
         {
            HibernateUtil.closeSession();
         }
         return devModelModuleList;
     }

     /**
      * ����ģ���Idȡ��ģ������Ӧ����ϸ��Ϣ
      * ������ģ��id
      * ����ֵ����ģ������Ӧ����ϸ��Ϣ
    */
     @SuppressWarnings({ "rawtypes", "unchecked", "unused" })
	 public List getModuleList(int terminalId,int devModelId)
     {
    	 //��ȡ�������õ�ģ��
         List terminalModuleRomoveList = getTerminalModuleList(terminalId,-1);
         //��ȡ�����õ�ģ��
         List terminalModuleList = getTerminalModuleList(terminalId,1);
         //�ͺŶ�Ӧ��ģ��
         List devModelModuleList = getDevModelModuleList(devModelId);
         //�ȸ����ͺŶ�Ӧ��ģ���벻���õ�ģ��ȡ���
         if(terminalModuleRomoveList != null && terminalModuleRomoveList.size() >0){
            devModelModuleList.removeAll(terminalModuleRomoveList);
         }
         if(terminalModuleList == null && devModelModuleList != null){
        	 terminalModuleList = devModelModuleList;
         }
         else if(terminalModuleList == null && devModelModuleList == null){
        	 return null;
         }
         else{
        	 if(devModelModuleList !=null && devModelModuleList.size()>0){
                //�������,��Ϊ�û�������֧�ֵ�ģ��
                terminalModuleList.removeAll(devModelModuleList);
                terminalModuleList.addAll(devModelModuleList);
        	 }
         }
         if (null == terminalModuleList)
         {
             return null;
         }
         List moduleList = null;
         try
         {
             Session session = HibernateUtil.getSession();
             String hql = "from Module where id in (:id)";
             Query query = session.createQuery(hql);
             query.setParameterList("id", terminalModuleList);
             //���ò�ѯ����
             query.setCacheable(true);
             query.setCacheRegion("ModuleQueries");
             moduleList = query.list();
             //δ�ҵ�
             if (moduleList==null||moduleList.isEmpty())
            	 moduleList = null;
           }
           catch (Exception e)
           {
              // ��¼��־��ˮ
        	  logErr.error("ȡģ����ϸ��Ϣʧ��:"+e);
           }
           finally
           {
              HibernateUtil.closeSession();
           }
           return moduleList;
       }

     /**
	   * ͬ���豸ģ�������Ϣ
	   * �������豸ģ�������Ϣ
	   * ������  true=�ɹ�  false=ʧ��
	*/
	public boolean save(TerminalModule entity) {
		boolean bRet = false;
		PreparedStatement pst =null;
		Session session = HibernateUtil.getSession();
		Connection dbm = session.connection();
		HibernateUtil.beginTransaction();
	    String sql = "insert into TerminalModule(id,iTerminalId,iModuleId,iModuleFlag) values (?,?,?,?)";
	    try
	    {
	        pst = dbm.prepareStatement(sql);
	        pst.setInt(1, entity.getId());
	        pst.setInt(2, entity.getTerminalId());
	        pst.setInt(3, entity.getModuleId());
	        pst.setInt(4, entity.getModuleFlag());
	        pst.addBatch();
	        pst.executeBatch();
	        HibernateUtil.commitTransaction();
	        bRet = true;
	    }
	    catch (SQLException e)
	    {
		    // ��¼��־��ˮ
		    logErr.error("�����豸ģ�������Ϣʧ��:"+e);
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
	  * ͬ���豸ģ�������Ϣ
	  * �������ͺ�ģ�������Ϣ
	  * ������  true=�ɹ�  false=ʧ��
	*/
	public boolean Update(TerminalModule entity)
    {
		boolean bRet = false;
	    PreparedStatement pre =null;
        String sql = "update TerminalModule set iTerminalId =? ,iModuleId =? ,strModuleFlag =? where id=?";
        Session session = HibernateUtil.getSession();
        Connection dbm = session.connection();
        HibernateUtil.beginTransaction();
        try
        {
           pre = dbm.prepareStatement(sql);
           pre.setInt(1, entity.getTerminalId());
           pre.setInt(2, entity.getModuleId());
           pre.setInt(3, entity.getModuleFlag());
           pre.setInt(4, entity.getId());
           pre.execute();
           HibernateUtil.commitTransaction();
           bRet = true;
        }
        catch (SQLException err)
        {
 	       logErr.error("�����豸ģ�������Ϣʧ��:"+err);
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
    	TerminalModule deleteBean = this.getTerminalModuleByIdNoCache(id);
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
	      logErr.error("ɾ���豸ģ�������Ϣʧ��:"+e);
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
	   * �����豸ģ�����idˢ�»���
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
	      String hql = "from TerminalModule where id=:id"; //�����󶨣�����sqlע��
	      Query query = session.createQuery(hql);
	      query.setInteger("id", id);
	      query.list();
	      bRet = true;
	    }
	    catch (Exception e)
	    {
	      // ��¼��־��ˮ
	      logErr.error("�����豸ģ�����idˢ�»���ʧ��:"+e);
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
 		boolean bRet = HibernateUtil.evictSessionFactoryQueries("TerminalModuleQueries");
 		if (bRet == false)
 		   return false;
 		return HibernateUtil.evictSessionFactory("com.yihuacomputer.cols.entity.TerminalModule");
 	}
 }
