package com.yihuacomputer.cols.database;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.SQLException;
import java.util.List;

import org.apache.log4j.Logger;
import org.hibernate.Query;
import org.hibernate.Session;

import com.yihuacomputer.cols.common.util.HibernateUtil;
import com.yihuacomputer.cols.entity.Terminal;

/**
 * �ն˱�����
 * �����������Թɷ����޹�˾
 * 2016-10-24
 */

public class TerminalDB
{
   public Logger logErr = Logger.getLogger("Error");

   public TerminalDB()
   {
   }

   /**
    * �����ն˱��ȡ�ն���Ϣ</p>
    * ����1���ն˱��
    * �ն˱������Ӧ���ն�
    */
   @SuppressWarnings("rawtypes")
   public Terminal getEntityById(int id)
   {
	 Terminal terminal = null;
     try
     {
       Session session = HibernateUtil.getSession();
       String hql = " from Terminal where id=:id "; //�����󶨣�����sqlע��
       Query query = session.createQuery(hql);
       query.setInteger("id", id);
       //���ò�ѯ����
       query.setCacheable(true);
       query.setCacheRegion("TerminalQueries");

       List TerminalList = query.list();
       if (TerminalList != null && !TerminalList.isEmpty() && TerminalList.size() > 0)
    	   terminal = (Terminal) TerminalList.get(0);
     }
     catch (Exception e)
     {
       // ��¼��־��ˮ
       logErr.error("�����ص�id��ȡ�ն���Ϣʧ��:"+e);
     }
     finally
     {
       HibernateUtil.closeSession();
     }
     return terminal;
   }

   /**
    * �����ն˱��ȡ�ն���Ϣ</p>
    * ����1���ն˱��
    * �ն˱������Ӧ���ն�
    */
   @SuppressWarnings("rawtypes")
   public Terminal getEntityByIdNoCache(int id)
   {
	 Terminal terminal = null;
     try
     {
       Session session = HibernateUtil.getSession();
       String hql = " from Terminal where id=:id "; //�����󶨣�����sqlע��
       Query query = session.createQuery(hql);
       query.setInteger("id", id);
       List TerminalList = query.list();
       if (TerminalList != null && !TerminalList.isEmpty() && TerminalList.size() > 0)
    	   terminal = (Terminal) TerminalList.get(0);
     }
     catch (Exception e)
     {
       // ��¼��־��ˮ
       logErr.error("�����ص�id��ȡ�ն���Ϣʧ��:"+e);
     }
     finally
     {
       HibernateUtil.closeSession();
     }
     return terminal;
   }
   
   /**
    * ��������IP��ַȡ�ն���Ϣ
    * ����1������IP��ַ
    * ����IP��ַ����Ӧ���ն�
   */
   @SuppressWarnings("rawtypes")
   public Terminal getTerminalByNetAddr(String strNetAddr)
   {
	   Terminal term = null;
       try
       {
          Session session = HibernateUtil.getSession();
          String hql = "from Terminal where strNetAddr=:strNetAddr and status=1 "; //�����󶨣�����sqlע��
          Query query = session.createQuery(hql);
          strNetAddr = strNetAddr.replaceAll("'", "");
          query.setString("strNetAddr", strNetAddr);
          List termList = query.list();
          System.out.println("����IP��ѯ��" + strNetAddr + "    " + termList.size());
          if (termList != null && !termList.isEmpty() && termList.size() > 0){
             term = (Terminal) termList.get(0);
          }
        }
        catch (Exception e)
        {
        	e.printStackTrace();
           // ��¼��־��ˮ
    	   logErr.error("��������IP��ַȡ�ն���Ϣʧ��:"+e);
        }
        finally
        {
           HibernateUtil.closeSession();
        }
        return term;
     }
   
