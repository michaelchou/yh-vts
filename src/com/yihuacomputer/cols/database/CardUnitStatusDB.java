package com.yihuacomputer.cols.database;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.SQLException;
import java.util.List;

import org.apache.log4j.Logger;
import org.hibernate.Query;
import org.hibernate.Session;

import com.yihuacomputer.cols.common.util.HibernateUtil;
import com.yihuacomputer.cols.entity.CardUnitStatus;

/**
 * ����������
 * �����������Թɷ����޹�˾
 * 2017-01-17
 */

public class CardUnitStatusDB {

	public Logger logErr = Logger.getLogger("Error");

	/**
	   * �����ն˱�ű��,�������п�����Ϣ</p>
	   * strTerminalNum String �ն˱��
	   * list List  ������Ϣ
	*/
	public List<?> getCardUnitList(String strTerminalNum)
	{
	    List<?> list = null;
	    try
	    {
	      Session session = HibernateUtil.getSession();
	      String hql =
	              "from CardUnitStatus where strTerminalNum=:strTerminalNum order by cuNum asc"; //�����󶨣�����sqlע��
	      Query query = session.createQuery(hql);
	      query.setString("strTerminalNum", strTerminalNum);

	      list = query.list();
	      if (list == null || list.isEmpty())
	    	  list = null;
	    }
	    catch (Exception e)
	    {
	      // ��¼��־��ˮ
		  logErr.error("ȡ�����б�ʧ��:"+e);
	    }
	    finally
	    {
	      HibernateUtil.closeSession();
	    }
	    return list;
	}


	/**
	 * �����ն˱���Լ���bin��ȡ��������Ϣ
	 * ����1���ն˱��
	 * ����2����bin
	 * ����ֵ����������
	*/
	@SuppressWarnings("rawtypes")
	public CardUnitStatus getCardTrackEntity(String strTerminalNum,String strCardTrack) {
		CardUnitStatus card = null;
		try {
			Session session = HibernateUtil.getSession();
//			String hql = "from CardUnitStatus where strTerminalNum=:strTerminalNum and cast(strCardTrackStart as integer) <=:strCardTrack and cast(strCardTrackEnd as integer) >=:strCardTrack";
			String hql = "from CardUnitStatus where strTerminalNum=:strTerminalNum and (:strCardTrack between strCardTrackStart and strCardTrackEnd)";
			
			Query query = session.createQuery(hql);
			query.setString("strTerminalNum", strTerminalNum);
			query.setString("strCardTrack", strCardTrack);
			List cardList = query.list();
			if (cardList != null && !cardList.isEmpty() && cardList.size() > 0)
				card = (CardUnitStatus) cardList.get(0);
		} catch (Exception e) {
			// ��¼��־��ˮ
			logErr.error("����binȡ�������Ϣʧ��:"+e);
		} finally {
			HibernateUtil.closeSession();
		}
		return card;
	}
	/**
	 * �����ն˱���Լ���bin��ȡ��������Ϣ
	 * ����1���ն˱��
	 * ����2��������
	 * ����3�������еĶ�
	 * ����ֵ����������
	*/
	@SuppressWarnings("rawtypes")
	public CardUnitStatus getCardUnitStatusBySegment(String strTerminalNum,String strCardType,String strCardTrack) {
		CardUnitStatus card = null;
		try {
			Session session = HibernateUtil.getSession();
		//	String hql = "from CardUnitStatus where strTerminalNum=:strTerminalNum and strCardType=:strCardType and cast(strCardTrackStart as integer) <=:strCardTrack and cast(strCardTrackEnd as integer) >=:strCardTrack";
			String hql = "from CardUnitStatus where strTerminalNum=:strTerminalNum and strCardType=:strCardType and  (:strCardTrack between strCardTrackStart and strCardTrackEnd)";
			
			Query query = session.createQuery(hql);
			query.setString("strTerminalNum", strTerminalNum);
			query.setString("strCardType", strCardType);
			query.setString("strCardTrack", strCardTrack);
			List cardList = query.list();
//			System.out.println("aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa");
//			System.out.println("strCardType="+strCardType);
//			System.out.println("strCardTrack="+strCardTrack);
//			System.out.println("size="+cardList.size());
			if (cardList != null && !cardList.isEmpty() && cardList.size() > 0)
				card = (CardUnitStatus) cardList.get(0);
		} catch (Exception e) {
			// ��¼��־��ˮ
			e.printStackTrace();
			logErr.error("������ȡ�������Ϣʧ��:"+e);
		} finally {
			HibernateUtil.closeSession();
		}
		return card;
	}
	/**
	 * �����ն˱���Լ��������кţ�ȡ��������Ϣ
	 * ����1���ն˱��
	 * ����2���������к�
	 * ����ֵ����������
	*/
	@SuppressWarnings("rawtypes")
	public CardUnitStatus getCardEntity(String strTerminalNum,int cuNum) {
		CardUnitStatus card = null;
		try {
			Session session = HibernateUtil.getSession();
			String hql = "from CardUnitStatus where strTerminalNum=:strTerminalNum and cuNum=:cuNum";
			Query query = session.createQuery(hql);
			query.setString("strTerminalNum", strTerminalNum);
			query.setInteger("cuNum", cuNum);
			List cardList = query.list();
			if (cardList != null && !cardList.isEmpty() && cardList.size() > 0)
				card = (CardUnitStatus) cardList.get(0);
		} catch (Exception e) {
			// ��¼��־��ˮ
			logErr.error("ȡ�������Ϣʧ��:"+e);
		} finally {
			HibernateUtil.closeSession();
		}
		return card;
	}

