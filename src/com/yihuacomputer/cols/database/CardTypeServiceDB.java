package com.yihuacomputer.cols.database;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.List;

import org.apache.log4j.Logger;
import org.hibernate.Query;
import org.hibernate.Session;

import com.yihuacomputer.cols.common.util.HibernateUtil;
import com.yihuacomputer.cols.entity.CardTypeService;
import com.yihuacomputer.cols.service.FlushCache;


/**
 * 卡类型对应的服务表处理类
 * 深圳怡化电脑股份有限公司
 * 2017-04-18
 */
public class CardTypeServiceDB
{
  public Logger logErr = Logger.getLogger("Error");
  public CardTypeServiceDB()
  {
  }

  /**
   * <p>根据卡类型取所对应的服务</p>
   * @param strCardType  卡类型
   */
  @SuppressWarnings("rawtypes")
  public List getCardTypeServiceList(String strCardType)
  {
    List CardTypeService = new ArrayList();
    try
    {
      Session session = HibernateUtil.getSession();
      String hql ="select distinct serviceMenuId from CardTypeService where strCardType=:strCardType";
      Query query = session.createQuery(hql);
      query.setString("strCardType", strCardType);
      //设置查询缓存
      query.setCacheable(true);
      query.setCacheRegion("CardTypeServiceQueries");

      CardTypeService = query.list();
      //未找到
      if (CardTypeService==null||CardTypeService.isEmpty())
        CardTypeService = null;
    }
    catch (Exception e)
    {
      // 记录日志流水
      logErr.error("根据卡类型取所对应的服务失败:"+e);
    }
    finally
    {
      HibernateUtil.closeSession();
    }
    return CardTypeService;
  }

  /**
	* 根据菜单Id删除卡类型对应的所有菜单信息
	* 参数：菜单Id
	* 处理结果  true=成功  false=失败
  */
  public boolean  delete(int serviceMenuId)
  {
	  boolean bRet = false;
      String sql = "delete from CardTypeService where iServiceMenuId=?";
      Session session = HibernateUtil.getSession();
      Connection dbm = session.connection();
      PreparedStatement pre =null;
      try
      {
	      pre = dbm.prepareStatement(sql);
	      pre.setInt(1, serviceMenuId);
	      HibernateUtil.beginTransaction();
	      pre.execute();
	      HibernateUtil.commitTransaction();
	      bRet = true;
      }
      catch (SQLException err)
      {
    	  err.printStackTrace();
          // 记录日志流水
          logErr.error("根据菜单Id删除卡类型对应的所有菜单信息失败:"+err);
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
      if (bRet != true){
	      return false;
      }
      //因为系统部署在集群环境中，当更新数据时，除了失效本节点的缓存，还需通知其它节点
      new FlushCache().broadcastFlushSessionAsync("MsgType=RefreshBuf&strTableName=CardTypeService&strKey=&strValue=");
      return true;
  }
  /**
   * 记录卡类型对应的服务菜单信息
   * 参数1：流水内容
   * 处理结果  true=成功  false=失败
   */
  public boolean save(CardTypeService entity)
  {
	  boolean bRet = false;
	  PreparedStatement pst =null;
	  Session session = HibernateUtil.getSession();
	  Connection dbm = session.connection();
	  HibernateUtil.beginTransaction();
	  String sql = "insert into CardTypeService(id,strCardType,iServiceMenuId) values (?,?,?)";
      try
      {
          pst = dbm.prepareStatement(sql);
          pst.setInt(1, entity.getId());
          pst.setString(2, entity.getStrCardType());
          pst.setString(3, String.valueOf(entity.getServiceMenuId()));
          pst.addBatch();
          pst.executeBatch();
          HibernateUtil.commitTransaction();
          bRet = true;
      }
      catch (SQLException e)
      {
	      // 记录日志流水
	      logErr.error("插入卡类型对应的服务信息失败:"+e);
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
       if (bRet != true){
		      return false;
	   }
	   //因为系统部署在集群环境中，当更新数据时，除了失效本节点的缓存，还需通知其它节点
	   new FlushCache().broadcastFlushSessionAsync("MsgType=RefreshBuf&strTableName=CardTypeService&strKey=&strValue=");
	   return true;
    }
}
