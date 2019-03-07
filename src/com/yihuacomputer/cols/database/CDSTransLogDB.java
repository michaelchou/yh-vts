package com.yihuacomputer.cols.database;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.SQLException;
import java.util.List;

import org.apache.log4j.Logger;
import org.hibernate.Query;
import org.hibernate.Session;

import com.yihuacomputer.cols.common.util.HibernateUtil;
import com.yihuacomputer.cols.entity.CDSSettleCycleLog;
import com.yihuacomputer.cols.entity.CDSTransLog;

/**
 * 存单交易流水表
 * 深圳怡化电脑股份有限公司
 * 2017-05-05
 */
public class CDSTransLogDB
{
    public Logger logErr = Logger.getLogger("Error");

    public CDSTransLogDB()
    {
    }

    /**
     * 记录开卡交易流水
     * 参数1：流水内容
     * 处理结果  true=成功  false=失败
    */
    public boolean save(CDSTransLog entity)
    {
      boolean bRet = false;
      try
      {
        Session session = HibernateUtil.getSession();
        HibernateUtil.beginTransaction();
        session.save(entity);
        HibernateUtil.commitTransaction();
        bRet = true;
      }
      catch (Exception e)
      {
	    // 记录日志流水
        logErr.error("插入存单交易流水失败:"+e.getMessage());
        HibernateUtil.rollbackTransaction();
      }
      finally
      {
        HibernateUtil.closeSession();
      }
      return bRet;
    }

	/**
     * 根据终端编号,是否受理成功,参数所有存单箱信息</p>
     * strTerminalNum String 终端编号
     * strSuccessful                是否成功true/false
     * list List  受理存单交易信息
	*/
	public List<?> getAcceptedCDSList(String strTerminalNum,String strSuccessful)
	{
	    List<?> list = null;
	    CDSSettleCycleLogDB cdsSettleCycleLogDB = new CDSSettleCycleLogDB();
		CDSSettleCycleLog  entity = cdsSettleCycleLogDB.getCurBatchNoEntity(strTerminalNum, 0);//0位未清存单状态
		if(entity==null)
			return null;


	    try
	    {
	      Session session = HibernateUtil.getSession();
	      String hql ="from CDSTransLog where strTerminalNum=:strTerminalNum and termBatchNo=:termBatchNo and settleCycleStatus=0" ;
	      		if(strSuccessful.equals("true")){
	      			//机具发放成功：存单开户 + 存单续存开户（交易成功，凭证成功  ）  +部提开户（交易成功，凭证成功）
	      			//机具受理成功：存单销户（交易成功）  + 存单续存销户（交易成功） + 存单部提（交易成功但是凭证失败，核心返回HX00BF）
	      			hql+="and("
	      				+ "(iHostTxStatus=0 and iTermTxStatus=1 and transCode=905107)"  //开户交易及凭证均成功
	      				+ "or (iHostTxStatus=0 and transCode in ('905104','905103'))" //销户交易成功或部提交易成功
	      				+ "or (iHostTxStatus=1 and strHostRetCode='HX00BF')" //部提成功，配单失败
	      				+ ")";//主机和终端状态都为成功
	      			//hql+=" and transCode in ('905107','905104','905104') ";//存单开户、存单销户、部提开户、续存开户、部提销户、续存销户
	      		}else
	      		if(strSuccessful.equals("false")){
	      				//机具发放失败：存单开户 + 存单续存开户(交易失败或凭证失败)  + 部提开户（交易成功，凭证失败）
	      			    //机具受理失败：存单销户（交易失败）  + 存单续存销户（交易失败） + 存单部提（交易失败，且返回码不是HX00BF）
	          			hql+="and ("
	          			   + "(iHostTxStatus!=0 and transCode=905104)"  //销户交易失败
	          			   + "or ((iHostTxStatus!=0 or iTermTxStatus!=1) and transCode=905107)" //开户交易或凭证失败
	          			   + "or (iHostTxStatus=0 and iTermTxStatus!=1 and transCode=905103)"  //部提交易成功，凭证失败
	          			   + "or (iHostTxStatus!=0 and transCode=905103)"  //部提交易失败
	          			   + ")";
	          			//hql+=" and transCode in ('905104','905107','905104') ";//存单开户、存单销户、部提开户、续存开户、部提销户、续存销户
	        	}
	       		hql+=" order by dtOccur asc"; //参数绑定，避免sql注入

	      Query query = session.createQuery(hql);
	      query.setString("strTerminalNum", strTerminalNum);
	      query.setInteger("termBatchNo", entity.getTermBatchNo());

	      list = query.list();
	      if (list == null || list.isEmpty())
	    	  list = null;
	    }
	    catch (Exception e)
	    {
	      // 记录日志流水
		  logErr.error("取受理存单交易信息失败:"+e);
	    }
	    finally
	    {
	      HibernateUtil.closeSession();
	    }
	    return list;
	}