	/**
	 * ��¼ ������Ϣ
	 * ����1���������
	 * ����ֵ��true=�ɹ� false=ʧ��
	 */
	public boolean save(CardUnitStatus entity)
	{
		boolean bRet = false;
		try
		{
			Session session = HibernateUtil.getSession();
			HibernateUtil.beginTransaction();
			session.save(entity);
			HibernateUtil.commitTransaction();
			bRet = true;
		} catch (Exception e)
		{
			// ��¼��־��ˮ
			logErr.error("��¼������Ϣʧ��:"+e);
			HibernateUtil.rollbackTransaction();
		} finally
		{
			HibernateUtil.closeSession();
		}
		return bRet;
	}

	/**
	 * ���¿�����Ϣ
	 * ����1���������
	 * ����ֵ��true=�ɹ� false=ʧ��
	 */
	public boolean update(CardUnitStatus entity)
	{
		boolean bRet = false;
		try
		{
			Session session = HibernateUtil.getSession();
			HibernateUtil.beginTransaction();
			session.update(entity);
			HibernateUtil.commitTransaction();
			bRet = true;
		} catch (Exception e)
		{
			// ��¼��־��ˮ
			logErr.error("���¿�����Ϣʧ��:"+e);
			HibernateUtil.rollbackTransaction();
		} finally
		{
			HibernateUtil.closeSession();
		}
		return bRet;
	}

	/**
	  * ����������
	*/
	public boolean insert(List<CardUnitStatus> cardList)
	{
		  boolean ret = false;
	      if (cardList != null && cardList.size() > 0)
	      {
	        for (int i = 0; i < cardList.size(); i++)
	        {
	        	CardUnitStatus entity = (CardUnitStatus) cardList.get(i);
	        	ret = save(entity);
	        }
	      }
	      return ret;
   }

	/**
	  * ���ն˱��ɾ������
    */
	public boolean delete(String strTerminalNum)
	{
		boolean ret = false;
	    String sql = "delete from CardUnitStatus where strTerminalNum=?";
	    Session session = HibernateUtil.getSession();
	    Connection dbm = session.connection();
		HibernateUtil.beginTransaction();
	    try
	    {
	      PreparedStatement pre = dbm.prepareStatement(sql);
	      pre.setString(1, strTerminalNum);
	      pre.execute();
	      HibernateUtil.commitTransaction();
	      ret = true;
	    }
	    catch (SQLException err)
	    {
	    	logErr.error("ɾ��������Ϣʧ��:"+err.getMessage());
	        HibernateUtil.rollbackTransaction();
	        ret = false;
	    }
	    finally
	    {
	    	HibernateUtil.closeSession();
	    }
	    return ret;
	}
}
