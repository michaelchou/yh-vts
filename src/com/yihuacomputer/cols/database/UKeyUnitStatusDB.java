package com.yihuacomputer.cols.database;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.SQLException;
import java.util.List;

import org.apache.log4j.Logger;
import org.hibernate.Query;
import org.hibernate.Session;

import com.yihuacomputer.cols.common.util.HibernateUtil;
import com.yihuacomputer.cols.entity.UKeyUnitStatus;

/**
 * UKey�������
 * �����������Թɷ����޹�˾
 * 2017-05-03
 */

public class UKeyUnitStatusDB {

	public Logger logErr = Logger.getLogger("Error");

	/**
	   * �����ն˱�ű��,��������UKey����Ϣ</p>
	   * strTerminalNum String �ն˱��
	   * list List  ������Ϣ
	*/
	public List<?> getUKeyUnitList(String strTerminalNum)
	{
	    List<?> list = null;
	    try
	    {
	      Session session = HibernateUtil.getSession();
	      String hql =
	              "from UKeyUnitStatus where strTerminalNum=:strTerminalNum order by cuNum asc"; //�����󶨣�����sqlע��
	      Query query = session.createQuery(hql);
	      query.setString("strTerminalNum", strTerminalNum);

	      list = query.list();
	      if (list == null || list.isEmpty())
	    	  list = null;
	    }
	    catch (Exception e)
	    {
	      // ��¼��־��ˮ
		  logErr.error("ȡUKey���б�ʧ��:"+e);
	    }
	    finally
	    {
	      HibernateUtil.closeSession();
	    }
	    return list;
	}

	/**
	 * �����ն˱���Լ�UKey�����кţ�ȡ��UKey����Ϣ
	 * ����1���ն˱��
	 * ����2��UKey�����к�
	 * ����ֵ����������
	*/
	@SuppressWarnings("rawtypes")
	public UKeyUnitStatus getUKeyEntity(String strTerminalNum,int cuNum) {
		UKeyUnitStatus card = null;
		try {
			Session session = HibernateUtil.getSession();
			String hql = "from UKeyUnitStatus where strTerminalNum=:strTerminalNum and cuNum=:cuNum";
			Query query = session.createQuery(hql);
			query.setString("strTerminalNum", strTerminalNum);
			query.setInteger("cuNum", cuNum);
			List ukeyList = query.list();
			if (ukeyList != null && !ukeyList.isEmpty() && ukeyList.size() > 0)
				card = (UKeyUnitStatus) ukeyList.get(0);
		} catch (Exception e) {
			// ��¼��־��ˮ
			logErr.error("ȡUKey�����Ϣʧ��:"+e);
		} finally {
			HibernateUtil.closeSession();
		}
		return card;
	}

	/**
	 * ��¼ UKey����Ϣ
	 * ����1���������
	 * ����ֵ��true=�ɹ� false=ʧ��
	 */
	public boolean save(UKeyUnitStatus entity)
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
			logErr.error("��¼UKey����Ϣʧ��:"+e);
			HibernateUtil.rollbackTransaction();
		} finally
		{
			HibernateUtil.closeSession();
		}
		return bRet;
	}

	/**
	 * ����UKey����Ϣ
	 * ����1��UKey�����
	 * ����ֵ��true=�ɹ� false=ʧ��
	 */
	public boolean update(UKeyUnitStatus entity)
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
			logErr.error("����UKey����Ϣʧ��:"+e);
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
	public boolean insert(List<UKeyUnitStatus> ukeyList)
	{
		  boolean ret = false;
	      if (ukeyList != null && ukeyList.size() > 0)
	      {
	        for (int i = 0; i < ukeyList.size(); i++)
	        {
	        	UKeyUnitStatus entity = (UKeyUnitStatus) ukeyList.get(i);
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
	    String sql = "delete from UKeyUnitStatus where strTerminalNum=?";
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
	    	logErr.error("ɾ��UKey����Ϣʧ��:"+err.getMessage());
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
	 * �����ն˱���Լ�UKey�Ŀ�bin��ȡ��UKey����Ϣ
	 * ����1���ն˱��
	 * ����2����bin
	 * ����ֵ����������
	*/
	@SuppressWarnings("rawtypes")
	public UKeyUnitStatus getUKeyTrackEntity(String strTerminalNum,String strUKeyTrack) {
		UKeyUnitStatus ukey = null;
		try {
			Session session = HibernateUtil.getSession();
			String hql = "from UKeyUnitStatus where strTerminalNum=:strTerminalNum and cast(strUKeyTrackStart as integer) <=:strUKeyTrack and cast(strUKeyTrackEnd as integer) >=:strUKeyTrack";
			Query query = session.createQuery(hql);
			query.setString("strTerminalNum", strTerminalNum);
			query.setString("strUKeyTrack", strUKeyTrack);
			List ukeyList = query.list();
			if (ukeyList != null && !ukeyList.isEmpty() && ukeyList.size() > 0)
				ukey = (UKeyUnitStatus) ukeyList.get(0);
		} catch (Exception e) {
			// ��¼��־��ˮ
			logErr.error("��UKey�Ŀ�binȡUKey�����Ϣʧ��:"+e);
		} finally {
			HibernateUtil.closeSession();
		}
		return ukey;
	}
}
