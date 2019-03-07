package com.yihuacomputer.cols.database;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.SQLException;
import java.util.List;

import org.apache.log4j.Logger;
import org.hibernate.Query;
import org.hibernate.Session;

import com.yihuacomputer.cols.common.util.HibernateUtil;
import com.yihuacomputer.cols.entity.CardSettleCycleLog;
import com.yihuacomputer.cols.entity.CardTransLog;

/**
 * ����������ˮ��
 * �����������Թɷ����޹�˾
 * 2017-05-05
 */
public class CardTransLogDB
{
  public Logger logErr = Logger.getLogger("Error");

  public CardTransLogDB()
  {
  }

  /**
   * ��¼����������ˮ
   * ����1����ˮ����
   * ������  true=�ɹ�  false=ʧ��
   */
  public boolean save(CardTransLog entity)
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
      logErr.error("���뿪��������ˮʧ��:"+e.getMessage());
      HibernateUtil.rollbackTransaction();
    }
    finally
    {
      HibernateUtil.closeSession();
    }
    return bRet;
  }

  /**
	 * ���·���������ˮ
	 * @return bRet boolean ������ true=�ɹ� false=ʧ��
   */
	public boolean update(CardTransLog entity) {
		boolean bRet = false;
		try {

			Session session = HibernateUtil.getSession();
			HibernateUtil.beginTransaction();
			session.update(entity);
			HibernateUtil.commitTransaction();
			bRet = true;
		} catch (Exception e) {
			// ��¼��־��ˮ
		    logErr.error("����ˮid���Ŀ���������ˮ��Ϣʧ��:"+e.getMessage());
		    HibernateUtil.rollbackTransaction();
		} finally {
			HibernateUtil.closeSession();
		}
		return bRet;
	}

	/**
	  * �޸Ŀ���������ˮ���忨״̬��Ϣ
	  * �������忨��Ϣ
	  * ������  true=�ɹ�  false=ʧ��
    */
	public boolean updateStatus(CardTransLog entity)
    {
		boolean bRet = false;
 	    PreparedStatement pre =null;
        String sql = "update CardTransLog set iSettleCycleStatus =? where strTerminalNum=?";
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
   	        logErr.error("�����忨��ˮ״̬��Ϣʧ��:"+err);
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
	 * �������׳ɹ���,�ն˷����ɹ�,�������ݿ���ˮ״̬
	 * ����1����ˮid
	 * ����2���ն˽���״̬
	 * @return boolean �Ƿ�ɹ�
   */
   public boolean update4CardPresented(int id, int status) {
		CardTransLog cardTransLog = getEntity(id);
		if (cardTransLog == null) {
			return false;
		}
		cardTransLog.setTermTxStatus(status);
		boolean bRet = update(cardTransLog);
		return bRet;
	}
   /**
	 * ����id��ȡ��ˮ��Ϣ
	 * ����1��id
	 */
	public CardTransLog getEntity(int id) {
		CardTransLog entity = null;
		try {
			Session session = HibernateUtil.getSession();
			String hql = "from CardTransLog  where id=:id";
			Query query = session.createQuery(hql);
			query.setInteger("id", id);
			entity = (CardTransLog) query.uniqueResult();
		}
		catch (Exception e) {
			// ��¼��־��ˮ
		    logErr.error("����ˮid��ѯ����������ˮ��Ϣʧ��:"+e.getMessage());
		    HibernateUtil.rollbackTransaction();
		} finally {
			HibernateUtil.closeSession();
		}
		return entity;
	}

	/**
     * �����ն˱��,��ѯ���з���������Ϣ</p>
     * strTerminalNum String �ն˱��

     * list List  ����������Ϣ
	*/
	public List<?> getList(String strTerminalNum)
	{
	    List<?> list = null;
	    try
	    {
	      Session session = HibernateUtil.getSession();
	      String hql ="from CardTransLog where strTerminalNum=:strTerminalNum " ;
	      Query query = session.createQuery(hql);
	      query.setString("strTerminalNum", strTerminalNum);

	      list = query.list();
	      if (list == null || list.isEmpty()){
	    	  list = null;
	      }
	    }
	    catch (Exception e)
	    {
	      // ��¼��־��ˮ
		  logErr.error("��ѯ���з���������Ϣʧ��:"+e);
	    }
	    finally
	    {
	      HibernateUtil.closeSession();
	    }
	    return list;
	}

	/**
     * �����ն˱��,��ѯ��ǰ�������з���������Ϣ</p>
     * strTerminalNum String �ն˱��

     * list List  ��ǰ���η���������Ϣ
	*/
	public List<?> getBatchList(String strTerminalNum)
	{
	    List<?> list = null;

	    CardSettleCycleLogDB cardSettleCycleLogDB = new CardSettleCycleLogDB();
	    CardSettleCycleLog  entity = cardSettleCycleLogDB.getCurBatchNoEntity(strTerminalNum, 0);//0λδ��浥״̬
			if(entity==null)
				return null;

	    try
	    {
	      Session session = HibernateUtil.getSession();
	      String hql ="from CardTransLog where strTerminalNum=:strTerminalNum  and termBatchNo=:termBatchNo " ;
			hql+=" order by dtOccur asc"; //�����󶨣�����sqlע��
	      Query query = session.createQuery(hql);
	      query.setString("strTerminalNum", strTerminalNum);
	      query.setInteger("termBatchNo", entity.getTermBatchNo());

	      list = query.list();
	      if (list == null || list.isEmpty()){
	    	  list = null;
	      }
	    }
	    catch (Exception e)
	    {
	      // ��¼��־��ˮ
	    	e.printStackTrace();
		  logErr.error("��ѯ���з���������Ϣʧ��:"+e);
	    }
	    finally
	    {
	      HibernateUtil.closeSession();
	    }

	    return list;
	}
}
