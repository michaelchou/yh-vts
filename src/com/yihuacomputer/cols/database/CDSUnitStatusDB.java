package com.yihuacomputer.cols.database;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.SQLException;
import java.util.List;

import org.apache.log4j.Logger;
import org.hibernate.Query;
import org.hibernate.Session;

import com.yihuacomputer.cols.common.util.HibernateUtil;
import com.yihuacomputer.cols.entity.CDSUnitStatus;

/**
 * �浥�������
 * �����������Թɷ����޹�˾
 * 2017-05-03
 */

public class CDSUnitStatusDB {

	public Logger logErr = Logger.getLogger("Error");

	/**
	   * �����ն˱�ű��,�������д浥����Ϣ</p>
	   * strTerminalNum String �ն˱��
	   * list List  �浥����Ϣ
	*/
	public List<?> getCDSUnitList(String strTerminalNum)
	{
	    List<?> list = null;
	    try
	    {
	      Session session = HibernateUtil.getSession();
	      String hql =
	              "from CDSUnitStatus where strTerminalNum=:strTerminalNum order by cuNum asc"; //�����󶨣�����sqlע��
	      Query query = session.createQuery(hql);
	      query.setString("strTerminalNum", strTerminalNum);

	      list = query.list();
	      if (list == null || list.isEmpty())
	    	  list = null;
	    }
	    catch (Exception e)
	    {
	      // ��¼��־��ˮ
		  logErr.error("ȡ�浥���б�ʧ��:"+e);
	    }
	    finally
	    {
	      HibernateUtil.closeSession();
	    }
	    return list;
	}

	/**
	 * �����ն˱���Լ�OCR�ţ�ȡ���浥����Ϣ
	 * ����1���ն˱��
	 * ����2����bin
	 * ����ֵ����������
	*/
	@SuppressWarnings("rawtypes")
	public CDSUnitStatus getCDSTrackEntity(String strTerminalNum,String strCDSTrack) {
		CDSUnitStatus cds = null;
		try {
			Session session = HibernateUtil.getSession();
			String hql = "from CDSUnitStatus where strTerminalNum=:strTerminalNum and cast(strCdsTrackStart as integer) <=:strCDSTrack and cast(strCdsTrackEnd as integer) >=:strCDSTrack";
			Query query = session.createQuery(hql);
			query.setString("strTerminalNum", strTerminalNum);
			query.setString("strCDSTrack", strCDSTrack);
			List cdsList = query.list();
			if (cdsList != null && !cdsList.isEmpty() && cdsList.size() > 0)
				cds = (CDSUnitStatus) cdsList.get(0);
		} catch (Exception e) {
			// ��¼��־��ˮ
			logErr.error("���浥OCRȡ�浥�����Ϣʧ��:"+e);
		} finally {
			HibernateUtil.closeSession();
		}
		return cds;
	}

	/**
	 * �����ն˱���Լ��浥�����кţ�ȡ���浥����Ϣ
	 * ����1���ն˱��
	 * ����2���������к�
	 * ����ֵ����������
	*/
	@SuppressWarnings("rawtypes")
	public CDSUnitStatus getCardEntity(String strTerminalNum,int cuNum) {
		CDSUnitStatus entity = null;
		try {
			Session session = HibernateUtil.getSession();
			String hql = "from CDSUnitStatus where strTerminalNum=:strTerminalNum and cuNum=:cuNum";
			Query query = session.createQuery(hql);
			query.setString("strTerminalNum", strTerminalNum);
			query.setInteger("cuNum", cuNum);
			List cardList = query.list();
			if (cardList != null && !cardList.isEmpty() && cardList.size() > 0)
				entity = (CDSUnitStatus) cardList.get(0);
		} catch (Exception e) {
			// ��¼��־��ˮ
			logErr.error("ȡ�浥�����Ϣʧ��:"+e);
		} finally {
			HibernateUtil.closeSession();
		}
		return entity;
	}

	/**
	 * ��¼ �浥����Ϣ
	 * ����1���������
	 * ����ֵ��true=�ɹ� false=ʧ��
	 */
	public boolean save(CDSUnitStatus entity)
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
			logErr.error("��¼�浥����Ϣʧ��:"+e);
			HibernateUtil.rollbackTransaction();
		} finally
		{
			HibernateUtil.closeSession();
		}
		return bRet;
	}

	/**
	 * ���´浥����Ϣ
	 * ����1���������
	 * ����ֵ��true=�ɹ� false=ʧ��
	 */
	public boolean update(CDSUnitStatus entity)
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
			logErr.error("���´浥����Ϣʧ��:"+e);
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
	public boolean insert(List<CDSUnitStatus> cardList)
	{
		  boolean ret = false;
	      if (cardList != null && cardList.size() > 0)
	      {
	        for (int i = 0; i < cardList.size(); i++)
	        {
	        	CDSUnitStatus entity = (CDSUnitStatus) cardList.get(i);
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
	    String sql = "delete from CDSUnitStatus where strTerminalNum=?";
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
	    	logErr.error("ɾ���浥����Ϣʧ��:"+err.getMessage());
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
