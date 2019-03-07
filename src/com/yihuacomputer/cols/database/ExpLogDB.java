package com.yihuacomputer.cols.database;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.SQLException;
import java.util.List;

import org.apache.log4j.Logger;
import org.hibernate.Query;
import org.hibernate.Session;

import com.yihuacomputer.cols.common.util.HibernateUtil;
import com.yihuacomputer.cols.entity.ExpLog;

/**
 * �쳣���������
 * �����������Թɷ����޹�˾
 * 2017-06-12
 */

public class ExpLogDB
{
	public Logger logErr = Logger.getLogger("Error");

    public ExpLogDB()
    {
    }


   /**
    * ��¼���׹����г��ֵ��쳣</p>
    * ����1��tl   ��ˮ����
    * ����ֵ: bRet boolean ������  true=�ɹ�  false=ʧ��
    */
   public boolean save(ExpLog tl)
   {
      boolean bRet = false;
      try
      {
         Session session = HibernateUtil.getSession();
         HibernateUtil.beginTransaction();
         session.save(tl);
         HibernateUtil.commitTransaction();
         bRet = true;
      }
      catch (Exception e)
      {
        // ��¼��־��ˮ
        logErr.error("�����쳣��Ϣʧ��:"+e);
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
	   * �����ն˱��,�쳣�������ѯ�쳣�����¼</p>
	   * strTerminalNum String  //�ն˱��
	   * strExpCode String �쳣������
	   * list List  �쳣�����¼
	*/
	public List<?> getList(String strTerminalNum, String strExpCode)
	{
	    List<?> list = null;
	    try
	    {
	      Session session = HibernateUtil.getSession();
	      String hql =
	              "from ExpLog where strTerminalNum = :strTerminalNum and strExpCode=:strExpCode order by dtOccur "; //�����󶨣�����sqlע��
	      Query query = session.createQuery(hql);
	      query.setString("strTerminalNum", strTerminalNum );
	      query.setString("strExpCode", strExpCode);
	      //���ò�ѯ����
	     

	      list = query.list();
	      if (list == null || list.isEmpty())
	    	  list = null;
	    }
	    catch (Exception e)
	    {
	      // ��¼��־��ˮ
		  logErr.error("ȡ�쳣�б�ʧ��:"+e);
	    }
	    finally
	    {
	      HibernateUtil.closeSession();
	    }
	    return list;
	}
	
	  /**
	   * �����ն˱��,�쳣�������ѯ�쳣�����¼</p>
	   * strTerminalNum String  //�ն˱��
	   *
	   * list List  �쳣�����¼
	*/
	public List<?> getCardList(String strTerminalNum)
	{
	    List<?> list = null;
	    try
	    {
	      Session session = HibernateUtil.getSession();
	      String hql =
	              "from ExpLog where strTerminalNum = :strTerminalNum and strExpCode in ('Exp01001','Exp01002')  order by dtOccur "; //�����󶨣�����sqlע��
	      Query query = session.createQuery(hql);
	      query.setString("strTerminalNum", strTerminalNum );

	
	      //���ò�ѯ����
	     

	      list = query.list();
	      if (list == null || list.isEmpty())
	    	  list = null;
	    }
	    catch (Exception e)
	    {
	      // ��¼��־��ˮ
	    	e.printStackTrace();
		  logErr.error("ȡ�쳣�б�ʧ��:"+e);
	    }
	    finally
	    {
	      HibernateUtil.closeSession();
	    }
	    return list;
	}
	
	public List<?> getDispenserCardList(String strTerminalNum)
	{
	    List<?> list = null;
	    try
	    {
	      Session session = HibernateUtil.getSession();
	      String hql =
	              "from ExpLog where strTerminalNum = :strTerminalNum and strExpCode = 'Exp01002'  order by dtOccur "; //�����󶨣�����sqlע��
	      Query query = session.createQuery(hql);
	      query.setString("strTerminalNum", strTerminalNum );

	
	      //���ò�ѯ����
	     

	      list = query.list();
	      if (list == null || list.isEmpty())
	    	  list = null;
	    }
	    catch (Exception e)
	    {
	      // ��¼��־��ˮ
	    	e.printStackTrace();
		  logErr.error("ȡ�쳣�б�ʧ��:"+e);
	    }
	    finally
	    {
	      HibernateUtil.closeSession();
	    }
	    return list;
	}
	
	public List<?> getDispenserKeyList(String strTerminalNum)
	{
	    List<?> list = null;
	    try
	    {
	      Session session = HibernateUtil.getSession();
	      String hql =
	              "from ExpLog where strTerminalNum = :strTerminalNum and strExpCode = 'Exp01003'  order by dtOccur "; //�����󶨣�����sqlע��
	      Query query = session.createQuery(hql);
	      query.setString("strTerminalNum", strTerminalNum );

	
	      //���ò�ѯ����
	     

	      list = query.list();
	      if (list == null || list.isEmpty())
	    	  list = null;
	    }
	    catch (Exception e)
	    {
	      // ��¼��־��ˮ
	    	e.printStackTrace();
		  logErr.error("ȡ�쳣�б�ʧ��:"+e);
	    }
	    finally
	    {
	      HibernateUtil.closeSession();
	    }
	    return list;
	}
	
	  /**
	   * �����ն˱��,ɾ���̿���ϸ��¼</p>
	   * strTerminalNum String  //�ն˱��
	   *
	*/
	public boolean  removeCardExpLog(String strTerminalNum)
 {
		boolean ret = false;
	    String sql = "delete from ExpLog where strTerminalNum=? and strExpCode in ('Exp01001','Exp01002') ";
	    Session session = HibernateUtil.getSession();
	    Connection dbm = session.connection();
		HibernateUtil.beginTransaction();
	    try
	    {
	      PreparedStatement pre = dbm.prepareStatement(sql);
	      pre.setString(1, strTerminalNum);
	      pre.execute();
	      HibernateUtil.commitTransaction();
	      ret = true;
	    }
	    catch (SQLException err)
	    {
	    	logErr.error("ɾ���̿���ϸ��¼ʧ��:"+err.getMessage());
	        HibernateUtil.rollbackTransaction();
	        ret = false;
	    }
	    finally
	    {
	    	HibernateUtil.closeSession();
	    }
	    return ret;
	}
	
	  /**
	   * �����ն˱��,ɾ����UKEY��ϸ��¼</p>
	   * strTerminalNum String  //�ն˱��
	   *
	*/
	public boolean  removeUkeyExpLog(String strTerminalNum)
{
		boolean ret = false;
	    String sql = "delete from ExpLog where strTerminalNum=? and strExpCode in ('Exp01003') ";
	    Session session = HibernateUtil.getSession();
	    Connection dbm = session.connection();
		HibernateUtil.beginTransaction();
	    try
	    {
	      PreparedStatement pre = dbm.prepareStatement(sql);
	      pre.setString(1, strTerminalNum);
	      pre.execute();
	      HibernateUtil.commitTransaction();
	      ret = true;
	    }
	    catch (SQLException err)
	    {
	    	logErr.error("ɾ����UKEY��ϸ��¼ʧ��:"+err.getMessage());
	        HibernateUtil.rollbackTransaction();
	        ret = false;
	    }
	    finally
	    {
	    	HibernateUtil.closeSession();
	    }
	    return ret;
	}
}
