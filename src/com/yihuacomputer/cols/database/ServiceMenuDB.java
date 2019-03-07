package com.yihuacomputer.cols.database;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.SQLException;
import java.util.List;

import org.apache.log4j.Logger;
import org.hibernate.Query;
import org.hibernate.Session;

import com.yihuacomputer.cols.common.util.HibernateUtil;
import com.yihuacomputer.cols.entity.ServiceMenu;

public class ServiceMenuDB
{
  public Logger logErr = Logger.getLogger("Error");
  //���񸸲˵�
  public static int SERVICEMENUTYPE_PARENTMENU = 0;
  //������������
  public static int SERVICEMENUTYPE_BASIC = 1;

  /**
	 * ����ID��ȡ���豸������Ϣ
	 * ����1��id��
	 * ����ֵ���豸���ö���
   */
   @SuppressWarnings("rawtypes")
   public ServiceMenu getServiceInfo(int id) {
	    ServiceMenu serviceMenu = null;
		try {
			Session session = HibernateUtil.getSession();
			String hql = "from ServiceMenu where id=:id";
			Query query = session.createQuery(hql);
			query.setInteger("id", id);
			// ���ò�ѯ����
			query.setCacheable(true);
			query.setCacheRegion("ServiceMenuQueries");
			List serviceMenuList = query.list();
			if (serviceMenuList != null && !serviceMenuList.isEmpty() && serviceMenuList.size() > 0)
				serviceMenu = (ServiceMenu) serviceMenuList.get(0);
		} catch (Exception e) {
			// ��¼��־��ˮ
			logErr.error("ȡ�˵���Ϣʧ��:"+e);
		} finally {
			HibernateUtil.closeSession();
		}
		return serviceMenu;
	}
   
   /**
    * ����ID��ȡ���豸������Ϣ
    * ����1��id��
    * ����ֵ���豸���ö���
    */
   @SuppressWarnings("rawtypes")
   public ServiceMenu getServiceInfoNoCache(int id) {
	   ServiceMenu serviceMenu = null;
	   try {
		   Session session = HibernateUtil.getSession();
		   String hql = "from ServiceMenu where id=:id";
		   Query query = session.createQuery(hql);
		   query.setInteger("id", id);
		   List serviceMenuList = query.list();
		   if (serviceMenuList != null && !serviceMenuList.isEmpty() && serviceMenuList.size() > 0)
			   serviceMenu = (ServiceMenu) serviceMenuList.get(0);
	   } catch (Exception e) {
		   // ��¼��־��ˮ
		   logErr.error("ȡ�˵���Ϣʧ��:"+e);
	   } finally {
		   HibernateUtil.closeSession();
	   }
	   return serviceMenu;
   }
  /**
   * ȡ���еĸ��˵�������ͨ����Ĳ˵���Ϣ</p>
  */
  @SuppressWarnings("rawtypes")
  public List getServiceMenuList(List serviceMenuIdList,String strCardType)
  {
    List serviceMenu = null;
    try
    {
      Session session = HibernateUtil.getSession();
      String hql = "from ServiceMenu where (serviceMenuId in (:serviceMenuIdList))  and strCardType=:strCardType order by serviceMenuId ";
      Query query = session.createQuery(hql);
      query.setParameterList("serviceMenuIdList", serviceMenuIdList);
      query.setString("strCardType", strCardType);
      //���ò�ѯ����
      query.setCacheable(true);
      query.setCacheRegion("ServiceMenuQueries");

      serviceMenu = query.list();
      if (serviceMenu==null||serviceMenu.isEmpty())
    	  serviceMenu = null;
    }
    catch (Exception e)
    {
    	// ��¼��־��ˮ
       logErr.error("ȡ����˵���Ϣʧ��:"+e);
    }
    finally
    {
      HibernateUtil.closeSession();
    }
    return serviceMenu;
  }
  /**
   * <p>ȡ��������˵��б�</p>
  */
  @SuppressWarnings("rawtypes")
  public List getAllServiceMenuList()
  {
    List allServiceMenuList = null;
    try
    {
      Session session = HibernateUtil.getSession();
      String hql = "select id from ServiceMenu order by id";
      Query query = session.createQuery(hql);
//      query.setInteger("ServiceMenuType", SERVICEMENUTYPE_BASIC);
      //���ò�ѯ����
      query.setCacheable(true);
      query.setCacheRegion("ServiceMenuQueries");

      allServiceMenuList = query.list();
      if (allServiceMenuList==null || allServiceMenuList.isEmpty())
    	  allServiceMenuList = null;
    }
    catch (Exception e)
    {
		// ��¼��־��ˮ
		logErr.error("ȡ����˵��б�ʧ��:"+e);
    }
    finally
    {
      HibernateUtil.closeSession();
    }
    return allServiceMenuList;
  }

