package com.yihuacomputer.cols.database;

import java.util.List;

import org.apache.log4j.Logger;
import org.hibernate.Query;
import org.hibernate.Session;

import com.yihuacomputer.cols.common.util.HibernateUtil;
import com.yihuacomputer.cols.entity.BrunchRegister;
import com.yihuacomputer.cols.service.FlushCache;

/**
 * ת�˵Ǽǲ�������
 * �����������Թɷ����޹�˾
 * 2017-06-06
 */
public class BrunchRegisterDB {

	public Logger logErr = Logger.getLogger("Error");

	/**
	   * ȡ�����еĲ��뿨�Ŷ�Ӧ��ת��������</p>
	   * list List  ת������Ϣ
	 * @param bean
	*/

	public List<?> getBrunchRegisterList(BrunchRegister bean)
	{
	    List<?> list = null;
	    try
	    {
	      Session session = HibernateUtil.getSession();
	      String hql =
	              "from BrunchRegister where strPanOut=:strPanOut and strPanInType=:strPanInType order by strBankCode asc"; //�����󶨣�����sqlע��
	      Query query = session.createQuery(hql);
	      query.setString("strPanOut", bean.getStrPanOut());
	      query.setString("strPanInType", bean.getStrPanInType());
	      //���ò�ѯ����
	      query.setCacheable(true);
	      query.setCacheRegion("BrunchRegisterQueries");

	      list = query.list();

	      if (list == null || list.isEmpty())
	    	  list = null;
	    }
	    catch (Exception e)
	    {
	      e.printStackTrace();
	    	// ��¼��־��ˮ
		  logErr.error("ȡ������ϵ���б�ʧ��:"+e);
	    }
	    finally
	    {
	      HibernateUtil.closeSession();
	    }

	    return list;

	}


	/**
	   * ���ӳ�����ϵ������</p>
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
		    // ��¼��־��ˮ
		    logErr.error("���ӳ�����ϵ����Ϣʧ��:"+e);
		    e.printStackTrace();
	        HibernateUtil.rollbackTransaction();
	        bRet = false;
	    }
	    finally
	    {
	    	HibernateUtil.closeSession();
	    }
	    //��Ϊϵͳ�����ڼ�Ⱥ�����У�����������ʱ������ʧЧ���ڵ�Ļ��棬����֪ͨ�����ڵ�
	    new FlushCache().broadcastFlushSessionAsync("MsgType=RefreshBuf&strTableName=BrunchRegister&strKey=id&strValue="+bean.getId());
	    return bRet;
	}

	/**
	   * ���ݳ�����ϵ��idˢ�»���
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
	      String hql = "from BrunchRegister where id=:id"; //�����󶨣�����sqlע��
	      Query query = session.createQuery(hql);
	      query.setInteger("id", id);
	      query.list();
	      bRet = true;
	    }
	    catch (Exception e)
	    {
	      // ��¼��־��ˮ
	      logErr.error("���ݳ�����ϵ��idˢ�»���ʧ��:"+e);
	    }
	    finally
	    {
	      HibernateUtil.closeSession();
	    }
	    return bRet;
	}
}

