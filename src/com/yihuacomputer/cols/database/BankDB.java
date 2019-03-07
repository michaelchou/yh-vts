package com.yihuacomputer.cols.database;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.SQLException;
import java.util.List;

import org.apache.log4j.Logger;
import org.hibernate.Query;
import org.hibernate.Session;

import com.yihuacomputer.cols.common.util.HibernateUtil;
import com.yihuacomputer.cols.entity.Bank;


/**
 * ������Ϣ������
 * �����������Թɷ����޹�˾
 * 2017-06-08
 */

public class BankDB {

	public Logger logErr = Logger.getLogger("Error");

	/**
	 * ����ID��ȡ��������Ϣ
	 * ����1��id��
	 * ����ֵ��������Ϣ����
	*/
	@SuppressWarnings("rawtypes")
	public Bank getBankById(int id) {
		Bank bank = null;
		try {
			Session session = HibernateUtil.getSession();
			String hql = "from Bank where id=:id";
			Query query = session.createQuery(hql);
			query.setInteger("id", id);
			// ���ò�ѯ����
			query.setCacheable(true);
			query.setCacheRegion("BankQueries");
			List provinceList = query.list();
			if (provinceList != null && !provinceList.isEmpty() && provinceList.size() > 0)
				bank = (Bank) provinceList.get(0);
		} catch (Exception e) {
			// ��¼��־��ˮ
			logErr.error("ȡ������Ϣʧ��:"+e);
		} finally {
			HibernateUtil.closeSession();
		}
		return bank;
	}
	/**
	 * ����ID��ȡ��������Ϣ
	 * ����1��id��
	 * ����ֵ��������Ϣ����
	 */
	@SuppressWarnings("rawtypes")
	public Bank getBankByIdNoCache(int id) {
		Bank bank = null;
		try {
			Session session = HibernateUtil.getSession();
			String hql = "from Bank where id=:id";
			Query query = session.createQuery(hql);
			query.setInteger("id", id);
			List provinceList = query.list();
			if (provinceList != null && !provinceList.isEmpty() && provinceList.size() > 0)
				bank = (Bank) provinceList.get(0);
		} catch (Exception e) {
			// ��¼��־��ˮ
			logErr.error("ȡ������Ϣʧ��:"+e);
		} finally {
			HibernateUtil.closeSession();
		}
		return bank;
	}

	/**
	   * ȡ�����е���������</p>
	   * list List  ������Ϣ
	*/
	public List<?> getBankList()
	{
	    List<?> list = null;
	    try
	    {
	      Session session = HibernateUtil.getSession();
	      String hql =
	              "from Bank order by strBankName asc"; //�����󶨣�����sqlע��
	      Query query = session.createQuery(hql);
	      //���ò�ѯ����
	      query.setCacheable(true);
	      query.setCacheRegion("BankQueries");

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
	public boolean save(Bank entity) {
		boolean bRet = false;
		PreparedStatement pst =null;
		Session session = HibernateUtil.getSession();
		Connection dbm = session.connection();
		HibernateUtil.beginTransaction();
	    String sql = "insert into Bank(id,strBankCode,strBankName) values (?,?,?)";
	    try
	    {
	        pst = dbm.prepareStatement(sql);
	        pst.setInt(1, entity.getId());
	        pst.setString(2, entity.getStrBankCode());
	        pst.setString(3, entity.getStrBankName());
	        pst.addBatch();
	        pst.executeBatch();
	        HibernateUtil.commitTransaction();
	        bRet = true;
	    }
	    catch (SQLException e)
	    {
		    // ��¼��־��ˮ
		    logErr.error("����������Ϣʧ��:"+e);
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
	public boolean Update(Bank entity)
    {
		boolean bRet = false;
	    PreparedStatement pre =null;
        String sql = "update Bank set strBankCode =?, strBankName =? where id=?";
        Session session = HibernateUtil.getSession();
        Connection dbm = session.connection();
        HibernateUtil.beginTransaction();
        try
        {
            pre = dbm.prepareStatement(sql);
            pre.setString(1, entity.getStrBankCode());
            pre.setString(2, entity.getStrBankName());
            pre.setInt(3, entity.getId());
            pre.execute();
            HibernateUtil.commitTransaction();
            bRet = true;
        }
        catch (SQLException err)
        {
  	        logErr.error("����������Ϣʧ��:"+err);
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
    	Bank deleteBean = this.getBankByIdNoCache(id);
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
	   * ��������idˢ�»���
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
	      String hql = "from Bank where id=:id"; //�����󶨣�����sqlע��
	      Query query = session.createQuery(hql);
	      query.setInteger("id", id);
	      query.list();
	      bRet = true;
	    }
	    catch (Exception e)
	    {
	      // ��¼��־��ˮ
	      logErr.error("��������idˢ�»���ʧ��:"+e);
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
		boolean bRet = HibernateUtil.evictSessionFactoryQueries("BankQueries");
		if (bRet == false)
			return false;
		return HibernateUtil.evictSessionFactory("com.yihuacomputer.cols.entity.Bank");
	}
}