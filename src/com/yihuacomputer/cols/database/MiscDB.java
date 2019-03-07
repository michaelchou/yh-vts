package com.yihuacomputer.cols.database;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.SQLException;
import java.util.List;

import org.apache.log4j.Logger;
import org.hibernate.Query;
import org.hibernate.Session;

import com.yihuacomputer.cols.common.util.HibernateUtil;
import com.yihuacomputer.cols.entity.Misc;
import com.yihuacomputer.cols.util.DataConversion;


/**
 * ������Ϣ������
 * �����������Թɷ����޹�˾
 * 2017-06-08
 */

public class MiscDB {

	public Logger logErr = Logger.getLogger("Error");

	/**
	 * ����ID��ȡ��������Ϣ
	 * ����1��id��
	 * ����ֵ����������
	*/
	@SuppressWarnings("rawtypes")
	public Misc getMiscById(int id) {
		Misc misc = null;
		try {
			Session session = HibernateUtil.getSession();
			String hql = "from Misc where id=:id";
			Query query = session.createQuery(hql);
			query.setInteger("id", id);
			// ���ò�ѯ����
			query.setCacheable(true);
			query.setCacheRegion("MiscQueries");
			List miscList = query.list();
			if (miscList != null && !miscList.isEmpty() && miscList.size() > 0)
				misc = (Misc) miscList.get(0);
		} catch (Exception e) {
			// ��¼��־��ˮ
			logErr.error("ȡ������Ϣʧ��:"+e);
		} finally {
			HibernateUtil.closeSession();
		}
		return misc;
	}
	
	/**
	 * ����ID��ȡ��������Ϣ
	 * ����1��id��
	 * ����ֵ����������
	 */
	@SuppressWarnings("rawtypes")
	public Misc getMiscByIdNoCache(int id) {
		Misc misc = null;
		try {
			Session session = HibernateUtil.getSession();
			String hql = "from Misc where id=:id";
			Query query = session.createQuery(hql);
			query.setInteger("id", id);
			List miscList = query.list();
			if (miscList != null && !miscList.isEmpty() && miscList.size() > 0)
				misc = (Misc) miscList.get(0);
		} catch (Exception e) {
			// ��¼��־��ˮ
			logErr.error("ȡ������Ϣʧ��:"+e);
		} finally {
			HibernateUtil.closeSession();
		}
		return misc;
	}

	/**
	 * ���ݻ�������Լ��������ƣ�ȡ������ֵ
	 * ����1����������
	 * ����2����������
	 * ����ֵ����������
	*/
	@SuppressWarnings("rawtypes")
	public Misc getEntity(String strOrgNum, String strName) {
		Misc misc = null;
		try {
			Session session = HibernateUtil.getSession();
			String hql = "from Misc where strOrgNum=:strOrgNum and strName=:strName";
			Query query = session.createQuery(hql);
			query.setString("strName", strName);
			query.setString("strOrgNum", strOrgNum);
			// ���ò�ѯ����
			query.setCacheable(true);
			query.setCacheRegion("MiscQueries");
			List miscList = query.list();
			if (miscList != null && !miscList.isEmpty() && miscList.size() > 0)
				misc = (Misc) miscList.get(0);
		} catch (Exception e) {
			// ��¼��־��ˮ
			logErr.error("ȡ����ʧ��:"+e);
		} finally {
			HibernateUtil.closeSession();
		}
		return misc;
	}

	/**
	 * ���ݻ�������Լ��������ƣ�ȡ������ֵ
	 * ����1����������
	 * ����2����������
	 * ����ֵ����������
	*/
	@SuppressWarnings("rawtypes")
	public Misc getEntityNoCache(String strOrgNum, String strName) {
		Misc misc = null;
		try {
			Session session = HibernateUtil.getSession();
			String hql = "from Misc where strOrgNum=:strOrgNum and strName=:strName";
			Query query = session.createQuery(hql);
			query.setString("strName", strName);
			query.setString("strOrgNum", strOrgNum);
			List miscList = query.list();
			if (miscList != null && !miscList.isEmpty() && miscList.size() > 0)
				misc = (Misc) miscList.get(0);
		} catch (Exception e) {
			// ��¼��־��ˮ
			logErr.error("ȡ����ʧ��:"+e);
		} finally {
			HibernateUtil.closeSession();
		}
		return misc;
	}

