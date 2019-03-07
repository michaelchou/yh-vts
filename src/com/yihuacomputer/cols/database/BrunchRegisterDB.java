package com.yihuacomputer.cols.database;

import java.util.List;

import org.apache.log4j.Logger;
import org.hibernate.Query;
import org.hibernate.Session;

import com.yihuacomputer.cols.common.util.HibernateUtil;
import com.yihuacomputer.cols.entity.BrunchRegister;
import com.yihuacomputer.cols.service.FlushCache;

/**
 * 转账登记簿表处理类
 * 深圳怡化电脑股份有限公司
 * 2017-06-06
 */
public class BrunchRegisterDB {

	public Logger logErr = Logger.getLogger("Error");

	/**
	   * 取出所有的插入卡号对应的转入行数据</p>
	   * list List  转入行信息
	 * @param bean
	*/

	public List<?> getBrunchRegisterList(BrunchRegister bean)
	{
	    List<?> list = null;
	    try
	    {
	      Session session = HibernateUtil.getSession();
	      String hql =
	              "from BrunchRegister where strPanOut=:strPanOut and strPanInType=:strPanInType order by strBankCode asc"; //参数绑定，避免sql注入
	      Query query = session.createQuery(hql);
	      query.setString("strPanOut", bean.getStrPanOut());
	      query.setString("strPanInType", bean.getStrPanInType());
	      //设置查询缓存
	      query.setCacheable(true);
	      query.setCacheRegion("BrunchRegisterQueries");

	      list = query.list();

	      if (list == null || list.isEmpty())
	    	  list = null;
	    }
	    catch (Exception e)
	    {
	      e.printStackTrace();
	    	// 记录日志流水
		  logErr.error("取常用联系人列表失败:"+e);
	    }
	    finally
	    {
	      HibernateUtil.closeSession();
	    }

	    return list;

	}


	/**
	   * 增加常用联系人数据</p>
	 * @param bean
	*/

	public boolean setBrunchRegisterList(BrunchRegister bean)
	{
		boolean bRet = false;
	    try
	    {
			Session session = HibernateUtil.getSession();
			HibernateUtil.beginTransaction();
	    	session.save(bean);
	        HibernateUtil.commitTransaction();
	        bRet = true;
	    }
	    catch (Exception e)
	    {
		    // 记录日志流水
		    logErr.error("增加常用联系人信息失败:"+e);
		    e.printStackTrace();
	        HibernateUtil.rollbackTransaction();
	        bRet = false;
	    }
	    finally
	    {
	    	HibernateUtil.closeSession();
	    }
	    //因为系统部署在集群环境中，当更新数据时，除了失效本节点的缓存，还需通知其它节点
	    new FlushCache().broadcastFlushSessionAsync("MsgType=RefreshBuf&strTableName=BrunchRegister&strKey=id&strValue="+bean.getId());
	    return bRet;
	}

	/**
	   * 根据常用联系人id刷新缓存
	   * @param id 参数id
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
	      String hql = "from BrunchRegister where id=:id"; //参数绑定，避免sql注入
	      Query query = session.createQuery(hql);
	      query.setInteger("id", id);
	      query.list();
	      bRet = true;
	    }
	    catch (Exception e)
	    {
	      // 记录日志流水
	      logErr.error("根据常用联系人id刷新缓存失败:"+e);
	    }
	    finally
	    {
	      HibernateUtil.closeSession();
	    }
	    return bRet;
	}
}

