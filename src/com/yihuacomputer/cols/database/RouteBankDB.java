package com.yihuacomputer.cols.database;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.SQLException;
import java.util.List;

import org.apache.log4j.Logger;
import org.hibernate.Query;
import org.hibernate.Session;

import com.yihuacomputer.cols.common.util.HibernateUtil;
import com.yihuacomputer.cols.entity.RouteBank;
import com.yihuacomputer.cols.service.FlushCache;

/**
 * 转账汇路行表处理类
 * 深圳怡化电脑股份有限公司
 * 2017-05-25
 */

public class RouteBankDB {

	public Logger logErr = Logger.getLogger("Error");
	public static final int MAXRS_PERBTACH = 20000;//每次插入数据库的条数
	/**
	   * 取出所有的转账汇路行数据</p>
	   * list List  参数信息
	*/
	public List<?> getRouteBankList(RouteBank bean)
	{
	    List<?> list = null;
	    try
	    {
	      Session session = HibernateUtil.getSession();
	      String hql =
	              "from RouteBank where strBankTypeCode=:strBankCode and strCCPCCode=:strCCPCCode order by strBankName asc"; //参数绑定，避免sql注入
	      Query query = session.createQuery(hql);
	      query.setString("strBankCode", bean.getStrBankTypeCode());
	      query.setString("strCCPCCode", bean.getStrCCPCCode());
	      //设置查询缓存
	      query.setCacheable(true);
	      query.setCacheRegion("RouteBankQueries");

	      list = query.list();
	      if (list == null || list.isEmpty())
	    	  list = null;
	    }
	    catch (Exception e)
	    {
	      // 记录日志流水
		  logErr.error("取转账汇路行列表失败:"+e);
	    }
	    finally
	    {
	      HibernateUtil.closeSession();
	    }
	    return list;
	}


	/**
	 * 删除数据
	 */
	public boolean delete() {
		boolean ret = false;
	    String sql = "delete from RouteBank";
	    Session session = HibernateUtil.getSession();
	    Connection dbm = session.connection();
		HibernateUtil.beginTransaction();
	    try
	    {
	       PreparedStatement pre = dbm.prepareStatement(sql);
	       pre.execute();
	       HibernateUtil.commitTransaction();
	       ret = true;
	    }
	    catch (SQLException err)
	    {
	    	logErr.error("删除转账汇路信息失败:"+err.getMessage());
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
	 *  添加新数据
	*/
	public boolean insert(List<?> list) {
		boolean bRet = false;
		PreparedStatement pst =null;
		Session session = HibernateUtil.getSession();
		Connection dbm = session.connection();
		HibernateUtil.beginTransaction();
		String sql="insert into RouteBank(strRouteCode,strBankCode,strBankName,strBankType,strBankTypeCode,strSettleBankCode,strCCPCCode,strSizeMark) values (?,?,?,?,?,?,?,?)";
	    try {
	    	pst = dbm.prepareStatement(sql);
	        if (list !=null && list.size() > 0)
	        {
	          for (int i = 0; i < list.size(); i++)
	          {
	        	  pst.setString(1, ((RouteBank)(list.get(i))).getStrRouteCode());
	  	          pst.setString(2, ((RouteBank)(list.get(i))).getStrBankCode());
	  	          pst.setString(3, ((RouteBank)(list.get(i))).getStrBankName());
	  	          pst.setString(4, ((RouteBank)(list.get(i))).getStrBankType());
	  	          pst.setString(5, ((RouteBank)(list.get(i))).getStrBankTypeCode());
	  	          pst.setString(6, ((RouteBank)(list.get(i))).getStrSettleBankCode());
	  	          pst.setString(7, ((RouteBank)(list.get(i))).getStrCCPCCode());
	  	          pst.setString(8, ((RouteBank)(list.get(i))).getStrSizeMark());
	  	          pst.addBatch();
	        	  if (i > 0 && i % MAXRS_PERBTACH == 0)
	       		  {
	        		  pst.executeBatch();
	        		  HibernateUtil.commitTransaction();
	       	      }
	          }
	        }
	        pst.executeBatch();
	        HibernateUtil.commitTransaction();
	        bRet = true;
	    }catch(SQLException err) {
	    	logErr.error("批处理转账汇路信息失败:"+err.getMessage());
	        HibernateUtil.rollbackTransaction();
	        bRet = false;
	    }finally {
	    	try{
				if(pst!=null){
					pst.close();
			    }
			}catch(Exception e){
			}
	    	HibernateUtil.closeSession();
	    }
	    //因为系统部署在集群环境中，当更新数据时，除了失效本节点的缓存，还需通知其它节点
	    new FlushCache().broadcastFlushSessionAsync("MsgType=RefreshBuf&strTableName=RouteBank&strKey=&strValue=");
	    return bRet;
	}

	/**
	 * 刷新缓存
	 */
	public boolean FlushSession() {
		// 先失效查询缓存，再失效二级缓存，保证与数据库中数据同步
		boolean bRet = HibernateUtil.evictSessionFactoryQueries("RouteBankQueries");
		if (bRet == false)
			return false;
		return HibernateUtil.evictSessionFactory("com.yihuacomputer.gump.entity.RouteBank");
	}
}