	/**
	 * ���ݻ�������Լ��������ƣ�ȡ������ֵ
	 * ����1����������
	 * ����2����������
	 * ����3������ֵ
	 * ����ֵ����������
	*/
	public String getDesc(String strOrgNum, String strName, String strValue) {
		String strDesc = null;
		try {
			Session session = HibernateUtil.getSession();
			String hql = "from Misc where strOrgNum=:strOrgNum and strName=:strName and strValue=:strValue";
			Query query = session.createQuery(hql);
			query.setString("strName", strName);
			query.setString("strOrgNum", strOrgNum);
			query.setString("strValue", strValue);
			//���ò�ѯ����
		    query.setCacheable(true);
		    query.setCacheRegion("MiscQueries");
			List<?> miscList = query.list();
			if (miscList != null && !miscList.isEmpty() && miscList.size() > 0)
				strDesc = ((Misc) miscList.get(0)).getStrDesc();
		} catch (Exception e) {
			// ��¼��־��ˮ
			logErr.error("ȡ��������ʧ��:"+e);
		} finally {
			HibernateUtil.closeSession();
		}
		return strDesc;
	}

	/**
	 * ���ݻ�������Լ��������ƣ�ȡ������ֵ(�ַ���)
	 * ����1����������
	 * ����2����������
	 * ����3��Ĭ��ֵ
	 * ����ֵ����������
	*/
	public String get(String strOrgNum, String strName, String strValDef) {
		String strValue = strValDef;
		Misc misc = getEntity(strOrgNum, strName);
		if (misc != null)
			strValue = misc.getStrValue().trim();
		return strValue;
	}

	/**
	 * ���ݻ�������Լ��������ƣ�ȡ������ֵ(����)
	 * ����1����������
	 * ����2����������
	 * ����3��Ĭ��ֵ
	 * ����ֵ����������
	*/
	public int get(String strOrgNum, String strName, int iValDef) {
	    int iValue = iValDef;
		Misc misc = getEntity(strOrgNum, strName);
		if (misc != null)
			iValue = DataConversion.str2Int(misc.getStrValue().trim(), iValDef);
		return iValue;
	}