  /**
   * ͬ���˵���Ϣ
   * �������˵���Ϣ
   * ������  true=�ɹ�  false=ʧ��
  */
  public boolean save(ServiceMenu entity) {
	  boolean bRet = false;
	  PreparedStatement pst =null;
	  Session session = HibernateUtil.getSession();
	  Connection dbm = session.connection();
	  HibernateUtil.beginTransaction();
      String sql = "insert into ServiceMenu(id,iServiceMenuId,strServiceMenuName,strServiceMenuNameEn,iBtnPos,iServiceMenuType,strServiceMenuAction,strOrgNum,strCardType) values (?,?,?,?,?,?,?,?,?)";
      try
      {
          pst = dbm.prepareStatement(sql);
          pst.setInt(1, entity.getId());
          if(String.valueOf(entity.getServiceMenuId()) != null && String.valueOf(entity.getServiceMenuId()) != "" &&  entity.getServiceMenuId() == 2){//һ���˵�
        	  pst.setInt(2, entity.getId());
          }
          else{
        	  pst.setInt(2, entity.getServiceMenuId());
          }
          pst.setString(3, entity.getStrServiceMenuName());
          pst.setString(4, entity.getStrServiceMenuNameEn());
          pst.setInt(5, entity.getBtnPos());
          if(entity.getStrServiceMenuAction() != null && !entity.getStrServiceMenuAction().equals("") && entity.getStrServiceMenuAction().equals("N/A")){
        	  pst.setInt(6, 0);
          }else{
        	  pst.setInt(6, 1);
          }
          pst.setString(7, entity.getStrServiceMenuAction());
          pst.setString(8, entity.getStrOrgNum());
          pst.setString(9, entity.getStrCardType());
          pst.addBatch();
          pst.executeBatch();
          HibernateUtil.commitTransaction();
          bRet = true;
      }
      catch (SQLException e)
      {
	      // ��¼��־��ˮ
	      logErr.error("���²˵���Ϣʧ��:"+e);
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
	  * ͬ���˵���Ϣ
	  * �������˵���Ϣ
	  * ������  true=�ɹ�  false=ʧ��
   */
   public boolean Update(ServiceMenu entity)
   {
	   boolean bRet = false;
	   PreparedStatement pre =null;
       String sql = "update ServiceMenu set iServiceMenuId =?,strServiceMenuName =?,strServiceMenuNameEn =?,iBtnPos =?,iServiceMenuType =?,strServiceMenuAction =?,strOrgNum =?,strOrgNum =? where id=?";
       Session session = HibernateUtil.getSession();
       Connection dbm = session.connection();
       HibernateUtil.beginTransaction();
       try
       {
          pre = dbm.prepareStatement(sql);
          if(String.valueOf(entity.getServiceMenuId()) != null && String.valueOf(entity.getServiceMenuId()) != "" &&  entity.getServiceMenuId() == 2){//һ���˵�
        	  pre.setInt(1, entity.getId());
          }
          else{
        	  pre.setInt(1, entity.getServiceMenuId());
          }
          pre.setString(2, entity.getStrServiceMenuName());
          pre.setString(3, entity.getStrServiceMenuNameEn());
          pre.setInt(4, entity.getBtnPos());
          if(entity.getStrServiceMenuAction() != null && !entity.getStrServiceMenuAction().equals("") && entity.getStrServiceMenuAction().equals("N/A")){
        	  pre.setInt(5, 0);
          }else{
        	  pre.setInt(5, 1);
          }
          pre.setString(6, entity.getStrServiceMenuAction());
          pre.setString(7, entity.getStrOrgNum());
          pre.setString(8, entity.getStrCardType());
          pre.setInt(9, entity.getId());
          pre.execute();
          HibernateUtil.commitTransaction();
          bRet = true;
       }
       catch (SQLException err)
       {
	      logErr.error("���Ĳ˵���Ϣʧ��:"+err);
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
	  ServiceMenu deleteBean = this.getServiceInfoNoCache(id);
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
         logErr.error("ɾ���˵���Ϣʧ��:"+e);
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
   * ���ݲ˵�idˢ�»���
   * @param id �˵�id
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
         String hql = "from ServiceMenu where id=:id"; //�����󶨣�����sqlע��
         Query query = session.createQuery(hql);
         query.setInteger("id", id);
         query.list();
         bRet = true;
      }
      catch (Exception e)
      {
         // ��¼��־��ˮ
         logErr.error("���ݲ˵�idˢ�»���ʧ��:"+e);
      }
      finally
      {
         HibernateUtil.closeSession();
      }
      return bRet;
  }
  /**
   *ˢ�»���
   */
  public boolean FlushSession()
  {
    //��ʧЧ��ѯ���棬��ʧЧ�������棬��֤�����ݿ�������ͬ��
    boolean bRet = HibernateUtil.evictSessionFactoryQueries("ServiceMenuQueries");
    if (bRet == false)
      return false;
    return HibernateUtil.evictSessionFactory("com.yihuacomputer.cols.entity.ServiceMenu");
  }
}