   /**
    * ���ݿͻ���MAC��ַȡ�ն���Ϣ
    * ����1���ͻ���MAC��ַ
    * �ͻ���MAC��ַ����Ӧ���ն�
   */
   @SuppressWarnings("rawtypes")
   public Terminal getTerminalByMACAddr(String strMacAddr)
   {
	   Terminal term = null;
       try
       {
          Session session = HibernateUtil.getSession();
          String hql = "from Terminal where strNetAddr=:strNetAddr "; //�����󶨣�����sqlע��
          Query query = session.createQuery(hql);
          strMacAddr = strMacAddr.replaceAll("'", "");
          query.setString("strNetAddr", strMacAddr);
          List termList = query.list();
          System.out.println("����MAC��ѯ��" + strMacAddr + "    " + termList.size());
          if (termList != null && !termList.isEmpty() && termList.size() > 0){
             term = (Terminal) termList.get(0);
          }
        }
        catch (Exception e)
        {
        	e.printStackTrace();
           // ��¼��־��ˮ
    	   logErr.error("��������MAC��ַȡ�ն���Ϣʧ��:"+e);
        }
        finally
        {
           HibernateUtil.closeSession();
        }
        return term;
   }
   
   /**
    * ���ݲ��̶�IP�ƶ�����ʽ�豸��IP  MAC ����ͬһ�ֶ�,IP��MAC��Ψһ�豸��
    * ����1������IP��ַ
    * ����2���ͻ���MAC��ַ
    * �ͻ���MAC��ַ����Ӧ���ն�
    */
   @SuppressWarnings("rawtypes")
   public Terminal getTerminalByNetAddr(String strNetAddr,String strMacAddr)
   {
	   Terminal term = null;
	   try
	   {
		   Session session = HibernateUtil.getSession();
		   String hql = "from Terminal where strNetAddr=:strNetAddr and status=1 "; //�����󶨣�����sqlע��
		   Query query = session.createQuery(hql);
		   strMacAddr = strMacAddr.replaceAll("'", "");
		   System.out.println("strMacAddr:"+strMacAddr);
		   query.setString("strNetAddr",strMacAddr );//����MAC��
		   List termList = query.list();
		   System.out.println("����MAC��:" + termList.size()  + "strMacAddr:" + strMacAddr );
		   if (termList != null && !termList.isEmpty() && termList.size() > 0){
			   term = (Terminal) termList.get(0);
		   }else{
			   query.setString("strNetAddr", strNetAddr);//����IP��
			   termList = query.list();
			   System.out.println("����IP��:" + termList.size() + "strNetAddr" + strNetAddr);
			   if (termList != null && !termList.isEmpty() && termList.size() > 0){
				   term = (Terminal) termList.get(0);
			   }
		   }
	   }
	   catch (Exception e)
	   {
		   e.printStackTrace();
		   // ��¼��־��ˮ
		   logErr.error("��������IP��ַȡ�ն���Ϣʧ��:"+e);
	   }
	   finally
	   {
		   HibernateUtil.closeSession();
	   }
	   return term;
   }

   /**
    * �����ն˱��ȡ�ն���Ϣ</p>
    * ����1���ն˱��
    * �ն˱������Ӧ���ն�
    */
   @SuppressWarnings("rawtypes")
   public Terminal getEntityByTerminal(String strTerminalNum)
   {
	 Terminal terminal = null;
     try
     {
       Session session = HibernateUtil.getSession();
       String hql = " from Terminal where strTerminalNum=:strTerminalNum "; //�����󶨣�����sqlע��
       Query query = session.createQuery(hql);
       query.setString("strTerminalNum", strTerminalNum);
       //���ò�ѯ����
       query.setCacheable(true);
       query.setCacheRegion("TerminalQueries");

       List TerminalList = query.list();
       if (TerminalList != null && !TerminalList.isEmpty() && TerminalList.size() > 0)
    	   terminal = (Terminal) TerminalList.get(0);
     }
     catch (Exception e)
     {
       // ��¼��־��ˮ
       logErr.error("�����ն˱��ȡ�ն���Ϣʧ��:"+e);
     }
     finally
     {
       HibernateUtil.closeSession();
     }
     return terminal;
   }

