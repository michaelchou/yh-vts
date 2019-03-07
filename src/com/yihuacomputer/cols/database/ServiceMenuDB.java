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
  //服务父菜单
  public static int SERVICEMENUTYPE_PARENTMENU = 0;
  //基本自助服务
  public static int SERVICEMENUTYPE_BASIC = 1;

  /**
	 * 根据ID号取出设备试用信息
	 * 参数1：id号
	 * 返回值：设备试用对象
   */
   @SuppressWarnings("rawtypes")
   public ServiceMenu getServiceInfo(int id) {
	    ServiceMenu serviceMenu = null;
		try {
			Session session = HibernateUtil.getSession();
			String hql = "from ServiceMenu where id=:id";
			Query query = session.createQuery(hql);
			query.setInteger("id", id);
			// 设置查询缓存
			query.setCacheable(true);
			query.setCacheRegion("ServiceMenuQueries");
			List serviceMenuList = query.list();
			if (serviceMenuList != null && !serviceMenuList.isEmpty() && serviceMenuList.size() > 0)
				serviceMenu = (ServiceMenu) serviceMenuList.get(0);
		} catch (Exception e) {
			// 记录日志流水
			logErr.error("取菜单信息失败:"+e);
		} finally {
			HibernateUtil.closeSession();
		}
		return serviceMenu;
	}
   
   /**
    * 根据ID号取出设备试用信息
    * 参数1：id号
    * 返回值：设备试用对象
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
		   // 记录日志流水
		   logErr.error("取菜单信息失败:"+e);
	   } finally {
		   HibernateUtil.closeSession();
	   }
	   return serviceMenu;
   }
  /**
   * 取所有的父菜单及所开通服务的菜单信息</p>
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
      //设置查询缓存
      query.setCacheable(true);
      query.setCacheRegion("ServiceMenuQueries");

      serviceMenu = query.list();
      if (serviceMenu==null||serviceMenu.isEmpty())
    	  serviceMenu = null;
    }
    catch (Exception e)
    {
    	// 记录日志流水
       logErr.error("取服务菜单信息失败:"+e);
    }
    finally
    {
      HibernateUtil.closeSession();
    }
    return serviceMenu;
  }
  /**
   * <p>取自助服务菜单列表</p>
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
      //设置查询缓存
      query.setCacheable(true);
      query.setCacheRegion("ServiceMenuQueries");

      allServiceMenuList = query.list();
      if (allServiceMenuList==null || allServiceMenuList.isEmpty())
    	  allServiceMenuList = null;
    }
    catch (Exception e)
    {
		// 记录日志流水
		logErr.error("取服务菜单列表失败:"+e);
    }
    finally
    {
      HibernateUtil.closeSession();
    }
    return allServiceMenuList;
  }

  /**
   * 同步菜单信息
   * 参数：菜单信息
   * 处理结果  true=成功  false=失败
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
          if(String.valueOf(entity.getServiceMenuId()) != null && String.valueOf(entity.getServiceMenuId()) != "" &&  entity.getServiceMenuId() == 2){//一级菜单
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
	      // 记录日志流水
	      logErr.error("更新菜单信息失败:"+e);
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
	  * 同步菜单信息
	  * 参数：菜单信息
	  * 处理结果  true=成功  false=失败
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
          if(String.valueOf(entity.getServiceMenuId()) != null && String.valueOf(entity.getServiceMenuId()) != "" &&  entity.getServiceMenuId() == 2){//一级菜单
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
	      logErr.error("更改菜单信息失败:"+err);
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
   * 删除数据
   * @param  id : 数据实体的ID号
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
         logErr.error("删除菜单信息失败:"+e);
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
   * 根据菜单id刷新缓存
   * @param id 菜单id
   * @return bRet boolean 处理结果
   * true=成功
   * false=失败
  */
  public boolean FlushSession(int id)
  {
      boolean bRet = false;
      try
      {
         Session session = HibernateUtil.getSession();
         String hql = "from ServiceMenu where id=:id"; //参数绑定，避免sql注入
         Query query = session.createQuery(hql);
         query.setInteger("id", id);
         query.list();
         bRet = true;
      }
      catch (Exception e)
      {
         // 记录日志流水
         logErr.error("根据菜单id刷新缓存失败:"+e);
      }
      finally
      {
         HibernateUtil.closeSession();
      }
      return bRet;
  }
  /**
   *刷新缓存
   */
  public boolean FlushSession()
  {
    //先失效查询缓存，再失效二级缓存，保证与数据库中数据同步
    boolean bRet = HibernateUtil.evictSessionFactoryQueries("ServiceMenuQueries");
    if (bRet == false)
      return false;
    return HibernateUtil.evictSessionFactory("com.yihuacomputer.cols.entity.ServiceMenu");
  }
}