	/**
     * 根据终端编号,查询本批次所有存单箱信息</p>
     * strTerminalNum String 终端编号
     *
     * list List  本批次所有受理存单交易信息
	*/
	public List<?> getCDSBatchList(String strTerminalNum)
	{
	    List<?> list = null;
	    CDSSettleCycleLogDB cdsSettleCycleLogDB = new CDSSettleCycleLogDB();
		CDSSettleCycleLog  entity = cdsSettleCycleLogDB.getCurBatchNoEntity(strTerminalNum, 0);//0位未清存单状态
		if(entity==null)
			return null;


	    try
	    {
	      Session session = HibernateUtil.getSession();
	      String hql ="from CDSTransLog where strTerminalNum=:strTerminalNum and termBatchNo=:termBatchNo " ;
	      	  		hql+=" order by dtOccur asc"; //参数绑定，避免sql注入

	      Query query = session.createQuery(hql);
	      query.setString("strTerminalNum", strTerminalNum);
	      query.setInteger("termBatchNo", entity.getTermBatchNo());

	      list = query.list();
	      if (list == null || list.isEmpty())
	    	  list = null;
	    }
	    catch (Exception e)
	    {
	      // 记录日志流水
		  logErr.error("取受理存单交易信息失败:"+e);
	    }
	    finally
	    {
	      HibernateUtil.closeSession();
	    }
	    return list;
	}

	/**
	 * 更新存单开户交易流水
	 * @return bRet boolean 处理结果 true=成功 false=失败
   */
	public boolean update(CDSTransLog entity) {
		boolean bRet = false;
		try {

			Session session = HibernateUtil.getSession();
			HibernateUtil.beginTransaction();
			session.update(entity);
			HibernateUtil.commitTransaction();
			bRet = true;
		} catch (Exception e) {
			// 记录日志流水
		    logErr.error("按流水id更改存单开户交易流水信息失败:"+e.getMessage());
		    HibernateUtil.rollbackTransaction();
		} finally {
			HibernateUtil.closeSession();
		}
		return bRet;
	}

