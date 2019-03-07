package com.yihuacomputer.cols.database;

import java.util.List;

import org.apache.log4j.Logger;
import org.hibernate.Query;
import org.hibernate.Session;

import com.yihuacomputer.cols.common.util.HibernateUtil;
import com.yihuacomputer.cols.entity.PadCheck;
import com.yihuacomputer.cols.service.FlushCache;

/**
 * PAD���״̬��ѯ��Ĵ�����
 */
public class PadCheckDB
{
	public Logger logErr = Logger.getLogger("Error");

	public PadCheckDB()
    {
    }

    /**
     * ������˽�����ˮ��ȡ��Ӧ��������Ϣ
     * null δ�ҵ�
     */
    @SuppressWarnings("rawtypes")
    public PadCheck getEntity(String strCheckSerialNo)
    {
       PadCheck padCheck = null;
       try
       {
          Session session = HibernateUtil.getSession();
          String hql = "from PadCheck where strCheckSerialNo=:strCheckSerialNo "; //�����󶨣�����sqlע��
          Query query = session.createQuery(hql);
          query.setString("strCheckSerialNo", strCheckSerialNo);
          //���ò�ѯ����
          query.setCacheable(true);
          query.setCacheRegion("PadCheckQueries");

          List padCheckList = query.list();
          if (padCheckList != null &&!padCheckList.isEmpty()&& padCheckList.size() > 0)
        	  padCheck = (PadCheck) padCheckList.get(0);
        }
        catch (Exception e)
        {
			// ��¼��־��ˮ
			logErr.error("ȡPAD������Ϣʧ��:"+e);
        }
        finally
        {
           HibernateUtil.closeSession();
        }
        return padCheck;
     }

    /**
     * ��¼������Ϣ
     * ����1����ˮ����
     * ������  true=�ɹ�  false=ʧ��
     */
    public boolean save(PadCheck entity)
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
            logErr.error("����PAD������Ϣʧ��:"+e.getMessage());
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
	     new FlushCache().broadcastFlushSessionAsync("MsgType=RefreshBuf&strTableName=PadCheck&strKey=&strValue=");
		 return true;
      }

    /**
	 * ����������Ϣ
	 * ����1���������
	 * ����ֵ��true=�ɹ� false=ʧ��
	 */
	public boolean update(PadCheck entity)
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
			logErr.error("����PAD������Ϣʧ��:"+e.getMessage());
			HibernateUtil.rollbackTransaction();
		} finally
		{
			HibernateUtil.closeSession();
		}
		if (bRet != true){
		      return false;
		}
		//��Ϊϵͳ�����ڼ�Ⱥ�����У�����������ʱ������ʧЧ���ڵ�Ļ��棬����֪ͨ�����ڵ�
	    new FlushCache().broadcastFlushSessionAsync("MsgType=RefreshBuf&strTableName=PadCheck&strKey=id&strValue="+entity.getStrCheckSerialNo());
		return true;
	}

	/**
	   * ������˽�����ˮ��ˢ�»���
	   * @param id ������id
	   * @return bRet boolean ������
	   * true=�ɹ�
	   * false=ʧ��
	*/
	public boolean FlushSession(String  strCheckSerialNo)
	{
	    boolean bRet = false;
	    try
	    {
	      Session session = HibernateUtil.getSession();
	      String hql = "from PadCheck where strCheckSerialNo=:strCheckSerialNo"; //�����󶨣�����sqlע��
	      Query query = session.createQuery(hql);
	      query.setString("strCheckSerialNo", strCheckSerialNo);
	      query.list();
	      bRet = true;
	    }
	    catch (Exception e)
	    {
	       // ��¼��־��ˮ
	       logErr.error("���ݽ�����ˮ��ˢ�»���ʧ��:"+e);
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
        boolean bRet = HibernateUtil.evictSessionFactoryQueries("PadCheckQueries");
        if (bRet == false)
           return false;
        return HibernateUtil.evictSessionFactory("com.yihuacomputer.cols.entity.PadCheck");
      }
}