	/**
	   * ���ݻ������,������ȡ����</p>
	   * strName String ������
	   * strOrgNum String ���б��
	   * list List  ������Ϣ
	*/
	public List<?> getList(String strOrgNum, String strName)
	{
	    List<?> list = null;
	    try
	    {
	      Session session = HibernateUtil.getSession();
	      String hql =
	              "from Misc where strName like :strName and strOrgNum=:strOrgNum order by length(strValue) desc"; //�����󶨣�����sqlע��
	      Query query = session.createQuery(hql);
	      query.setString("strName", strName + "%");
	      query.setString("strOrgNum", strOrgNum);
	      //���ò�ѯ����
	      query.setCacheable(true);
	      query.setCacheRegion("MiscQueries");

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
	   * ���ݻ������,������ȡ����</p>
	   * strOrgNum String ���б��
	   * list List  �����б���Ϣ
	*/
	public List<?> getAll(String strOrgNum)
	{
	    List<?> list = null;
	    try
	    {
	      Session session = HibernateUtil.getSession();
	      String hql =
	              "from Misc where strOrgNum=:strOrgNum order by id "; //�����󶨣�����sqlע��
	      Query query = session.createQuery(hql);
	      query.setString("strOrgNum", strOrgNum);
	      //���ò�ѯ����
	      query.setCacheable(true);
	      query.setCacheRegion("MiscQueries");

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
	   * ͬ��������Ϣ
	   * ������������Ϣ
	   * ������  true=�ɹ�  false=ʧ��
	*/
	public boolean save(Misc entity) {
		boolean bRet = false;
		PreparedStatement pst =null;
		Session session = HibernateUtil.getSession();
		Connection dbm = session.connection();
		HibernateUtil.beginTransaction();
	    String sql = "insert into Misc(id,strName,strValue,strDesc,strOrgNum) values (?,?,?,?,?)";
	    try
	    {
	        pst = dbm.prepareStatement(sql);
	        pst.setInt(1, entity.getId());
	        pst.setString(2, entity.getStrName());
	        pst.setString(3, entity.getStrValue());
	        pst.setString(4, entity.getStrDesc());
	        pst.setString(5, entity.getStrOrgNum());
	        pst.addBatch();
	        pst.executeBatch();
	        HibernateUtil.commitTransaction();
	        bRet = true;
	    }
	    catch (SQLException e)
	    {
		    // ��¼��־��ˮ
		    logErr.error("���²�����Ϣʧ��:"+e);
	        HibernateUtil.rollbackTransaction();
	        bRet = false;
	    }
	    finally
	    {
	    	try{
				if(pst!=null){
					pst.close();
			    }
			}catch(Exception e){
			}
	    	HibernateUtil.closeSession();
	    }
	    return bRet;
	}

	/**
	  * ͬ��������Ϣ
	  * ������������Ϣ
	  * ������  true=�ɹ�  false=ʧ��
	*/
	public boolean Update(Misc entity)
    {
		boolean bRet = false;
	    PreparedStatement pre =null;
        String sql = "update Misc set strName =?,strValue =?,strDesc =?,strOrgNum =? where id=?";
        Session session = HibernateUtil.getSession();
        Connection dbm = session.connection();
        HibernateUtil.beginTransaction();
        try
        {
            pre = dbm.prepareStatement(sql);
            pre.setString(1, entity.getStrName());
            pre.setString(2, entity.getStrValue());
            pre.setString(3, entity.getStrDesc());
            pre.setString(4, entity.getStrOrgNum());
            pre.setInt(5, entity.getId());
            pre.execute();
            HibernateUtil.commitTransaction();
            bRet = true;
        }
        catch (SQLException err)
        {
  	        logErr.error("���Ĳ�����Ϣʧ��:"+err);
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
	   * ɾ������
	   * @param  id : ����ʵ���ID��
	*/
    public boolean delete(int id)
	{
    	boolean bRet = false;
    	Misc deleteBean = this.getMiscByIdNoCache(id);
    	if(deleteBean == null ){
    		 return true;
    	}
	    Session session = HibernateUtil.getSession();
	    HibernateUtil.beginTransaction();
	    try
	    {
	       session.delete(deleteBean);
	       HibernateUtil.commitTransaction();
	       bRet = true;
	    }
	    catch (Exception e)
	    {
	       logErr.error("ɾ��������Ϣʧ��:"+e);
	       HibernateUtil.rollbackTransaction();
	       bRet = false;
	    }
	    finally
	    {
	       HibernateUtil.closeSession();
	    }
	    return bRet;
	}

	/**
	   * ���ݲ���idˢ�»���
	   * @param id ����id
	   * @return bRet boolean ������
	   * true=�ɹ�
	   * false=ʧ��
	*/
	public boolean FlushSession(int id)
	{
	    boolean bRet = false;
	    try
	    {
	      Session session = HibernateUtil.getSession();
	      String hql = "from Misc where id=:id"; //�����󶨣�����sqlע��
	      Query query = session.createQuery(hql);
	      query.setInteger("id", id);
	      query.list();
	      bRet = true;
	    }
	    catch (Exception e)
	    {
	      // ��¼��־��ˮ
	      logErr.error("���ݲ���idˢ�»���ʧ��:"+e);
	    }
	    finally
	    {
	      HibernateUtil.closeSession();
	    }
	    return bRet;
	}

	/**
	 * ˢ�»���
	*/
	public boolean FlushSession() {
		// ��ʧЧ��ѯ���棬��ʧЧ�������棬��֤�����ݿ�������ͬ��
		boolean bRet = HibernateUtil.evictSessionFactoryQueries("MiscQueries");
		if (bRet == false)
			return false;
		return HibernateUtil.evictSessionFactory("com.yihuacomputer.cols.entity.Misc");
	}
}