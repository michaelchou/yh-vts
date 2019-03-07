package com.yihuacomputer.cols.database;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.SQLException;
import java.util.List;

import org.apache.log4j.Logger;
import org.hibernate.Query;
import org.hibernate.Session;

import com.yihuacomputer.cols.common.util.HibernateUtil;
import com.yihuacomputer.cols.entity.BranchMap;
import com.yihuacomputer.cols.entity.BrunchRegister;
import com.yihuacomputer.cols.service.FlushCache;

/**
 *跨行转账转出卡行号表处理类
 * 深圳怡化电脑股份有限公司
 * 2017-07-13
 */

public class BranchMapDB {

	public Logger logErr = Logger.getLogger("Error");
	public static final int MAXRS_PERBTACH = 20000;//每次插入数据库的条数

	/**
	 * 删除数据
	 */
	public boolean delete() {
		boolean ret = false;
	    String sql = "delete from BranchMap";
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
	    	logErr.error("删除跨行转账转出卡行号表信息失败:"+err.getMessage());
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
		String sql="insert into BranchMap(strLocalRouteCode,strLocalBankCode) values (?,?)";
	    try {
	    	pst = dbm.prepareStatement(sql);
	        if (list !=null && list.size() > 0)
	        {
	          for (int i = 0; i < list.size(); i++)
	          {
	        	  pst.setString(1, ((BranchMap)(list.get(i))).getStrLocalRouteCode());
	  	          pst.setString(2, ((BranchMap)(list.get(i))).getStrLocalBankCode());
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
	    	logErr.error("批处理跨行转账转出卡行号表信息失败:"+err.getMessage());
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
	    new FlushCache().broadcastFlushSessionAsync("MsgType=RefreshBuf&strTableName=BranchMap&strKey=&strValue=");
	    return bRet;
	}

	/**
	   * 取出转出卡行号对应的网点号数据</p>
	   * list List  转出行网点信息
	 * @param bean
	*/

	public List<?> getBranchMapNoList(BranchMap bean)
	{
	    List<?> list = null;
	    try
	    {
	      Session session = HibernateUtil.getSession();
	      String hql =
	              "from BranchMap where strLocalRouteCode=:strLocalRouteCode order by strLocalRouteCode asc"; //参数绑定，避免sql注入
	      Query query = session.createQuery(hql);
	      //System.out.println(">>>>>>>>>>>>>>>查询：" + bean.getStrLocalRouteCode());
	      query.setString("strLocalRouteCode", bean.getStrLocalRouteCode());

	      //设置查询缓存
	      query.setCacheable(true);
	      query.setCacheRegion("BranchMapQueries");

	      list = query.list();

	      if (list == null || list.isEmpty())
	    	  list = null;
	    }
	    catch (Exception e)
	    {
	      e.printStackTrace();
	    	// 记录日志流水
		  logErr.error("取开卡行网点号失败:"+e);
	    }
	    finally
	    {
	      HibernateUtil.closeSession();
	    }

	    return list;
	}

	/**
	 * 刷新缓存
	 */
	public boolean FlushSession() {
		// 先失效查询缓存，再失效二级缓存，保证与数据库中数据同步
		boolean bRet = HibernateUtil.evictSessionFactoryQueries("BranchMapQueries");
		if (bRet == false)
			return false;
		return HibernateUtil.evictSessionFactory("com.yihuacomputer.gump.entity.BranchMap");
	}
}