   /**
    * ͬ���ն���Ϣ
    * �������ն���Ϣ
    * ������  true=�ɹ�  false=ʧ��
   */
   public boolean save(Terminal entity) {
 	  boolean bRet = false;
 	  PreparedStatement pst =null;
 	  Session session = HibernateUtil.getSession();
 	  Connection dbm = session.connection();
 	  HibernateUtil.beginTransaction();
       String sql = "insert into Terminal(id,strTerminalNum,strParentOrgNum,strOrgNum,strNetAddr,strTellerNum,iStatus,strTerminalStyle,strTerminalAddr,strDevSn,iDevType,iDevModel,iDevManu,dtStart,strMemo) values (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)";
       try
       {
           pst = dbm.prepareStatement(sql);
           pst.setInt(1, entity.getId());
           pst.setString(2, entity.getStrTerminalNum());
           pst.setString(3, entity.getStrParentOrgNum());
           pst.setString(4, entity.getStrOrgNum());
           pst.setString(5, entity.getStrNetAddr());
           pst.setString(6, entity.getStrTellerNum());
           pst.setInt(7, entity.getStatus());
           pst.setString(8, entity.getStrTerminalStyle());
           pst.setString(9, entity.getStrTerminalAddr());
           pst.setString(10, entity.getStrDevSn());
           pst.setInt(11, entity.getDevType());
           pst.setInt(12, entity.getDevModel());
           pst.setInt(13, entity.getDevManu());
           pst.setTimestamp(14, entity.getDtStart());
           pst.setString(15, entity.getStrMemo());
           pst.addBatch();
           pst.executeBatch();
           HibernateUtil.commitTransaction();
           bRet = true;
       }
       catch (SQLException e)
       {
 	       // ��¼��־��ˮ
 	       logErr.error("�����ն���Ϣʧ��:"+e);
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
	  * ͬ���ն���Ϣ
	  * �������ն���Ϣ
	  * ������  true=�ɹ�  false=ʧ��
   */
   public boolean Update(Terminal entity)
   {
	   boolean bRet = false;
	   PreparedStatement pre =null;
       String sql = "update Terminal set strTerminalNum =?,strOrgNum =?,strNetAddr =?,strTellerNum =?,iStatus =?,strTerminalStyle =?,strTerminalAddr =?,strDevSn =?,iDevType =?,strParentOrgNum =?,iDevModel =?,iDevManu =?,dtStart =?,dtEnd =?,strMemo =? where id=?";
       Session session = HibernateUtil.getSession();
       Connection dbm = session.connection();
       HibernateUtil.beginTransaction();
       try
       {
           pre = dbm.prepareStatement(sql);
           pre.setString(1, entity.getStrTerminalNum());
           pre.setString(2, entity.getStrOrgNum());
           pre.setString(3, entity.getStrNetAddr());
           pre.setString(4, entity.getStrTellerNum());
           pre.setInt(5, entity.getStatus());
           pre.setString(6, entity.getStrTerminalStyle());
           pre.setString(7, entity.getStrTerminalAddr());
           pre.setString(8, entity.getStrDevSn());
           pre.setInt(9, entity.getDevType());
           pre.setString(10, entity.getStrParentOrgNum());
           pre.setInt(11, entity.getDevModel());
           pre.setInt(12, entity.getDevManu());
           pre.setTimestamp(13, entity.getDtStart());
           pre.setTimestamp(14, entity.getDtEnd());
           pre.setString(15, entity.getStrMemo());
           pre.setInt(16, entity.getId());
           pre.execute();
           HibernateUtil.commitTransaction();
           bRet = true;
        }
        catch (SQLException err)
        {
	       logErr.error("�����ն���Ϣʧ��:"+err);
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
	   Terminal deleteBean = this.getEntityByIdNoCache(id);
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
          logErr.error("ɾ���ն���Ϣʧ��:"+e);
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
      *�����豸Idˢ�»���
      *�������ն�id��
      *��������true=�ɹ� false=ʧ��
   */
   public boolean FlushSession(int id)
   {
        boolean bRet = false;
        try
        {
           Session session = HibernateUtil.getSession();
           String hql = "from Terminal where id=:id"; //�����󶨣�����sqlע��
           Query query = session.createQuery(hql);
           query.setInteger("id", id);
           query.list();
           bRet = true;
        }
        catch (Exception e)
        {
          // ��¼��־��ˮ
          logErr.error("�����豸id��ˢ���ն˻�����Ϣʧ��:"+e);
        }
        finally
        {
           HibernateUtil.closeSession();
        }
        return bRet;
   }

   public boolean FlushSession()
   {
       //��ʧЧ��ѯ���棬��ʧЧ�������棬��֤�����ݿ�������ͬ��
       boolean bRet = HibernateUtil.evictSessionFactoryQueries("TerminalQueries");
       if (bRet == false)
          return false;
       return HibernateUtil.evictSessionFactory("com.yihuacomputer.gump.entity.Terminal");
   }
}
