package com.yihuacomputer.cols.database;

import java.util.List;

import org.apache.log4j.Logger;
import org.hibernate.Query;
import org.hibernate.Session;

import com.yihuacomputer.cols.common.util.HibernateUtil;
import com.yihuacomputer.cols.entity.HostRetCode;
import com.yihuacomputer.cols.service.FlushCache;

/**
 * ����������ת����Ĵ�����
 */
public class HostRetCodeDB
{
	public Logger logErr = Logger.getLogger("Error");

	public HostRetCodeDB()
    {
    }

    /**
     * ��������������ȡ��Ӧ��������Ϣ
     * null δ�ҵ�
     */
    @SuppressWarnings("rawtypes")
    public HostRetCode getEntity(String strHostRetCode)
    {
	   HostRetCode hostRetCode = null;
       try
       {
          Session session = HibernateUtil.getSession();
          String hql = "from HostRetCode  where strHostRetCode=:strHostRetCode "; //�����󶨣�����sqlע��
          Query query = session.createQuery(hql);
          query.setString("strHostRetCode", strHostRetCode);
          //���ò�ѯ����
          query.setCacheable(true);
          query.setCacheRegion("HostRetCodeQueries");

          List hostRetCodeList = query.list();
          if (hostRetCodeList != null &&!hostRetCodeList.isEmpty()&& hostRetCodeList.size() > 0)
    	      hostRetCode = (HostRetCode) hostRetCodeList.get(0);
        }
        catch (Exception e)
        {
			// ��¼��־��ˮ
			logErr.error("ȡ������������Ϣʧ��:"+e);
        }
        finally
        {
           HibernateUtil.closeSession();
        }
        return hostRetCode;
     }

    /**
     * ��¼������������Ϣ
     * ����1����ˮ����
     * ������  true=�ɹ�  false=ʧ��
     */
    public boolean save(HostRetCode entity)
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
            logErr.error("����������������Ϣʧ��:"+e.getMessage());
            HibernateUtil.rollbackTransaction();
         }
         finally
         {
            HibernateUtil.closeSession();
         }
         if (bRet != true){
		      return false;
		 }
		 //��Ϊϵͳ�����ڼ�Ⱥ�����У�����������ʱ������ʧЧ���ڵ�Ļ��棬����֪ͨ�����ڵ�
	     new FlushCache().broadcastFlushSessionAsync("MsgType=RefreshBuf&strTableName=HostRetCode&strKey=&strValue=");
		 return true;
      }

    /**
	 * ���¿�����Ϣ
	 * ����1���������
	 * ����ֵ��true=�ɹ� false=ʧ��
	 */
	public boolean update(HostRetCode entity)
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
			logErr.error("����������������Ϣʧ��:"+e.getMessage());
			HibernateUtil.rollbackTransaction();
		} finally
		{
			HibernateUtil.closeSession();
		}
		if (bRet != true){
		      return false;
		}
		//��Ϊϵͳ�����ڼ�Ⱥ�����У�����������ʱ������ʧЧ���ڵ�Ļ��棬����֪ͨ�����ڵ�
	    new FlushCache().broadcastFlushSessionAsync("MsgType=RefreshBuf&strTableName=HostRetCode&strKey=id&strValue="+entity.getId());
		return true;
	}

	/**
	   * ���ݷ�����idˢ�»���
	   * @param id ������id
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
	      String hql = "from HostRetCode where id=:id"; //�����󶨣�����sqlע��
	      Query query = session.createQuery(hql);
	      query.setInteger("id", id);
	      query.list();
	      bRet = true;
	    }
	    catch (Exception e)
	    {
	       // ��¼��־��ˮ
	       logErr.error("���ݷ�����idˢ�»���ʧ��:"+e);
	    }
	    finally
	    {
	      HibernateUtil.closeSession();
	    }
	    return bRet;
	}

      /**
       * ˢ�»���
       * @return bRet boolean ������
       * true=�ɹ�
       * false=ʧ��
      */
      public boolean FlushSession()
      {
        //��ʧЧ��ѯ���棬��ʧЧ�������棬��֤�����ݿ�������ͬ��
        boolean bRet = HibernateUtil.evictSessionFactoryQueries("HostRetCodeQueries");
        if (bRet == false)
           return false;
        return HibernateUtil.evictSessionFactory("com.yihuacomputer.cols.entity.HostRetCode");
      }
}
