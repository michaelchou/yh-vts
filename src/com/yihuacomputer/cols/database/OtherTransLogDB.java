package com.yihuacomputer.cols.database;

import java.util.List;

import org.apache.log4j.Logger;
import org.hibernate.Query;
import org.hibernate.Session;

import com.yihuacomputer.cols.common.util.HibernateUtil;
import com.yihuacomputer.cols.entity.OtherTransLog;

/**
 * ����������ˮ��(���浥����������UKEY)
 * �����������Թɷ����޹�˾
 * 2017-05-05
 */
public class OtherTransLogDB
{
  public Logger logErr = Logger.getLogger("Error");

  public OtherTransLogDB()
  {
  }
  /**
	* ���ݽ�����ˮ�Ų�ѯ��ˮ��Ϣ
	* ����1���ն���ˮ��
  */
  public OtherTransLog getEntity(String strOrgTsn) {
	OtherTransLog entity = null;
	try {
		Session session = HibernateUtil.getSession();
		String hql = "from OtherTransLog  where strTermSerialNo=:strTermSerialNo";
		Query query = session.createQuery(hql);
		query.setString("strTermSerialNo", strOrgTsn);
		entity = (OtherTransLog) query.uniqueResult();
	}
	catch (Exception e) {
		// ��¼��־��ˮ
		logErr.error("��ԭ������ˮ�Ų�ѯ������ˮ��Ϣʧ��:"+e.getMessage());
		HibernateUtil.rollbackTransaction();
	} finally {
		HibernateUtil.closeSession();
	}
	return entity;
  }
  /**
   * ��¼������ˮ
   * ����1����ˮ����
   * ������  true=�ɹ�  false=ʧ��
   */
  public boolean save(OtherTransLog entity)
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
      logErr.error("���뽻����ˮʧ��:"+e.getMessage());
      HibernateUtil.rollbackTransaction();
    }
    finally
    {
      HibernateUtil.closeSession();
    }
    return bRet;
  }
  /**
	* ���½�����ˮ��Ϣ
	* @return bRet boolean ������ true=�ɹ� false=ʧ��
   */
  public boolean update(OtherTransLog entity) {
	boolean bRet = false;
	try {
		Session session = HibernateUtil.getSession();
		HibernateUtil.beginTransaction();
		session.update(entity);
		HibernateUtil.commitTransaction();
		bRet = true;
	} catch (Exception e) {
		// ��¼��־��ˮ
		logErr.error("���½�����ˮ��Ϣʧ��:"+e.getMessage());
		HibernateUtil.rollbackTransaction();
	} finally {
		HibernateUtil.closeSession();
	}
	return bRet;
  }
  
	/**
   * �������κš��ն˺š��������ȡ����ת����Ϣ</p>
   * strSingleBusinessNum String ���κ�
   * hostTxStatus	int	��������״̬
   * termTxStatus	int	�ն˽���״̬	
   * strSuccessful                �Ƿ�ɹ�true/false
   * list List  �ڲ���ת�˽�����Ϣ
	*/
	public List<?> getTransList(String strTransRandom,String strTerminalNum,String strOldTransCode)
	{
	    List<?> list = null;
	    try
	    {
	      Session session = HibernateUtil.getSession();
	      String hql ="from OtherTransLog  where strTerminalNum=:strTerminalNum and strExInfo2=:strExInfo2 "
	      		+ "and transCode=:transCode and hostTxStatus=0";
	      Query query = session.createQuery(hql);
	      query.setString("strTerminalNum", strTerminalNum);
	      query.setString("transCode", strOldTransCode);
	      query.setString("strExInfo2", strTransRandom);
	      
	      list = query.list();
	      if (list == null || list.isEmpty())
	    	  list = null;
	    }
	    catch (Exception e)
	    {
	      // ��¼��־��ˮ
		  logErr.error("��ѯת����Ϣʧ��:"+e);
	    }
	    finally
	    {
	      HibernateUtil.closeSession();
	    }
	    return list;
	}
}
