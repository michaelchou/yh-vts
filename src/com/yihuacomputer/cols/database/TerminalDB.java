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
 * 终端表处理类
 * 深圳怡化电脑股份有限公司
 * 2016-10-24
 */

public class TerminalDB
{
   public Logger logErr = Logger.getLogger("Error");

   public TerminalDB()
   {
   }

   /**
    * 根据终端编号取终端信息</p>
    * 参数1：终端编号
    * 终端编号所对应的终端
    */
   @SuppressWarnings("rawtypes")
   public Terminal getEntityById(int id)
   {
	 Terminal terminal = null;
     try
     {
       Session session = HibernateUtil.getSession();
       String hql = " from Terminal where id=:id "; //参数绑定，避免sql注入
       Query query = session.createQuery(hql);
       query.setInteger("id", id);
       //设置查询缓存
       query.setCacheable(true);
       query.setCacheRegion("TerminalQueries");

       List TerminalList = query.list();
       if (TerminalList != null && !TerminalList.isEmpty() && TerminalList.size() > 0)
    	   terminal = (Terminal) TerminalList.get(0);
     }
     catch (Exception e)
     {
       // 记录日志流水
       logErr.error("根据重点id号取终端信息失败:"+e);
     }
     finally
     {
       HibernateUtil.closeSession();
     }
     return terminal;
   }

   /**
    * 根据终端编号取终端信息</p>
    * 参数1：终端编号
    * 终端编号所对应的终端
    */
   @SuppressWarnings("rawtypes")
   public Terminal getEntityByIdNoCache(int id)
   {
	 Terminal terminal = null;
     try
     {
       Session session = HibernateUtil.getSession();
       String hql = " from Terminal where id=:id "; //参数绑定，避免sql注入
       Query query = session.createQuery(hql);
       query.setInteger("id", id);
       List TerminalList = query.list();
       if (TerminalList != null && !TerminalList.isEmpty() && TerminalList.size() > 0)
    	   terminal = (Terminal) TerminalList.get(0);
     }
     catch (Exception e)
     {
       // 记录日志流水
       logErr.error("根据重点id号取终端信息失败:"+e);
     }
     finally
     {
       HibernateUtil.closeSession();
     }
     return terminal;
   }
   
   /**
    * 根据网络IP地址取终端信息
    * 参数1：网络IP地址
    * 网络IP地址所对应的终端
   */
   @SuppressWarnings("rawtypes")
   public Terminal getTerminalByNetAddr(String strNetAddr)
   {
	   Terminal term = null;
       try
       {
          Session session = HibernateUtil.getSession();
          String hql = "from Terminal where strNetAddr=:strNetAddr and status=1 "; //参数绑定，避免sql注入
          Query query = session.createQuery(hql);
          strNetAddr = strNetAddr.replaceAll("'", "");
          query.setString("strNetAddr", strNetAddr);
          List termList = query.list();
          System.out.println("根据IP查询：" + strNetAddr + "    " + termList.size());
          if (termList != null && !termList.isEmpty() && termList.size() > 0){
             term = (Terminal) termList.get(0);
          }
        }
        catch (Exception e)
        {
        	e.printStackTrace();
           // 记录日志流水
    	   logErr.error("根据网络IP地址取终端信息失败:"+e);
        }
        finally
        {
           HibernateUtil.closeSession();
        }
        return term;
     }
   
   /**
    * 根据客户端MAC地址取终端信息
    * 参数1：客户端MAC地址
    * 客户端MAC地址所对应的终端
   */
   @SuppressWarnings("rawtypes")
   public Terminal getTerminalByMACAddr(String strMacAddr)
   {
	   Terminal term = null;
       try
       {
          Session session = HibernateUtil.getSession();
          String hql = "from Terminal where strNetAddr=:strNetAddr "; //参数绑定，避免sql注入
          Query query = session.createQuery(hql);
          strMacAddr = strMacAddr.replaceAll("'", "");
          query.setString("strNetAddr", strMacAddr);
          List termList = query.list();
          System.out.println("根据MAC查询：" + strMacAddr + "    " + termList.size());
          if (termList != null && !termList.isEmpty() && termList.size() > 0){
             term = (Terminal) termList.get(0);
          }
        }
        catch (Exception e)
        {
        	e.printStackTrace();
           // 记录日志流水
    	   logErr.error("根据网络MAC地址取终端信息失败:"+e);
        }
        finally
        {
           HibernateUtil.closeSession();
        }
        return term;
   }
   
