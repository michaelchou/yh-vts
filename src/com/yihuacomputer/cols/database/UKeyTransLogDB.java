package com.yihuacomputer.cols.database;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.SQLException;
import java.util.List;

import org.apache.log4j.Logger;
import org.hibernate.Query;
import org.hibernate.Session;

import com.yihuacomputer.cols.common.util.HibernateUtil;
import com.yihuacomputer.cols.entity.UKeySettleCycleLog;
import com.yihuacomputer.cols.entity.UKeyTransLog;

/**
 * UKey������ˮ��
 * �����������Թɷ����޹�˾
 * 2017-05-10
 */
public class UKeyTransLogDB
{
  public Logger logErr = Logger.getLogger("Error");

  public UKeyTransLogDB()
  {
  }

  /**
   * ��¼UKey������ˮ
   * ����1����ˮ����
   * ������  true=�ɹ�  false=ʧ��
   */
  public boolean save(UKeyTransLog entity)
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
	  // ��¼��־��ˮ
      logErr.error("����UKey������ˮʧ��:"+e.getMessage());
      HibernateUtil.rollbackTransaction();
    }
    finally
    {
      HibernateUtil.closeSession();
    }
    return bRet;
  }

  /**
	 * ����UKey������ˮ
	 * @return bRet boolean ������ true=�ɹ� false=ʧ��
   */
   public boolean update(UKeyTransLog entity) {
		boolean bRet = false;
		try {

			Session session = HibernateUtil.getSession();
			HibernateUtil.beginTransaction();
			session.update(entity);
			HibernateUtil.commitTransaction();
			bRet = true;
		} catch (Exception e) {
			// ��¼��־��ˮ
		    logErr.error("����ˮid����UKey������ˮ��Ϣʧ��:"+e.getMessage());
		    HibernateUtil.rollbackTransaction();
		} finally {
			HibernateUtil.closeSession();
		}
		return bRet;
   }

   /**
	  * �޸ķ�UKey������ˮ����Ukey״̬��Ϣ
	  * �������忨��Ϣ
	  * ������  true=�ɹ�  false=ʧ��
   */
   public boolean updateStatus(UKeyTransLog entity)
   {
		boolean bRet = false;
	    PreparedStatement pre =null;
        String sql = "update UKeyTransLog set iSettleCycleStatus =? where strTerminalNum=?";
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
 	        logErr.error("������UKey��ˮ״̬��Ϣʧ��:"+err);
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
	 * UKey���׳ɹ���,�ն˷�UKey�ɹ�,�������ݿ���ˮ״̬
	 * ����1����ˮid
	 * ����2���ն˽���״̬
	 * @return boolean �Ƿ�ɹ�
   */
   public boolean update4UKeyPresented(int id, int status) {
	    UKeyTransLog ukeyTransLog = getEntity(id);
		if (ukeyTransLog == null) {
			return false;
		}
		ukeyTransLog.setTermTxStatus(status);
		boolean bRet = update(ukeyTransLog);
		return bRet;
	}
   /**
	 * ����id��ȡ��ˮ��Ϣ
	 * ����1��id
	 */
	public UKeyTransLog getEntity(int id) {
		UKeyTransLog entity = null;
		try {
			Session session = HibernateUtil.getSession();
			String hql = "from UKeyTransLog  where id=:id";
			Query query = session.createQuery(hql);
			query.setInteger("id", id);
			entity = (UKeyTransLog) query.uniqueResult();
		}
		catch (Exception e) {
			// ��¼��־��ˮ
		    logErr.error("����ˮid��ѯUKey������ˮ��Ϣʧ��:"+e.getMessage());
		    HibernateUtil.rollbackTransaction();
		} finally {
			HibernateUtil.closeSession();
		}
		return entity;
	}

	/**
     * �����ն˱��,��ѯ���з�Ukey������Ϣ</p>
     * strTerminalNum String �ն˱��

     * list List  ��Ukey������Ϣ
	*/
	public List<?> getList(String strTerminalNum)
	{
	    List<?> list = null;
	    try
	    {
	      Session session = HibernateUtil.getSession();
	      String hql ="from UKeyTransLog where strTerminalNum=:strTerminalNum " ;
	      Query query = session.createQuery(hql);
	      query.setString("strTerminalNum", strTerminalNum);

	      list = query.list();
	      if (list == null || list.isEmpty())
	    	  list = null;
	    }
	    catch (Exception e)
	    {
	      // ��¼��־��ˮ
		  logErr.error("��ѯ���з�Ukey������Ϣʧ��:"+e);
	    }
	    finally
	    {
	      HibernateUtil.closeSession();
	    }
	    return list;
	}

	/**
     * �����ն˱��,��ѯ��ǰ�������з�Ukey������Ϣ</p>
     * strTerminalNum String �ն˱��

     * list List ��ǰ���� ��Ukey������Ϣ
	*/
	public List<?> getBatchList(String strTerminalNum)
	{
	    List<?> list = null;
	    UKeySettleCycleLogDB uKeySettleCycleLogDB = new UKeySettleCycleLogDB();
	    UKeySettleCycleLog  entity = uKeySettleCycleLogDB.getCurBatchNoEntity(strTerminalNum, 0);//0λδ��浥״̬
			if(entity==null)
				return null;
	    try
	    {
	      Session session = HibernateUtil.getSession();
	      String hql ="from UKeyTransLog where strTerminalNum=:strTerminalNum  and termBatchNo=:termBatchNo " ;
			hql+=" order by dtOccur asc"; //�����󶨣�����sqlע��
	      Query query = session.createQuery(hql);
	      query.setString("strTerminalNum", strTerminalNum);
	      query.setInteger("termBatchNo", entity.getTermBatchNo());

	      list = query.list();
	      if (list == null || list.isEmpty())
	    	  list = null;
	    }
	    catch (Exception e)
	    {
	      // ��¼��־��ˮ
		  logErr.error("��ѯ���з�Ukey������Ϣʧ��:"+e);
	    }
	    finally
	    {
	      HibernateUtil.closeSession();
	    }
	    return list;
	}
}
