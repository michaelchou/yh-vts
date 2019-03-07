package com.yihuacomputer.cols.database;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.SQLException;
import java.util.List;

import org.apache.log4j.Logger;
import org.hibernate.Query;
import org.hibernate.Session;

import com.yihuacomputer.cols.common.util.HibernateUtil;
import com.yihuacomputer.cols.entity.CDSSettleCycleLog;
import com.yihuacomputer.cols.entity.CDSTransLog;

/**
 * �浥������ˮ��
 * �����������Թɷ����޹�˾
 * 2017-05-05
 */
public class CDSTransLogDB
{
    public Logger logErr = Logger.getLogger("Error");

    public CDSTransLogDB()
    {
    }

    /**
     * ��¼����������ˮ
     * ����1����ˮ����
     * ������  true=�ɹ�  false=ʧ��
    */
    public boolean save(CDSTransLog entity)
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
        logErr.error("����浥������ˮʧ��:"+e.getMessage());
        HibernateUtil.rollbackTransaction();
      }
      finally
      {
        HibernateUtil.closeSession();
      }
      return bRet;
    }

	/**
     * �����ն˱��,�Ƿ�����ɹ�,�������д浥����Ϣ</p>
     * strTerminalNum String �ն˱��
     * strSuccessful                �Ƿ�ɹ�true/false
     * list List  ����浥������Ϣ
	*/
	public List<?> getAcceptedCDSList(String strTerminalNum,String strSuccessful)
	{
	    List<?> list = null;
	    CDSSettleCycleLogDB cdsSettleCycleLogDB = new CDSSettleCycleLogDB();
		CDSSettleCycleLog  entity = cdsSettleCycleLogDB.getCurBatchNoEntity(strTerminalNum, 0);//0λδ��浥״̬
		if(entity==null)
			return null;


	    try
	    {
	      Session session = HibernateUtil.getSession();
	      String hql ="from CDSTransLog where strTerminalNum=:strTerminalNum and termBatchNo=:termBatchNo and settleCycleStatus=0" ;
	      		if(strSuccessful.equals("true")){
	      			//���߷��ųɹ����浥���� + �浥���濪�������׳ɹ���ƾ֤�ɹ�  ��  +���Ὺ�������׳ɹ���ƾ֤�ɹ���
	      			//��������ɹ����浥���������׳ɹ���  + �浥�������������׳ɹ��� + �浥���ᣨ���׳ɹ�����ƾ֤ʧ�ܣ����ķ���HX00BF��
	      			hql+="and("
	      				+ "(iHostTxStatus=0 and iTermTxStatus=1 and transCode=905107)"  //�������׼�ƾ֤���ɹ�
	      				+ "or (iHostTxStatus=0 and transCode in ('905104','905103'))" //�������׳ɹ����ύ�׳ɹ�
	      				+ "or (iHostTxStatus=1 and strHostRetCode='HX00BF')" //����ɹ����䵥ʧ��
	      				+ ")";//�������ն�״̬��Ϊ�ɹ�
	      			//hql+=" and transCode in ('905107','905104','905104') ";//�浥�������浥���������Ὺ�������濪����������������������
	      		}else
	      		if(strSuccessful.equals("false")){
	      				//���߷���ʧ�ܣ��浥���� + �浥���濪��(����ʧ�ܻ�ƾ֤ʧ��)  + ���Ὺ�������׳ɹ���ƾ֤ʧ�ܣ�
	      			    //��������ʧ�ܣ��浥����������ʧ�ܣ�  + �浥��������������ʧ�ܣ� + �浥���ᣨ����ʧ�ܣ��ҷ����벻��HX00BF��
	          			hql+="and ("
	          			   + "(iHostTxStatus!=0 and transCode=905104)"  //��������ʧ��
	          			   + "or ((iHostTxStatus!=0 or iTermTxStatus!=1) and transCode=905107)" //�������׻�ƾ֤ʧ��
	          			   + "or (iHostTxStatus=0 and iTermTxStatus!=1 and transCode=905103)"  //���ύ�׳ɹ���ƾ֤ʧ��
	          			   + "or (iHostTxStatus!=0 and transCode=905103)"  //���ύ��ʧ��
	          			   + ")";
	          			//hql+=" and transCode in ('905104','905107','905104') ";//�浥�������浥���������Ὺ�������濪����������������������
	        	}
	       		hql+=" order by dtOccur asc"; //�����󶨣�����sqlע��

	      Query query = session.createQuery(hql);
	      query.setString("strTerminalNum", strTerminalNum);
	      query.setInteger("termBatchNo", entity.getTermBatchNo());

	      list = query.list();
	      if (list == null || list.isEmpty())
	    	  list = null;
	    }
	    catch (Exception e)
	    {
	      // ��¼��־��ˮ
		  logErr.error("ȡ����浥������Ϣʧ��:"+e);
	    }
	    finally
	    {
	      HibernateUtil.closeSession();
	    }
	    return list;
	}

	/**
     * �����ն˱��,��ѯ���������д浥����Ϣ</p>
     * strTerminalNum String �ն˱��
     *
     * list List  ��������������浥������Ϣ
	*/
	public List<?> getCDSBatchList(String strTerminalNum)
	{
	    List<?> list = null;
	    CDSSettleCycleLogDB cdsSettleCycleLogDB = new CDSSettleCycleLogDB();
		CDSSettleCycleLog  entity = cdsSettleCycleLogDB.getCurBatchNoEntity(strTerminalNum, 0);//0λδ��浥״̬
		if(entity==null)
			return null;


	    try
	    {
	      Session session = HibernateUtil.getSession();
	      String hql ="from CDSTransLog where strTerminalNum=:strTerminalNum and termBatchNo=:termBatchNo " ;
	      	  		hql+=" order by dtOccur asc"; //�����󶨣�����sqlע��

	      Query query = session.createQuery(hql);
	      query.setString("strTerminalNum", strTerminalNum);
	      query.setInteger("termBatchNo", entity.getTermBatchNo());

	      list = query.list();
	      if (list == null || list.isEmpty())
	    	  list = null;
	    }
	    catch (Exception e)
	    {
	      // ��¼��־��ˮ
		  logErr.error("ȡ����浥������Ϣʧ��:"+e);
	    }
	    finally
	    {
	      HibernateUtil.closeSession();
	    }
	    return list;
	}

	/**
	 * ���´浥����������ˮ
	 * @return bRet boolean ������ true=�ɹ� false=ʧ��
   */
	public boolean update(CDSTransLog entity) {
		boolean bRet = false;
		try {

			Session session = HibernateUtil.getSession();
			HibernateUtil.beginTransaction();
			session.update(entity);
			HibernateUtil.commitTransaction();
			bRet = true;
		} catch (Exception e) {
			// ��¼��־��ˮ
		    logErr.error("����ˮid���Ĵ浥����������ˮ��Ϣʧ��:"+e.getMessage());
		    HibernateUtil.rollbackTransaction();
		} finally {
			HibernateUtil.closeSession();
		}
		return bRet;
	}

	/**
	  * �޸Ĵ浥������ˮ����浥״̬��Ϣ
	  * ��������浥��Ϣ
	  * ������  true=�ɹ�  false=ʧ��
  */
   public boolean updateStatus(CDSTransLog entity)
   {
		boolean bRet = false;
	    PreparedStatement pre =null;
        String sql = "update CDSTransLog set iSettleCycleStatus =? where strTerminalNum=?";
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
	        logErr.error("������浥��ˮ״̬��Ϣʧ��:"+err);
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
	 * �浥�������׳ɹ���,�ն˴浥���ųɹ�,�������ݿ���ˮ״̬
	 * ����1����ˮid
	 * ����2���ն˽���״̬
	 * @return boolean �Ƿ�ɹ�
	*/
	public boolean update4CDSPresented(int id, int status) {
		CDSTransLog cdsTransLog = getEntity(id);
		if (cdsTransLog == null) {
			return false;
		}
		cdsTransLog.setTermTxStatus(status);
		boolean bRet = update(cdsTransLog);
		return bRet;
	}

	/**
	 * ����id��ȡ��ˮ��Ϣ
	 * ����1��id
	*/
	public CDSTransLog getEntity(int id) {
		CDSTransLog entity = null;
		try {
			Session session = HibernateUtil.getSession();
			String hql = "from CDSTransLog  where id=:id";
			Query query = session.createQuery(hql);
			query.setInteger("id", id);
			entity = (CDSTransLog) query.uniqueResult();
		}
		catch (Exception e) {
			// ��¼��־��ˮ
		    logErr.error("����ˮid��ѯ�浥������ˮ��Ϣʧ��:"+e.getMessage());
		    HibernateUtil.rollbackTransaction();
		} finally {
			HibernateUtil.closeSession();
		}
		return entity;
	}

	/**
     * �����������ȡ�ͽ����������д浥��Ϣ</p>
     * strSingleBusinessNum String ���κ�
     * hostTxStatus	int	��������״̬
     * termTxStatus	int	�ն˽���״̬
     * strSuccessful                �Ƿ�ɹ�true/false
     * strCDSType ��1����2����3����4����
     * list List  ����浥������Ϣ
	*/
	public List<?> getCDSInfoList(String strTransRandom,String strCDSType)
	{
	    List<?> list = null;
	    try
	    {
	      Session session = HibernateUtil.getSession();
	      String hql ="from CDSTransLog where strSingleBusinessNum=:strSingleBusinessNum and (hostTxStatus=0 or termTxStatus=9) "
	      		+ "and strCDSType=:strCDSType" ;
	      Query query = session.createQuery(hql);
	      query.setString("strSingleBusinessNum", strTransRandom);
	      query.setString("strCDSType", strCDSType);

	      list = query.list();
	      if (list == null || list.isEmpty())
	    	  list = null;
	    }
	    catch (Exception e)
	    {
	      // ��¼��־��ˮ
		  logErr.error("��ѯ�浥��Ϣʧ��:"+e);
	    }
	    finally
	    {
	      HibernateUtil.closeSession();
	    }
	    return list;
	}

	/**
     * �����������ȡ�ͽ����������д浥��Ϣ</p>
     * strSingleBusinessNum String ���κ�
     * hostTxStatus	int	��������״̬
     * termTxStatus	int	�ն˽���״̬
     * strSuccessful                �Ƿ�ɹ�true/false
     * strCDSType ��1����2����3����4����
     * list List  ����浥������Ϣ
	*/
	public List<?> getCDSInfoList(String strTransRandom,String strCDSType,String strTransCode)
	{
	    List<?> list = null;
	    try
	    {
	      Session session = HibernateUtil.getSession();
	      String hql = "";
	      //��������濪������HX00BF
	      if(strTransCode.equals("905107")){
	    	  hql ="from CDSTransLog where strSingleBusinessNum=:strSingleBusinessNum and (hostTxStatus=0 or termTxStatus=9) "
	  	      		+ "and strCDSType=:strCDSType and transCode=:transCode" ;  
	      }else{
	    	  hql ="from CDSTransLog where strSingleBusinessNum=:strSingleBusinessNum and hostTxStatus=0 "
	  	      		+ "and strCDSType=:strCDSType and transCode=:transCode" ; 
	      }
	      Query query = session.createQuery(hql);
	      query.setString("strSingleBusinessNum", strTransRandom);
	      query.setString("strCDSType", strCDSType);
	      query.setString("transCode", strTransCode);

	      list = query.list();
	      if (list == null || list.isEmpty())
	    	  list = null;
	    }
	    catch (Exception e)
	    {
	      // ��¼��־��ˮ
		  logErr.error("��ѯ�浥��Ϣʧ��:"+e);
	    }
	    finally
	    {
	      HibernateUtil.closeSession();
	    }
	    return list;
	}
	/**
     * ����������ͽ������ȡ����ת���ڲ�����Ϣ</p>
     * strSingleBusinessNum String ���κ�
     * hostTxStatus	int	��������״̬
     * termTxStatus	int	�ն˽���״̬
     * strSuccessful                �Ƿ�ɹ�true/false
     * list List  ����浥������Ϣ
	*/
	public List<?> getTransOutList(String strTransRandom,String strTransCode)
	{
	    List<?> list = null;
	    try
	    {
	      Session session = HibernateUtil.getSession();
	      String hql ="from CDSTransLog where strSingleBusinessNum=:strSingleBusinessNum and hostTxStatus=0 "
	      		+ "and transCode=:transCode" ;
	      Query query = session.createQuery(hql);
	      query.setString("strSingleBusinessNum", strTransRandom);
	      query.setString("transCode", strTransCode);

	      list = query.list();
	      if (list == null || list.isEmpty())
	    	  list = null;
	    }
	    catch (Exception e)
	    {
	      // ��¼��־��ˮ
		  logErr.error("��ѯ�ڲ�����Ϣʧ��:"+e);
	    }
	    finally
	    {
	      HibernateUtil.closeSession();
	    }
	    return list;
	}

	/**
     * �����ն˱��,��ѯ���н�����Ϣ</p>
     * strTerminalNum String �ն˱��

     * list List  ������Ϣ
	*/
	public List<?> getList(String strTerminalNum)
	{
	    List<?> list = null;
	    try
	    {
	      Session session = HibernateUtil.getSession();
	      String hql ="from CDSTransLog where strTerminalNum=:strTerminalNum " ;
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
		  logErr.error("��ѯ���з��浥������Ϣʧ��:"+e);
	    }
	    finally
	    {
	      HibernateUtil.closeSession();
	    }
	    return list;
	}
	
	/**
     * �����ն˺�,����״̬�����½��ױ�</p>
     * strTerminalNum String �ն˱��

     * list List  ������Ϣ
	*/
	public boolean updateTranslogStatus(CDSTransLog entity,String strSuccessful)
	{
			boolean bRet = false;
		    PreparedStatement pre =null;
	        String sql = "update CDSTransLog set iSettleCycleStatus =3 where strTerminalNum=? and iTermBatchNo=?";
	        if(strSuccessful.equals("true")){
      			//���߷��ųɹ����浥���� + �浥���濪�������׳ɹ���ƾ֤�ɹ�  ��  +���Ὺ�������׳ɹ���ƾ֤�ɹ���
      			//��������ɹ����浥���������׳ɹ���  + �浥�������������׳ɹ��� + �浥���ᣨ���׳ɹ�����ƾ֤ʧ�ܣ����ķ���HX00BF��
	        	sql+="and("
      				+ "(iHostTxStatus=0 and iTermTxStatus=1 and strTransCode=905107)"  //�������׼�ƾ֤���ɹ�
      				+ "or (iHostTxStatus=0 and strTransCode in ('905104','905103'))" //�������׳ɹ����ύ�׳ɹ�
      				+ "or (iHostTxStatus=1 and strHostRetCode='HX00BF')" //����ɹ����䵥ʧ��
      				+ ")";//�������ն�״̬��Ϊ�ɹ�
      		}else
      		if(strSuccessful.equals("false")){
      				//���߷���ʧ�ܣ��浥���� + �浥���濪��(����ʧ�ܻ�ƾ֤ʧ��)  + ���Ὺ�������׳ɹ���ƾ֤ʧ�ܣ�
      			    //��������ʧ�ܣ��浥����������ʧ�ܣ�  + �浥��������������ʧ�ܣ� + �浥���ᣨ����ʧ�ܣ��ҷ����벻��HX00BF��
      			sql+="and ("
          			   + "(iHostTxStatus!=0 and strTransCode=905104)"  //��������ʧ��
          			   + "or ((iHostTxStatus!=0 or iTermTxStatus!=1) and strTransCode=905107)" //�������׻�ƾ֤ʧ��
          			   + "or (iHostTxStatus=0 and iTermTxStatus!=1 and strTransCode=905103)"  //���ύ�׳ɹ���ƾ֤ʧ��
          			   + "or (iHostTxStatus!=0 and strTransCode=905103)"  //���ύ��ʧ��
          			   + ")";
        	}
	        Session session = HibernateUtil.getSession();
	        Connection dbm = session.connection();
	        HibernateUtil.beginTransaction();
	        try
	        {
	           pre = dbm.prepareStatement(sql);
	           pre.setString(1, entity.getStrTerminalNum());
	           pre.setInt(2, entity.getTermBatchNo());
	           pre.execute();
	           HibernateUtil.commitTransaction();
	           bRet = true;
	       }
	       catch (SQLException err)
	       {
		        logErr.error("������浥��ˮ״̬��Ϣʧ��:"+err);
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

}