   /**
    * 兼容不固定IP移动离行式设备，IP  MAC 共用同一字段,IP或MAC绑定唯一设备。
    * 参数1：网络IP地址
    * 参数2：客户端MAC地址
    * 客户端MAC地址所对应的终端
    */
   @SuppressWarnings("rawtypes")
   public Terminal getTerminalByNetAddr(String strNetAddr,String strMacAddr)
   {
	   Terminal term = null;
	   try
	   {
		   Session session = HibernateUtil.getSession();
		   String hql = "from Terminal where strNetAddr=:strNetAddr and status=1 "; //参数绑定，避免sql注入
		   Query query = session.createQuery(hql);
		   strMacAddr = strMacAddr.replaceAll("'", "");
		   System.out.println("strMacAddr:"+strMacAddr);
		   query.setString("strNetAddr",strMacAddr );//根据MAC查
		   List termList = query.list();
		   System.out.println("根据MAC查:" + termList.size()  + "strMacAddr:" + strMacAddr );
		   if (termList != null && !termList.isEmpty() && termList.size() > 0){
			   term = (Terminal) termList.get(0);
		   }else{
			   query.setString("strNetAddr", strNetAddr);//根据IP查
			   termList = query.list();
			   System.out.println("根据IP查:" + termList.size() + "strNetAddr" + strNetAddr);
			   if (termList != null && !termList.isEmpty() && termList.size() > 0){
				   term = (Terminal) termList.get(0);
			   }
		   }
	   }
	   catch (Exception e)
	   {
		   e.printStackTrace();
		   // 记录日志流水
		   logErr.error("根据网络IP地址取终端信息失败:"+e);
	   }
	   finally
	   {
		   HibernateUtil.closeSession();
	   }
	   return term;
   }

   /**
    * 根据终端编号取终端信息</p>
    * 参数1：终端编号
    * 终端编号所对应的终端
    */
   @SuppressWarnings("rawtypes")
   public Terminal getEntityByTerminal(String strTerminalNum)
   {
	 Terminal terminal = null;
     try
     {
       Session session = HibernateUtil.getSession();
       String hql = " from Terminal where strTerminalNum=:strTerminalNum "; //参数绑定，避免sql注入
       Query query = session.createQuery(hql);
       query.setString("strTerminalNum", strTerminalNum);
       //设置查询缓存
       query.setCacheable(true);
       query.setCacheRegion("TerminalQueries");

       List TerminalList = query.list();
       if (TerminalList != null && !TerminalList.isEmpty() && TerminalList.size() > 0)
    	   terminal = (Terminal) TerminalList.get(0);
     }
     catch (Exception e)
     {
       // 记录日志流水
       logErr.error("根据终端编号取终端信息失败:"+e);
     }
     finally
     {
       HibernateUtil.closeSession();
     }
     return terminal;
   }

   /**
    * 同步终端信息
    * 参数：终端信息
    * 处理结果  true=成功  false=失败
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
 	       // 记录日志流水
 	       logErr.error("更新终端信息失败:"+e);
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
	  * 同步终端信息
	  * 参数：终端信息
	  * 处理结果  true=成功  false=失败
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
	       logErr.error("更改终端信息失败:"+err);
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
          logErr.error("删除终端信息失败:"+e);
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
      *根据设备Id刷新缓存
      *参数：终端id号
      *处理结果：true=成功 false=失败
   */
   public boolean FlushSession(int id)
   {
        boolean bRet = false;
        try
        {
           Session session = HibernateUtil.getSession();
           String hql = "from Terminal where id=:id"; //参数绑定，避免sql注入
           Query query = session.createQuery(hql);
           query.setInteger("id", id);
           query.list();
           bRet = true;
        }
        catch (Exception e)
        {
          // 记录日志流水
          logErr.error("根据设备id号刷新终端缓存信息失败:"+e);
        }
        finally
        {
           HibernateUtil.closeSession();
        }
        return bRet;
   }

   public boolean FlushSession()
   {
       //先失效查询缓存，再失效二级缓存，保证与数据库中数据同步
       boolean bRet = HibernateUtil.evictSessionFactoryQueries("TerminalQueries");
       if (bRet == false)
          return false;
       return HibernateUtil.evictSessionFactory("com.yihuacomputer.gump.entity.Terminal");
   }
}