	/**
	  * 修改存单交易流水表清存单状态信息
	  * 参数：清存单信息
	  * 处理结果  true=成功  false=失败
  */
   public boolean updateStatus(CDSTransLog entity)
   {
		boolean bRet = false;
	    PreparedStatement pre =null;
        String sql = "update CDSTransLog set iSettleCycleStatus =? where strTerminalNum=?";
        Session session = HibernateUtil.getSession();
        Connection dbm = session.connection();
        HibernateUtil.beginTransaction();
        try
        {
           pre = dbm.prepareStatement(sql);
           pre.setInt(1, entity.getSettleCycleStatus());
           pre.setString(2, entity.getStrTerminalNum());
           pre.execute();
           HibernateUtil.commitTransaction();
           bRet = true;
       }
       catch (SQLException err)
       {
	        logErr.error("更改清存单流水状态信息失败:"+err);
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
	 * 存单开户交易成功后,终端存单发放成功,更新数据库流水状态
	 * 参数1：流水id
	 * 参数2：终端交易状态
	 * @return boolean 是否成功
	*/
	public boolean update4CDSPresented(int id, int status) {
		CDSTransLog cdsTransLog = getEntity(id);
		if (cdsTransLog == null) {
			return false;
		}
		cdsTransLog.setTermTxStatus(status);
		boolean bRet = update(cdsTransLog);
		return bRet;
	}

	/**
	 * 根据id号取流水信息
	 * 参数1：id
	*/
	public CDSTransLog getEntity(int id) {
		CDSTransLog entity = null;
		try {
			Session session = HibernateUtil.getSession();
			String hql = "from CDSTransLog  where id=:id";
			Query query = session.createQuery(hql);
			query.setInteger("id", id);
			entity = (CDSTransLog) query.uniqueResult();
		}
		catch (Exception e) {
			// 记录日志流水
		    logErr.error("按流水id查询存单交易流水信息失败:"+e.getMessage());
		    HibernateUtil.rollbackTransaction();
		} finally {
			HibernateUtil.closeSession();
		}
		return entity;
	}

	/**
     * 根据随机数获取和交易类型所有存单信息</p>
     * strSingleBusinessNum String 批次号
     * hostTxStatus	int	主机交易状态
     * termTxStatus	int	终端交易状态
     * strSuccessful                是否成功true/false
     * strCDSType ：1开户2销户3续存4部提
     * list List  受理存单交易信息
	*/
	public List<?> getCDSInfoList(String strTransRandom,String strCDSType)
	{
	    List<?> list = null;
	    try
	    {
	      Session session = HibernateUtil.getSession();
	      String hql ="from CDSTransLog where strSingleBusinessNum=:strSingleBusinessNum and (hostTxStatus=0 or termTxStatus=9) "
	      		+ "and strCDSType=:strCDSType" ;
	      Query query = session.createQuery(hql);
	      query.setString("strSingleBusinessNum", strTransRandom);
	      query.setString("strCDSType", strCDSType);

	      list = query.list();
	      if (list == null || list.isEmpty())
	    	  list = null;
	    }
	    catch (Exception e)
	    {
	      // 记录日志流水
		  logErr.error("查询存单信息失败:"+e);
	    }
	    finally
	    {
	      HibernateUtil.closeSession();
	    }
	    return list;
	}

	/**
     * 根据随机数获取和交易类型所有存单信息</p>
     * strSingleBusinessNum String 批次号
     * hostTxStatus	int	主机交易状态
     * termTxStatus	int	终端交易状态
     * strSuccessful                是否成功true/false
     * strCDSType ：1开户2销户3续存4部提
     * list List  受理存单交易信息
	*/
	public List<?> getCDSInfoList(String strTransRandom,String strCDSType,String strTransCode)
	{
	    List<?> list = null;
	    try
	    {
	      Session session = HibernateUtil.getSession();
	      String hql = "";
	      //如果是续存开户出现HX00BF
	      if(strTransCode.equals("905107")){
	    	  hql ="from CDSTransLog where strSingleBusinessNum=:strSingleBusinessNum and (hostTxStatus=0 or termTxStatus=9) "
	  	      		+ "and strCDSType=:strCDSType and transCode=:transCode" ;  
	      }else{
	    	  hql ="from CDSTransLog where strSingleBusinessNum=:strSingleBusinessNum and hostTxStatus=0 "
	  	      		+ "and strCDSType=:strCDSType and transCode=:transCode" ; 
	      }
	      Query query = session.createQuery(hql);
	      query.setString("strSingleBusinessNum", strTransRandom);
	      query.setString("strCDSType", strCDSType);
	      query.setString("transCode", strTransCode);

	      list = query.list();
	      if (list == null || list.isEmpty())
	    	  list = null;
	    }
	    catch (Exception e)
	    {
	      // 记录日志流水
		  logErr.error("查询存单信息失败:"+e);
	    }
	    finally
	    {
	      HibernateUtil.closeSession();
	    }
	    return list;
	}
	/**
     * 根据随机数和交易码获取所有转入内部账信息</p>
     * strSingleBusinessNum String 批次号
     * hostTxStatus	int	主机交易状态
     * termTxStatus	int	终端交易状态
     * strSuccessful                是否成功true/false
     * list List  受理存单交易信息
	*/
	public List<?> getTransOutList(String strTransRandom,String strTransCode)
	{
	    List<?> list = null;
	    try
	    {
	      Session session = HibernateUtil.getSession();
	      String hql ="from CDSTransLog where strSingleBusinessNum=:strSingleBusinessNum and hostTxStatus=0 "
	      		+ "and transCode=:transCode" ;
	      Query query = session.createQuery(hql);
	      query.setString("strSingleBusinessNum", strTransRandom);
	      query.setString("transCode", strTransCode);

	      list = query.list();
	      if (list == null || list.isEmpty())
	    	  list = null;
	    }
	    catch (Exception e)
	    {
	      // 记录日志流水
		  logErr.error("查询内部账信息失败:"+e);
	    }
	    finally
	    {
	      HibernateUtil.closeSession();
	    }
	    return list;
	}

	/**
     * 根据终端编号,查询所有交易信息</p>
     * strTerminalNum String 终端编号

     * list List  交易信息
	*/
	public List<?> getList(String strTerminalNum)
	{
	    List<?> list = null;
	    try
	    {
	      Session session = HibernateUtil.getSession();
	      String hql ="from CDSTransLog where strTerminalNum=:strTerminalNum " ;
	      Query query = session.createQuery(hql);
	      query.setString("strTerminalNum", strTerminalNum);

	      list = query.list();
	      if (list == null || list.isEmpty()){
	    	  list = null;
	      }
	    }
	    catch (Exception e)
	    {
	      // 记录日志流水
		  logErr.error("查询所有发存单交易信息失败:"+e);
	    }
	    finally
	    {
	      HibernateUtil.closeSession();
	    }
	    return list;
	}
	
	/**
     * 根据终端号,受理状态来更新交易表</p>
     * strTerminalNum String 终端编号

     * list List  交易信息
	*/
	public boolean updateTranslogStatus(CDSTransLog entity,String strSuccessful)
	{
			boolean bRet = false;
		    PreparedStatement pre =null;
	        String sql = "update CDSTransLog set iSettleCycleStatus =3 where strTerminalNum=? and iTermBatchNo=?";
	        if(strSuccessful.equals("true")){
      			//机具发放成功：存单开户 + 存单续存开户（交易成功，凭证成功  ）  +部提开户（交易成功，凭证成功）
      			//机具受理成功：存单销户（交易成功）  + 存单续存销户（交易成功） + 存单部提（交易成功但是凭证失败，核心返回HX00BF）
	        	sql+="and("
      				+ "(iHostTxStatus=0 and iTermTxStatus=1 and strTransCode=905107)"  //开户交易及凭证均成功
      				+ "or (iHostTxStatus=0 and strTransCode in ('905104','905103'))" //销户交易成功或部提交易成功
      				+ "or (iHostTxStatus=1 and strHostRetCode='HX00BF')" //部提成功，配单失败
      				+ ")";//主机和终端状态都为成功
      		}else
      		if(strSuccessful.equals("false")){
      				//机具发放失败：存单开户 + 存单续存开户(交易失败或凭证失败)  + 部提开户（交易成功，凭证失败）
      			    //机具受理失败：存单销户（交易失败）  + 存单续存销户（交易失败） + 存单部提（交易失败，且返回码不是HX00BF）
      			sql+="and ("
          			   + "(iHostTxStatus!=0 and strTransCode=905104)"  //销户交易失败
          			   + "or ((iHostTxStatus!=0 or iTermTxStatus!=1) and strTransCode=905107)" //开户交易或凭证失败
          			   + "or (iHostTxStatus=0 and iTermTxStatus!=1 and strTransCode=905103)"  //部提交易成功，凭证失败
          			   + "or (iHostTxStatus!=0 and strTransCode=905103)"  //部提交易失败
          			   + ")";
        	}
	        Session session = HibernateUtil.getSession();
	        Connection dbm = session.connection();
	        HibernateUtil.beginTransaction();
	        try
	        {
	           pre = dbm.prepareStatement(sql);
	           pre.setString(1, entity.getStrTerminalNum());
	           pre.setInt(2, entity.getTermBatchNo());
	           pre.execute();
	           HibernateUtil.commitTransaction();
	           bRet = true;
	       }
	       catch (SQLException err)
	       {
		        logErr.error("更改清存单流水状态信息失败:"+err);
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

}
